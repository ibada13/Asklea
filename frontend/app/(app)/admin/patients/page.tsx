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
    keepPreviousData :true ,
  });

  if (!patients && !error) return <Loading />;
  if (error) return <Error />;

  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-6 p-6 bg-gray-50">
      <input
        type="text"
        placeholder="Search patients by username..."
        value={inputValue}
        onChange={handleChange}
        className="w-full max-w-4xl p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sg mb-6"
      />
      {patients?.map((patient) => (
        <Link
          key={patient.id}
          href={`/patients/${patient.id}`}
          className="w-full max-w-4xl p-6 bg-white rounded-2xl shadow transition hover:shadow-lg border-2 border-gray-200 hover:border-2 hover:border-sg flex flex-col md:flex-row md:items-center md:justify-between group"
        >
          <div className="flex items-center space-x-6">
            <Image
              src={'https://fedskillstest.ct.digital/8.png'}
              alt={`${patient.username}'s profile`}
              width={64}
              height={64}
              className="rounded-full object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold text-sg group-hover:underline">{patient.username}</h2>
              <p className="text-gray-600 text-sm mt-1">
                Age: <span className="font-medium">{patient.age}</span>
              </p>
              <p className="text-gray-600 text-sm">
                Insurance: <span className="font-medium">{patient.insurance_type}</span>
              </p>
              <p className="text-gray-600 text-sm">
                Gender: <span className="font-medium">{patient.gender}</span>
              </p>
              <p className="text-gray-600 text-sm">
                Phone: <span className="font-medium">{patient.phone_number || 'Not Available'}</span>
              </p>
              <p className="text-gray-600 text-sm">
                Emergency Contact:{' '}
                <span className="font-medium">{patient.emergency_contact || 'Not Available'}</span>
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 text-sm text-sg font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
            View Profile →
          </div>
        </Link>
      ))}
    </div>
  );
}
