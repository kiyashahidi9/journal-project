import { z } from 'zod'

export const journalTitleSchema = z.string().trim().min(1, 'Title is required').max(55, 'Title must be 55 characters or less')
export const entryTitleSchema = z.string().trim().max(255, 'Title must be 255 characters or less')
export const entryBodySchema = z.string().trim()
export const paramIdSchema = z.coerce.number().int().positive()

export const createJournalSchema = z.object({
    title: journalTitleSchema,
})

export const createEntrySchema = z.object({
    title: entryTitleSchema,
    body: entryBodySchema,
})

export const journalIdParamSchema = z.object({
    id: paramIdSchema,
})

export const entryIdParamSchema = z.object({
    journalId: paramIdSchema,
    entryId: paramIdSchema,
})