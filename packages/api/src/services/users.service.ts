import prisma from '../config/prisma.js';

async function getLikedListings(userId: string) {
  const userWithLikes = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      likedListings: { // '찜'한 매물 목록을 함께 불러옴
        orderBy: {
          createdAt: 'desc', // 최신순으로 정렬
        },
      },
    },
  });

  if (!userWithLikes) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }

  return userWithLikes.likedListings;
}

export default {
  getLikedListings,
};