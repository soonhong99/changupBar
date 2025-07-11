// packages/api/src/api/auth.ts

import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authMiddleware } from '../middlewares/auth.middleware.js'; // ⬅️ 이 줄을 추가해주세요!

const router: Router = Router();

// POST /api/v1/auth/register - 회원가입
router.post('/register', asyncHandler(authController.register));

// POST /api/v1/auth/login - 로그인
router.post('/login', asyncHandler(authController.login));

// GET /api/v1/auth/me - 내 정보 확인 (로그인 필요)
router.get('/me', authMiddleware, asyncHandler(authController.getMe)); 

// GET /api/v1/auth/kakao - 카카오 로그인 페이지로 리다이렉트
router.get('/kakao', authController.redirectToKakao);

// GET /api/v1/auth/kakao/callback - 카카오 로그인 콜백 처리
router.get('/kakao/callback', asyncHandler(authController.handleKakaoCallback));

export default router;