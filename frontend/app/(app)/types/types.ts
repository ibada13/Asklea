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
