import { Request, Response } from 'express';
declare function createPresignedUrl(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
declare const _default: {
    createPresignedUrl: typeof createPresignedUrl;
};
export default _default;
