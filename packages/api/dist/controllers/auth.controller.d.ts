import { Request, Response } from 'express';
declare function register(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
declare function login(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
declare function getMe(req: Request, res: Response): Promise<void>;
declare function redirectToKakao(req: Request, res: Response): void;
declare function handleKakaoCallback(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
declare const _default: {
    register: typeof register;
    login: typeof login;
    getMe: typeof getMe;
    redirectToKakao: typeof redirectToKakao;
    handleKakaoCallback: typeof handleKakaoCallback;
};
export default _default;
