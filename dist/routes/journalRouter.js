"use strict";
// THIS FILE RECIEVES ROUTING REQUESTS, 
// FORWARDS THEM TO THE MODEL, AND RESPONDS
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const journalRouter = express_1.default.Router();
const journal_1 = require("../models/journal");
const errors_1 = require("../utils/errors");
const journalValidation_1 = require("../validation/journalValidation");
// JOURNAL CRUD ROUTES
journalRouter.get('/', async (req, res) => {
    const authReq = req;
    const userId = authReq.user?.id;
    if (!userId)
        throw new errors_1.AuthorizationError('Authentication Required');
    const allJournals = await (0, journal_1.getAllJournals)(userId);
    res.json(allJournals);
});
journalRouter.get('/:id', async (req, res) => {
    const authReq = req;
    const userId = authReq.user?.id;
    if (!userId)
        throw new errors_1.AuthorizationError('Authentication Required');
    const parsedParams = journalValidation_1.journalIdParamSchema.safeParse(req.params);
    if (!parsedParams.success) {
        throw new errors_1.ValidationError('Invalid Journal ID');
    }
    const id = parsedParams.data.id;
    const selectedJournal = await (0, journal_1.getJournalById)(id, userId);
    res.json(selectedJournal);
});
journalRouter.post('/', async (req, res) => {
    const authReq = req;
    const userId = authReq.user?.id;
    if (!userId)
        throw new errors_1.AuthorizationError('Authentication Required');
    const parsedJournal = journalValidation_1.createJournalSchema.safeParse(req.body);
    if (!parsedJournal.success) {
        const message = parsedJournal.error.issues[0]?.message ?? 'Invalid Input';
        throw new errors_1.ValidationError(message);
    }
    const title = parsedJournal.data.title;
    const addedJournal = await (0, journal_1.addNewJournal)(userId, title);
    res.json(addedJournal);
});
journalRouter.delete('/:id', async (req, res) => {
    const authReq = req;
    const userId = authReq.user?.id;
    if (!userId)
        throw new errors_1.AuthorizationError('Authentication Required');
    const parsedParams = journalValidation_1.journalIdParamSchema.safeParse(req.params);
    if (!parsedParams.success) {
        throw new errors_1.ValidationError('Invalid Journal ID');
    }
    const id = parsedParams.data.id;
    const deletedJournal = await (0, journal_1.deleteJournalById)(id, userId);
    res.json(deletedJournal);
});
journalRouter.patch('/:id', async (req, res) => {
    const authReq = req;
    const userId = authReq.user?.id;
    if (!userId)
        throw new errors_1.AuthorizationError('Authentication Required');
    const parsedJournal = journalValidation_1.createJournalSchema.safeParse(req.body);
    const parsedParams = journalValidation_1.journalIdParamSchema.safeParse(req.params);
    if (!parsedJournal.success) {
        const message = parsedJournal.error.issues[0]?.message ?? "Invalid Input";
        throw new errors_1.ValidationError(message);
    }
    if (!parsedParams.success) {
        throw new errors_1.ValidationError('Invalid Journal ID');
    }
    const newTitle = parsedJournal.data.title;
    const id = parsedParams.data.id;
    const updatedJournal = await (0, journal_1.editJournalTitleById)(newTitle, id, userId);
    res.json(updatedJournal);
});
// ENTRY CRUD ROUTES
journalRouter.post('/:id/entries', async (req, res) => {
    const authReq = req;
    const userId = authReq.user?.id;
    if (!userId)
        throw new errors_1.AuthorizationError('Authentication Required');
    const parsedEntry = journalValidation_1.createEntrySchema.safeParse(req.body);
    const parsedParams = journalValidation_1.journalIdParamSchema.safeParse(req.params);
    if (!parsedEntry.success) {
        const message = parsedEntry.error.issues[0]?.message ?? "Invalid Input";
        throw new errors_1.ValidationError(message);
    }
    if (!parsedParams.success) {
        throw new errors_1.ValidationError('Invalid Journal ID');
    }
    const newEntry = parsedEntry.data;
    const journalId = parsedParams.data.id;
    const addedEntry = await (0, journal_1.addNewEntryToJournal)(newEntry, journalId, userId);
    res.json(addedEntry);
});
journalRouter.get('/:id/entries', async (req, res) => {
    const authReq = req;
    const userId = authReq.user?.id;
    if (!userId)
        throw new errors_1.AuthorizationError('Authentication Required');
    const parsedParams = journalValidation_1.journalIdParamSchema.safeParse(req.params);
    if (!parsedParams.success) {
        throw new errors_1.ValidationError('Invalid Journal ID');
    }
    const journalId = parsedParams.data.id;
    const allEntries = await (0, journal_1.getAllEntriesByJournalId)(journalId, userId);
    res.json(allEntries);
});
journalRouter.get('/:journalId/entries/:entryId', async (req, res) => {
    const authReq = req;
    const userId = authReq.user?.id;
    if (!userId)
        throw new errors_1.AuthorizationError('Authentication Required');
    const parsedParams = journalValidation_1.entryIdParamSchema.safeParse(req.params);
    if (!parsedParams.success) {
        throw new errors_1.ValidationError('Invalid Journal or Entry ID');
    }
    const journalId = parsedParams.data.journalId;
    const entryId = parsedParams.data.entryId;
    const selectedEntry = await (0, journal_1.getEntryById)(journalId, entryId, userId);
    res.json(selectedEntry);
});
journalRouter.patch('/:journalId/entries/:entryId/title', async (req, res) => {
    const authReq = req;
    const userId = authReq.user?.id;
    if (!userId)
        throw new errors_1.AuthorizationError('Authentication Required');
    const parsedParams = journalValidation_1.entryIdParamSchema.safeParse(req.params);
    const parsedTitle = journalValidation_1.entryTitleSchema.safeParse(req.body.title);
    if (!parsedParams.success) {
        throw new errors_1.ValidationError('Invalid Journal or Entry ID');
    }
    if (!parsedTitle.success) {
        const message = parsedTitle.error.issues[0]?.message ?? "Invalid Input";
        throw new errors_1.ValidationError(message);
    }
    const journalId = parsedParams.data.journalId;
    const entryId = parsedParams.data.entryId;
    const newTitle = parsedTitle.data;
    const updatedEntry = await (0, journal_1.editEntryTitle)(journalId, entryId, newTitle, userId);
    res.json(updatedEntry);
});
journalRouter.patch('/:journalId/entries/:entryId/body', async (req, res) => {
    const authReq = req;
    const userId = authReq.user?.id;
    if (!userId)
        throw new errors_1.AuthorizationError('Authentication Required');
    const parsedParams = journalValidation_1.entryIdParamSchema.safeParse(req.params);
    const parsedBody = journalValidation_1.entryTitleSchema.safeParse(req.body.body);
    if (!parsedParams.success) {
        throw new errors_1.ValidationError('Invalid Journal or Entry ID');
    }
    if (!parsedBody.success) {
        const message = parsedBody.error.issues[0]?.message ?? "Invalid Input";
        throw new errors_1.ValidationError(message);
    }
    const journalId = parsedParams.data.journalId;
    const entryId = parsedParams.data.entryId;
    const newBody = parsedBody.data;
    const updatedEntry = await (0, journal_1.editEntryBody)(journalId, entryId, newBody, userId);
    res.json(updatedEntry);
});
journalRouter.delete('/:journalId/entries/:entryId', async (req, res) => {
    const authReq = req;
    const userId = authReq.user?.id;
    if (!userId)
        throw new errors_1.AuthorizationError('Authentication Required');
    const parsedParams = journalValidation_1.entryIdParamSchema.safeParse(req.params);
    if (!parsedParams.success) {
        throw new errors_1.ValidationError('Invalid Journal or Entry ID');
    }
    const journalId = parsedParams.data.journalId;
    const entryId = parsedParams.data.entryId;
    const deletedEntry = await (0, journal_1.deleteEntry)(journalId, entryId, userId);
    res.json(deletedEntry);
});
exports.default = journalRouter;
//# sourceMappingURL=journalRouter.js.map