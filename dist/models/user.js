"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.createUser = createUser;
exports.findUserByUsername = findUserByUsername;
exports.createToken = createToken;
const pool_1 = __importDefault(require("../db/pool"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../utils/config"));
const errors_1 = require("../utils/errors");
const SALT_ROUNDS = 10;
async function hashPassword(password) {
    return bcryptjs_1.default.hash(password, SALT_ROUNDS);
}
async function verifyPassword(password, passwordHash) {
    return bcryptjs_1.default.compare(password, passwordHash);
}
async function createUser(username, password) {
    const userExistsQuery = `
        SELECT * FROM users
        WHERE username = $1
    `;
    const userExists = await pool_1.default.query(userExistsQuery, [username]);
    if (userExists.rows[0]) {
        throw new errors_1.ValidationError('Username already exists');
    }
    const passwordHash = await hashPassword(password);
    const query = `
        INSERT INTO users (username, password_hash)
        VALUES ($1, $2)
        RETURNING *
    `;
    const createdUser = await pool_1.default.query(query, [username, passwordHash]);
    return createdUser.rows[0];
}
async function findUserByUsername(username) {
    const query = `
        SELECT
            id,
            username,
            password_hash AS "passwordHash",
            created_at AS "createdAt"
        FROM users
        WHERE username = $1
    `;
    const user = await pool_1.default.query(query, [username]);
    if (!user.rows[0]) {
        throw new errors_1.ValidationError('Invalid username or password');
    }
    return user.rows[0];
}
function createToken(user) {
    const secret = config_1.default.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET must be defined');
    }
    const payload = {
        id: user.id,
        username: user.username,
    };
    const expiresIn = config_1.default.JWT_EXPIRES_IN;
    const signOptions = { expiresIn };
    return jsonwebtoken_1.default.sign(payload, secret, signOptions);
}
//# sourceMappingURL=user.js.map