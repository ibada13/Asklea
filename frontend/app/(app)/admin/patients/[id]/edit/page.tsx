'use client'
import EditForm from "../../../components/EditForm"
import { patientFields } from "../../../components/def/data"
import useSWRImmutable from "swr/immutable"
import { getPrivliged } from "@/app/lib/utlis"
import Error from "@/app/(app)/extra/Error"
import Loading from "@/app/(app)/extra/Loading"
import { useParams } from "next/navigation"
export default function EditDoctor() { 
    const { id} = useParams()
    const { data:patient , isLoading , error} = useSWRImmutable(`/admin/patients/${id}`,getPrivliged)
    if(error) return <Error/>
    if(isLoading) return <Loading/>
    if (!patient) return
    return (
        
        <EditForm redirect={`/admin/patients/${id}`} route={`/admin/users/${id}`} title="Patient Edit Form" userFields={patientFields} userdata={patient}/>
    )
}