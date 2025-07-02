import { Request, Response } from 'express';
declare function createListing(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
declare const _default: {
    createListing: typeof createListing;
};
export default _default;
