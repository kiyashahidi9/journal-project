"use strict";
// THIS FILES CONNECTS TO THE DATABASE 
// AND EXPOSES IT VIA A POOL
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../utils/config"));
const logger_1 = __importDefault(require("../utils/logger"));
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: config_1.default.DB_USER,
    host: config_1.default.DB_HOST,
    database: config_1.default.DB_NAME,
    password: config_1.default.DB_PASS,
    port: config_1.default.DB_PORT,
});
pool.on('error', (error) => {
    logger_1.default.error('Unexpected PostgreSQL error', error);
});
exports.default = pool;
//# sourceMappingURL=pool.js.map