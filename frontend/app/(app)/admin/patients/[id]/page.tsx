'use client';

import useSWRImmutable from 'swr/immutable';
import { get } from "@/app/lib/utlis";
import Loading from "@/app/(app)/extra/Loading";
import Error from "@/app/(app)/extra/Error";
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Attach from '../../common/Attach';
import Oparations from '../../components/Oprations';
import useSWR from 'swr';



interface PatientType {
  id: string;
  username: string;
  gender: string;
  age?: number;
  profile_picture?: string;
  date_of_birth?: string;
  phone_number?: string;
  emergency_contact?: string;
  insurance_type: string;
  can_send_messages: boolean;
}

export default function PatientProfile() {
  const { id } = useParams();

  const { data: patient, error, isLoading } = useSWR<PatientType>(id ? `/admin/patients/${id}` : null, get);

  if (isLoading) return <Loading />;
  if (error) return <Error />;
  if(!patient) return
  return (
    <div className="w-full min-h-screen flex flex-col items-center p-6 bg-gray-50">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-8">
        <Oparations can_message={ patient.can_send_messages} edithref={`/admin/patients/${id}/edit`} id={ patient.id} username={ patient.username } />
        <div className="flex justify-center mb-8">
          <Image
            src={ patient?.profile_picture||"/pfp.jpg"}
            alt={`${patient?.username}'s profile`}
            width={128}
            height={128}
            className="rounded-full object-cover"
          />
        </div>
        <h1 className="text-4xl font-bold text-sg">{patient?.username}</h1>
        <p className="text-xl text-gray-600 mt-2">{patient?.gender}, {patient?.age} years old</p>
        <div className="mt-6 space-y-2">
          <p className="text-sm text-gray-500">Date of Birth: <span className="text-gray-700">{patient?.date_of_birth}</span></p>
          <p className="text-sm text-gray-500">Phone Number: <span className="text-gray-700">{patient?.phone_number || 'Not Available'}</span></p>
          <p className="text-sm text-gray-500">Emergency Contact: <span className="text-gray-700">{patient?.emergency_contact || 'Not Available'}</span></p>
          <p className="text-sm text-gray-500">Insurance Type: <span className="text-gray-700">{patient?.insurance_type}</span></p>
        </div>

        <Attach del_url={`/admin/patients/${id}/doctors`} attachedUsersUrl={`/admin/attached_doctors/${id}`} post_url={`/admin/attach_doctors_to_patient/${id}`} fetch_url={`/admin/not_attached_doctors/${id}`} />
      </div>
    </div>
  );
}
