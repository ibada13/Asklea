import { patient } from "./Lib/defintions";
import LabResultes from "./Lib/ui/LabResultes";

import PatientCard from "./Lib/ui/PatientCard";
export default function RightBar({ patient }: {patient:patient}) { 
    return (
        <div className=" flex flex-col w-[30%]  rounded-lg  gap-y-2">
            <PatientCard patient={patient}/>
            <LabResultes patient={patient}/>
        </div>
    );
}