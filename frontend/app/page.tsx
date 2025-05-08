'use client'

import Link from "next/link";
import { BsGithub } from "react-icons/bs";

export default function Home() {
  return (
    <div className="flex justify-center items-center w-full h-[80vh]">
      <div className="h-2/3 w-3/4 flex flex-col justify-between items-center text-center space-y-6">
        <p className="font-bold text-2xl">
          This website was built using Next.js and Tailwind CSS
        </p>

        <Link 
          href={"https://github.com/ibada13/Tech-Care"} 
          className="w-1/4 uppercase p-3 text-white bg-gray-500 transition-colors duration-200 hover:bg-gray-800 rounded-lg font-bold flex justify-center items-center gap-2"
        >
          Source Code <BsGithub size={20} />
        </Link>

        <Link 
          href={"/0"} 
          className="w-1/4 bg-gray-300 p-3 rounded-lg font-bold hover:bg-gray-400 transition-colors duration-200"
        >
          Visit the Project
        </Link>
      </div>
    </div>
  );
}
