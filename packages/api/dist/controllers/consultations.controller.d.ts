import { Request, Response } from 'express';
declare function createRequest(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
declare function getAllRequests(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
declare function deleteRequest(req: Request, res: Response): Promise<void>;
declare function getPendingCount(req: Request, res: Response): Promise<void>;
declare function markAllAsContacted(req: Request, res: Response): Promise<void>;
declare const _default: {
    createRequest: typeof createRequest;
    getAllRequests: typeof getAllRequests;
    deleteRequest: typeof deleteRequest;
    getPendingCount: typeof getPendingCount;
    markAllAsContacted: typeof markAllAsContacted;
};
export default _default;
