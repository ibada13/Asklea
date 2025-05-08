import logo from './[id]/layout/components/assets/TestLogo.svg'
import Image from 'next/image'
import { MdOutlineHome } from "react-icons/md";
import { IoPeople } from "react-icons/io5";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { FaRegCreditCard } from "react-icons/fa";
import { TiMessage } from "react-icons/ti";
import drpic from './[id]/layout/components/assets/senior-woman-doctor-and-portrait-smile-for-health-2023-11-27-05-18-16-utc.png'
import { IoMdSettings } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
const NavBar = () => { 


    return (
        <div className="h-1/6 w-full flex justify-between items-center p-3 bg-white text-xs rounded-lg" >
            <Image src={logo} alt='logo' className='w-[10%]' />
            <div className='flex justify-between gap-x-2 font-bold text-sm'>

            <p className='flex gap-x-1 items-center rounded-lg p-2 bg-sg'><MdOutlineHome size={15}/>Overview</p>
            <p className='flex gap-x-1 items-center rounded-lg p-2 '><IoPeople size={15}/>Patients</p>
            <p className='flex gap-x-1 items-center rounded-lg p-2 '><RiCalendarScheduleLine size={15}/>Schedule</p>
            <p className='flex gap-x-1 items-center rounded-lg p-2 '><TiMessage size={15}/>Messages</p>
            <p className='flex gap-x-1 items-center rounded-lg p-2 '><FaRegCreditCard size={15}/>Transactions</p>
            </div>
            <div className='flex justify-between gap-x-2'>
                <div className='flex gap-x-1 items-center'>
                    
                <div className='w-8 h-8 relative'>
                    <Image className='object-cover rounded-full' src={drpic} alt='dr picture' layout='fill' />
                </div>
                <div className='flex flex-col items-center justify-center text-nowrap'>
                    <p className='font-bold text-xs'>dr. Jsoe simmons</p>
                    <p className='text-xs '>Genral practitoner</p>
                </div>
                </div>
                <div className='flex items-center'>
                    <IoMdSettings size={20}/>
                    <BsThreeDotsVertical size={20}/>
                </div>

        </div>
        </div>
    )
}
export default NavBar