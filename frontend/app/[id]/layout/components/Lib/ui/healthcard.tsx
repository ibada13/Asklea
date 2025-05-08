import temp from '../../assets/temperature.svg'
import heart from '../../assets/HeartBPM.svg'
import respo from '../../assets/respiratory rate.svg'
import Image from 'next/image'

import {diagnosis_history} from '../defintions'
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropup } from "react-icons/io";
const HealthCard = ({diagnosis_history }: {diagnosis_history:diagnosis_history}) => { 
    return (
        <div className="flex justify-around h-1/3 gap-x-2 ">
            <div className="h-full flex flex-grow flex-col justify-between border rounded-md p-2 bg-[#E0F3FA]">
                <div className='w-12 h-12'>

                <Image  src={respo} alt=""/>
                </div>
                <div>

                <p className=' text-xs'>Respiratory Rate</p>
                <p className='text-2xl font-bold'>{diagnosis_history.respiratory_rate.value} bpm</p>
                </div>
            <p className="flex gap-x-1 items-center text-xss text-nowrap">{ diagnosis_history.respiratory_rate.levels ==="Normal"?"":diagnosis_history.respiratory_rate.levels==="Higher than Average" ?<IoMdArrowDropup size={20}/>: <IoMdArrowDropdown size={20}/>}{ diagnosis_history.respiratory_rate.levels}</p>

            </div>
            <div className="h-full flex flex-grow flex-col justify-between border rounded-md p-2 bg-[#FFE6E9]">
                <div className='w-12 h-12'>
                <Image  src={temp} alt=""/>
                </div>
                <div>

                <p className=''>Temperature</p>
                <p className='text-2xl font-bold'>{diagnosis_history.temperature.value}°F</p>
                </div>
            <p className="flex gap-x-1 items-center text-xss text-nowrap">{ diagnosis_history.temperature.levels ==="Normal"?"":diagnosis_history.temperature.levels==="Higher than Average" ?<IoMdArrowDropup size={20}/>: <IoMdArrowDropdown size={20}/>}{ diagnosis_history.temperature.levels}</p>

            </div>
            <div className="h-full flex flex-grow flex-col justify-between border rounded-md p-2 bg-[#FFE6F1]">
                <div className='w-12 h-12'>

                <Image  src={heart} alt=""/>
                </div>
                <div>

                <p className=''>Heart Rate</p>
                <p className='text-2xl font-bold'>{diagnosis_history.heart_rate.value} bpm</p>
                </div>
            <p className="flex gap-x-1 items-center text-xss text-nowrap">{ diagnosis_history.heart_rate.levels ==="Normal"?"":diagnosis_history.heart_rate.levels==="Higher than Average" ?<IoMdArrowDropup size={20}/>: <IoMdArrowDropdown size={20}/>}{ diagnosis_history.heart_rate.levels}</p>

            </div>

        </div>
    );
}

export default HealthCard