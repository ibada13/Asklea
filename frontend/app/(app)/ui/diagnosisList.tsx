import {diagnostic_list} from '../components/Lib/defintions'
const DiagnosisList = ({ diagnostic_list}: {diagnostic_list:diagnostic_list[]}) => { 
    return (
        <div className="bg-white w-full flex flex-col justify-between gap-y-3 p-2 h-[40vh] rounded-md">
            <p className="font-bold">Diagnostic List</p>
  
 
            <div className="flex flex-col flex-grow">
    
   
                <div className="flex justify-between bg-background h-1/4 items-center rounded-lg">
                    <p className="font-bold text-xs flex-grow">Diagnosis/History</p>
                    <p className="font-bold text-xs flex-grow">Description</p>
                    <p className="font-bold text-xs w-1/6">Status</p>
                </div>

    
                <div className="overflow-y-auto h-[28vh]">
                    {diagnostic_list?.map((elm, idx) => (
                        <div className="flex justify-between border-b h-1/4" key={`dlist-${idx}`}>
                            <p className="text-xss w-[41.5%] ">{elm.name}</p>
                            <p className="text-xss w-[41.5%] ">{elm.description}</p>
                            <p className="text-xss w-1/6">{elm.status}</p>
                        </div>
                    ))}
                </div>
                        
            </div>
        </div>
    );
}

export default DiagnosisList