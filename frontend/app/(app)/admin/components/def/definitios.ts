import { IconType } from "react-icons";

export type NavLink = {
    icon?:IconType
  label: string;
  href: string;
};

export type FieldType = "text" | "email" | "password" | "select" | string;

export interface UserField {
    name: "username" | "email" | "password" | string;
  type: FieldType;
  label: string;
  options?: string[]; 
}


