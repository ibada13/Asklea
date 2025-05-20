import PostForm from "../../components/PostForm"
import { doctorFields } from "../../components/def/data"
export default function CreateDoctor() { 

    return (
        <PostForm redirect="/admin/doctors" title="Create new doctor" route={`/admin/doctors`}  userFields={doctorFields} />
    )
}