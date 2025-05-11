'use client';

import useSWRImmutable from 'swr/immutable';
import { get, post } from "@/app/lib/utlis";
import Loading from "@/app/(app)/extra/Loading";
import Error from "@/app/(app)/extra/Error";
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Attach from '../../common/Attach';


interface DoctorType {
  id: string;
  username: string;
  specialty: string;
  office_location: string;
  email: string;
  profile_picture?: string;
}

export default function DoctorProfile() {
  const { id } = useParams();


  const { data: doctor, error, isLoading } = useSWRImmutable<DoctorType>(id ? `/admin/doctors/${id}` : null, get);

  
  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <div className="w-full min-h-screen flex flex-col items-center p-6 bg-gray-50">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-center mb-8">
          <Image
            src={doctor?.profile_picture || "https://fedskillstest.ct.digital/3.png"}
            alt={`${doctor?.username}'s profile`}
            width={128}
            height={128}
            className="rounded-full object-cover"
          />
        </div>
        <h1 className="text-4xl font-bold text-sg">{doctor?.username}</h1>
        <p className="text-xl text-gray-600 mt-2">{doctor?.specialty}</p>
        <div className="mt-6 space-y-2">
          <p className="text-sm text-gray-500">Office Location: <span className="text-gray-700">{doctor?.office_location}</span></p>
          <p className="text-sm text-gray-500">Email: <a href={`mailto:${doctor?.email}`} className="text-blue-600">{doctor?.email}</a></p>
        </div>

    <Attach attachedUsersUrl={`/admin/attached_patients/${id}`} post_url={`/admin/attach_patients_to_doctor/${id}`} fetch_url={`/admin/not_attached_patients/${id}`}/>
      </div>
    </div>
  );
}
