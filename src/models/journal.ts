// THIS FILE DIRECTLY INTERACTS WITH THE 
// DATABASE BASED OFF OF ROUTING REQUESTS //

import pool from '../db/pool'
import type { 
    Journal, 
    Entry, 
    CreateEntryInput 
} from '../types/types'

import { 
    NotFoundError, 
    ValidationError 
} from '../utils/errors'

// VALIDATION

function mapDbError(error: unknown): Error {
    if (
        error instanceof NotFoundError || 
        error instanceof ValidationError
    ) throw error
    
    if (
        typeof error !== 'object' || 
        error === null || 
        !('code' in error)
    ) {
        return new Error('Unknown database error')
    }

    const code = (error as { code?: string }).code

    switch (code) {
        case '23502':
            return new ValidationError(
                'Request field is missing'
            )
        case '22001':
            return new ValidationError(
                'Value is too long for the database field'
            )
        case '23514':
            return new ValidationError(
                'Value violates a database constraint'
            )
        case '23505':
            return new ValidationError(
                'This value already exists'
            )
        case '23503':
            return new NotFoundError(
                'Journal does not exist'
            )
        default:
            return new Error(
                "Unknown Database Error"
            )
    }
}

// HELPERS

async function journalExistsById(
    id: number, 
    userId: number
): Promise<boolean> {
    const journalExistsQuery = `
        SELECT * FROM journals
        WHERE id = $1 AND user_id = $2
    `
    const journal = await pool.query(
        journalExistsQuery, 
        [id, userId]
    )
    if (!journal.rows[0]) {
        return false
    }
    return true
}

async function journalExistsByTitle(
    title: string,
    userId: number
): Promise<boolean> {
    const journalExistsQuery = `
        SELECT * FROM journals
        WHERE title = $1 AND user_id = $2
    `
    const journal = await pool.query(
        journalExistsQuery,
        [title, userId]
    )
    if (!journal.rows[0]) {
        return false
    }
    return true
}

// JOURNAL CRUD //

export async function getAllJournals(
    userId: number
): Promise<Journal[]> {
    try {
        const query = `
            SELECT * FROM journals 
            WHERE user_id = $1
        `
        const journals = await pool.query(query, [userId])
        return journals.rows
    } catch (error) {
        throw mapDbError(error)
    }
}

export async function getJournalById(
    id: number, 
    userId: number
): Promise<Journal> {
    try {
        const query = `
            SELECT * FROM journals 
            WHERE id = $1 AND user_id = $2
        `
        const selectedJournal = await pool.query(
            query, 
            [id, userId]
        )

        if (!selectedJournal.rows[0]) {
            throw new NotFoundError('Journal Not Found')
        }

        return selectedJournal.rows[0]
    } catch (error) {
        throw mapDbError(error)
    }
}

export async function addNewJournal(
    userId: number, 
    title: string
): Promise<Journal> {
    try {
        if (await journalExistsByTitle(title, userId)) {
            throw new ValidationError('Title must be unique')
        }
        const query = `
            INSERT INTO journals 
            (title, user_id) VALUES ($1, $2) 
            RETURNING *
        `
        const addedJournal = await pool.query(
            query, 
            [title, userId]
        )
        return addedJournal.rows[0]
    } catch (error) {
        throw mapDbError(error)
    }
}

export async function deleteJournalById(
    id: number, 
    user_id: number
): Promise<Journal> {
    try {
        const query = `
            DELETE FROM journals 
            WHERE id = $1 AND user_id = $2 
            RETURNING *
        `
        const deletedJournal = await pool.query(
            query, 
            [id, user_id])

        if (!deletedJournal.rows[0]) {
            throw new NotFoundError('Journal Not Found')
        }

        return deletedJournal.rows[0]
    } catch (error) {
        throw mapDbError(error)
    }
}

export async function editJournalTitleById(
    newTitle: string,
    id: number,
    user_id: number
): Promise<Journal> {
    try {
        const query = `
            UPDATE journals
            SET title = $1
            WHERE id = $2 AND user_id = $3
            RETURNING *
        `
        const updatedJournal = await pool.query(
            query,
            [newTitle, id, user_id]
        )

        if (!updatedJournal.rows[0]) {
            throw new NotFoundError('Journal Not Found')
        }

        return updatedJournal.rows[0]
    } catch (error) {
        throw mapDbError(error)
    }
}

// ENTRY CRUD //

export async function getEntryById(
    journalId: number,
    entryId: number,
    userId: number
): Promise<Entry> {
    try {
        if (!await journalExistsById(journalId, userId)) {
            throw new NotFoundError('Journal Not Found')
        }

        const query = `
            SELECT e.*
            FROM entries e
            JOIN journals j ON j.id = e.journal_id
            WHERE e.id = $1 AND e.journal_id = $2 AND j.user_id = $3
        `

        const selectedEntry = await pool.query(
            query,
            [entryId, journalId, userId]
        )

        if (!selectedEntry.rows[0]) {
            throw new NotFoundError('Entry Not Found')
        }

        return selectedEntry.rows[0]
    } catch (error) {
        throw mapDbError(error)
    }
}

export async function getAllEntriesByJournalId(
    id: number,
    userId: number
): Promise<Entry[]> {
    try {
        if (!await journalExistsById(id, userId)) {
            throw new NotFoundError('Journal Not Found')
        }

        const query = `
            SELECT e.*
            FROM entries e
            INNER JOIN journals j ON j.id = e.journal_id
            WHERE e.journal_id = $1 AND j.user_id = $2
            ORDER BY created_on ASC
        `
        const allEntries = await pool.query(
            query,
            [id, userId]
        )
        return allEntries.rows
    } catch (error) {
        throw mapDbError(error)
    }
}

export async function addNewEntryToJournal(
    entry: CreateEntryInput, 
    journalId: number, 
    userId: number
): Promise<Entry> {
    try {
        const query = `
            INSERT INTO entries (title, body, journal_id)
            SELECT $1, $2, j.id
            FROM journals j
            WHERE j.id = $3 AND j.user_id = $4
            RETURNING *
        `
        const addedEntry = await pool.query(query, [
            entry.title, 
            entry.body, 
            journalId, 
            userId
        ])

        if (!addedEntry.rows[0]) {
            throw new NotFoundError('Journal Not Found')
        }

        return addedEntry.rows[0]
    } catch (error) {
        throw mapDbError(error)
    }
}

export async function editEntryTitle(
    journalId: number,
    entryId: number,
    newTitle: string,
    userId: number
): Promise<Entry> {
    try {
        const query = `
            UPDATE entries
            SET title = $1
            WHERE id = $2 AND journal_id = $3
            AND journal_id IN (
                SELECT id FROM journals WHERE user_id = $4
            )
            RETURNING *
        `
        const updatedEntry = await pool.query(
            query,
            [newTitle, entryId, journalId, userId]
        )

        if (!updatedEntry.rows[0]) {
            throw new NotFoundError('Entry Not Found')
        }

        return updatedEntry.rows[0]
    } catch (error) {
        throw mapDbError(error)
    }
}

export async function editEntryBody(
    journalId: number,
    entryId: number,
    newBody: string,
    userId: number
): Promise<Entry> {
    try {
        const query = `
            UPDATE entries
            SET body = $1
            WHERE id = $2 AND journal_id = $3
            AND journal_id IN (
                SELECT id FROM journals WHERE user_id = $4
            )
            RETURNING *
        `
        const updatedEntry = await pool.query(
            query,
            [newBody, entryId, journalId, userId]
        )

        if (!updatedEntry.rows[0]) {
            throw new NotFoundError('Entry Not Found')
        }

        return updatedEntry.rows[0]
    } catch (error) {
        throw mapDbError(error)
    }
}

export async function deleteEntry(
    journalId: number,
    entryId: number,
    user_id: number
): Promise<Entry> {
    try {
        const query = `
            DELETE FROM entries
            WHERE id = $1 AND journal_id = $2
            AND journal_id IN (
                SELECT id FROM journals WHERE user_id = $3
            )
            RETURNING *
        `
        const deletedEntry = await pool.query(
            query,
            [entryId, journalId, user_id]
        )

        if (!deletedEntry.rows[0]) {
            throw new NotFoundError('Entry Not Found')
        }

        return deletedEntry.rows[0]
    } catch (error) {
        throw mapDbError(error)
    }
}