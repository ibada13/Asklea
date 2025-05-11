'use client'
import { patient } from "./Lib/defintions";
import LabResultes from "./Lib/ui/LabResultes";
import PatientCard from "./Lib/ui/PatientCard";

export default function RightBar({ id }: { id?: string }) { 
    if (!id) {
        return <div>No patient selected.</div>
    }

    return (
        <div className="flex flex-col w-[30%] rounded-lg gap-y-2">
            <PatientCard id={id} />
            {/* <LabResultes patient={patient} /> */}
        </div>
    );
}
