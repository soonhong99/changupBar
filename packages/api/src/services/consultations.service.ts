// packages/api/src/services/consultations.service.ts

import prisma from '../config/prisma.js';
import { CreateConsultationInput } from '../../../shared/src/schemas/consultation.schema.js';

async function create(data: CreateConsultationInput) {
  const newRequest = await prisma.consultationRequest.create({
    data,
  });
  return newRequest;
}

async function getAll() {
  return prisma.consultationRequest.findMany({
    orderBy: {
      createdAt: 'desc', // 최신순으로 정렬
    },
  });
}

async function remove(id: string) {
  await prisma.consultationRequest.delete({
    where: { id },
  });
  return { message: '상담 신청 내역이 삭제되었습니다.' };
}

export default {
  create,
  getAll,
  remove,
};