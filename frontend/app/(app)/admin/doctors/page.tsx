'use client';
import { useState } from "react";
import useSWR from "swr";
import { get } from "@/app/lib/utlis";
import Loading from "../../extra/Loading";
import Error from "../../extra/Error";
import { DoctorInfo } from "../../types/types";

import { useDebounce } from "use-debounce";
import NewUserCard from "../components/NewUserCard"; 7
import DoctorCard from "../components/DoctorCard";
export default function Doctors() {
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useDebounce('', 300);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
    setSearchQuery(e.target.value.trim());
  }

  const endpoint = searchQuery
    ? `/admin/doctors?search=${encodeURIComponent(searchQuery)}`
    : '/admin/doctors';

  const { data: doctors, error, isLoading } = useSWR<DoctorInfo[]>(endpoint, get, {
    keepPreviousData: true,
    fallbackData: []
  });

  if (!doctors && !error) return <Loading />;
  if (error) return <Error />;

  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-8 p-6 bg-gray-50">
      <input
        type="text"
        placeholder="Search doctors by username..."
        value={inputValue}
        onChange={handleChange}
        className="w-full max-w-4xl p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sg mb-8"
      />

      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <NewUserCard href="/admin/doctors/create" content="Add new Doctor" />
        {doctors?.map((doctor) => (
          <DoctorCard doctor={doctor}/>
        ))}

        
        
      </div>
    </div>
  );
}
