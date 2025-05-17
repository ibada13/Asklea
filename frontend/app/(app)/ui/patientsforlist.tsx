import { patient } from "../components/Lib/defintions";
import { BsThreeDotsVertical } from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";
import { PatientforListType } from "@/app/(app)/doctor/types/types";
export default function PatientForList({patient ,id}:{patient:PatientforListType ,id:string}) { 
    console.log(patient)
    return (
        <Link href={ `/doctor/${id}`} className="flex p-2  w-full gap-x-4 ">
            <div className="flex-grow flex items-center gap-x-2" >
                <div className="w-8 h-8"> 
                <Image src={"https://fedskillstest.ct.digital/1.png"} className=" object-cover" alt="profile_picture" width={100} height={100}/>    
                </div>
                <div className="flex flex-col text-nowrap justify-between">
                    <p className="font-bold text-xs">{ patient["username"]}</p>
                    <p className=" text-xs"> {patient["gender"]} , {patient["age"] }</p>
                </div>
            </div>
            <div className="flex-grow flex items-center justify-end " >
                <BsThreeDotsVertical size={25}/>
            </div>
        </Link>
    )
}