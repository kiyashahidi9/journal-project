"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("./errors");
const logger_1 = __importDefault(require("./logger"));
function unknownEndpoint(req, res) {
    res.status(404).send({ error: 'unknown endpoint' });
}
function errorHandler(error, req, res, next) {
    logger_1.default.error(error.message);
    if (error instanceof errors_1.NotFoundError) {
        res.status(404).json({ error: error.message });
        return;
    }
    else if (error instanceof errors_1.ValidationError) {
        res.status(400).json({ error: error.message });
        return;
    }
    else if (error instanceof errors_1.AuthorizationError) {
        res.status(403).json({ error: error.message });
        return;
    }
    next(error);
}
exports.default = {
    unknownEndpoint,
    errorHandler
};
//# sourceMappingURL=middleware.js.map