import { patient } from "../defintions";
import { MdDownload } from "react-icons/md";

const LabResultes = ({ patient }: {patient:patient}) => { 
    return (
        <div className="flex-grow flex flex-col  rounded-lg p-2 bg-white">
        <p className="font-bold text-lg ">Lab Results   </p>
            <div className="overflow-y-auto flex flex-col h-[30vh] ">
                {patient.lab_results.map((result, index) => (
                    <div key={`lab_result-${index}`}  className="flex justify-between items-center p-2 hover:bg-background">
                        <p className="font-semibold text-xs ">
                            {result}
                        </p>
                        <MdDownload size={25}/>
                    </div>
                ))}
                    
        </div>
        </div>
    );
}

export default LabResultes