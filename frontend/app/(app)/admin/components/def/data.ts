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
  
export const patientoriginalfields: UserField[] = [
    { name: "username", type: "text", label: "Username" },
  { name: "gender", label: "Gender", type: "select", options: ["Male", "Female"] },
  { name: "age", label: "Age", type: "number" },
  // { name: "profile_picture", label: "Profile Picture", type: "text" },
  { name: "date_of_birth", label: "Date of Birth", type: "date" },
  { name: "phone_number", label: "Phone Number", type: "text" },
  { name: "emergency_contact", label: "Emergency Contact", type: "text" },
  {
    name: "insurance_type",
    label: "Insurance Type",
    type: "select",
    options: ["Premier Auto Corporation", "Blue Cross Blue Shield", "Aetna", "Cigna", "United Healthcare", "Humana", "Other"]
,
  },
]
export const patientFields: UserField[] = [
  ...userFields,
  ...patientoriginalfields
];