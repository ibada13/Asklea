'use client';
import { useState } from 'react';
import useSWRImmutable from 'swr/immutable';

import { useDebounce } from 'use-debounce';
import { IoSearch } from 'react-icons/io5';
import { IoMdClose } from 'react-icons/io';

import { DoctorforListType } from '../../types/types';
import { getPrivliged } from '@/app/lib/utlis';
import DoctorforList from '../../ui/doctorforlist';

const LeftBar = ({ selected }: { selected?: string }) => {
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [debounced] = useDebounce(query, 300);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [openChatId, setOpenChatId] = useState<string | null>(null);

  const { data, error, isLoading } = useSWRImmutable<DoctorforListType[]>(
    debounced ? `/patient/my-doctors?name=${debounced}` : '/patient/my-doctors',
    getPrivliged,
    { keepPreviousData: true }
  );

  const handleToggleMenu = (id: string) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const handleOpenChat = (id: string) => {
    setOpenChatId(id);
    setOpenMenuId(null); 
  };

  const handleCloseChat = () => {
    setOpenChatId(null);
  };

  return (
    <div className="flex flex-col flex-grow bg-white h-[150vh] p-2 gap-y-2 rounded-lg min-w-[250px]">
      <div className="flex justify-between items-center">
        <p className="font-bold w-1/2">Doctors</p>
        <p onClick={() => setSearching((p) => !p)} className="cursor-pointer">
          {searching ? <IoMdClose size={25} /> : <IoSearch size={25} />}
        </p>
      </div>

      {searching && (
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-gray-300 rounded-md focus:outline-none p-1"
          placeholder="Search doctors..."
        />
      )}

      <div className="overflow-y-scroll flex-grow">
        {error && <p className="text-red-500 p-2">Error loading doctors</p>}
        {isLoading && !data && <p className="text-gray-500 p-2">Loading…</p>}
        {data?.length === 0 && <p className="text-center text-gray-500">No doctors found.</p>}
        {data?.map((doctor: DoctorforListType) => (
          <div
            key={doctor.id}
            className={`${selected === doctor.id ? 'bg-gray-200' : ''} rounded-lg cursor-pointer`}
          >
            <DoctorforList
              id={doctor.id}
              user={doctor}
              menuOpen={openMenuId === doctor.id}
              toggleMenuAction={() => handleToggleMenu(doctor.id)}
              showChat={openChatId === doctor.id}
              openChatAction={() => handleOpenChat(doctor.id)}
              closeChatAction={handleCloseChat}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftBar;
