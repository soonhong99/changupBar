// packages/shared/src/schemas/consultation.schema.ts
import { z } from 'zod';

export const createConsultationSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'), // ⬅️ 추가
  phone: z.string().min(10, '올바른 전화번호를 입력해주세요.'),
  age: z.number().int().min(1, '나이를 입력해주세요.'),
  gender: z.string(),
  desiredCategory: z.string().min(1, '원하는 업종을 입력해주세요.'),
  desiredLocation: z.string().min(1, '원하는 지역을 입력해주세요.'),
  investmentAmount: z.number().int().min(0),
  details: z.string().max(200, '상세사항은 200자 이내로 입력해주세요.').optional(), // ⬅️ 추가
});

export type CreateConsultationInput = z.infer<typeof createConsultationSchema>;