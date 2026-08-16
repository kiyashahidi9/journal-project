"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("./config"));
const errors_1 = require("./errors");
function getTokenFromHeader(req) {
    const authHeader = req.get('Authorization');
    if (!authHeader?.toLowerCase().startsWith('bearer ')) {
        return null;
    }
    return authHeader.substring(7);
}
function requireAuth(req, res, next) {
    const token = getTokenFromHeader(req);
    if (!token) {
        throw new errors_1.AuthorizationError('Authentication required');
    }
    if (!config_1.default.JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET);
        req.user = { id: decoded.id, username: decoded.username };
        next();
    }
    catch {
        throw new errors_1.AuthorizationError('Invalid or expired token');
    }
}
//# sourceMappingURL=auth.js.map