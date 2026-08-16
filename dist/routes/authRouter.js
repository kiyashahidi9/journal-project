"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../models/user");
const errors_1 = require("../utils/errors");
const userValidation_1 = require("../validation/userValidation");
const authRouter = express_1.default.Router();
// REGISTER
authRouter.post('/register', async (req, res) => {
    const parsedRegister = userValidation_1.registerSchema.safeParse(req.body);
    if (!parsedRegister.success) {
        const message = parsedRegister.error.issues[0]?.message ?? 'Invalid Input';
        throw new errors_1.ValidationError(message);
    }
    const { username, password } = parsedRegister.data;
    const createdUser = await (0, user_1.createUser)(username, password);
    res.status(201).json({
        user: {
            id: createdUser.id,
            username: createdUser.username,
        }
    });
});
// LOGIN
authRouter.post('/login', async (req, res) => {
    const parsedLogin = userValidation_1.loginSchema.safeParse(req.body);
    if (!parsedLogin.success) {
        const message = parsedLogin.error.issues[0]?.message ?? "Invalid Input";
        throw new errors_1.ValidationError(message);
    }
    const { username, password } = parsedLogin.data;
    const user = await (0, user_1.findUserByUsername)(username);
    const isValidPassword = await (0, user_1.verifyPassword)(password, user.passwordHash);
    if (!isValidPassword) {
        throw new errors_1.ValidationError('Invalid username or password');
    }
    const token = (0, user_1.createToken)({
        id: user.id,
        username: user.username,
    });
    res.json({
        token,
        user: {
            id: user.id,
            username: user.username,
        },
    });
});
exports.default = authRouter;
//# sourceMappingURL=authRouter.js.map