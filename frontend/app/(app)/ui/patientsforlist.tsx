'use client'

import { BsThreeDotsVertical } from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { PatientforListType } from "../types/types";
import ChatBox from "./ChatBox";
import { post } from "@/app/lib/utlis";
import { useRouter } from "next/navigation";
export default function PatientforList({
  user,

}: {
  user: PatientforListType;

}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setMenuOpen((prev) => !prev);
  };

  const handleChat = (e:React.MouseEvent) => {
        e.stopPropagation();
    e.preventDefault();
    setShowChat(true);
    setMenuOpen(false);
  };

const router = useRouter()
  const handleDetach = async(e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try { 
       await post(`/doctor/${user.id}/detach_request`,)
      router.push(`${location.pathname}?msg=detach request was sent succesfully `, {
        scroll: false,
      });
    } catch (err) { 
      router.push(`${location.pathname}?msg=detach request was not sent&color=red `, {
        scroll: false,
      });
      console.log(err)
    }
  };


  return (
    <>
      <Link href={`/doctor/${user.id}`} className="flex p-2 w-full gap-x-4 relative">
        <div className="flex-grow flex items-center gap-x-2">
          <div className="w-8 h-8">
            <Image
              src={ user.profile_picture||"/pfp.jpg"}
              className="object-cover rounded-full"
              alt="profile_picture"
              width={100}
              height={100}
            />
          </div>
          <div className="flex flex-col text-nowrap justify-between">
            <p className="font-bold text-xs">{user.username}</p>
            {/* <p className="text-xs">{patient.gender}, {patient.age}</p> */}
          </div>
        </div>

        <div
          className="relative flex items-center justify-end z-50 cursor-pointer"
                  onClick={(e)=>toggleMenu(e)}
        >
          <BsThreeDotsVertical size={20} />
          {menuOpen && (
            <div className="absolute right-0 top-6 w-40 bg-white border border-gray-200 shadow-lg rounded-md text-sm">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={(e)=>handleChat(e)}
              >
                Chat with {user.username}
              </button>
              <button
                className={`w-full text-left px-4 py-2  ${user.detach ? "text-red-800 bg-gray-300 cursor-not-allowed" : " hover:bg-gray-100 text-red-600 "}`}
                onClick={(e) => handleDetach(e)}
                disabled={user.detach}
              >
                Detach user
              </button>
            </div>
          )}
        </div>
      </Link>

      {showChat && (
        <ChatBox
          receiverId={user.id.toString()}
                  receiverName={user.username}
                  onCloseAction={()=>setShowChat(false)}
        />
      )}
    </>
  );
}
