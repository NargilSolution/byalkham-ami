export interface SportType {
  id?: string;
  order: number;
  acronym: string;
  title: string;
  english: string;
  imageURL?: string;
  iconURL?: string;
}
export interface SportTypeUpdate {
  id?: string;
  order?: number;
  acronym?: string;
  title?: string;
  english?: string;
  imageURL?: string;
  iconURL?: string;
}
