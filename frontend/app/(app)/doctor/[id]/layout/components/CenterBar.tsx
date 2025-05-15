'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import ChartCard from './Lib/ui/chartcard'
import HealthCard from './Lib/ui/healthcard'
import DiagnosisList from './Lib/ui/diagnosisList'
import DiagnosisForm from './Lib/ui/DiagnosisForm'
import { get } from '@/app/lib/utlis'
import TextPlaceHolder from '../extra/TextPlaceHolder'
import { useRouter } from 'next/navigation'
import DiagnosticListForm from './Lib/ui/Diagnosislistform'
export default function CenterBarWrapper({ id }: { id?: string | null }) {
  const { data: diagnostics, isLoading, error } = useSWR(
    id ? `/doctor/my-patients/${id}/diagnostics` : null,
    get
  )
  const router = useRouter()
  const searchParams = useSearchParams()
  const msg = searchParams.get('msg')
  const [showMsg, setShowMsg] = useState(!!msg)

  useEffect(() => {
    if (msg) {
      setShowMsg(true)
      const timeout = setTimeout(() => {
        setShowMsg(false)
        router.replace(location.pathname)
      }, 5000)
      return () => clearTimeout(timeout)
    }
  }, [msg])

  if (!id) {
    return (
      <TextPlaceHolder
        className="w-1/2 flex justify-center font-bold"
        text="No patient selected."
      />
    )
  }

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

  return (
    <>
      {showMsg && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow z-50">
          {msg}
        </div>
      )}
      <CenterBar
        id={id}
        diagnosis_history={diagnostics.diagnosis_history}
        diagnostic_list={diagnostics.diagnostic_list}
      />
    </>
  )
}

function CenterBar({
  diagnosis_history,
  diagnostic_list,
  id
}: {
  diagnosis_history: any[]
  diagnostic_list: any[]
  id: string
}) {
  const [showForm, setShowForm] = useState(false)
  const [showListForm, setShowListForm] = useState(false);
  return (
    <>
      <div className="flex flex-col w-1/2 gap-y-4">
        <div className="flex flex-col bg-white w-full p-2 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <p className="font-bold">Diagnostic</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-xl font-bold px-3 rounded hover:bg-gray-200"
              title="Add new diagnosis"
            >
              +
            </button>
          </div>
          <div className="h-screen flex flex-col justify-around bg-white">
            <ChartCard diagnosis_history={diagnosis_history} />
            <HealthCard diagnosis_history={diagnosis_history[0]} />
          </div>
        </div>

        {/* + button above the diagnostic list */}
        <div className="flex flex-col justify-end mb-2 bg-white py-3 px-1 rounded-md">
          <button
            onClick={() => setShowListForm(true)}
            className="text-xl self-end font-bold px-3 rounded hover:bg-gray-200"
            title="Add new diagnosis"
          >
            +
          </button>

        <DiagnosisList diagnostic_list={diagnostic_list} />
        </div>
      </div>

      {showForm && (
        <div
          className="p-12 fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white p-6 rounded shadow-lg max-w-xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <DiagnosisForm patient_id={id} onCloseAction={() => setShowForm(false)} />
          </div>
        </div>
      )}

            {showListForm && (
        <div
          className="p-12 fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setShowListForm(false)}
        >
          <div
            className="bg-white p-6 rounded shadow-lg max-w-xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <DiagnosticListForm patient_id={id} onCloseAction={() => setShowListForm(false)} />
          </div>
        </div>
      )}
    </>
  )
}
