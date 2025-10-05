import { diagnosis_history } from "../doctor/components/Lib/defintions";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import React, { useState } from "react";
import Chart from "./chart";

type Props = {
  diagnosis_history?: diagnosis_history[];
};

export default function ChartCard({ diagnosis_history = [] }: Props) {
  const [range, Setrange] = useState<number>(12);

  const handleRangeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    Setrange(Number(event.target.value));
  };

  const sortedHistory = [...diagnosis_history].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const latestData = sortedHistory.length > 0 ? sortedHistory[0] : null;

  return (
    <div className="h-1/2 flex p-2 bg-charbackground">
      <div className="flex flex-grow h-full gap-x-1">
        <div className="w-3/4 h-full flex flex-col gap-y-2 p-2">
          <div className="flex justify-between items-center">
            <p className="font-bold self-start text-lg">Blood Pressure</p>
            <select
              className="text-xs self-end bg-charbackground"
              value={range}
              onChange={handleRangeChange}
            >
              <option value={3}>Last 3 records</option>
              <option value={6}>Last 6 records</option>
              <option value={12}>Last 12 records</option>
              <option value={diagnosis_history.length}>All</option>
            </select>
          </div>
          <Chart range={range} diagnosis_history={sortedHistory} />
        </div>

        <div className="w-1/4 flex-grow flex flex-col h-1/2">
          {latestData ? (
            <>
              <div className="w-full flex-grow flex flex-col gap-y-1 border-b border-b-black">
                <p className="flex gap-x-2 items-center font-bold text-xs">
                  <span className="w-2 h-2 rounded-full bg-[#E66FD2] inline-block"></span>
                  Systolic
                </p>
                <p className="flex gap-x-2 items-center font-bold">
                  {latestData.blood_pressure_systolic_value}
                </p>
                <p className="flex items-center text-xss text-nowrap">
                  {latestData.blood_pressure_systolic_levels === "Normal" ? null :
                    latestData.blood_pressure_systolic_levels === "Higher than Average" ? (
                      <IoMdArrowDropup size={20} />
                    ) : (
                      <IoMdArrowDropdown size={20} />
                    )}
                  {latestData.blood_pressure_systolic_levels}
                </p>
              </div>

              <div className="w-full flex-grow flex flex-col gap-y-1 mt-1">
                <p className="flex gap-x-2 items-center font-bold text-xs">
                  <span className="w-2 h-2 rounded-full bg-[#8C6FE6] inline-block"></span>
                  Diastolic
                </p>
                <p className="flex items-center font-bold">
                  {latestData.blood_pressure_diastolic_value}
                </p>
                <p className="flex items-center text-xss text-nowrap">
                  {latestData.blood_pressure_diastolic_levels === "Normal" ? null :
                    latestData.blood_pressure_diastolic_levels === "Higher than Average" ? (
                      <IoMdArrowDropup size={20} />
                    ) : (
                      <IoMdArrowDropdown size={20} />
                    )}
                  {latestData.blood_pressure_diastolic_levels}
                </p>
              </div>
            </>
          ) : (
            <div className="text-xs text-gray-400 p-2">No data available</div>
          )}
        </div>
      </div>
    </div>
  );
}
