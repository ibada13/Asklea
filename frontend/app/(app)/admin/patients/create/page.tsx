import PostForm from "../../components/PostForm"
import { patientFields } from "../../components/def/data"
export default function CreatePatient() { 

    return (
        <PostForm redirect="/admin/patients" title="Create new patient" route={`/admin/patients`}  userFields={patientFields} />
    )
}