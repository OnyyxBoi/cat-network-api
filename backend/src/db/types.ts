export interface User {
  id: number;
  name: string;
  first_name: string;
  pseudonym: string;
  age: number | null;
  email: string;
  password: string;
  is_owner: boolean;
  is_veterinarian: boolean;
  created_at: Date;
}

export interface Breed {
  id: number;
  name: string;
}

export interface Clinic {
  id: number;
  name: string;
  address: string;
  created_at: Date;
}

export interface ClinicVeterinarian {
  clinic_id: number;
  vet_id: number;
}

export interface Cat {
  id: number;
  name: string;
  breed: number | null;
  owner: number;
  age: number | null;
  weight: string | null;
  main_clinic: number | null;
  created_at: Date;
}

export interface Appointment {
  id: number;
  cat: number;
  veterinarian: number;
  date: Date;
  created_at: Date;
}

export interface CatWithOwnerBreed {
  id: number;
  cat_name: string;
  owner_id: number;
  owner_pseudonym: string;
  breed_name: string | null;
}

export interface VetBusyDay {
  vet_id: number;
  pseudonym: string;
  appt_day: string;
  appts: number;
}

export interface OwnerWithoutCats {
  owner_id: number;
  pseudonym: string;
}