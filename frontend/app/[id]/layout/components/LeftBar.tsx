import { IoMdClose } from "react-icons/io";
import { patient } from "./Lib/defintions";
import PatientForList from "./Lib/ui/patientsforlist";
import { IoSearch } from "react-icons/io5";
import { useEffect, useState } from "react";

const LeftBar = ({ patients, selected }: { patients: patient[]; selected: number }) => {
    const [patientsList, setPatientList] = useState<patient[]>(patients);
    const [searching, setSearching] = useState<boolean>(false);

    useEffect(() => {
        setPatientList(patients);
    }, [patients]);

    const search = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value.toLowerCase();
        const filteredPatients = patients.filter((patient) =>
            patient.name.toLowerCase().includes(query)
        );
        setPatientList(filteredPatients);
    };

    return (
        <div className="flex flex-col flex-grow bg-white h-[150vh] p-2 gap-y-2 rounded-lg min-w-[250px]">
            {/* Header */}
            <div className="flex justify-between items-center">
                <p className="font-bold w-1/2">Patients</p>
                <p onClick={() => setSearching((prev) => !prev)} className="cursor-pointer">
                    {searching ? <IoMdClose size={25} /> : <IoSearch size={25} />}
                </p>
            </div>

            {/* Search Input */}
            {searching && (
                <input
                    onChange={search}
                    className="w-full border border-gray-300 rounded-md focus:outline-none p-1"
                    type="text"
                    placeholder="Search patients..."
                />
            )}

            {/* Patients List */}
            <div className="overflow-y-scroll overflow-x-hidden flex-grow min-w-full">
                {patientsList.map((patient, index) => (
                    <div
                        key={`patient-${index}`}
                        className={`${
                            index === selected && patientsList.length === patients.length ? "bg-gray-200" : ""
                        } rounded-lg`}
                    >
                        <PatientForList id={index} Patient={patient} key={`p-${index}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LeftBar;
