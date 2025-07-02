// packages/shared/src/schemas/auth.schema.ts

import { z } from 'zod';

export const registerUserSchema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요.'),
  name: z.string().min(2, '이름은 2자 이상이어야 합니다.'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다.'),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;

export const loginUserSchema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

export type LoginUserInput = z.infer<typeof loginUserSchema>;