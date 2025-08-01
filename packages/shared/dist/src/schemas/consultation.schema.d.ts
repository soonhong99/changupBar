import { z } from 'zod';
export declare const createConsultationSchema: z.ZodObject<{
    name: z.ZodString;
    phone: z.ZodString;
    age: z.ZodNumber;
    gender: z.ZodString;
    desiredCategory: z.ZodString;
    desiredLocation: z.ZodString;
    investmentAmount: z.ZodNumber;
    details: z.ZodOptional<z.ZodString>;
    desiredTime: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    phone: string;
    name: string;
    age: number;
    gender: string;
    desiredCategory: string;
    desiredLocation: string;
    investmentAmount: number;
    details?: string | undefined;
    desiredTime?: string | null | undefined;
}, {
    phone: string;
    name: string;
    age: number;
    gender: string;
    desiredCategory: string;
    desiredLocation: string;
    investmentAmount: number;
    details?: string | undefined;
    desiredTime?: string | null | undefined;
}>;
export type CreateConsultationInput = z.infer<typeof createConsultationSchema>;
