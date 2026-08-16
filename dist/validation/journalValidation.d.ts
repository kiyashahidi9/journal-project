import { z } from 'zod';
export declare const journalTitleSchema: z.ZodString;
export declare const entryTitleSchema: z.ZodString;
export declare const entryBodySchema: z.ZodString;
export declare const paramIdSchema: z.ZodCoercedNumber<unknown>;
export declare const createJournalSchema: z.ZodObject<{
    title: z.ZodString;
}, z.core.$strip>;
export declare const createEntrySchema: z.ZodObject<{
    title: z.ZodString;
    body: z.ZodString;
}, z.core.$strip>;
export declare const journalIdParamSchema: z.ZodObject<{
    id: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export declare const entryIdParamSchema: z.ZodObject<{
    journalId: z.ZodCoercedNumber<unknown>;
    entryId: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
//# sourceMappingURL=journalValidation.d.ts.map