'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavLink } from "./def/definitios";


export default function NavBar({links}: {links:NavLink[]}) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex justify-center w-full">
      <div className="w-2/3 rounded-full p-4 bg-sg flex justify-around items-center uppercase font-semibold">
        {links.map(({ href, label ,icon :Icon}) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`transition-colors duration-300 px-6 py-3 rounded-full flex items-center gap-x-4 ${
                active ? "text-white bg-green-700" : "text-black hover:text-white"
              }`}
            >
                  {label}
                 {Icon && <Icon size={25} className="inline "/>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
