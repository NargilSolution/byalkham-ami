export interface ClubMember {
  id?: string;
  userId?: string;
  nickname?: string;
  registry: string
  lastName: string;
  firstName: string;
  DOB: Date | any;
  age?: number;
  gender: 'Эр' | 'Эм';
  rank: string;
  photoURL?: string;
  thumbURL?: string;
  faceURL?: string;
  phone?: number;
  otherPhones?: string;
  address?: string;
  school?: string;
  uploadedBy?: string;
  uploadedId?: string;
  uploadedAt?: any;
  createdAt?: any;
  createdBy?: string;
  createdId?: string;
  updatedAt?: any;
  updatedBy?: string;
  updatedId?: string;
}
export interface ClubMemberUpdate {
  registry?: string
  lastName?: string;
  firstName?: string;
  DOB?: Date;
  age?: number;
  gender?: string;
  rank?: string;
  phone?: number;
  otherPhones?: string;
  address?: string;
  school?: string;
}
