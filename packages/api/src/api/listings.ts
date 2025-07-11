// packages/api/src/api/listings.ts

import { Router } from 'express';
import listingController from '../controllers/listings.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { optionalAuthMiddleware } from '../middlewares/optionalAuth.middleware.js'; // ⬅️ 추가

const router: Router = Router();

// 1. 가장 구체적인 경로를 맨 위로 올립니다.
// GET /api/v1/listings/featured - 대표 매물 조회
router.get('/featured', optionalAuthMiddleware, asyncHandler(listingController.getFeaturedListings));

// GET /api/v1/listings/most-viewed - 가장 인기있는 매물 조회
router.get('/most-viewed', asyncHandler(listingController.getMostViewedListing)); 

// GET /api/v1/listings/stats - 매물 통계 조회
router.get('/stats', asyncHandler(listingController.getStats)); // ⬅️ 추가

// 2. 그 다음 일반적인 목록 경로를 조회합니다.
// GET /api/v1/listings - 모든 매물 조회
router.get('/', optionalAuthMiddleware, asyncHandler(listingController.getAllListings));

// 3. 가장 마지막에 동적인 :id 경로를 조회합니다.
// GET /api/v1/listings/:id - 특정 매물 조회
router.get('/:id', asyncHandler(listingController.getListingById));

// --- POST, PATCH, DELETE 등 다른 메소드 라우트는 순서에 큰 영향을 받지 않습니다. ---

// POST /api/v1/listings/:id/like - 특정 매물 '찜'하기 (로그인 필요)
router.post(
  '/:id/like',
  authMiddleware,
  asyncHandler(listingController.likeListing)
);

// POST /api/v1/listings - 신규 매물 생성
router.post('/', authMiddleware, asyncHandler(listingController.createListing));

// DELETE /api/v1/listings/:id - 특정 매물 삭제 (로그인 필요)
router.delete(
  '/:id',
  authMiddleware,
  asyncHandler(listingController.deleteListing)
);

// PATCH /api/v1/listings/:id - 특정 매물 수정 (로그인 필요)
router.patch(
  '/:id',
  authMiddleware,
  asyncHandler(listingController.updateListing)
);

export default router;