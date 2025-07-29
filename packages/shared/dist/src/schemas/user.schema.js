import { z } from 'zod';
export const updateUserSchema = z.object({
    phone: z.string().min(10, '올바른 전화번호를 입력해주세요.'),
});
//# sourceMappingURL=user.schema.js.map