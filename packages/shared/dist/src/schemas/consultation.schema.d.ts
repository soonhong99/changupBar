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
}, "strip", z.ZodTypeAny, {
    name: string;
    phone: string;
    age: number;
    gender: string;
    desiredCategory: string;
    desiredLocation: string;
    investmentAmount: number;
    details?: string | undefined;
}, {
    name: string;
    phone: string;
    age: number;
    gender: string;
    desiredCategory: string;
    desiredLocation: string;
    investmentAmount: number;
    details?: string | undefined;
}>;
export type CreateConsultationInput = z.infer<typeof createConsultationSchema>;
