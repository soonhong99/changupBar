// packages/api/src/services/listings.service.ts

import prisma from '../config/prisma.js';
import { CreateListingInput } from 'shared/schemas/listing.schema';
import { Prisma, UserRole } from '@prisma/client'; // Prisma 타입을 가져옵니다.
import { UpdateListingInput } from 'shared/schemas/listing.schema'; // ⬅️ 추가
import notificationService from './notification.service.js'; // ⬅️ 추가
import { regionGroups, findRegionGroup } from '../data/regionGroups.js'; // ⬅️ 추가

let cachedMostViewed: { listing: any; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5분 (밀리초 단위)

let cachedRandomByCategory: { data: any; timestamp: number } | null = null;
const RANDOM_CACHE_DURATION = 12 * 60 * 60 * 1000; // 12시간

let cachedRelatedListings = new Map<string, { data: any; timestamp: number }>();
const RELATED_CACHE_DURATION = 5 * 60 * 1000; // 5분 캐시

/**
 * 신규 매물을 데이터베이스에 생성합니다.
 * @param data 컨트롤러에서 유효성 검사를 마친 매물 데이터
 * @returns 생성된 매물 객체
 */
async function create(data: CreateListingInput) {
  console.log('✅ Service: 데이터베이스에 매물 생성을 시작합니다.');
  
  // Prisma Client를 사용해 데이터베이스에 새로운 Listing 레코드를 생성합니다.
  // Zod 스키마와 Prisma 모델의 필드명이 일치하므로, 데이터를 그대로 전달할 수 있습니다.
  const newListing = await prisma.listing.create({
    data,
  });

  console.log('✅ Service: 매물 생성 완료!', newListing.id);
  return newListing;
}

/**
 * ID로 특정 매물 하나를 조회합니다.
 * @param id 조회할 매물의 ID
 * @returns 조회된 매물 객체, 없으면 null
 */
async function getById(id: string) {
  console.log(`✅ Service: ID(${id})로 매물 조회를 시작합니다.`);

  // 1. 먼저 매물이 존재하는지, _count와 함께 조회합니다.
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      _count: {
        select: { likedBy: true },
      },
    },
  });

  // 2. 매물이 존재하지 않으면, 즉시 null을 반환하여 에러를 막습니다.
  if (!listing) {
    console.log(`⚠️ Service: ID(${id})에 해당하는 매물을 찾지 못했습니다.`);
    return null;
  }

  // 3. 매물이 존재하는 것이 확인된 후에, 조회수를 1 증가시킵니다. (이 작업은 백그라운드에서 실행되도록 await를 사용하지 않아도 괜찮습니다.)
  prisma.listing.update({
    where: { id },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  }).catch(err => console.error(`Failed to increment view count for ${id}`, err)); // 혹시 모를 에러는 로그만 남깁니다.


  console.log(`✅ Service: ID(${id}) 매물 조회 완료!`);
  return listing;
}

/**
 * 필터 조건과 사용자 역할에 따라 매물 목록을 조회합니다.
 * @param query 필터 및 정렬 조건
 * @param role 요청한 사용자의 역할 (예: 'ADMIN', 'USER' 또는 undefined)
 */
async function getAll(query: GetAllListingsQuery, role?: UserRole) {
  console.log(`✅ Service: 매물 조회 시작.`);

  const { region, mainCategory, subCategory, status, keyMoneyLte, sido, sigungu, sortBy = 'createdAt', order = 'desc' } = query;
  const where: Prisma.ListingWhereInput = {};

  // --- 조건부 필터링 ---
  // 1. 역할 기반 상태 필터링
  if (role !== 'ADMIN') {
    // 관리자가 아니면 '공개(PUBLISHED)' 상태의 매물만 보도록 강제
    where.status = 'PUBLISHED';
  } else if (status) {
    // 관리자이고, 상태 필터 값이 있으면 해당 상태로 필터링
    where.status = status;
  }

  // 2. 다른 필터들
  if (region) where.region = region;
  if (mainCategory) where.mainCategory = mainCategory;
  if (subCategory) where.subCategory = subCategory;
  if (keyMoneyLte) where.keyMoney = { lte: parseInt(keyMoneyLte, 10) };
  if (sido) where.sido = sido;
  if (sigungu) where.sigungu = sigungu;

  // ⬇️ 역할에 따라 orderBy 조건을 동적으로 설정합니다.
  const orderBy: Prisma.ListingOrderByWithRelationInput[] = [];

  if (role === 'ADMIN') {
    orderBy.push({ isWeeklyBest: 'desc' }); // 관리자일 경우 대표 매물 우선 정렬
  }

  orderBy.push({ [sortBy]: order }); // 기본 정렬 조건 추가

  const listings = await prisma.listing.findMany({
    where,
    orderBy,
    include: {
      _count: {
        select: { likedBy: true },
      },
    },
  });

  console.log(`✅ Service: 총 ${listings.length}개의 매물 조회 완료!`);
  return listings;
}


/**
 * 특정 사용자가 특정 매물을 '찜'합니다.
 * @param userId '찜'하는 사용자의 ID
 * @param listingId '찜'할 매물의 ID
 */
async function like(userId: string, listingId: string) {
  const existingLike = await prisma.user.findFirst({
    where: { id: userId, likedListings: { some: { id: listingId } } },
  });

  if (existingLike) {
    // 찜 취소 로직
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { likedListings: { disconnect: { id: listingId } } },
      }),
      prisma.listing.update({
        where: { id: listingId },
        data: { likeCount: { decrement: 1 } }, // ⬅️ 카운트 감소
      }),
    ]);
    return { message: '매물 찜을 취소했습니다.' };
  } else {
    // 찜하기 로직
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { likedListings: { connect: { id: listingId } } },
      }),
      prisma.listing.update({
        where: { id: listingId },
        data: { likeCount: { increment: 1 } }, // ⬅️ 카운트 증가
      }),
    ]);
    return { message: '매물을 찜했습니다.' };
  }
}

const truncate = (str: string, n: number) => {
  return str.length > n ? str.substring(0, n - 1) + "..." : str;
};

async function update(id: string, data: UpdateListingInput) {
  const originalListing = await prisma.listing.findUnique({ where: { id } });
  if (!originalListing) throw new Error('매물을 찾을 수 없습니다.');

  const updatedListing = await prisma.listing.update({
    where: { id },
    data,
  });

  const frontendUrl = process.env.FRONTEND_URL || 'https://www.xn--hz2b15nyscisj8ui.com';
  const shortName = truncate(updatedListing.name, 15); // 매물 이름을 15자로 줄임

  // --- 알림 발송 로직 ---
  // 1. 계약 상태 변경 알림 (기존과 동일)
  if (originalListing.contractStatus !== updatedListing.contractStatus) {
    let message = '';

    switch (updatedListing.contractStatus) {
      case 'PENDING':
        message = `[찜알리미]\n'${shortName}' 매물이 계약 진행중입니다. 서두르세요!\n스마트창업.com`;
        break;
      case 'SOLD':
        message = `[찜알리미]\n'${shortName}' 매물이 계약 완료되었습니다. 다른 매물을 확인하세요.\n스마트창업.com`;
        break;
      case 'AVAILABLE':
        if (originalListing.contractStatus !== 'AVAILABLE') {
          message = `[찜알리미]\n'${shortName}' 매물이 다시 나왔습니다! 바로 확인하세요.\n스마트창업.com`;
        }
        break;
    }

    if (message) {
      notificationService.notifyUsersWhoLikedListing(updatedListing, message);
    }
  }

  if (originalListing.keyMoney !== updatedListing.keyMoney) {
    const difference = updatedListing.keyMoney - originalListing.keyMoney;
    let message = '';

    if (difference > 0) {
      message = `[권리금 인상]\n'${shortName}' 권리금 ${ difference.toLocaleString() }만원 인상! \n스마트창업.com`;
    } else {
      message = `[권리금 인하]\n'${shortName}' 권리금 ${ Math.abs(difference).toLocaleString() }만원 인하! \n스마트창업.com`;
    }
    notificationService.notifyUsersWhoLikedListing(updatedListing, message);
  }
  return updatedListing;
}

/**
 * 현재 노출 기간에 해당하는 '주간 대표 매물'들을 역할에 따라 조회합니다.
 * @param role 요청한 사용자의 역할
 */
async function getFeatured(role?: UserRole) {
  console.log(`✅ Service: 대표 매물 조회 시작.`);
  const now = new Date();

  console.log('Server Current Time (UTC):', now.toISOString()); 
  console.log('Server Current Time (Locale):', now.toString());
  
  const where: Prisma.ListingWhereInput = {
    isWeeklyBest: true,
    featuredStart: { lte: now },
    featuredEnd: { gte: now },
  };

  // 관리자가 아니면 '공개' 상태인 대표 매물만 보여줌
  if (role !== 'ADMIN') {
    where.status = 'PUBLISHED';
  }

  // console.log('Prisma Query WHERE clause:', JSON.stringify(where, null, 2));

  const featuredListings = await prisma.listing.findMany({
    where,
    take: 3,
    include: {
      _count: {
        select: { likedBy: true },
      },
    },
  });

  console.log(`✅ Service: 총 ${featuredListings.length}개의 대표 매물 조회 완료!`);
  return featuredListings;
}

interface GetAllListingsQuery {
  region?: 'METROPOLITAN' | 'NON_METROPOLITAN';
  mainCategory?: string;
  subCategory?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'; // ⬅️ 관리자용 상태 필터
  keyMoneyLte?: string;
  sortBy?: 'createdAt' | 'keyMoney' | 'status' | 'viewCount' |'likeCount'; // ⬅️ 'status' 추가
  order?: 'asc' | 'desc'; // 정렬 순서
  sido?: string;
  sigungu?: string;
}

async function remove(id: string) {
  console.log(`✅ Service: ID(${id}) 매물 삭제를 시작합니다.`);
  await prisma.listing.delete({
    where: { id },
  });
  return { message: '매물이 성공적으로 삭제되었습니다.' };
}

/**
 * 공개된 매물의 통계를 계산합니다.
 */
async function getStats() {
  console.log('✅ Service: 매물 통계 계산을 시작합니다.');

  // 이번 주의 시작(일요일)을 계산합니다.
  const today = new Date();
  const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  firstDayOfWeek.setHours(0, 0, 0, 0);

  // 두 가지 카운트를 병렬로 실행합니다.
  const [totalCount, newThisWeekCount] = await Promise.all([
    // 1. 공개된 전체 매물 수
    prisma.listing.count({
      where: { status: 'PUBLISHED' },
    }),
    // 2. 이번 주에 등록된 신규 공개 매물 수
    prisma.listing.count({
      where: {
        status: 'PUBLISHED',
        createdAt: {
          gte: firstDayOfWeek, // gte: 크거나 같음
        },
      },
    }),
  ]);

  console.log(`✅ Service: 통계 계산 완료 - 전체: ${totalCount}, 신규: ${newThisWeekCount}`);
  return { totalCount, newThisWeekCount };
}

/**
 * 공개된 매물 중 가장 조회수가 높은 매물 1개를 조회합니다. (5분 캐시 적용)
 */
async function getMostViewed() {
  const now = Date.now();

  // 1. 캐시가 유효하면 캐시된 데이터를 반환
  if (cachedMostViewed && now - cachedMostViewed.timestamp < CACHE_DURATION) {
    console.log('✅ Service: 캐시된 인기 매물을 반환합니다.');
    return cachedMostViewed.listing;
  }

  // 2. 캐시가 없거나 만료되면 DB에서 새로 조회
  console.log('✅ Service: DB에서 새로운 인기 매물을 조회합니다.');
  const mostViewedListing = await prisma.listing.findFirst({
    where: { status: 'PUBLISHED' },
    orderBy: { viewCount: 'desc' },
    include: { _count: { select: { likedBy: true } } },
  });

  // 3. 새로운 데이터로 캐시를 업데이트
  cachedMostViewed = { listing: mostViewedListing, timestamp: now };

  return mostViewedListing;
}

/**
 * 각 대분류별로 판매중인 매물을 3개씩 랜덤으로 추천합니다. (12시간 캐시)
 */
async function getRandomByCategory() {
  const now = Date.now();

  // 1. 캐시가 유효하면 캐시된 데이터를 반환
  if (cachedRandomByCategory && now - cachedRandomByCategory.timestamp < RANDOM_CACHE_DURATION) {
    console.log('✅ Service: 캐시된 "카테고리별 랜덤 매물"을 반환합니다.');
    return cachedRandomByCategory.data;
  }

  console.log('✅ Service: DB에서 새로운 "카테고리별 랜덤 매물"을 조회합니다.');
  const mainCategories = [
    '휴게음식점', '일반음식점', '주류/치킨/호프', 
    '오락/스포츠/관리', '판매/소매'
  ];

  const results: { [key: string]: any[] } = {};

  for (const category of mainCategories) {
    // 2. 각 카테고리별로 판매중인 모든 매물을 가져옵니다.
    const listings = await prisma.listing.findMany({
      where: {
        mainCategory: category,
        status: 'PUBLISHED',
        contractStatus: 'AVAILABLE',
      },
      include: { _count: { select: { likedBy: true } } },
    });

    // 3. 가져온 매물을 랜덤으로 섞은 뒤, 최대 3개만 선택합니다. (Fisher-Yates shuffle 알고리즘)
    for (let i = listings.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [listings[i], listings[j]] = [listings[j], listings[i]];
    }
    results[category] = listings.slice(0, 3);
  }

  // 4. 새로운 데이터로 캐시를 업데이트
  cachedRandomByCategory = { data: results, timestamp: now };

  return results;
}

/**
 * 특정 매물과 관련된 추천 매물 목록을 조회합니다. (5분 캐시)
 * @param listingId 기준이 되는 매물의 ID
 */
async function getRelatedListings(listingId: string) {
  const now = Date.now();
  const cached = cachedRelatedListings.get(listingId);

  if (cached && now - cached.timestamp < RELATED_CACHE_DURATION) {
    console.log(`✅ Service: 캐시된 '관련 매물'(${listingId})을 반환합니다.`);
    return cached.data;
  }

  const baseListing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!baseListing) throw new Error('기준 매물을 찾을 수 없습니다.');

  // 권리금
  const getKeyMoneyRange = (km: number) => {
    if (km < 10000) return { lt: 10000 };
    if (km < 20000) return { gte: 10000, lt: 20000 };
    if (km < 50000) return { gte: 20000, lt: 50000 };
    return { gte: 50000 };
  };
  // 실수익
  const getNetProfitRange = (np: number) => {
    if (np < 500) return { lt: 500 };
    if (np < 1000) return { gte: 500, lt: 1000 };
    if (np < 2000) return { gte: 1000, lt: 2000 };
    return { gte: 2000 };
  };

  const baseWhere = {
    id: { not: listingId },
    status: 'PUBLISHED',
    contractStatus: 'AVAILABLE'
  } as const;

  // 랜덤 추출을 위한 함수
  const getRandomListings = async (where: Prisma.ListingWhereInput, limit: number = 3) => {
    const allIds = await prisma.listing.findMany({ where, select: { id: true } });
    const shuffled = allIds.sort(() => 0.5 - Math.random());
    const selectedIds = shuffled.slice(0, limit).map(l => l.id);

    return prisma.listing.findMany({
      where: { id: { in: selectedIds } },
      include: { _count: { select: { likedBy: true } } },
    });
  };

  // 4개의 쿼리를 병렬로 실행
  const [byKeyMoney, byNetProfit, byMainCategory, byRegion] = await Promise.all([
    getRandomListings({ ...baseWhere, keyMoney: getKeyMoneyRange(baseListing.keyMoney) }),
    getRandomListings({ ...baseWhere, netProfit: getNetProfitRange(baseListing.netProfit) }),
    getRandomListings({ ...baseWhere, mainCategory: baseListing.mainCategory }),
    getRandomListings({ ...baseWhere, sigungu: { in: findRegionGroup(baseListing.sigungu || '') || [] } }),
  ]);

  const results = { byKeyMoney, byNetProfit, byMainCategory, byRegion };
  cachedRelatedListings.set(listingId, { data: results, timestamp: now });

  console.log(`✅ Service: 새로운 '관련 매물'(${listingId})을 조회했습니다.`);
  return results;
}

// 서비스 객체로 내보내기
export default {
  create,
  getById,
  getAll,
  like,
  remove,
  update,
  getFeatured,
  getStats,
  getMostViewed,
  getRandomByCategory,
  getRelatedListings,
};
