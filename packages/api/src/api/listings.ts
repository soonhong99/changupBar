// packages/api/src/api/listings.ts

import { Router } from 'express';
import listingController from '../controllers/listings.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js'; // ⬅️ asyncHandler import
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router: Router = Router();

// POST /api/v1/listings - 신규 매물 생성
// listingController.createListing을 asyncHandler로 감싸줍니다.
router.post('/', asyncHandler(listingController.createListing)); // ⬅️ 이렇게 수정!

// GET /api/v1/listings - 모든 매물 조회
router.get('/', asyncHandler(listingController.getAllListings));

// GET /api/v1/listings/:id - 특정 매물 조회
router.get('/:id', asyncHandler(listingController.getListingById));

// POST /api/v1/listings/:id/like - 특정 매물 '찜'하기 (로그인 필요)
router.post(
    '/:id/like',
    authMiddleware, // ⬅️ 컨트롤러 실행 전에 '출입증 검사'
    asyncHandler(listingController.likeListing)
);

// DELETE /api/v1/listings/:id - 특정 매물 삭제 (로그인 필요)
router.delete(
  '/:id',
  authMiddleware, // ⬅️ 관리자만 삭제할 수 있도록 보호
  asyncHandler(listingController.deleteListing)
);

// PATCH /api/v1/listings/:id - 특정 매물 수정 (로그인 필요)
router.patch(
  '/:id',
  authMiddleware, // ⬅️ 관리자만 수정할 수 있도록 보호
  asyncHandler(listingController.updateListing)
);

export default router;