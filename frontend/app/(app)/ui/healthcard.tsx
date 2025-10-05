import temp from './assets/temperature.svg';
import heart from './assets/HeartBPM.svg';
import respo from './assets/respiratory rate.svg';
import Image from 'next/image';
import { diagnosis_history } from '../doctor/components/Lib/defintions';
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

type Props = {
  diagnosis_history?: diagnosis_history; // optional + safe
};

const HealthCard = ({ diagnosis_history }: Props) => {
  const fallback = {
    respiratory_rate_value: '-',
    respiratory_rate_levels: '',
    temperature_value: '-',
    temperature_levels: '',
    heart_rate_value: '-',
    heart_rate_levels: '',
  };

  const data = diagnosis_history ?? fallback;

  return (
    <div className="flex justify-around h-1/3 gap-x-2">
      {/* Respiratory Rate */}
      <div className="h-full flex flex-grow flex-col justify-between border rounded-md p-2 bg-[#E0F3FA]">
        <div className='w-12 h-12'>
          <Image src={respo} alt="Respiratory Icon" />
        </div>
        <div>
          <p className='text-xs'>Respiratory Rate</p>
          <p className='text-2xl font-bold'>{data.respiratory_rate_value} bpm</p>
        </div>
        <p className="flex gap-x-1 items-center text-xss text-nowrap">
          {data.respiratory_rate_levels === "Normal" ? null :
            data.respiratory_rate_levels === "Higher than Average" ? (
              <IoMdArrowDropup size={20} />
            ) : (
              <IoMdArrowDropdown size={20} />
            )}
          {data.respiratory_rate_levels}
        </p>
      </div>

      {/* Temperature */}
      <div className="h-full flex flex-grow flex-col justify-between border rounded-md p-2 bg-[#FFE6E9]">
        <div className='w-12 h-12'>
          <Image src={temp} alt="Temperature Icon" />
        </div>
        <div>
          <p className='text-xs'>Temperature</p>
          <p className='text-2xl font-bold'>{data.temperature_value}°F</p>
        </div>
        <p className="flex gap-x-1 items-center text-xss text-nowrap">
          {data.temperature_levels === "Normal" ? null :
            data.temperature_levels === "Higher than Average" ? (
              <IoMdArrowDropup size={20} />
            ) : (
              <IoMdArrowDropdown size={20} />
            )}
          {data.temperature_levels}
        </p>
      </div>

      {/* Heart Rate */}
      <div className="h-full flex flex-grow flex-col justify-between border rounded-md p-2 bg-[#FFE6F1]">
        <div className='w-12 h-12'>
          <Image src={heart} alt="Heart Rate Icon" />
        </div>
        <div>
          <p className='text-xs'>Heart Rate</p>
          <p className='text-2xl font-bold'>{data.heart_rate_value} bpm</p>
        </div>
        <p className="flex gap-x-1 items-center text-xss text-nowrap">
          {data.heart_rate_levels === "Normal" ? null :
            data.heart_rate_levels === "Higher than Average" ? (
              <IoMdArrowDropup size={20} />
            ) : (
              <IoMdArrowDropdown size={20} />
            )}
          {data.heart_rate_levels}
        </p>
      </div>
    </div>
  );
};

export default HealthCard;
