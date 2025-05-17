'use client'
import { useState } from "react";
import DiagnosisList from "../../ui/diagnosisList";
import ChartCard from "../../ui/chartcard";
import HealthCard from "../../ui/healthcard";
import useSWR from "swr";
import { getPrivliged } from "@/app/lib/utlis";
import TextPlaceHolder from "../../extra/TextPlaceHolder";
export default function LeftBarWrapper() {
  const { data:diagnostics , error , isLoading} = useSWR("/patients/diagnostics",getPrivliged)

  if (isLoading) {
      return (
        <TextPlaceHolder
          className="w-1/2 flex justify-center font-bold text-sg"
          text="Loading..."
        />
      )
    }
  
    if (error) {
      return (
        <TextPlaceHolder
          className="w-1/2 flex justify-center font-bold text-red-500"
          text="Error."
        />
      )
    }
  
    if (!diagnostics) {
      return (
        <TextPlaceHolder
          className="w-1/2 flex justify-center font-bold text-sg"
          text="No results"
        />
      )
  }
  
  return <LeftBar diagnosis_history={diagnostics.diagnosis_history} diagnostic_list={diagnostics.diagnostic_list}/>
  
 } 

function LeftBar({
  diagnosis_history,
  diagnostic_list,

}: {
  diagnosis_history: any[]
  diagnostic_list: any[]

}) {

  return (
    <>
      <div className="flex flex-col w-1/2 gap-y-4">
        <div className="flex flex-col bg-white w-full p-2 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <p className="font-bold">Diagnostic</p>
  
          </div>
          <div className="h-screen flex flex-col justify-around bg-white">
            <ChartCard diagnosis_history={diagnosis_history} />
            <HealthCard diagnosis_history={diagnosis_history[0]} />
          </div>
        </div>

        {/* + button above the diagnostic list */}
        <div className="flex flex-col justify-end mb-2 bg-white py-3 px-1 rounded-md">


        <DiagnosisList diagnostic_list={diagnostic_list} />
        </div>
      </div>

      
    </>
  )
}
