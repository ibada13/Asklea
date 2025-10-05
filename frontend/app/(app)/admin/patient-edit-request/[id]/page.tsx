'use client'

import { useParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
import { getPrivliged, put } from '@/app/lib/utlis'
import { FaCheck, FaTimes } from 'react-icons/fa'
import TextPlaceHolder from '@/app/(app)/extra/TextPlaceHolder'

type Gender = 'MALE' | 'FEMALE' | 'OTHER'

interface PatientEditRequest {
  patient_id: string
  gender?: Gender
  age?: number
  profile_picture?: string
  date_of_birth?: string
  phone_number?: string
  emergency_contact?: string
  insurance_type?: string
  timestamp: string
}

export default function PatientEditRequestPage() {
  const { id } = useParams()
  const router = useRouter()

  const { data, error, isLoading } = useSWR<PatientEditRequest>(
    id ? `/admin/patient-edit-request/${id}` : null,
    getPrivliged
  )

  const handleDecision = async (accept: boolean) => {
    try {
      const res = await put(`/admin/patient-edit-request/${id}/${accept}`, {})
      router.push(`/admin/patients/${id}?msg=${res?.detail || 'Done'}`)
    } catch (err: any) {
      const errMsg = err?.response?.data?.detail || 'Failed to process the request.'
      router.push(`${window.location.href}?msg=${errMsg}&color=red`)
    }
  }

  if (isLoading) return <p className="p-6 text-center text-gray-500">Loading...</p>
  if (error) {
    if (error.message === 'Unauthorized') {
      router.replace('/403')
      return null
    }
    return <p className="p-6 text-center text-red-600">Error loading data</p>
  }
  
  if (!data) return <TextPlaceHolder text="No data available"/>

  const fields = [
    ['Patient ID', data.patient_id],
    ['Gender', data.gender ?? 'N/A'],
    ['Age', data.age ?? 'N/A'],
    ['DOB', data.date_of_birth ?? 'N/A'],
    ['Phone', data.phone_number ?? 'N/A'],
    ['Emergency Contact', data.emergency_contact ?? 'N/A'],
    ['Insurance', data.insurance_type ?? 'N/A'],
    ['Timestamp', new Date(data.timestamp).toLocaleString()],
  ]

  return (
    <main className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-md space-y-8">
      <h1 className="text-4xl font-extrabold text-sg">Patient Edit Request</h1>

      <dl className="grid grid-cols-2 gap-y-4 gap-x-8 text-gray-700 text-base font-medium">
        {fields.map(([label, value]) => (
          <div key={label}>
            <dt className="text-gray-500">{label}</dt>
            <dd className="text-gray-900">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex justify-end gap-4">
        <button
          aria-label="Deny"
          onClick={() => handleDecision(false)}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-sm transition"
        >
          <FaTimes className="inline mr-2" />
          Deny
        </button>
        <button
          aria-label="Accept"
          onClick={() => handleDecision(true)}
          className="px-6 py-3 bg-sg hover:bg-sg/80 text-white font-semibold rounded-md shadow-sm transition"
        >
          <FaCheck className="inline mr-2" />
          Accept
        </button>
      </div>
    </main>
  )
}
