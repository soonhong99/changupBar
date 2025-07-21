import { CreateConsultationInput } from '../../../shared/dist/src/schemas/consultation.schema.js';
declare function create(data: CreateConsultationInput): Promise<{
    name: string | null;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: import("@prisma/client").$Enums.ConsultationStatus;
    phone: string;
    age: number;
    gender: string;
    desiredCategory: string;
    desiredLocation: string;
    investmentAmount: number;
    details: string | null;
}>;
declare function getAll(): Promise<{
    name: string | null;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: import("@prisma/client").$Enums.ConsultationStatus;
    phone: string;
    age: number;
    gender: string;
    desiredCategory: string;
    desiredLocation: string;
    investmentAmount: number;
    details: string | null;
}[]>;
declare function remove(id: string): Promise<{
    message: string;
}>;
declare function getPendingCount(): Promise<number>;
declare function markAllAsContacted(): Promise<{
    count: number;
}>;
declare const _default: {
    create: typeof create;
    getAll: typeof getAll;
    remove: typeof remove;
    getPendingCount: typeof getPendingCount;
    markAllAsContacted: typeof markAllAsContacted;
};
export default _default;
