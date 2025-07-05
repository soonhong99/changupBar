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

export default router;