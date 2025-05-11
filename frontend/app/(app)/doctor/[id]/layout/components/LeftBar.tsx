'use client';
import { useState } from "react";
import useSWR from "swr";
import { IoSearch } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import PatientForList from "./Lib/ui/patientsforlist";
import Loading from "@/app/(app)/extra/Loading";
import Error from "@/app/(app)/extra/Error";
import { PatientforListType } from "../../../types/types";
import { getPrivliged } from "@/app/lib/utlis";

const LeftBar = ({ selected }: { selected?: string }) => {
    const [searching, setSearching] = useState<boolean>(false);
    const [query, setQuery] = useState<string>('');

    const { data: patientsList, isLoading, error } = useSWR(
        query ? `/api/my-patients?name=${query}` : "/doctor/my-patients",
        getPrivliged
    );

    const search = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setQuery(query);
    };

    if (isLoading) {
        return <Loading />;
    }

    if (error || !patientsList) {
        return <Error />;
    }

    return (
        <div className="flex flex-col flex-grow bg-white h-[150vh] p-2 gap-y-2 rounded-lg min-w-[250px]">
            <div className="flex justify-between items-center">
                <p className="font-bold w-1/2">Patients</p>
                <p onClick={() => setSearching((prev) => !prev)} className="cursor-pointer">
                    {searching ? <IoMdClose size={25} /> : <IoSearch size={25} />}
                </p>
            </div>

            {searching && (
                <input
                    onChange={search}
                    className="w-full border border-gray-300 rounded-md focus:outline-none p-1"
                    type="text"
                    placeholder="Search patients..."
                />
            )}

            <div className="overflow-y-scroll overflow-x-hidden flex-grow min-w-full">
                {patientsList?.length === 0 ? (
                    <p className="text-center text-gray-500">No patients found.</p>
                ) : (
                    patientsList.map((patient:PatientforListType, index:number) => (
                        <div
                            key={`patient-${index}`}
                            className={`${
                                patient.id === selected ? "bg-gray-200" : ""
                            } rounded-lg cursor-pointer`}
                        >
                            <PatientForList id={patient.id} patient={patient} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default LeftBar;
