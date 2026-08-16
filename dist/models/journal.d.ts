import type { Journal, Entry, CreateEntryInput } from '../types/types';
export declare function getAllJournals(userId: number): Promise<Journal[]>;
export declare function getJournalById(id: number, userId: number): Promise<Journal>;
export declare function addNewJournal(userId: number, title: string): Promise<Journal>;
export declare function deleteJournalById(id: number, user_id: number): Promise<Journal>;
export declare function editJournalTitleById(newTitle: string, id: number, user_id: number): Promise<Journal>;
export declare function getEntryById(journalId: number, entryId: number, userId: number): Promise<Entry>;
export declare function getAllEntriesByJournalId(id: number, userId: number): Promise<Entry[]>;
export declare function addNewEntryToJournal(entry: CreateEntryInput, journalId: number, userId: number): Promise<Entry>;
export declare function editEntryTitle(journalId: number, entryId: number, newTitle: string, userId: number): Promise<Entry>;
export declare function editEntryBody(journalId: number, entryId: number, newBody: string, userId: number): Promise<Entry>;
export declare function deleteEntry(journalId: number, entryId: number, user_id: number): Promise<Entry>;
//# sourceMappingURL=journal.d.ts.map