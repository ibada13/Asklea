'use client'
import useSWR from 'swr'
import ChartCard from './Lib/ui/chartcard'
import HealthCard from './Lib/ui/healthcard'
import DiagnosisList from './Lib/ui/diagnosisList'
import { get } from '@/app/lib/utlis'
import Loading from '@/app/(app)/extra/Loading'
import Error from '@/app/(app)/extra/Error'

export default function CenterBarWrapper({ id }: { id?: string | null }) {
  const { data: diagnostics, isLoading, error } = useSWR(
    id ? `/doctor/my-patients/${id}/diagnostics` : null, 
    get
  )

  if (!id) return <div>No patient selected.</div> // You can change this to whatever message you want when id is null

  if (isLoading) return <Loading />
  if (error || !diagnostics) return <Error />

  return <CenterBar diagnosis_history={diagnostics.diagnosis_history} diagnostic_list={diagnostics.diagnostic_list} />
}

function CenterBar({ diagnosis_history, diagnostic_list }: { diagnosis_history: any[]; diagnostic_list: any[] }) {
  return (
    <div className="flex flex-col w-1/2 gap-y-4">
      <div className="flex flex-col bg-white w-full p-2 rounded-lg">
        <p className="font-bold">Diagnostic</p>
        <div className="h-screen flex flex-col justify-around bg-white">
          <ChartCard diagnosis_history={diagnosis_history} />
          <HealthCard diagnosis_history={diagnosis_history[0]} />
        </div>
      </div>
      <DiagnosisList diagnostic_list={diagnostic_list} />
    </div>
  )
}
