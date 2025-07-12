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

function redirectToKakao(req: Request, res: Response) {
  const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}&response_type=code`;
  res.redirect(kakaoAuthURL);
}

async function handleKakaoCallback(req: Request, res: Response) {
  const { code } = req.query;
  if (!code || typeof code !== 'string') {
    return res.status(400).send('카카오 인증 코드가 없습니다.');
  }

  try {
    const { token } = await authService.handleKakaoLogin(code);
    // 로그인 성공 시, 토큰을 쿠키에 저장하고 프론트엔드 메인 페이지로 리다이렉트
    res.redirect(`http://localhost:3000/auth/social?token=${token}`);
  } catch (error) {
    console.error('카카오 로그인 실패:', error);
    res.redirect('http://localhost:3000/login?error=kakao-login-failed');
  }
}

export default {
  register,
  login,
  getMe,
  redirectToKakao,
  handleKakaoCallback,
};