'use client';

import useSWR from 'swr';
import { get } from '@/app/lib/utlis';
import Loading from '../../extra/Loading';
import Error from '../../extra/Error';
import { PatientInfo } from '../../types/types';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import PatientCard from '../components/PatientCard';
import NewUserCard from '../components/NewUserCard';
export default function Patients() {
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useDebounce('', 300);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
    setSearchQuery(e.target.value.trim());
  }

  const endpoint = searchQuery
    ? `/admin/patients?search=${encodeURIComponent(searchQuery)}`
    : '/admin/patients';

  const { data: patients, error, isLoading } = useSWR<PatientInfo[]>(endpoint, get, {
    keepPreviousData: true,
  });

  if (!patients && !error) return <Loading />;
  if (error) return <Error />;

  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-8 p-6 bg-gray-50">
      <input
        type="text"
        placeholder="Search patients by username..."
        value={inputValue}
        onChange={handleChange}
        className="w-full max-w-4xl p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sg mb-8"
      />

      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <NewUserCard href='/admin/patients/create' content='Add New Patient'/>
        {patients?.map((patient) => (
          <PatientCard patient={patient} key={ `${patient.id} card's`} />
                 ))}
      </div>
    </div>
  );
}
