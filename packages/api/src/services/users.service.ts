// packages/api/src/services/users.service.ts

import prisma from '../config/prisma.js';
import { UpdateUserInput } from '../../../shared/src/schemas/user.schema.js';

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