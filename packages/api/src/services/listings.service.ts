// packages/api/src/services/listings.service.ts

import prisma from '../config/prisma.js';
import { CreateListingInput } from '../../../shared/src/schemas/listing.schema.js';
import { Prisma, UserRole } from '@prisma/client'; // Prisma 타입을 가져옵니다.
import { UpdateListingInput } from '../../../shared/src/schemas/listing.schema.js'; // ⬅️ 추가


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

  const [_, listing] = await prisma.$transaction([
    prisma.listing.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1, // ⬅️ 조회수를 1 증가시킵니다.
        },
      },
    }),
    prisma.listing.findUnique({
      where: { id },
      // ⬇️ 찜한 사람 수를 함께 조회하도록 include 추가
      include: {
        _count: {
          select: { likedBy: true },
        },
      },
    }),
  ]);

  if (!listing) {
    console.log(`⚠️ Service: ID(${id})에 해당하는 매물을 찾지 못했습니다.`);
    return null;
  }

  console.log(`✅ Service: ID(${id}) 매물 조회 완료!`);
  return listing;
}

/**
 * 필터 조건과 사용자 역할에 따라 매물 목록을 조회합니다.
 * @param query 필터 및 정렬 조건
 * @param role 요청한 사용자의 역할 (예: 'ADMIN', 'USER' 또는 undefined)
 */
async function getAll(query: GetAllListingsQuery, role?: UserRole) {
  console.log(`✅ Service: 매물 조회 시작. 역할: ${role || 'Guest'}`);

  const { region, category, status, keyMoneyLte, sortBy = 'createdAt', order = 'desc' } = query;
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
  if (category) where.category = category;
  if (keyMoneyLte) where.keyMoney = { lte: parseInt(keyMoneyLte, 10) };

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

async function update(id: string, data: UpdateListingInput) {
  console.log(`✅ Service: ID(${id}) 매물 수정을 시작합니다.`);
  const updatedListing = await prisma.listing.update({
    where: { id },
    data,
  });
  return updatedListing;
}

/**
 * 현재 노출 기간에 해당하는 '주간 대표 매물'들을 역할에 따라 조회합니다.
 * @param role 요청한 사용자의 역할
 */
async function getFeatured(role?: UserRole) {
  console.log(`✅ Service: 대표 매물 조회 시작. 역할: ${role || 'Guest'}`);
  const now = new Date();

  const where: Prisma.ListingWhereInput = {
    isWeeklyBest: true,
    featuredStart: { lte: now },
    featuredEnd: { gte: now },
  };

  // 관리자가 아니면 '공개' 상태인 대표 매물만 보여줌
  if (role !== 'ADMIN') {
    where.status = 'PUBLISHED';
  }

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
  category?: 'CAFE_BAKERY' | 'RESTAURANT_BAR' | 'RETAIL_ETC';
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'; // ⬅️ 관리자용 상태 필터
  keyMoneyLte?: string;
  sortBy?: 'createdAt' | 'keyMoney' | 'status' | 'viewCount' |'likeCount'; // ⬅️ 'status' 추가
  order?: 'asc' | 'desc'; // 정렬 순서
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
};