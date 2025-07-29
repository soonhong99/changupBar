// packages/api/src/controllers/auth.controller.ts

import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { registerUserSchema, loginUserSchema} from '../../../shared/dist/src/schemas/auth.schema.js';
import { updateUserSchema } from '../../../shared/src/schemas/user.schema.js';
import authService from '../services/auth.service.js';
import prisma from '../config/prisma.js'; // ⬅️ prisma import 추가

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
    const { token } = await authService.login(validatedData);
 
    res.status(200).json({ token, message: 'login success!' });
  } catch (error) {
	if (error instanceof ZodError) {
	    return res.status(400).json({
		message: '입력값이 올바르지 않습니다.',
		errors: error.flatten().fieldErrors,
	    });
	}
	if (error instanceof Error && error.message.includes('비밀번호')) {
	    return res.status(401).json({message: error.message});
	}
	console.error(error);
	return res.status(500).json({message: '서버 내부 오류가 발생했습니다.'});
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
    // ⬇️ 서비스 로직을 컨트롤러로 일부 가져와서 수정합니다.
    // 1. 카카오로부터 사용자 정보 가져오기
    const kakaoUserInfo = await authService.getKakaoUserInfo(code); // (이 함수는 아래 서비스에서 새로 만듭니다)

    // 2. 우리 DB에서 사용자 찾기 또는 생성
    const user = await prisma.user.upsert({
      where: { providerId: kakaoUserInfo.kakaoId },
      update: {}, // 이미 있으면 아무것도 변경 안 함
      create: {
        provider: 'KAKAO',
        providerId: kakaoUserInfo.kakaoId,
        email: kakaoUserInfo.email,
        name: kakaoUserInfo.name,
        password: null,
      },
    });

    // 3. 우리 서비스의 JWT 발급
    const token = authService.generateServiceToken(user);

    // 4. 사용자의 전화번호 유무에 따라 다른 주소로 리다이렉트
    if (!user.phone || (user.phone && user.phone.length < 10)) {
      // 전화번호가 없으면, 인증이 필요하다는 신호와 함께 리다이렉트
      res.redirect(`${process.env.FRONTEND_URL}/auth/social?token=${token}&action=verify_phone`);
    } else {
      // 전화번호가 이미 있으면, 바로 메인 페이지로
      res.redirect(`${process.env.FRONTEND_URL}/auth/social?token=${token}`);
    }
  } catch (error) {
    console.error('카카오 로그인 실패:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=kakao-login-failed`);
  }
}

export default {
  register,
  login,
  getMe,
  redirectToKakao,
  handleKakaoCallback,
};
