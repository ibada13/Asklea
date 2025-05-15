'use client';
import { useState } from 'react';
import useSWR from 'swr';
import { useDebounce } from 'use-debounce';
import { IoSearch } from 'react-icons/io5';
import { IoMdClose } from 'react-icons/io';
import PatientForList from './Lib/ui/patientsforlist';
import { PatientforListType } from '../../../types/types';
import { getPrivliged } from '@/app/lib/utlis';

const LeftBar = ({ selected }: { selected?: string }) => {
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [debounced] = useDebounce(query, 300);

  const { data, error, isLoading } = useSWR(
    debounced ? `/doctor/my-patients?name=${debounced}` : '/doctor/my-patients',
    getPrivliged,
    { keepPreviousData: true }
  );

  return (
    <div className="flex flex-col flex-grow bg-white h-[150vh] p-2 gap-y-2 rounded-lg min-w-[250px]">
      <div className="flex justify-between items-center">
        <p className="font-bold w-1/2">Patients</p>
        <p onClick={() => setSearching((p) => !p)} className="cursor-pointer">
          {searching ? <IoMdClose size={25} /> : <IoSearch size={25} />}
        </p>
      </div>

      {searching && (
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-gray-300 rounded-md focus:outline-none p-1"
          placeholder="Search patients..."
        />
      )}

      <div className="overflow-y-scroll flex-grow">
        {error && <p className="text-red-500 p-2">Error loading patients</p>}
        {isLoading && !data && <p className="text-gray-500 p-2">Loading…</p>}
        {data?.length === 0 && <p className="text-center text-gray-500">No patients found.</p>}
        {data?.map((p: PatientforListType) => (
          <div
            key={p.id}
            className={`${selected === p.id ? 'bg-gray-200' : ''} rounded-lg cursor-pointer`}
          >
            <PatientForList id={p.id} patient={p} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftBar;
