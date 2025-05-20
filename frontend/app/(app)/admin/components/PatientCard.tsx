import Link from "next/link"
import { PatientInfo } from "../../types/types"
import Image from "next/image"
export default function PatientCard({ patient }: {patient:PatientInfo}) { 
    

    return (
         <Link
            key={patient.id}
            href={`/admin/patients/${patient.id}`}
            className="block bg-white rounded-2xl shadow-md border border-gray-200 hover:border-sg transition-shadow hover:shadow-lg p-6 cursor-pointer"
          >
            <div className="flex flex-col items-center mb-6">
              <Image
                src="https://fedskillstest.ct.digital/8.png"
                alt={`${patient.username}'s profile`}
                width={64}
                height={64}
                className="rounded-full object-cover"
              />
              <h2
                className="mt-3 text-lg font-bold text-sg text-center break-words"
                style={{ maxWidth: '100%' }}
              >
                {patient.username}
              </h2>
            </div>

            <div className="space-y-2 text-gray-700 text-sm">
              <p>
                <strong>Age:</strong> {patient.age}
              </p>
              <p>
                <strong>Insurance:</strong> {patient.insurance_type}
              </p>
              <p>
                <strong>Gender:</strong> {patient.gender}
              </p>
              <p>
                <strong>Phone:</strong> {patient.phone_number || 'Not Available'}
              </p>
              <p>
                <strong>Emergency Contact:</strong> {patient.emergency_contact || 'Not Available'}
              </p>
            </div>

            <div className="mt-6 text-sg font-semibold text-right opacity-0 group-hover:opacity-100 transition-opacity">
              View Profile →
            </div>
          </Link>

    )
}