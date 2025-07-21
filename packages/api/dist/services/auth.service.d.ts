import { RegisterUserInput, LoginUserInput } from '../../../shared/dist/src/schemas/auth.schema.js';
declare function register(data: RegisterUserInput): Promise<{
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    phone: string | null;
    provider: import("@prisma/client").$Enums.Provider;
    providerId: string | null;
    role: import("@prisma/client").$Enums.UserRole;
}>;
declare function login(data: LoginUserInput): Promise<{
    token: string;
}>;
declare function getMe(userId: string): Promise<{
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    role: import("@prisma/client").$Enums.UserRole;
}>;
declare function handleKakaoLogin(code: string): Promise<{
    token: string;
}>;
declare const _default: {
    register: typeof register;
    login: typeof login;
    getMe: typeof getMe;
    handleKakaoLogin: typeof handleKakaoLogin;
};
export default _default;
