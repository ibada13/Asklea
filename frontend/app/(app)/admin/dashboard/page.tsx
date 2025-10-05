'use client'
import useSWR from 'swr';

import { getPrivliged } from "@/app/lib/utlis";
import Error from "../../extra/Error";
import Loading from "../../extra/Loading";

interface DashboardStats {
  total_doctors: number;
  total_patients: number;
  patients_banned_from_messaging: number;
  doctors_banned_from_posting: number;
  doctors_banned_from_messaging: number;
  messages_today: number;
  diagnosis_reports: number;
  message_reports: number;
  infos_request: number;
  detach_request: number;
}


type Stat = {
  label: string;
  value: number;
  color: "sg" | "red-600" | "blue-400"|"orange-400";
};

const colorClasses: Record<Stat["color"], string> = {
  sg: "text-sg border-sg",
  "red-600": "text-red-600 border-red-600",
  "blue-400": "text-blue-400 border-blue-400",
  "orange-400": "text-orange-400 border-orange-400",
};

export default function DashBoard() {
  const { data, error} = useSWR<DashboardStats>("/admin/dashboard/stats", getPrivliged);

  if (error) return <Error />;
  if ( !data) return <Loading />;

 const stats: Stat[] = [
  { label: "Total Doctors", value: data.total_doctors, color: "sg" },
  { label: "Total Patients", value: data.total_patients, color: "sg" },
  { label: "Messages Today", value: data.messages_today, color: "sg" },
  // { label: "Patients Banned from Messaging", value: data.patients_banned_from_messaging, color: "orange-400" },
  // { label: "Doctors Banned from Posting", value: data.doctors_banned_from_posting, color: "orange-400" },
  // { label: "Doctors Banned from Messaging", value: data.doctors_banned_from_messaging, color: "orange-400" },
  // { label: "Diagnosis Reports", value: data.diagnosis_reports, color: "red-600" },
  // { label: "Message Reports", value: data.message_reports, color: "red-600" },
  { label: "Infos Request", value: data.infos_request, color: "blue-400" },
  { label: "Detach Request", value: data.detach_request, color: "blue-400" },
];


  return (
    <div className="min-h-screen p-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {stats.map(({ label, value, color }) => (
          <div
            key={label}
            className={`bg-white rounded-2xl shadow-md px-20 py-4 flex flex-col items-center justify-center text-center hover:shadow-xl transition-shadow duration-300 w-full border-2 border-dashed ${colorClasses[color]}`}
          >
            <p className={`text-sm font-semibold uppercase tracking-wide mb-2 ${colorClasses[color].split(" ")[0]}`}>
              {label}
            </p>
            <p className={`text-5xl font-extrabold leading-none ${colorClasses[color].split(" ")[0]}`}>
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
