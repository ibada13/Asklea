'use client'
import { FaTrash , FaEdit , } from "react-icons/fa"
import { MdCancel } from "react-icons/md";
import Link from "next/link"
import React, { useState } from "react"
import { deletePrivileged } from "@/app/lib/utlis";
import { useRouter } from "next/navigation";
export default function Oparations({ username , id ,edithref}: {username:string ,id:string ,edithref:string}) { 

    const [delPanel, SetDelPanel] = useState<boolean>(false);
    const [disabled, SetDisabled] = useState<boolean>(true);
    const router = useRouter()
    function inputchange(value: string) {
        
        SetDisabled(value !== username)

     }
    const submithandler = async(e: React.FormEvent<HTMLFormElement>) => { 
        e.preventDefault();
        try {
            await deletePrivileged(`/admin/${id}`)
            SetDelPanel(false);
            router.push('/admin?msg=user has been deleted')
         }
        catch (err) {
                console.log(err)
         }


    }
    return (
                <div className='w-full  p-2 flex justify-end text-gray-400' >
                    <div className='flex gap-x-8'>
                    <button type="button" onClick={()=>SetDelPanel(true)}><FaTrash className='hover:text-red-500 transition-colors duration-300'  size={30}/></button>
                <Link href={ edithref}><FaEdit className='hover:text-sg transition-colors duration-300' size={30}/></Link>
            </div>
   {delPanel && 
  <>
    <div className="fixed inset-0 bg-black/20 backdrop-blur-md"></div>
    <div className="fixed inset-0 flex justify-center items-center text-black">
                    <form onSubmit={submithandler} className="min-h-1/2 space-y-12 w-1/2 p-4 bg-white flex flex-col rounded-lg">
                        <div className="flex justify-between ">
                            <p className="text-black text-lg">Delte the user</p>
                            <button onClick={()=>SetDelPanel(false)}><MdCancel className="text-black hover:text-sg transition-colors duration-300" size={30}/></button>
                    </div>
                    
                    <div className="flex flex-col w-full items-start space-y-4">
                            <p>Enter the name of the user to confirm deletion: <strong>{ username}</strong></p>
                    <input
                        className={`w-5/6 p-4 rounded-lg border-2 ${disabled ? "focus:border-red-400":"border-sg"} border-gray-300 focus:outline-none focus:ring-0 focus:border-sg`}
                        placeholder="username"
                        onChange={(e)=>inputchange(e.target.value)}
                        type="text"
                        name="name"
                        autoFocus
                    />
                    </div>
                    
                        <div className="flex w-full justify-end">
                            
                            <button disabled={disabled} type="submit" className="bg-gray-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:border-2 disabled:border-gray-400 disabled:cursor-not-allowed  border-2 border-sg hover:bg-sg px-6 py-3 uppercase rounded-md transition-colors duration-300" >submit</button>
                    </div>

                    </form>
    </div>
  </>
}

                </div>
    )
}