'use client'
import { patient } from "@/[id]/layout/components/Lib/defintions";
import LabResultes from "../../ui/LabResultes";
import PatientCard from "../../ui/PatientCard";

import TextPlaceHolder from "../../extra/TextPlaceHolder";
import useSWR  from "swr";
import { getPrivliged } from "@/app/lib/utlis";
export default function RightBar() { 

  const { data: patient, isLoading, error } = useSWR(`/patients/me`, getPrivliged)

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
