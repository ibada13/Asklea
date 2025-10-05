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

type MessageReportes = {
  id: number;
  sender_id: string;
  sender_name: string;
  reporter_name: string;
  reporter_id: string;
  text: string;
};

export default function DashBoard() {
  const { data, error, mutate ,isLoading} = useSWR<MessageReportes[]>("/admin/message-reports", getPrivliged);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const router= useRouter()
  if (error) return <Error />;
  if (isLoading) return <Loading />;
  if(!data || data.length ===0) return <TextPlaceHolder text="no message reportes for the moment" />
  const handleAction = async (id: number, accept: boolean) => {
    setLoadingId(id);
    try {
      await post(`/admin/chat/report/${id}/${accept}`);
      mutate();
      router.push(`${window.location.pathname}?msg=Action completed successfully`)
    } catch (err :any) {
     const msg = err?.response?.data?.detail || 'Some error occurred';
    console.error(err);
    router.push(`${window.location.pathname}?msg=${encodeURIComponent(msg)}&color=red`);

    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="w-full h-full space-y-4">
      {data.map(({ id, reporter_name, text, sender_name }) => (
        <div
          key={id}
          className="p-4 bg-white rounded-2xl shadow border-2 border-dashed border-sg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <p className="text-sm sm:text-base">
            The user <strong className="text-sg">{reporter_name}</strong> has reported the text message{" "}
            <span className="text-red-500 font-semibold">"{text}"</span> that is sent by{" "}
            <strong className="text-red-500">{sender_name}</strong>.
          </p>
          <div className="flex gap-2">
            <button
              disabled={loadingId === id}
              onClick={() => handleAction(id, true)}
              className="p-2 rounded-lg bg-sg hover:bg-white hover:text-sg/90 text-white transition-all duration-200 shadow-md hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Accept Report and Ban User"
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
