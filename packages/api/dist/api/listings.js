// packages/api/src/api/listings.ts
import { Router } from 'express';
import listingController from '../controllers/listings.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js'; // ⬅️ asyncHandler import
const router = Router();
// POST /api/v1/listings - 신규 매물 생성
// listingController.createListing을 asyncHandler로 감싸줍니다.
router.post('/', asyncHandler(listingController.createListing)); // ⬅️ 이렇게 수정!
export default router;
