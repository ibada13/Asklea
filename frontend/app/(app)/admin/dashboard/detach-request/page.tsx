"use client";

import Error from "@/app/(app)/extra/Error";
import Loading from "@/app/(app)/extra/Loading";
import { deletePrivileged, getPrivliged } from "@/app/lib/utlis";
import useSWR, { mutate } from "swr";
import { FaCheck } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useRouter } from "next/navigation";
import TextPlaceHolder from "@/app/(app)/extra/TextPlaceHolder";
type DetachRequest = {
  id: number;
  doctor_username: string;
  doctor_id: string;
  patient_id: string;
  patient_username: string;
};

export default function DashBoard() {
  const { data, error } = useSWR<DetachRequest[]>(
    "/admin/patient-detach-requests",
    getPrivliged
  );
  const router = useRouter();

  const handleDeacthUser = async (requestId: number, action: boolean) => {
    try {
      const response = await deletePrivileged(
        `/admin/${requestId}/patient-detach-request/${action}`
      );

      if (response) {
        mutate("/admin/patient-detach-requests"); 
        router.push(`${location.pathname}?msg=${response.detail}`, {
          scroll: false,
        });
      }
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.detail || "Failed to detach users. Try again.";
      router.push(
        `${location.pathname}?msg=${errorMsg}&&color=red`,
        { scroll: false }
      );
    }
  };

  if (error) return <Error />;
  if (!data) return <Loading />;
  if (data.length ===0 ) return <TextPlaceHolder text="no requestes for the moment"/>
  return (
    <div className="w-full h-full space-y-4">
      {data.map(
        ({
          id: requesId,
          patient_id,
          patient_username,
          doctor_username,
          doctor_id,
        }) => (
          <div
            key={patient_id + doctor_id}
            className="p-4 bg-white rounded-2xl shadow border-2 border-dashed border-sg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <p className="text-sm sm:text-base">
              The doctor <strong className="text-sg">"{doctor_username}"</strong> wants to
              detach the patient
              <strong className="text-sg "> "{patient_username}"</strong>
            </p>
            <div className="flex gap-2">
              <button
                className="p-2 rounded-lg bg-sg hover:bg-white hover:text-sg/90 text-white transition-all duration-200 shadow-md hover:scale-105"
                title="Accept"
                onClick={() => handleDeacthUser(requesId, true)}
              >
                <FaCheck size={18} />
              </button>
              <button
                className="p-2 rounded-lg bg-red-500 hover:text-red-700 hover:bg-white text-white transition-all duration-200 shadow-md hover:scale-105"
                title="Decline"
                onClick={() => handleDeacthUser(requesId, false)}
              >
                <IoMdClose size={20} />
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
