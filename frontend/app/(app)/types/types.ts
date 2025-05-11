export interface DoctorInfo {
  id: number;
  username: string;
  specialty: string;
  office_location: string;
  profile_picture?: string;

}


export interface DoctorType {
  id: string;
  username: string;
  role: "DOCTOR";
  specialty: string;
  office_location: string;
  email: string;
  profile_picture?: string;
}


export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type InsuranceType = 'PUBLIC' | 'PRIVATE' | 'NONE';



export interface PatientInfo {
  id: string;
  username: string;
  gender: Gender;
  age?: number;
  profile_picture?: string;
  date_of_birth?: string;
  phone_number?: string;
  emergency_contact?: string;
  insurance_type: InsuranceType;
}

