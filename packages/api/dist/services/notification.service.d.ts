import { Listing } from '@prisma/client';
/**
 * 특정 매물을 찜한 모든 사용자에게 알림을 보냅니다.
 * @param listing - 상태가 변경된 매물 객체
 * @param message - 사용자에게 보낼 메시지
 */
declare function notifyUsersWhoLikedListing(listing: Listing, message: string): Promise<void>;
declare const _default: {
    notifyUsersWhoLikedListing: typeof notifyUsersWhoLikedListing;
};
export default _default;
