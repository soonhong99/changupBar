// packages/api/src/controllers/users.controller.ts

import { Request, Response } from 'express';
import usersService from '../services/users.service.js';
import { updateUserSchema } from '../../../shared/src/schemas/user.schema.js';

async function getMyLikedListings(req: Request, res: Response) {
  const userId = req.user!.userId;
  const listings = await usersService.getLikedListings(userId);
  res.status(200).json(listings);
}

async function updateMyPhone(req: Request, res: Response) {
  const userId = req.user!.userId;
  const validatedData = updateUserSchema.parse(req.body);
  await usersService.updateMyPhone(userId, validatedData);
  res.status(200).json({ message: '핸드폰 번호가 등록되었습니다.' });
}

export default {
  getMyLikedListings,
  updateMyPhone, // ⬅️ 추가
};