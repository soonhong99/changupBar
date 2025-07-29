import { z } from 'zod';
export declare const updateUserSchema: z.ZodObject<{
    phone: z.ZodString;
}, "strip", z.ZodTypeAny, {
    phone: string;
}, {
    phone: string;
}>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
