export interface Journal {
    id: number;
    title: string;
}
export type CreateJournalInput = Omit<Journal, 'id'>;
export interface Entry {
    id: number;
    title: string;
    body: string;
    createdOn: string;
    journalId: number;
}
export type CreateEntryInput = Omit<Entry, 'id' | 'createdOn' | 'journalId'>;
export interface User {
    id: number;
    username: string;
    passwordHash: string;
    createdAt: string;
}
export type CreateUserInput = Omit<User, 'id' | 'createdAt'>;
//# sourceMappingURL=types.d.ts.map