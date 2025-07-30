// packages/api/src/services/users.service.ts

import prisma from '../config/prisma.js';
import { UpdateUserInput } from 'shared/schemas/user.schema';

async function getLikedListings(userId: string) {
  const userWithLikes = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      likedListings: { // '찜'한 매물 목록을 함께 불러옴
        where: {
          status: 'PUBLISHED',
        },
        orderBy: {
          createdAt: 'desc', // 최신순으로 정렬
        },
        include: {
          _count: {
            select: { likedBy: true },
          },
        },
      },
    },
  });

  if (!userWithLikes) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }

  return userWithLikes.likedListings;
}

async function updateMyPhone(userId: string, data: UpdateUserInput) {
  const { phone } = data;

  // 1. 이 번호를 다른 사람이 쓰고 있는지 확인합니다.
  const existingUserWithPhone = await prisma.user.findUnique({
    where: { phone },
  });

  // 2. 다른 사람이 쓰고 있다면, 에러를 발생시킵니다.
  if (existingUserWithPhone && existingUserWithPhone.id !== userId) {
    throw new Error('이미 사용 중인 핸드폰 번호입니다. 다른 번호를 입력해주세요.');
  }

  // 3. 중복이 아니면, 업데이트를 진행합니다.
  return prisma.user.update({
    where: { id: userId },
    data: {
      phone: data.phone,
    },
  });
}

export default {
  getLikedListings,
  updateMyPhone, // ⬅️ 추가
};