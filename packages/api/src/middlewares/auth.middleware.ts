// packages/api/src/middlewares/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Express의 Request 타입에 user 속성을 추가하기 위한 타입 확장
declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; role: string };
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  console.log(`Method: ${req.method}, authHeader: ${authHeader}`);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: '인증 토큰이 필요합니다!' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };
    req.user = decoded; // 요청 객체에 사용자 정보 추가
    next(); // 다음 미들웨어 또는 컨트롤러로 진행
  } catch (error) {
    res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    return;
  }
};