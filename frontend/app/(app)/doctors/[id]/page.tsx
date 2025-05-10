'use client';

import useSWRImmutable from 'swr/immutable';
import { get, post } from "@/app/lib/utlis";
import Loading from "@/app/(app)/extra/Loading";
import Error from "@/app/(app)/extra/Error";
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { MdOutlineCancel } from "react-icons/md";

interface Patient {
  id: string;
  username: string;
  profile_picture?: string;
}

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
  const [patientName, setPatientName] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatients, setSelectedPatients] = useState<Patient[]>([]);
  const [selectedPatientIds, setSelectedPatientIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { data: doctor, error, isLoading } = useSWRImmutable<DoctorType>(id ? `/admin/doctors/${id}` : null, get);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (patientName.trim()) {
        get(`/admin/search_patients/${id}?name=${patientName}`)
          .then((res) => {
            const filteredPatients = res.filter((patient: Patient) => !selectedPatientIds.includes(patient.id));
            setPatients(filteredPatients || []);
          })
          .catch(() => {});
      } else {
        setPatients([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [patientName, selectedPatientIds]);

  const handleAttachPatients = async () => {
    if (selectedPatientIds.length === 0) return;
    setLoading(true);
    console.log(selectedPatientIds)
    try {
      await post(`/admin/attach_patients_to_doctor/${id}`, JSON.stringify(
    selectedPatientIds
  ));
      setSuccessMessage('Patients successfully attached!');
    } catch {} finally {
      setLoading(false);
    }
  };

  const handlePatientSelection = (patient: Patient) => {
    setSelectedPatients(prev => [...prev, patient]);
    setPatients(prev => prev.filter(p => p.id !== patient.id));
    setSelectedPatientIds(prev => [...prev, patient.id]);
  };

  const handlePatientDelete = (patient: Patient) => {
    setSelectedPatients(prev => prev.filter(p => p.id !== patient.id));
    setSelectedPatientIds(prev => prev.filter(p => p !== patient.id));
  };

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

        <div className="mt-8">

            {selectedPatients.length > 0 && (
              <div className="mb-4 space-y-3">
                <h3 className="font-semibold text-gray-700">Selected Patients:</h3>
                <div className="flex flex-wrap space-x-2 space-y-3">
                  {selectedPatients.map((patient) => (
                    <div key={patient.id} className="flex items-center justify-between py-2 px-3 border-2 border-gray-200 rounded-md w-full">
                      <span className="text-sg">{patient.username}</span>
                      <button
                        onClick={() => handlePatientDelete(patient)}
                        className="text-red-600 hover:text-red-800 transition-colors duration-300"
                      >
                        <MdOutlineCancel size={30}/>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
       
          <input
            type="text"
            placeholder="Enter patient name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="p-2 border border-gray-300 rounded-md w-full"
          />

          <div className="mt-4 space-y-2">
            {patients.length > 0 ? (
              patients.map((patient) => (
                <div key={patient.id} className="w-full">
                  <button
                    onClick={() => handlePatientSelection(patient)}
                    className="w-full flex items-center justify-start p-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300 hover:bg-gray-200 transition-all"
                  >
                    <Image
                      src={patient.profile_picture || "https://fedskillstest.ct.digital/8.png"}
                      alt={`${patient.username} profile`}
                      width={40}
                      height={40}
                      className="rounded-full mr-4"
                    />
                    <span className="text-left">{patient.username}</span>
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No patients found</p>
            )}
          </div>

          <button
            onClick={handleAttachPatients}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-full w-full"
            disabled={loading}
          >
            {loading ? 'Attaching...' : 'Attach Patients'}
          </button>

          {successMessage && <p className="mt-4 text-green-600">{successMessage}</p>}
        </div>
      </div>
    </div>
  );
}
