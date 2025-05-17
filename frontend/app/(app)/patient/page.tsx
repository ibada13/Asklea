'use client'
import UseAuth from "@/app/hooks/useAuth";
import RightBar from "./components/Rightbar";
import LeftBarWrapper from "./components/Leftbar";
export default function PatientPage() {
    

    return (
        <UseAuth middleware="patient">

                <div className="flex justify-around gap-x-4">
                    <LeftBarWrapper/>
                    <RightBar/>
                </div>
        </UseAuth>
    );
 }