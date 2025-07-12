// packages/api/src/api/verification.ts

import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import verificationController from '../controllers/verification.controller.js';

const router: Router = Router();

// POST /api/v1/verification/send - 인증번호 발송
router.post('/send', asyncHandler(verificationController.sendCode));

// POST /api/v1/verification/check - 인증번호 확인
router.post('/check', asyncHandler(verificationController.checkCode));

export default router;