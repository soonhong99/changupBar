// packages/api/src/controllers/listings.controller.ts
import { ZodError } from 'zod';
import { createListingSchema } from '../../../shared/src/schemas/listing.schema.js';
import listingService from '../services/listings.service.js';
async function createListing(req, res) {
    try {
        // 1. Zod 스키마를 사용해 요청 본문(req.body)을 검증합니다.
        const validatedData = createListingSchema.parse(req.body);
        // 2. (아직 만들지 않은) 서비스 계층을 호출하여 데이터를 생성합니다.
        const newListing = await listingService.create(validatedData);
        // 3. 성공적으로 생성되면 201 Created 상태 코드와 함께 결과를 반환합니다.
        res.status(201).json(newListing);
    }
    catch (error) {
        // Zod 유효성 검사 에러 처리
        if (error instanceof ZodError) {
            return res.status(400).json({
                message: '입력값이 올바르지 않습니다.',
                errors: error.flatten().fieldErrors,
            });
        }
        // 그 외 서버 내부 에러 처리
        console.error(error);
        res.status(500).json({ message: '서버 내부 오류가 발생했습니다.' });
    }
}
export default {
    createListing,
};
