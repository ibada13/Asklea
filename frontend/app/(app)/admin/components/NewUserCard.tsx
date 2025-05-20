import Link from "next/link";
import { AiOutlinePlus } from "react-icons/ai";
export default function NewUserCard({ content  , href}: {content:string , href:string}) { 
    return (
                <Link
        href={href}
        className="flex flex-col items-center justify-center border-2 border-dashed border-green-400 bg-green-50 rounded-2xl p-8 cursor-pointer hover:bg-green-100 hover:border-green-600 transition-colors shadow-md"
        aria-label={ content}
>
  <AiOutlinePlus className="text-green-600" size={56} />
            <span className="mt-4 text-green-700 font-semibold text-xl">{ content}</span>
</Link>
    );
}