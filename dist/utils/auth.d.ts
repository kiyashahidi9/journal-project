import type { Request, Response, NextFunction } from 'express';
export interface AuthenticationRequest extends Request {
    user?: {
        id: number;
        username: string;
    };
}
export declare function requireAuth(req: AuthenticationRequest, res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.d.ts.map