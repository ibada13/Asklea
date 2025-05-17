import { diagnosis_history } from "../components/Lib/defintions";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropup } from "react-icons/io";
import React, { useState } from "react";
import Chart from "./chart";

export default function ChartCard({ diagnosis_history }: { diagnosis_history: diagnosis_history[] }) {
  const [range, Setrange] = useState<number>(12);
  const handleRangeChange = (event: React.ChangeEvent<HTMLSelectElement>) => { 
    Setrange(Number(event.target.value))
  }

  return (
    <div className="h-1/2 flex p-2 bg-charbackground">
      <div className="flex flex-grow h-full gap-x-1">
        <div className="w-3/4 h-full flex flex-col gap-y-2 p-2">
          <div className="flex justify-between items-center">
            <p className="font-bold self-start text-lg">Blood Pressure</p>
            <select className="text-xs self-end bg-charbackground" id="rangeSelect" value={range} onChange={handleRangeChange}>
              <option value={3}>Last 3 months</option>
              <option value={6}>Last 6 months</option>
              <option value={12}>Last 1 year</option>
              <option value={diagnosis_history.length}>All</option>
            </select>
          </div>
          <Chart range={range} diagnosis_history={diagnosis_history} />
        </div>
        <div className="w-1/4 flex-grow flex flex-col h-1/2">
          <div className="w-full flex-grow flex flex-col gap-y-1 border-b border-b-black">
            <p className="flex gap-x-2 items-center font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-[#E66FD2] inline-block"></span>
              Systolic
            </p>
            <p className="flex gap-x-2 items-center font-bold">{diagnosis_history[0].blood_pressure_systolic_value}</p>
            <p className="flex items-center text-xss text-nowrap">
              {diagnosis_history[0].blood_pressure_systolic_levels === "Normal" ? null : 
              diagnosis_history[0].blood_pressure_systolic_levels === "Higher than Average" 
                ? <IoMdArrowDropup size={20}/> 
                : <IoMdArrowDropdown size={20}/>}
              {diagnosis_history[0].blood_pressure_systolic_levels}
            </p>
          </div>
          <div className="w-full flex-grow flex flex-col gap-y-1 mt-1">
            <p className="flex gap-x-2 items-center font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-[#8C6FE6] inline-block"></span>
              Diastolic
            </p>
            <p className="flex items-center font-bold">{diagnosis_history[0].blood_pressure_diastolic_value}</p>
            <p className="flex items-center text-xss text-nowrap">
              {diagnosis_history[0].blood_pressure_diastolic_levels === "Normal" ? null : 
              diagnosis_history[0].blood_pressure_diastolic_levels === "Higher than Average" 
                ? <IoMdArrowDropup size={20}/> 
                : <IoMdArrowDropdown size={20}/>}
              {diagnosis_history[0].blood_pressure_diastolic_levels}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
};
