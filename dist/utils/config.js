"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { PORT, DB_NAME, DB_HOST, DB_PASS, DB_USER, JWT_EXPIRES_IN, JWT_SECRET, } = process.env;
const DB_PORT = Number(process.env.DB_PORT);
exports.default = {
    PORT,
    DB_NAME,
    DB_HOST,
    DB_PASS,
    DB_PORT,
    DB_USER,
    JWT_EXPIRES_IN,
    JWT_SECRET,
};
//# sourceMappingURL=config.js.map