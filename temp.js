"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config = { JWT_SECRET: 'abc', JWT_EXPIRES_IN: '1d' };
function createToken() {
    const secret = config.JWT_SECRET;
    if (!secret)
        throw new Error();
    const payload = { id: 1 };
    if (config.JWT_EXPIRES_IN) {
        return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: config.JWT_EXPIRES_IN });
    }
    return jsonwebtoken_1.default.sign(payload, secret);
}
