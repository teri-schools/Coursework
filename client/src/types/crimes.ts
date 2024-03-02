export interface ICrime {
  id: number;
  date: string;
  location: string;
  description: string;
  investigation_status: 'Closed' | 'Open';
}
