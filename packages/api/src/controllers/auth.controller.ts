// packages/api/src/controllers/auth.controller.ts

import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { registerUserSchema, loginUserSchema} from '../../../shared/src/schemas/auth.schema.js';
import authService from '../services/auth.service.js';

async function register(req: Request, res: Response) {
  try {
    const validatedData = registerUserSchema.parse(req.body);
    const newUser = await authService.register(validatedData);
    res.status(201).json(newUser);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: '입력값이 올바르지 않습니다.',
        errors: error.flatten().fieldErrors,
      });
    }
    // 이메일 중복 에러 처리
    if (error instanceof Error && error.message.includes('이메일')) {
      return res.status(409).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: '서버 내부 오류가 발생했습니다.' });
  }
}

async function login(req: Request, res: Response) {
  try {
    const validatedData = loginUserSchema.parse(req.body);
    const result = await authService.login(validatedData);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: '입력값이 올바르지 않습니다.',
        errors: error.flatten().fieldErrors,
      });
    }
    // 로그인 실패 에러 처리
    if (error instanceof Error && error.message.includes('비밀번호')) {
      return res.status(401).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: '서버 내부 오류가 발생했습니다.' });
  }
}

async function getMe(req: Request, res: Response) {
  const userId = req.user!.userId;
  const user = await authService.getMe(userId);
  res.status(200).json(user);
}

export default {
  register,
  login,
  getMe,
};