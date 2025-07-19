import CoolsmsMessageService, { Message } from 'coolsms-node-sdk';
import prisma from '../config/prisma.js';
import { Listing, User } from '@prisma/client';

const smsClient = new (CoolsmsMessageService as any).default(process.env.COOLSMS_API_KEY!, process.env.COOLSMS_API_SECRET!);

/**
 * 특정 매물을 찜한 모든 사용자에게 알림을 보냅니다.
 * @param listing - 상태가 변경된 매물 객체
 * @param message - 사용자에게 보낼 메시지
 */
async function notifyUsersWhoLikedListing(listing: Listing, message: string) {
  // 1. 이 매물을 찜한 모든 사용자를 찾습니다.
  const users = await prisma.user.findMany({
    where: {
      likedListings: {
        some: { id: listing.id },
      },
    },
  });

  // 2. 각 사용자에게 알림을 보냅니다.
  for (const user of users) {
    // 전화번호가 등록된 사용자에게만 SMS를 발송합니다.
    if (user.phone) {
      try {
        await smsClient.sendOne({
          to: user.phone,
          from: process.env.COOLSMS_SENDER_PHONE!,
          text: message,
        });
        console.log(`✅ SMS 발송 성공: ${user.name} (${user.phone})`);
      } catch (error) {
        console.error(`❌ SMS 발송 실패: ${user.name} (${user.phone})`, error);
      }
    }
  }
}

export default {
  notifyUsersWhoLikedListing,
};