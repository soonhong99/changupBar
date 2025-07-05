// packages/shared/src/schemas/listing.schema.ts

import { z } from 'zod';

export const createListingSchema = z.object({
  name: z.string().min(1, '매물 이름은 필수입니다.'),
  summary: z.string().min(1, '한 줄 요약은 필수입니다.'),
  address: z.string().min(1, '상세 주소는 필수입니다.'),
  
  region: z.enum(['METROPOLITAN', 'NON_METROPOLITAN']),
  category: z.enum(['CAFE_BAKERY', 'RESTAURANT_BAR', 'RETAIL_ETC']),
  
  deposit: z.number().int().min(0),
  monthlyRent: z.number().int().min(0),
  keyMoney: z.number().int().min(0),
  monthlyRevenue: z.number().int().min(0),
  materialCost: z.number().int().min(0),
  personnelCost: z.number().int().min(0),
  utilityCost: z.number().int().min(0).optional(),    // ⬅️ 추가
  otherCost: z.number().int().min(0).optional(),      // ⬅️ 추가
  deliveryPercent: z.number().int().min(0).max(100).optional(), // ⬅️ 추가
  netProfit: z.number().int().min(0),

  isAutomated: z.boolean().default(false),
  hasParking: z.boolean().default(false),
  isFirstFloor: z.boolean().default(false),
  isNearStation: z.boolean().default(false),

  description: z.string().min(1, '상세 설명은 필수입니다.'),
  coverImage: z.string().url('유효한 URL을 입력해주세요.'),
  imageUrls: z.array(z.string().url()),

  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  isBest: z.boolean().default(false),
  bestUntil: z.string().datetime().optional(), // ISO 8601 날짜 문자열
  isWeeklyBest: z.boolean().default(false).optional(),
  featuredStart: z.string().datetime().optional().nullable(),
  featuredEnd: z.string().datetime().optional().nullable()
});

// Zod 스키마로부터 TypeScript 타입 추론
export type CreateListingInput = z.infer<typeof createListingSchema>;

export const updateListingSchema = createListingSchema.partial();

export type UpdateListingInput = z.infer<typeof updateListingSchema>;