import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client'; // ⬅️ UserRole 타입을 import 합니다.

export const optionalAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  // 토큰이 없거나 'Bearer '로 시작하지 않으면, 그냥 통과시킨다.
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: UserRole;
    };
    req.user = decoded; // 토큰이 유효하면 사용자 정보를 추가
  } catch (error) {
    // 토큰이 유효하지 않아도 에러를 발생시키지 않고 그냥 통과
  }

  next();
};