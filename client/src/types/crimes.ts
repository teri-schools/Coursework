export interface ICrime {
  id: number;
  date: string;
  location: string;
  description: string;
  investigation_status: 'Closed' | 'Open';
  person_id: number;
}

export type PartialCrime = Omit<ICrime, 'id'>;