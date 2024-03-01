export type PaginatedData<T> = {
  total: number;
  items: T[];
} & IPagination

export interface IPagination {
  page: number;
  per_page: number;
}

export interface ICoordinates {
  latitude: number;
  longitude: number;
}

export interface IMapPoint extends ICoordinates {
  title: string;
  id: number;
}