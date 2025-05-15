'use client';
import CenterBar from "./layout/components/CenterBar";
import LeftBar from "./layout/components/LeftBar";
import RightBar from "./layout/components/RightBar";
import { patients } from "./layout/components/Lib/data";


export default function Page({ params }: { params: { id: string } }) { 
    const id = Number(params.id);

    console.log(id); // Debugging

    return (
        <div className="flex justify-between gap-x-4">
            <LeftBar selected={id} patients={patients} />
            <CenterBar patient={patients[id]} />
            <RightBar patient={patients[id]} />
        </div>
    );
}
