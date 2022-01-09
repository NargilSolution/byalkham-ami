import { ClubMember } from "./club.model";

export interface LightBoxPhoto {
  src: string;
  caption: string;
  thumb: string;
}
export interface EventType {
  id?: string;
  order: number;
  title: string;
  english: string;
  iconURL?: string;
  hasPhotos: boolean;
  hasVideos: boolean;
  hasSchedule: boolean;
  createdAt?: any;
  createdBy?: string;
  createdId?: string;
  updatedAt?: any;
  updatedBy?: string;
  updatedId?: string;
}
export interface EventStatus {
  id?: string;
  title: string;
  createdAt?: any;
  createdBy?: string;
  createdId?: string;
  updatedAt?: any;
  updatedBy?: string;
  updatedId?: string;
}
export interface Event {
  id?: string;
  typeId: EventType;
  type: string;
  name: string;
  englishName: string;
  info?: string;
  photoURL?: string;
  startDate: Date | any;
  endDate: Date | any;
  dateRange: string;
  place: string;
  organizer: string;
  status: string;
  resultAvailable: boolean;
  pdfAvailable: boolean;
  hasChanges: boolean;
  isCanceled: boolean;
  medals?: string;
  youtubeId?: string;
  createdAt?: any;
  createdBy?: string;
  createdId?: string;
  updatedAt?: any;
  updatedBy?: string;
  updatedId?: string;
}

export interface Sport {
  id?: string;
  title: string;
  acronym: string;
  english: string;
  imageURL?: string;
  iconURL?: string;
}

export interface Race {
  id?: string;
  eventId?: string;
  date: any;
  order: number;
  title: string;
  minAge: number;
  maxAge: number;
  gender: string[];
  distance: number;
  type: string;
  createdAt?: any;
  createdBy?: string;
  createdId?: string;
  updatedAt?: any;
  updatedBy?: string;
  updatedId?: string;
}

export interface EventCategory {
  id?: string;
  order: number;
  title: string;
  creationAt?: Date;
  createdId?: string;
  createdBy?: string;
  updatedAt?: Date;
  updatedId?: string;
  updatedBy?: string;
}
export interface EventPhoto {
  id?: string;
  eventId: string;
  date?: Date | any;
  category: EventCategory;
  fileName: string;
  originalURL: string;
  previewURL: string;
  thumbURL: string;
  order: number;
  title: string;
  isUploaded: boolean;
  orignalSize: number;
  previewSize: number;
  thumbSize: number;
  creationAt?: Date;
  createdId?: string;
  createdBy?: string;
  updatedAt?: Date;
  updatedId?: string;
  updatedBy?: string;
}
export interface EventThumb {
  category: EventCategory;
  thumbURL: string;
  order: number;
  title: string;
}
export interface EventPhotoUpdate {
  date?: Date | any;
  category?: EventCategory;
  fileName?: string;
  order?: number;
  title?: string;
}
export interface EventVideo {
  id?: string;
  eventId: string;
  date?: Date | any;
  category: EventCategory;
  youtubeId: string;
  thumbURL: string;
  order: number;
  title: string;
  duration: number;
  thumbSize: number;
  creationAt?: Date;
  createdId?: string;
  createdBy?: string;
  updatedAt?: Date;
  updatedId?: string;
  updatedBy?: string;
}
export interface EventVideoUpdate {
  date?: Date | any;
  category?: EventCategory;
  youtubeId?: string;
  order?: number;
  title?: string;
}
export interface PhotoGallery {
  id?: string;
  order: number;
  title: string;
  photos: EventPhoto[];
}
export interface VideoGallery {
  id?: string;
  order: number;
  title: string;
  videos: EventVideo[];
}
export interface RaceResult {
  id?: string;
  eventId: string;
  raceId: string;
  order: number;
  memberId: string;
  member?: ClubMember;
  firstName: string;
  lastName: string;
  registry: string;
  photoURL?: string;
  faceURL?: string;
  raceNumber: string;
  distance: number;
  time: number;
  creationAt?: Date;
  createdId?: string;
  createdBy?: string;
  updatedAt?: Date;
  updatedId?: string;
  updatedBy?: string;
}
export interface ResultUpdate {
  raceId?: string;
  order?: number;
  memberId?: string;
  member?: ClubMember;
  firstName?: string;
  lastName?: string;
  registry?: string;
  raceNumber?: string;
  distance?: number;
  time?: number;
}
