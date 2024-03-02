import type { ICrime } from "./crimes";

export interface IPerson {
  id: number;
  last_name: string;
  first_name: string;
  date_of_birth: string;
  gender: 'Male' | 'Female';
  crimes: ICrime[];
  address: string;
  position: string;
  citizenship: string;
  phone_number: string;
  email: string;
  country_of_birth: string;
  investigation_status: string | null;
  danger_level: number | null;
  exclusion_reason: string | null;
}