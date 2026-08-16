"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entryIdParamSchema = exports.journalIdParamSchema = exports.createEntrySchema = exports.createJournalSchema = exports.paramIdSchema = exports.entryBodySchema = exports.entryTitleSchema = exports.journalTitleSchema = void 0;
const zod_1 = require("zod");
exports.journalTitleSchema = zod_1.z.string().trim().min(1, 'Title is required').max(55, 'Title must be 55 characters or less');
exports.entryTitleSchema = zod_1.z.string().trim().max(255, 'Title must be 255 characters or less');
exports.entryBodySchema = zod_1.z.string().trim();
exports.paramIdSchema = zod_1.z.coerce.number().int().positive();
exports.createJournalSchema = zod_1.z.object({
    title: exports.journalTitleSchema,
});
exports.createEntrySchema = zod_1.z.object({
    title: exports.entryTitleSchema,
    body: exports.entryBodySchema,
});
exports.journalIdParamSchema = zod_1.z.object({
    id: exports.paramIdSchema,
});
exports.entryIdParamSchema = zod_1.z.object({
    journalId: exports.paramIdSchema,
    entryId: exports.paramIdSchema,
});
//# sourceMappingURL=journalValidation.js.map