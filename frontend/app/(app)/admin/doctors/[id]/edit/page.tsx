'use client'
import Form from "../../../components/Form"
import { doctorFields } from "../../../components/def/data"
import useSWRImmutable from "swr/immutable"
import { getPrivliged } from "@/app/lib/utlis"
import Error from "@/app/(app)/extra/Error"
import Loading from "@/app/(app)/extra/Loading"
import { useParams } from "next/navigation"
export default function EditDoctor() { 
    const { id} = useParams()
    const { data:doctor , isLoading , error} = useSWRImmutable(`/admin/doctors/${id}`,getPrivliged)
    if(error) return <Error/>
    if(isLoading) return <Loading/>
    if (!doctor) return
    return (
        
        <Form title="Doctor Edit Form" userFields={doctorFields} userdata={doctor}/>
    )
}