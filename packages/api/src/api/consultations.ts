// packages/api/src/api/consultations.ts

import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import consultationsController from '../controllers/consultations.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js'; // ⬅️ 추가

const router: Router = Router();

router.get('/', authMiddleware, asyncHandler(consultationsController.getAllRequests)); // ⬅️ 추가

// POST /api/v1/consultations - 상담 신청 생성
router.post('/', asyncHandler(consultationsController.createRequest));

router.delete('/:id', authMiddleware, asyncHandler(consultationsController.deleteRequest)); // ⬅️ 추가

export default router;