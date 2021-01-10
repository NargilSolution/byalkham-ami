
export interface Roles { 
    [key: string]: any;
    subscriber?: boolean;
    editor?: boolean;
    admin?: boolean;
    assistant?: boolean;
    accountant?: boolean;
    supporter?: boolean;
    issuer?: boolean;
 }
 export interface User {
    uid: string;
    photoURL?: string;
    displayName?: string;
    email: string;
    lastName?: string;
    firstName?: string;
    nickname?: string;
    phone?: number;
    profession?: string;
    roles?: Roles;
}