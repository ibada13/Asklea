'use client';

import CenterBar from "../components/CenterBar";
import LeftBar from "../components/LeftBar";
import RightBar from "../components/RightBar";



export default function Page({ params }: { params: { id: string } }) { 
    const id = String(params.id) ;
    
    console.log(id); // Debugging

    return (
        <div className="flex justify-between gap-x-4">
            <LeftBar selected={id}  />
            <CenterBar id={ id} />
            <RightBar id={ id} />
        </div>
    );
}
