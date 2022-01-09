/* eslint-disable linebreak-style */
export interface AccountProfile {
  email?: string;
  displayName?: string;
  phoneNumber?: string;
  photoURL?: string;
}
export interface AccountUpdateData {
  uid: string;
  update: AccountProfile;
}
export interface Roles {
  subscriber: boolean;
  editor?: boolean;
  assistant?: boolean;
  athlete?: boolean;
  accountant?: boolean;
  coach?: boolean;
  admin?: boolean;
}
export interface UserProfile {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phoneNumber: number;
  roles: Roles;
  photoURL?: string;
}
export interface NewUserData {
  userId: string;
  invitationId: string;
  firstName: string;
  lastName: string;
  registry: string;
  displayName: string;
  email: string;
  phoneNumber: number;
  roles: Roles;
  photoURL?: string;
}
