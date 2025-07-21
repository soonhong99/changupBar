import { UserRole } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                role: UserRole;
            };
        }
    }
}
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => void;
