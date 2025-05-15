'use client'
import { patient } from "./Lib/defintions";
import LabResultes from "./Lib/ui/LabResultes";
import PatientCard from "./Lib/ui/PatientCard";
import TextPlaceHolder from "../extra/TextPlaceHolder";
import useSWR  from "swr";
import { getPrivliged } from "@/app/lib/utlis";
export default function RightBar({ id }: { id?: string }) { 
    if (!id) {
        return <TextPlaceHolder className="w-[30%] flex justify-center  font-bold"  text="No patient selected."/>
    }
  const { data: patient, isLoading, error } = useSWR(`/doctor/my-patient/${id}`, getPrivliged)

   if (isLoading) { 
        return <TextPlaceHolder  className="w-[30%] flex justify-center  font-bold text-sg"  text="Loading..."/>

    }
    
   if (error ) { 
        return <TextPlaceHolder  className="w-[30%] flex justify-center  font-bold text-red-500"  text="Error."/>

    }
    if (!patient) { 
        return <TextPlaceHolder  className="w-[30%] flex justify-center  font-bold text-sg"  text="No patient"/>

    }
    return (
        <div className="flex flex-col w-[30%] rounded-lg gap-y-2">
            <PatientCard patient={ patient} />
            {/* <LabResultes patient={patient} /> */}
        </div>
    );
}
