// THIS FILE RECIEVES ROUTING REQUESTS, 
// FORWARDS THEM TO THE MODEL, AND RESPONDS

import express from 'express'
const journalRouter = express.Router()

import { 
    getAllJournals, 
    getJournalById,
    addNewJournal, 
    deleteJournalById,
    editJournalTitleById,
    getEntryById,
    getAllEntriesByJournalId,
    addNewEntryToJournal,
    editEntryBody,
    editEntryTitle,
    deleteEntry,
} from '../models/journal'
import { 
    ValidationError, 
    AuthorizationError 
} from '../utils/errors'
import {
    journalIdParamSchema,
    createJournalSchema,
    createEntrySchema,
    entryIdParamSchema,
    entryTitleSchema,
    entryBodySchema,
} from '../validation/journalValidation'
import { AuthenticationRequest } from '../utils/auth'

// JOURNAL CRUD ROUTES

journalRouter.get('/', async (req, res) => {
    const authReq = req as AuthenticationRequest
    const userId = authReq.user?.id
    if (!userId) throw new AuthorizationError('Authentication Required')

    const allJournals = await getAllJournals(userId)
    res.json(allJournals)
})

journalRouter.get('/:id', async (req, res) => {
    const authReq = req as AuthenticationRequest
    const userId = authReq.user?.id
    if (!userId) throw new AuthorizationError('Authentication Required')

    const parsedParams = journalIdParamSchema.safeParse(req.params)

    if (!parsedParams.success) {
        throw new ValidationError('Invalid Journal ID')
    }

    const id = parsedParams.data.id
    const selectedJournal = await getJournalById(id, userId)
    res.json(selectedJournal)
})

journalRouter.post('/', async (req, res) => {
    const authReq = req as AuthenticationRequest
    const userId = authReq.user?.id
    if (!userId) throw new AuthorizationError('Authentication Required')

    const parsedJournal = createJournalSchema.safeParse(req.body)

    if (!parsedJournal.success) {
        const message = parsedJournal.error.issues[0]?.message ?? 'Invalid Input'
        throw new ValidationError(message)
    }

    const title = parsedJournal.data.title
    const addedJournal = await addNewJournal(userId, title)
    res.json(addedJournal)
})

journalRouter.delete('/:id', async (req, res) => {
    const authReq = req as AuthenticationRequest
    const userId = authReq.user?.id
    if (!userId) throw new AuthorizationError('Authentication Required')

    const parsedParams = journalIdParamSchema.safeParse(req.params)

    if (!parsedParams.success) {
        throw new ValidationError('Invalid Journal ID')
    }

    const id = parsedParams.data.id
    const deletedJournal = await deleteJournalById(id, userId)
    res.json(deletedJournal)
})

journalRouter.patch('/:id', async (req, res) => {
    const authReq = req as AuthenticationRequest
    const userId = authReq.user?.id
    if (!userId) throw new AuthorizationError('Authentication Required')

    const parsedJournal = createJournalSchema.safeParse(req.body)
    const parsedParams = journalIdParamSchema.safeParse(req.params)

    if (!parsedJournal.success) {
        const message = parsedJournal.error.issues[0]?.message ?? "Invalid Input"
        throw new ValidationError(message)
    }

    if (!parsedParams.success) {
        throw new ValidationError('Invalid Journal ID')
    }

    const newTitle = parsedJournal.data.title
    const id = parsedParams.data.id
    const updatedJournal = await editJournalTitleById(newTitle, id, userId)
    res.json(updatedJournal)
})

// ENTRY CRUD ROUTES

journalRouter.post('/:id/entries', async (req, res) => {
    const authReq = req as AuthenticationRequest
    const userId = authReq.user?.id
    if (!userId) throw new AuthorizationError('Authentication Required')

    const parsedEntry = createEntrySchema.safeParse(req.body)
    const parsedParams = journalIdParamSchema.safeParse(req.params)

    if (!parsedEntry.success) {
        const message = parsedEntry.error.issues[0]?.message ?? "Invalid Input"
        throw new ValidationError(message)
    }

    if (!parsedParams.success) {
        throw new ValidationError('Invalid Journal ID')
    }

    const newEntry = parsedEntry.data
    const journalId = parsedParams.data.id
    const addedEntry = await addNewEntryToJournal(newEntry, journalId, userId)
    res.json(addedEntry)
})

journalRouter.get('/:id/entries', async (req, res) => {
    const authReq = req as AuthenticationRequest
    const userId = authReq.user?.id
    if (!userId) throw new AuthorizationError('Authentication Required')

    const parsedParams = journalIdParamSchema.safeParse(req.params)

    if (!parsedParams.success) {
        throw new ValidationError('Invalid Journal ID')
    }

    const journalId = parsedParams.data.id
    const allEntries = await getAllEntriesByJournalId(journalId, userId)
    res.json(allEntries)
})

journalRouter.get('/:journalId/entries/:entryId', async (req, res) => {
    const authReq = req as AuthenticationRequest
    const userId = authReq.user?.id
    if (!userId) throw new AuthorizationError('Authentication Required')

    const parsedParams = entryIdParamSchema.safeParse(req.params)

    if (!parsedParams.success) {
        throw new ValidationError('Invalid Journal or Entry ID')
    }

    const journalId = parsedParams.data.journalId
    const entryId = parsedParams.data.entryId
    const selectedEntry = await getEntryById(journalId, entryId, userId)
    res.json(selectedEntry)
})

journalRouter.patch('/:journalId/entries/:entryId/title', async (req, res) => {
    const authReq = req as AuthenticationRequest
    const userId = authReq.user?.id
    if (!userId) throw new AuthorizationError('Authentication Required')

    const parsedParams = entryIdParamSchema.safeParse(req.params)
    const parsedTitle = entryTitleSchema.safeParse(req.body.title)

    if (!parsedParams.success) {
        throw new ValidationError('Invalid Journal or Entry ID')
    }

    if (!parsedTitle.success) {
        const message = parsedTitle.error.issues[0]?.message ?? "Invalid Input"
        throw new ValidationError(message)
    }

    const journalId = parsedParams.data.journalId
    const entryId = parsedParams.data.entryId
    const newTitle = parsedTitle.data
    const updatedEntry = await editEntryTitle(journalId, entryId, newTitle, userId)
    res.json(updatedEntry)
})

journalRouter.patch('/:journalId/entries/:entryId/body', async (req, res) => {
    const authReq = req as AuthenticationRequest
    const userId = authReq.user?.id
    if (!userId) throw new AuthorizationError('Authentication Required')

    const parsedParams = entryIdParamSchema.safeParse(req.params)
    const parsedBody = entryBodySchema.safeParse(req.body.body)

    if (!parsedParams.success) {
        throw new ValidationError('Invalid Journal or Entry ID')
    }

    if (!parsedBody.success) {
        const message = parsedBody.error.issues[0]?.message ?? "Invalid Input"
        throw new ValidationError(message)
    }

    const journalId = parsedParams.data.journalId
    const entryId = parsedParams.data.entryId
    const newBody = parsedBody.data
    const updatedEntry = await editEntryBody(journalId, entryId, newBody, userId)
    res.json(updatedEntry)
})

journalRouter.delete('/:journalId/entries/:entryId', async (req, res) => {
    const authReq = req as AuthenticationRequest
    const userId = authReq.user?.id
    if (!userId) throw new AuthorizationError('Authentication Required')

    const parsedParams = entryIdParamSchema.safeParse(req.params)

    if (!parsedParams.success) {
        throw new ValidationError('Invalid Journal or Entry ID')
    }

    const journalId = parsedParams.data.journalId
    const entryId = parsedParams.data.entryId
    const deletedEntry = await deleteEntry(journalId, entryId, userId)
    res.json(deletedEntry)
})

export default journalRouter
