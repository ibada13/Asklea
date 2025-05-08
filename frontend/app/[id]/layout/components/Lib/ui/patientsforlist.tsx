import { patient } from "../defintions";
import { BsThreeDotsVertical } from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";
export default function PatientForList({Patient ,id}:{Patient:patient ,id:number}) { 
    return (
        <Link href={ `/${id}`} className="flex p-2  w-full gap-x-4 ">
            <div className="flex-grow flex items-center gap-x-2" >
                <div className="w-8 h-8"> 
                <Image src={Patient["profile_picture"]} className=" object-cover" alt="profile_picture" width={100} height={100}/>    
                </div>
                <div className="flex flex-col text-nowrap justify-between">
                    <p className="font-bold text-xs">{ Patient["name"]}</p>
                    <p className=" text-xs"> {Patient["gender"]} , {Patient["age"] }</p>
                </div>
            </div>
            <div className="flex-grow flex items-center justify-end " >
                <BsThreeDotsVertical size={25}/>
            </div>
        </Link>
    )
}