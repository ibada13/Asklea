'use client';
import Image from 'next/image';

import { FiLogOut } from 'react-icons/fi';
import logo from '@/public/logo.png';
import { UseAuth } from './state/AuthProvider';
export default function NavBar() {
  const { handleLogout } = UseAuth();

  return (
    <nav className="w-full h-20 px-8 flex items-center justify-between bg-white rounded-xl shadow-md border">
      <div className="flex items-center gap-4">
        <Image src={logo} alt="Logo" width={80} height={60} className="object-contain" />
        {/* Future Nav Icons (optional):
        <div className="hidden md:flex gap-6 text-gray-500">
          <MdOutlineHome size={22} className="hover:text-blue-600 cursor-pointer" />
          <IoPeople size={22} className="hover:text-blue-600 cursor-pointer" />
          <RiCalendarScheduleLine size={22} className="hover:text-blue-600 cursor-pointer" />
          <FaRegCreditCard size={22} className="hover:text-blue-600 cursor-pointer" />
          <TiMessage size={22} className="hover:text-blue-600 cursor-pointer" />
          <IoMdSettings size={22} className="hover:text-blue-600 cursor-pointer" />
        </div> */}
      </div>
      <button
        onClick={() =>handleLogout()}
        className="flex items-center gap-2 text-sm text-red-600 hover:text-white hover:bg-red-500 transition-all px-4 py-2 rounded-md"
      >
        <FiLogOut size={18} />
        Logout
      </button>
    </nav>
  );
}
