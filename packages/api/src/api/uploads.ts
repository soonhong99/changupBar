// packages/api/src/api/uploads.ts
import { Router } from 'express';
import uploadsController from '../controllers/uploads.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router: Router = Router();

// GET /api/v1/uploads/presigned-url - 업로드용 URL 요청 (로그인 필요)
router.get(
  '/presigned-url',
  authMiddleware, // 관리자만 업로드할 수 있도록 인증 미들웨어 적용
  asyncHandler(uploadsController.createPresignedUrl)
);

export default router;