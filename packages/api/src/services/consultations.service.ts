// packages/api/src/services/consultations.service.ts

import prisma from '../config/prisma.js';
import { CreateConsultationInput } from 'shared/schemas/consultation.schema';

async function create(data: CreateConsultationInput) {
  console.log(`API desired time: ${data.desiredTime}`)
  // ⬇️ Prisma에 저장하기 전에 데이터를 변환하는 단계를 추가합니다.
  const dataForDb = {
    ...data,
    // desiredTime이 문자열이면 new Date()로 Date 객체로 변환, 없으면 null
    desiredTime: data.desiredTime ? new Date(data.desiredTime) : null,
  };

  const newRequest = await prisma.consultationRequest.create({
    data: dataForDb, // 변환된 데이터를 사용합니다.
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

async function getPendingCount() {
  return prisma.consultationRequest.count({
    where: { status: 'PENDING' },
  });
}

async function markAllAsContacted() {
  // status가 'PENDING'인 모든 레코드를 'CONTACTED'로 변경합니다.
  const result = await prisma.consultationRequest.updateMany({
    where: { status: 'PENDING' },
    data: { status: 'CONTACTED' },
  });
  return { count: result.count }; // 몇 개의 레코드가 변경되었는지 반환
}

export default {
  create,
  getAll,
  remove,
  getPendingCount,
  markAllAsContacted,
};