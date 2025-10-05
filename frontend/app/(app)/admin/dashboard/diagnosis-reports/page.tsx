"use client";

import Error from "@/app/(app)/extra/Error";
import Loading from "@/app/(app)/extra/Loading";
import { getPrivliged, post } from "@/app/lib/utlis";
import useSWR from "swr";
import { FaGavel } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TextPlaceHolder from "@/app/(app)/extra/TextPlaceHolder";

type DiagnosisReport = {
  id: number;
  description: string;
  reported_by_username: string;
  posted_by_username: string;
};

export default function DashBoard() {
  const { data, error, mutate, isLoading } = useSWR<DiagnosisReport[]>(
    "/admin/diagnosis-reports",
    getPrivliged
  );

  const [loadingId, setLoadingId] = useState<number | null>(null);
  const router = useRouter();

  if (error) return <Error />;
  if (isLoading) return <Loading />;
  if (!data || data.length === 0)
    return <TextPlaceHolder text="No diagnosis reports for the moment." />;

const handleAction = async (id: number, accept: boolean) => {
  setLoadingId(id);
  try {
    const res = await post(`/admin/diagnosis/report/${id}/${accept}`);
    mutate();
    router.push(
      `${window.location.pathname}?msg=${encodeURIComponent(
        res?.detail || "Diagnosis report handled successfully"
      )}`
    );
  } catch (err: any) {
    const errorMsg =
      err?.response?.data?.detail || err?.message || "An unexpected error occurred";
    console.log(errorMsg);
    router.push(
      `${window.location.pathname}?msg=${encodeURIComponent(errorMsg)}&color=red`
    );
  } finally {
    setLoadingId(null);
  }
};


  return (
    <div className="w-full h-full space-y-4">
      {data.map(({ id, reported_by_username, posted_by_username, description }) => (
        <div
          key={id}
          className="p-4 bg-white rounded-2xl shadow border-2 border-dashed border-sg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <p className="text-sm sm:text-base">
            <strong className="text-sg">{reported_by_username}</strong> reported a diagnosis posted by{" "}
            <strong className="text-red-500">{posted_by_username}</strong>:{" "}
            <span className="text-gray-800 font-medium">"{description}"</span>
          </p>
          <div className="flex gap-2">
            <button
              disabled={loadingId === id}
              onClick={() => handleAction(id, true)}
              className="p-2 rounded-lg bg-sg hover:bg-white hover:text-sg/90 text-white transition-all duration-200 shadow-md hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Accept Report and Take Action"
            >
              <FaGavel size={18} />
            </button>
            <button
              disabled={loadingId === id}
              onClick={() => handleAction(id, false)}
              className="p-2 rounded-lg bg-red-500 hover:text-red-700 hover:bg-white text-white transition-all duration-200 shadow-md hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Dismiss Report"
            >
              <IoMdClose size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
