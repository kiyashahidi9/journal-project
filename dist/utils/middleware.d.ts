import type { Request, Response, NextFunction } from 'express';
declare function unknownEndpoint(req: Request, res: Response): void;
declare function errorHandler(error: Error, req: Request, res: Response, next: NextFunction): void;
declare const _default: {
    unknownEndpoint: typeof unknownEndpoint;
    errorHandler: typeof errorHandler;
};
export default _default;
//# sourceMappingURL=middleware.d.ts.map