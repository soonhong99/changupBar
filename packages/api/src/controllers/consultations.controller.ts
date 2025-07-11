// packages/api/src/controllers/consultations.controller.ts

import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { createConsultationSchema } from '../../../shared/src/schemas/consultation.schema.js';
import consultationsService from '../services/consultations.service.js';

async function createRequest(req: Request, res: Response) {
  try {
    const validatedData = createConsultationSchema.parse(req.body);
    const newRequest = await consultationsService.create(validatedData);
    res.status(201).json(newRequest);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: '입력값이 올바르지 않습니다.',
        errors: error.flatten().fieldErrors,
      });
    }
    console.error(error);
    res.status(500).json({ message: '서버 내부 오류가 발생했습니다.' });
  }
}

async function getAllRequests(req: Request, res: Response) {
  // 관리자만 접근 가능한 기능이므로, 역할 체크를 추가할 수 있습니다.
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: '접근 권한이 없습니다.' });
  }
  const requests = await consultationsService.getAll();
  res.status(200).json(requests);
}

async function deleteRequest(req: Request, res: Response) {
  const { id } = req.params;
  await consultationsService.remove(id);
  res.status(200).json({ message: '삭제되었습니다.' });
}

export default {
  createRequest,
  getAllRequests,
  deleteRequest,
};