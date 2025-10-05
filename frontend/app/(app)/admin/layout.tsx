'use client'

import Auth from '@/app/hooks/useAuth'
import NavBar from './components/NavBar'
import type { NavLink } from './components/def/definitios'
import { FaUserDoctor } from "react-icons/fa6";
import { FaUser } from 'react-icons/fa'
import { MdDashboard } from "react-icons/md";

const Layout = ({ children }: { children: React.ReactNode }) => {
const navBarProps:NavLink[] = [
  { label: "Patients", href: "/admin/patients" , icon:FaUser },
  { label: "Doctors", href: "/admin/doctors" , icon :FaUserDoctor },
  { label: "Dashboards", href: "/admin/dashboard"  ,icon:MdDashboard},
];


  return (
    <Auth middleware='admin'>
        <NavBar links={navBarProps} />
    {children}
    </Auth>
  )
}

export default Layout
