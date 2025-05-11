'use client';
import CenterBar from "./[id]/layout/components/CenterBar";
import LeftBar from "./[id]/layout/components/LeftBar";
import RightBar from "./[id]/layout/components/RightBar";


export default function Page() { 
   
    
    

    return (
        <div className="flex justify-between gap-x-4">
            <LeftBar   />
            <CenterBar  />
            <RightBar  />
        </div>
    );
}
