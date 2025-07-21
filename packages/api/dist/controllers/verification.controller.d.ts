import { Request, Response } from 'express';
declare function sendCode(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
declare function checkCode(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
declare const _default: {
    sendCode: typeof sendCode;
    checkCode: typeof checkCode;
};
export default _default;
