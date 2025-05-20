import Link from "next/link"
import { DoctorInfo } from "../../types/types"
import Image from "next/image"
export default function DoctorCard({ doctor }: {doctor:DoctorInfo}) { 

    return (
        <Link
            key={doctor.id}
            href={`/admin/doctors/${doctor.id}`}
            className="block bg-white rounded-2xl shadow-md border border-gray-200 hover:border-sg transition-shadow hover:shadow-lg p-6 cursor-pointer"
          >
            <div className="flex flex-col items-center mb-6">
              <Image
                src={doctor.profile_picture || "https://fedskillstest.ct.digital/3.png"}
                alt={`${doctor.username}'s profile`}
                width={64}
                height={64}
                className="rounded-full object-cover"
              />
              <h2
                className="mt-3 text-lg font-bold text-sg text-center break-words"
                style={{ maxWidth: '100%' }}
              >
                {doctor.username}
              </h2>
            </div>

            <div className="space-y-2 text-gray-700 text-sm">
              <p>
                <strong>Specialty:</strong> {doctor.specialty}
              </p>
              <p>
                <strong>Location:</strong> {doctor.office_location}
              </p>
            </div>

            <div className="mt-6 text-sg font-semibold text-right opacity-0 group-hover:opacity-100 transition-opacity">
              View Profile →
            </div>
          </Link>
    )
}