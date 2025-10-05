'use client'
import { getPrivliged } from "@/app/lib/utlis";
import { patientoriginalfields } from "../../admin/components/def/data";
import PostForm from "../components/PostForm";
import useSWRImmutable from "swr/immutable";
import Loading from "../../extra/Loading";
import Error from "../../extra/Error";
export default function Editpage(){ 
    const { data: patient, error, isLoading } = useSWRImmutable("/patient/me",getPrivliged);
    if(error) return <Error/>
    if(isLoading) return <Loading/>
    if (!patient) return
    return (
                <PostForm msg="your edit info request was sent " redirect={`/patient/`} route={`/patient/edit-request`} title="Edit My Infos" userFields={patientoriginalfields} userdata={patient}/>

    )
}