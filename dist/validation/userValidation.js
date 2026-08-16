"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    username: zod_1.z.string().trim().min(3, 'username\'s gotta be at least 3 characters bro').max(30, 'woahhh, username too long bro'),
    password: zod_1.z.string().min(6, 'password must be at least 6 characters long broski').max(100, 'woahhh, password too long bro')
});
exports.loginSchema = zod_1.z.object({
    username: zod_1.z.string().trim().min(1, 'Username required'),
    password: zod_1.z.string().trim().min(1, 'Password required')
});
//# sourceMappingURL=userValidation.js.map