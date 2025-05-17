'use client';
import LeftBar from "./components/LeftBar";
import RightBar from "./components/RightBar";
import CenterBar from "./components/CenterBar";

export default function Page() { 
   
    
    

    return (
        <div className="flex justify-between gap-x-4">
            <LeftBar   />
            <CenterBar  />
            <RightBar  />
        </div>
    );
}
