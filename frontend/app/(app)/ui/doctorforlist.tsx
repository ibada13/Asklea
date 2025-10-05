'use client'

import { BsThreeDotsVertical } from "react-icons/bs";
import Image from "next/image";
import React from "react";
import { DoctorforListType } from "../types/types";
import ChatBox from "./ChatBox";
import { post } from "@/app/lib/utlis";
import { useRouter } from "next/navigation";
export default function DoctorforList({
  user,
  id,
  menuOpen,
  toggleMenuAction,
  showChat,
  openChatAction,
  closeChatAction,
}: {
  user: DoctorforListType;
  id: string;
  menuOpen: boolean;
  toggleMenuAction: (e: React.MouseEvent) => void;
  showChat: boolean;
  openChatAction: (e: React.MouseEvent) => void;
  closeChatAction: () => void;
}) {
  const handleChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    openChatAction(e);
  };

  return (
    <>
      <div className="flex p-2 w-full gap-x-4 relative">
        <div className="flex-grow flex items-center gap-x-3">
          <div className="w-8 h-8">
            <Image
              src={ user.profile_picture ||"/pfp.jpg"}
              className="object-cover rounded-full"
              alt="profile_picture"
              width={100}
              height={100}
            />
          </div>
          <div className="flex flex-col text-nowrap justify-between gap-y-1">
            <p className="font-bold text-xs">{user.username}</p>
            <p className="text-xs">{user.specialty}</p>
          </div>
        </div>

        <div
          className="relative flex items-center justify-end z-50 cursor-pointer"
          onClick={toggleMenuAction}
        >
          <BsThreeDotsVertical size={20} />
          {menuOpen && (
            <div className="absolute right-0 top-6 w-40 bg-white border border-gray-200 shadow-lg rounded-md text-sm">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={handleChat}
              >
                Chat with {user.username}
              </button>

            </div>
          )}
        </div>
      </div>

      {showChat && (
        <ChatBox
          receiverId={user.id.toString()}
          receiverName={user.username}
          onCloseAction={closeChatAction}
        />
      )}
    </>
  );
}
