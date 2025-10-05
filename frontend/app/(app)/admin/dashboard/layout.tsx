  'use client'
  import React, { useState } from "react";
import Link from "next/link";
  interface AdminLayoutProps {
    children: React.ReactNode;
  }

  const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const toggleMenu = (menu: string) => {
      setOpenMenu(openMenu === menu ? null : menu);
    };

    return (
      <div className="flex h-screen bg-gray-50 text-gray-800 gap-x-8">
        <aside className="w-128 p-6 flex flex-col space-y-6 bg-white shadow-md">
          <div className="text-3xl font-extrabold mb-8 select-none text-gray-900">
            Admin Panel
          </div>

          <button
            onClick={() => toggleMenu("reports")}
            className="w-full text-left py-3 px-4 rounded-md hover:bg-green-100 hover:text-green-700 transition-colors font-semibold text-gray-700"
          >
            Reports
          </button>
          {openMenu === "reports" && (
            <div className="pl-6 space-y-2 text-gray-700">
              <Link
              href={"/admin/dashboard/message-reports"}
                className="block w-full text-left py-2 rounded-md hover:bg-green-100 hover:text-green-700 transition-colors">
                Message Reports
              </Link>
              <Link href={"/admin/dashboard/diagnosis-reports"} className="block w-full text-left py-2 rounded-md hover:bg-green-100 hover:text-green-700 transition-colors">
                Diagnosis Reports
              </Link>
            </div>
          )}

          <button
            onClick={() => toggleMenu("requests")}
            className="w-full text-left py-3 px-4 rounded-md hover:bg-green-100 hover:text-green-700 transition-colors font-semibold text-gray-700"
          >
            Requests
          </button>
          {openMenu === "requests" && (
            <div className="pl-6 space-y-2 text-gray-700">
              <Link href={"/admin/dashboard/patient-edit-request"} className="block w-full text-left py-2 rounded-md hover:bg-green-100 hover:text-green-700 transition-colors">
                Info Requests
              </Link>
              <Link
                href={"/admin/dashboard/detach-request"}
                className="block w-full text-left py-2 rounded-md hover:bg-green-100 hover:text-green-700 transition-colors">
                Detach Requests
              </Link>
            </div>
          )}
        </aside>

        <div className="flex flex-col bg-white flex-1 min-w-0">
          <header className="h-16 flex items-center justify-between px-6 border-b border-gray-300">
            <div className="text-xl font-bold text-gray-900 select-none">Dashboard</div>
            <div className="text-gray-600 font-medium">Admin</div>
          </header>

          <main className="flex-1 p-2 overflow-auto min-w-0">{children}</main>
        </div>
      </div>
    );
  };

  export default AdminLayout;
