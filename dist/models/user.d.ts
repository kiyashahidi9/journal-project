import { User } from '../types/types';
export declare function hashPassword(password: string): Promise<string>;
export declare function verifyPassword(password: string, passwordHash: string): Promise<boolean>;
export declare function createUser(username: string, password: string): Promise<User>;
export declare function findUserByUsername(username: string): Promise<User>;
export declare function createToken(user: Pick<User, 'id' | 'username'>): string;
//# sourceMappingURL=user.d.ts.map