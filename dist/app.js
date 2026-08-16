"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const middleware_1 = __importDefault(require("./utils/middleware"));
const journalRouter_1 = __importDefault(require("./routes/journalRouter"));
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const auth_1 = require("./utils/auth");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/auth', authRouter_1.default);
app.use('/api/journals', auth_1.requireAuth, journalRouter_1.default);
const frontendDistPath = path_1.default.join(process.cwd(), 'frontend-dist');
app.use(express_1.default.static(frontendDistPath));
app.get(/^\/(?!api)(?!.*\.[a-zA-Z0-9]+$).*/, (req, res, next) => {
    if (req.path.startsWith('/api')) {
        return next();
    }
    res.sendFile(path_1.default.join(frontendDistPath, 'index.html'));
});
app.use(middleware_1.default.unknownEndpoint);
app.use(middleware_1.default.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map