"use strict";
// THIS FILE DIRECTLY INTERACTS WITH THE 
// DATABASE BASED OFF OF ROUTING REQUESTS //
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllJournals = getAllJournals;
exports.getJournalById = getJournalById;
exports.addNewJournal = addNewJournal;
exports.deleteJournalById = deleteJournalById;
exports.editJournalTitleById = editJournalTitleById;
exports.getEntryById = getEntryById;
exports.getAllEntriesByJournalId = getAllEntriesByJournalId;
exports.addNewEntryToJournal = addNewEntryToJournal;
exports.editEntryTitle = editEntryTitle;
exports.editEntryBody = editEntryBody;
exports.deleteEntry = deleteEntry;
const pool_1 = __importDefault(require("../db/pool"));
const errors_1 = require("../utils/errors");
// VALIDATION
function mapDbError(error) {
    if (error instanceof errors_1.NotFoundError ||
        error instanceof errors_1.ValidationError)
        throw error;
    if (typeof error !== 'object' ||
        error === null ||
        !('code' in error)) {
        return new Error('Unknown database error');
    }
    const code = error.code;
    switch (code) {
        case '23502':
            return new errors_1.ValidationError('Request field is missing');
        case '22001':
            return new errors_1.ValidationError('Value is too long for the database field');
        case '23514':
            return new errors_1.ValidationError('Value violates a database constraint');
        case '23505':
            return new errors_1.ValidationError('This value already exists');
        case '23503':
            return new errors_1.NotFoundError('Journal does not exist');
        default:
            return new Error("Unknown Database Error");
    }
}
// HELPERS
async function journalExistsById(id, userId) {
    const journalExistsQuery = `
        SELECT * FROM journals
        WHERE id = $1 AND user_id = $2
    `;
    const journal = await pool_1.default.query(journalExistsQuery, [id, userId]);
    if (!journal.rows[0]) {
        return false;
    }
    return true;
}
async function journalExistsByTitle(title, userId) {
    const journalExistsQuery = `
        SELECT * FROM journals
        WHERE title = $1 AND user_id = $2
    `;
    const journal = await pool_1.default.query(journalExistsQuery, [title, userId]);
    if (!journal.rows[0]) {
        return false;
    }
    return true;
}
// JOURNAL CRUD //
async function getAllJournals(userId) {
    try {
        const query = `
            SELECT * FROM journals 
            WHERE user_id = $1
        `;
        const journals = await pool_1.default.query(query, [userId]);
        return journals.rows;
    }
    catch (error) {
        throw mapDbError(error);
    }
}
async function getJournalById(id, userId) {
    try {
        const query = `
            SELECT * FROM journals 
            WHERE id = $1 AND user_id = $2
        `;
        const selectedJournal = await pool_1.default.query(query, [id, userId]);
        if (!selectedJournal.rows[0]) {
            throw new errors_1.NotFoundError('Journal Not Found');
        }
        return selectedJournal.rows[0];
    }
    catch (error) {
        throw mapDbError(error);
    }
}
async function addNewJournal(userId, title) {
    try {
        if (await journalExistsByTitle(title, userId)) {
            throw new errors_1.ValidationError('Title must be unique');
        }
        const query = `
            INSERT INTO journals 
            (title, user_id) VALUES ($1, $2) 
            RETURNING *
        `;
        const addedJournal = await pool_1.default.query(query, [title, userId]);
        return addedJournal.rows[0];
    }
    catch (error) {
        throw mapDbError(error);
    }
}
async function deleteJournalById(id, user_id) {
    try {
        const query = `
            DELETE FROM journals 
            WHERE id = $1 AND user_id = $2 
            RETURNING *
        `;
        const deletedJournal = await pool_1.default.query(query, [id, user_id]);
        if (!deletedJournal.rows[0]) {
            throw new errors_1.NotFoundError('Journal Not Found');
        }
        return deletedJournal.rows[0];
    }
    catch (error) {
        throw mapDbError(error);
    }
}
async function editJournalTitleById(newTitle, id, user_id) {
    try {
        const query = `
            UPDATE journals
            SET title = $1
            WHERE id = $2 AND user_id = $3
            RETURNING *
        `;
        const updatedJournal = await pool_1.default.query(query, [newTitle, id, user_id]);
        if (!updatedJournal.rows[0]) {
            throw new errors_1.NotFoundError('Journal Not Found');
        }
        return updatedJournal.rows[0];
    }
    catch (error) {
        throw mapDbError(error);
    }
}
// ENTRY CRUD //
async function getEntryById(journalId, entryId, userId) {
    try {
        if (!await journalExistsById(journalId, userId)) {
            throw new errors_1.NotFoundError('Journal Not Found');
        }
        const query = `
            SELECT e.*
            FROM entries e
            JOIN journals j ON j.id = e.journal_id
            WHERE e.id = $1 AND e.journal_id = $2 AND j.user_id = $3
        `;
        const selectedEntry = await pool_1.default.query(query, [entryId, journalId, userId]);
        if (!selectedEntry.rows[0]) {
            throw new errors_1.NotFoundError('Entry Not Found');
        }
        return selectedEntry.rows[0];
    }
    catch (error) {
        throw mapDbError(error);
    }
}
async function getAllEntriesByJournalId(id, userId) {
    try {
        if (!await journalExistsById(id, userId)) {
            throw new errors_1.NotFoundError('Journal Not Found');
        }
        const query = `
            SELECT e.*
            FROM entries e
            INNER JOIN journals j ON j.id = e.journal_id
            WHERE e.journal_id = $1 AND j.user_id = $2
            ORDER BY created_on ASC
        `;
        const allEntries = await pool_1.default.query(query, [id, userId]);
        return allEntries.rows;
    }
    catch (error) {
        throw mapDbError(error);
    }
}
async function addNewEntryToJournal(entry, journalId, userId) {
    try {
        const query = `
            INSERT INTO entries (title, body, journal_id)
            SELECT $1, $2, j.id
            FROM journals j
            WHERE j.id = $3 AND j.user_id = $4
            RETURNING *
        `;
        const addedEntry = await pool_1.default.query(query, [
            entry.title,
            entry.body,
            journalId,
            userId
        ]);
        if (!addedEntry.rows[0]) {
            throw new errors_1.NotFoundError('Journal Not Found');
        }
        return addedEntry.rows[0];
    }
    catch (error) {
        throw mapDbError(error);
    }
}
async function editEntryTitle(journalId, entryId, newTitle, userId) {
    try {
        const query = `
            UPDATE entries
            SET title = $1
            WHERE id = $2 AND journal_id = $3
            AND journal_id IN (
                SELECT id FROM journals WHERE user_id = $4
            )
            RETURNING *
        `;
        const updatedEntry = await pool_1.default.query(query, [newTitle, entryId, journalId, userId]);
        if (!updatedEntry.rows[0]) {
            throw new errors_1.NotFoundError('Entry Not Found');
        }
        return updatedEntry.rows[0];
    }
    catch (error) {
        throw mapDbError(error);
    }
}
async function editEntryBody(journalId, entryId, newBody, userId) {
    try {
        const query = `
            UPDATE entries
            SET body = $1
            WHERE id = $2 AND journal_id = $3
            AND journal_id IN (
                SELECT id FROM journals WHERE user_id = $4
            )
            RETURNING *
        `;
        const updatedEntry = await pool_1.default.query(query, [newBody, entryId, journalId, userId]);
        if (!updatedEntry.rows[0]) {
            throw new errors_1.NotFoundError('Entry Not Found');
        }
        return updatedEntry.rows[0];
    }
    catch (error) {
        throw mapDbError(error);
    }
}
async function deleteEntry(journalId, entryId, user_id) {
    try {
        const query = `
            DELETE FROM entries
            WHERE id = $1 AND journal_id = $2
            AND journal_id IN (
                SELECT id FROM journals WHERE user_id = $3
            )
            RETURNING *
        `;
        const deletedEntry = await pool_1.default.query(query, [entryId, journalId, user_id]);
        if (!deletedEntry.rows[0]) {
            throw new errors_1.NotFoundError('Entry Not Found');
        }
        return deletedEntry.rows[0];
    }
    catch (error) {
        throw mapDbError(error);
    }
}
//# sourceMappingURL=journal.js.map