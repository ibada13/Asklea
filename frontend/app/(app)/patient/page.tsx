'use client'
import UseAuth from "@/app/hooks/useAuth";
import RightBar from "./components/Rightbar";
import CenterBarWrapper from "./components/Centerbar";
import LeftBar from "./components/LeftBar";
export default function PatientPage() {
    

    return (

                <div className="flex justify-around gap-x-4">
                    <LeftBar/>

                    <CenterBarWrapper/>
                    <RightBar/>
                </div>
    );
 }