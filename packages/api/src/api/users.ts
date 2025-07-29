// packages/api/src/api/users.ts

import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import usersController from '../controllers/users.controller.js';

const router: Router = Router();

// GET /api/v1/users/me/likes - 내가 찜한 매물 목록 조회
router.get(
  '/me/likes',
  authMiddleware,
  asyncHandler(usersController.getMyLikedListings)
);

// PATCH /api/v1/users/me - 내 정보(핸드폰 번호) 업데이트
router.patch('/me', authMiddleware, asyncHandler(usersController.updateMyPhone)); // ⬅️ 추가

export default router;