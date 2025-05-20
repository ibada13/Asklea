import { UserField } from "./definitios";
export const userFields: UserField[] = [
  { name: "username", type: "text", label: "Username" },
  { name: "email", type: "email", label: "Email" },
  { name: "password", type: "password", label: "Password" },
//   { name: "role", type: "select", label: "Role", options: ["admin", "doctor", "patient"] },
];


export const doctorFields: UserField[] = [
  ...userFields,
  { name: 'specialty', label: 'Specialty', type: 'select', options:['Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'Oncology', 'Orthopedics', 'Psychiatry', 'Radiology', 'General Surgery', 'Internal Medicine'] },
  { name: 'office_location', label: 'Office Location', type: 'text' },
];