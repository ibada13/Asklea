"use client";

import Error from "@/app/(app)/extra/Error";
import Loading from "@/app/(app)/extra/Loading";
import TextPlaceHolder from "@/app/(app)/extra/TextPlaceHolder";
import { getPrivliged } from "@/app/lib/utlis";
import Link from "next/link";
import useSWR from "swr";


type EditRequest = {
    patient_id: string;
    patient_username: string;
};

export default function EditRequestes() {
  const { data, error } = useSWR<EditRequest[]>("/admin/patient-edit-requests", getPrivliged);

  if (error) return <Error />;
  if (!data) return <Loading />;
  if (data.length ===0 ) return <TextPlaceHolder text="no requestes for the moment"/>

  return (
    <div className="w-full h-full space-y-4">
      {data.map(({ patient_id , patient_username }) => (
          <Link
              href={ `/admin/patient-edit-request/${patient_id}`}
          key={patient_id}
          className="p-4 bg-white rounded-2xl shadow border-2 border-dashed border-sg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <p className="text-sm sm:text-base">
            The patient <strong className="text-sg">{patient_username}</strong> wants to edit his infos


          </p>
 
        </Link>
      ))}
    </div>
  );
}
