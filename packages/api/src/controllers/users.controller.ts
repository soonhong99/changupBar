// packages/api/src/controllers/users.controller.ts

import { Request, Response } from 'express';
import usersService from '../services/users.service.js';
import { updateUserSchema } from 'shared/schemas/user.schema';

async function getMyLikedListings(req: Request, res: Response) {
  const userId = req.user!.userId;
  const listings = await usersService.getLikedListings(userId);
  res.status(200).json(listings);
}

async function updateMyPhone(req: Request, res: Response) {
  try { // ⬅️ try-catch 블록으로 감싸 에러를 직접 처리합니다.
    const userId = req.user!.userId;
    const validatedData = updateUserSchema.parse(req.body);
    await usersService.updateMyPhone(userId, validatedData);
    res.status(200).json({ message: '핸드폰 번호가 등록되었습니다.' });
  } catch (error) {
    // ⬇️ '이미 사용 중인' 에러 메시지를 감지하면 409 상태 코드를 반환합니다.
    if (error instanceof Error && error.message.includes('이미 사용 중인')) {
      return res.status(409).json({ message: error.message });
    }

    // 그 외 다른 에러는 기존처럼 처리합니다.
    console.error(error);
    res.status(500).json({ message: '서버 내부 오류가 발생했습니다.' });
  }
}

export default {
  getMyLikedListings,
  updateMyPhone, // ⬅️ 추가
};