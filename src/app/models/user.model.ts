export interface Roles {
  [key: string]: any;
  subscriber: boolean;
  editor?: boolean;
  assistant?: boolean;
  athlete?: boolean;
  accountant?: boolean;
  coach?: boolean;
  admin?: boolean;
}

export interface UserInvitation {
  lastName: string;
  firstName: string;
  displayName: string;
  email: string;
  roles: Roles;
  createdAt?: Date;
}

export interface Profile {
  id?: string;
  email: string;
  lastName: string;
  firstName: string;
  displayName: string;
  photoURL?: string;
  registry: string;
  phoneNumber: number;
  roles: Roles;
}
export interface SignupData {
  invitationId: string;
  firstName: string;
  lastName: string;
  registry: string;
  displayName: string;
  email: string;
  password: string;
  phoneNumber: number;
  roles: Roles;
  photoURL?: string;
}
export interface ProfileUpdate {
  email?: string;
  displayName?: string;
  phoneNumber?: string;
  photoURL?: string;
}
export interface ProfileUpdateData {
  uid: string;
  update: ProfileUpdate;
}
