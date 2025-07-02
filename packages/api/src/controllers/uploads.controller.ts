// packages/api/src/controllers/uploads.controller.ts
import { Request, Response } from 'express';
import uploadsService from '../services/uploads.service.js';

async function createPresignedUrl(req: Request, res: Response) {
  // 클라이언트가 쿼리 파라미터로 파일명과 타입을 보냅니다.
  const { filename, filetype } = req.query;

  if (typeof filename !== 'string' || typeof filetype !== 'string') {
    return res.status(400).json({ message: 'filename과 filetype 쿼리 파라미터가 필요합니다.' });
  }

  const urls = await uploadsService.createPresignedUrl(filename, filetype);
  res.status(200).json(urls);
}

export default {
  createPresignedUrl,
};