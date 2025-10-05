'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import type { NavLink } from "./def/definitios";
import { UseAuth } from "@/app/state/AuthProvider";
export default function NavBar({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => pathname === href;
  const { handleLogout} = UseAuth()
  return (
    <nav className="w-full bg-gray-50 shadow-md sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-4 rounded-full uppercase font-semibold">
        <div className="text-gray-900 text-lg font-bold tracking-wide select-none cursor-default">Logo</div>

        <button
          className="sm:hidden text-gray-900 focus:outline-none transition-transform duration-300 hover:scale-110"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <HiX size={32} className="text-red-600" /> : <HiMenu size={32} className="text-gray-900" />}
        </button>

        <div className="hidden sm:flex justify-center flex-1 gap-6 md:gap-8 lg:gap-12">
          {links.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`relative overflow-hidden px-5 py-3 rounded-full flex items-center gap-x-3 text-base font-medium transition-colors duration-300 select-none
                  ${
                    active
                      ? "text-white bg-gradient-to-r from-green-400 via-cyan-500 to-blue-600 shadow-lg"
                      : "text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-green-400 hover:via-cyan-400 hover:to-blue-500"
                  }`}
              >
                {Icon && <Icon size={22} className="inline" />}
                <span className="z-10">{label}</span>
                <span className="absolute inset-0 bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full blur-md"></span>
              </Link>
            );
          })}
        </div>
        <button className="uppercase bg-red-200 text-black hover:bg-red-300 transition-colors duration-200 px-6 py-3 rounded-lg " onClick={()=>handleLogout()}>
          logout
        </button>
      </div>

      <div
        className={`sm:hidden fixed top-16 left-0 right-0 bg-gray-50 shadow-lg rounded-b-lg max-w-md mx-auto overflow-hidden z-40 transform transition-transform duration-500 ${
          open ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-3 p-5">
          {links.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-300
                  ${
                    active
                      ? "text-white bg-gradient-to-r from-green-400 via-cyan-500 to-blue-600 shadow-lg"
                      : "text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-green-400 hover:via-cyan-400 hover:to-blue-500"
                  }`}
              >
                {Icon && <Icon size={24} />}
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
