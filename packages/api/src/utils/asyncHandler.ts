// packages/api/src/utils/asyncHandler.ts

import { Request, Response, NextFunction } from 'express';

// 비동기 요청 핸들러의 타입을 정의합니다.
type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

/**
 * 비동기 컨트롤러 함수를 감싸는 래퍼 함수입니다.
 * 컨트롤러 내부에서 발생한 에러를 잡아 Express의 에러 핸들러로 전달합니다.
 * @param fn 비동기 컨트롤러 함수
 */
export const asyncHandler = (fn: AsyncRequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};