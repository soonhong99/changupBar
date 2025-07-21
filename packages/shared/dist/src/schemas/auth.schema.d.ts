import { z } from 'zod';
export declare const registerUserSchema: z.ZodObject<{
    email: z.ZodString;
    name: z.ZodString;
    password: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    name: string;
    password: string;
    phone?: string | undefined;
}, {
    email: string;
    name: string;
    password: string;
    phone?: string | undefined;
}>;
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export declare const loginUserSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
