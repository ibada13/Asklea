'use client'
import { patient } from "../defintions"
import { CgGenderFemale, CgGenderMale } from "react-icons/cg"
import { CiCalendar } from "react-icons/ci"
import { BsTelephone } from "react-icons/bs"
import Image from "next/image"
import { convertDate } from "../functions"
import { IoShieldCheckmarkOutline } from "react-icons/io5"
import useSWR from "swr"
import { get } from "@/app/lib/utlis"
import Loading from "@/app/(app)/extra/Loading"
import Error from "@/app/(app)/extra/Error"

export default function PatientCard({ id }: { id: string }) {
  const { data: patient, isLoading, error } = useSWR(`/doctor/my-patient/${id}`, get)

  if (isLoading) return <Loading />
  if (error || !patient) return <Error />

  return (
    <div className="w-full bg-white flex flex-col gap-y-4 p-2 rounded-lg">
      <div className="w-full h-[28%] flex flex-col items-center justify-between">
        <div className="w-32 h-32 flex justify-center">
          <Image className="bg-cover w-full h-full rounded-full" width={100} height={100} src={patient.profile_picture} alt="" />
        </div>
        <p className="text-xl font-bold">{patient.name}</p>
      </div>

      <div className="flex flex-col justify-between gap-y-3 w-full p-2">
        <div className="flex gap-x-2 w-4/5 items-center">
          <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
            <CiCalendar size={22} />
          </div>
          <div className="flex flex-col justify-between">
            <p className="font-thin text-xs">Date of Birth</p>
            <p className="font-semibold text-xs">{convertDate(patient.date_of_birth)}</p>
          </div>
        </div>

        <div className="flex gap-x-2 w-5/6 items-center text-nowrap">
          <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
            {patient.gender === "Female" ? <CgGenderFemale size={22} /> : <CgGenderMale size={22} />}
          </div>
          <div className="flex flex-col justify-between">
            <p className="font-thin text-xs">Gender</p>
            <p className="font-semibold text-xs">{patient.gender}</p>
          </div>
        </div>

        <div className="flex gap-x-2 w-4/5 items-center">
          <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
            <BsTelephone size={22} />
          </div>
          <div className="flex flex-col justify-between">
            <p className="font-thin text-xs">Contact info</p>
            <p className="font-semibold text-xs">{patient.phone_number}</p>
          </div>
        </div>

        <div className="flex gap-x-2 w-4/5 items-center">
          <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
            <BsTelephone size={22} />
          </div>
          <div className="flex flex-col justify-between text-nowrap">
            <p className="font-thin text-xs">Emergency Contact</p>
            <p className="font-semibold text-xs">{patient.emergency_contact}</p>
          </div>
        </div>

        <div className="flex gap-x-2 w-4/5 items-center">
          <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
            <IoShieldCheckmarkOutline size={38} />
          </div>
          <div className="flex flex-col justify-between text-nowrap">
            <p className="font-thin text-xs">Insurance Provider</p>
            <p className="font-semibold text-xs">{patient.insurance_type}</p>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center items-center">
        <button className="bg-sg w-4/5 font-bold p-2 text-nowrap text-xs rounded-xl">Show all Information</button>
      </div>
    </div>
  )
}
