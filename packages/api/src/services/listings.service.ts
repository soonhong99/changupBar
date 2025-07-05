// packages/api/src/services/listings.service.ts

import prisma from '../config/prisma.js';
import { CreateListingInput } from '../../../shared/src/schemas/listing.schema.js';
import { Prisma } from '@prisma/client'; // Prisma 타입을 가져옵니다.
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

  const listing = await prisma.listing.findUnique({
    where: { id },
  });

  if (!listing) {
    console.log(`⚠️ Service: ID(${id})에 해당하는 매물을 찾지 못했습니다.`);
    return null;
  }

  console.log(`✅ Service: ID(${id}) 매물 조회 완료!`);
  return listing;
}

/**
 * 필터 조건에 따라 매물 목록을 조회합니다.
 * @returns 필터링된 매물 객체의 배열
 */
async function getAll(query: GetAllListingsQuery) {
  console.log('✅ Service: 매물 조회를 시작합니다.', query);

  const { region, category, keyMoneyLte, sortBy = 'createdAt', order = 'desc' } = query;
  const where: Prisma.ListingWhereInput = {};

  if (region) where.region = region;
  if (category) where.category = category;
  if (keyMoneyLte) where.keyMoney = { lte: parseInt(keyMoneyLte, 10) };

  const listings = await prisma.listing.findMany({
    where,
    // ⬇️ 정렬 로직 수정: 대표 매물을 항상 위로, 그 다음 사용자가 선택한 기준으로 정렬
    orderBy: [
      {
        isWeeklyBest: 'desc', // true가 위로 오도록
      },
      {
        [sortBy]: order,
      },
    ],
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
  // 1. 이미 찜했는지 확인
  const existingLike = await prisma.user.findFirst({
    where: {
      id: userId,
      likedListings: {
        some: { id: listingId },
      },
    },
  });

  if (existingLike) {
    // 이미 찜했다면 '찜 취소' 로직 실행 (토글 기능)
    console.log(`✅ Service: 사용자(${userId})가 매물(${listingId}) 찜을 취소합니다.`);
    await prisma.user.update({
      where: { id: userId },
      data: {
        likedListings: {
          disconnect: { id: listingId },
        },
      },
    });
    return { message: '매물 찜을 취소했습니다.' };
  } else {
    // 찜하지 않았다면 '찜하기' 로직 실행
    console.log(`✅ Service: 사용자(${userId})가 매물(${listingId})을 찜합니다.`);
    await prisma.user.update({
      where: { id: userId },
      data: {
        likedListings: {
          connect: { id: listingId },
        },
      },
    });
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
 * 현재 노출 기간에 해당하는 '주간 대표 매물'들을 조회합니다.
 * @returns 대표 매물 객체의 배열
 */
async function getFeatured() {
  console.log('✅ Service: 대표 매물 조회를 시작합니다.');
  const now = new Date();

  const featuredListings = await prisma.listing.findMany({
    where: {
      isWeeklyBest: true,
      featuredStart: {
        lte: now, // 노출 시작일이 현재보다 이전이고
      },
      featuredEnd: {
        gte: now, // 노출 종료일이 현재보다 이후인 매물
      },
    },
    take: 3, // 최대 3개만 가져옴
  });

  console.log(`✅ Service: 총 ${featuredListings.length}개의 대표 매물 조회 완료!`);
  return featuredListings;
}

interface GetAllListingsQuery {
  region?: 'METROPOLITAN' | 'NON_METROPOLITAN';
  category?: 'CAFE_BAKERY' | 'RESTAURANT_BAR' | 'RETAIL_ETC';
  keyMoneyLte?: string;
  sortBy?: 'createdAt' | 'keyMoney'; // 정렬 기준
  order?: 'asc' | 'desc'; // 정렬 순서
}

async function remove(id: string) {
  console.log(`✅ Service: ID(${id}) 매물 삭제를 시작합니다.`);
  await prisma.listing.delete({
    where: { id },
  });
  return { message: '매물이 성공적으로 삭제되었습니다.' };
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
};