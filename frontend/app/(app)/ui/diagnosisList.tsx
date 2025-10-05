'use client';

import { FiEdit } from "react-icons/fi";
import { MdReport } from "react-icons/md";
import { useState } from "react";
import { diagnostic_list } from "../doctor/components/Lib/defintions";
import { post } from "@/app/lib/utlis";
import { useRouter } from "next/navigation";
import DiagnosticListEditForm from "./DiagnosticListEditForm";
const DiagnosisList = ({ diagnostic_list }: { diagnostic_list: diagnostic_list[] }) => {
  const [description, setDescription] = useState("");
  const [activeId, setActiveId] = useState<number | null>(null);
  const [viewItem, setViewItem] = useState<diagnostic_list | null>(null);
  const [editItem, setEditItem] = useState<diagnostic_list | null>(null);
  const router = useRouter();

  const handleReport = async () => {
    if (!description || activeId === null) return;
    try {
      await post("/doctor/diagnosis_reports/", {
        diagnostic_list_id: activeId,
        description,
      });
      router.push(`${window.location.pathname}?msg=your report was posted successfully`, {
        scroll: false,
      });
    } catch (err: any) {
      const errmsg = err?.detail || "some error occurred";
      router.push(`${window.location.pathname}?msg=${errmsg}&color=red`, {
        scroll: false,
      });
      console.error("Report failed:", err);
    } finally {
      setDescription("");
      setActiveId(null);
    }
  };

  return (
    <>
      <div className="w-full min-h-screen flex flex-col gap-6 p-6 bg-gray-50">
        <h1 className="text-2xl font-bold text-center">Diagnostic List</h1>
        <div className="rounded-xl shadow bg-white overflow-hidden">
          <div className="flex justify-between items-center bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600">
            <p className="w-[30%]">Posted By</p>
            <p className="w-[30%]">Diagnosis/History</p>
            <p className="w-[30%]">Description</p>
            <p className="w-[15%]">Status</p>
            <p className="w-[25%] text-right">Action</p>
          </div>

          <div className="divide-y">
            {diagnostic_list?.map((elm, idx) => (
              <div
                key={`dlist-${idx}`}
                className="flex justify-between items-center px-4 py-3 text-sm hover:bg-gray-100 cursor-pointer"
                onClick={() => setViewItem(elm)}
              >
                <p className="w-[30%] truncate">{elm.name}</p>
                <p className="w-[30%] truncate">{elm.description}</p>
                <p className="w-[15%] capitalize">{elm.status}</p>
                <div
                  className="w-[25%] flex justify-end gap-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  {elm.is_by_this_doc ? (
                    <FiEdit
                      className="text-blue-600 cursor-pointer hover:scale-110 transition"
                      onClick={() => setEditItem(elm)}
                    />
                  ) : (
                    <MdReport size={35}
                      className="text-green-600 cursor-pointer hover:scale-110 transition"
                      onClick={() => setActiveId(elm.id)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {activeId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md flex flex-col gap-4 shadow-lg">
            <h2 className="text-lg font-semibold">Tell us why?</h2>
            <input
              type="text"
              placeholder="Enter description"
              className="border px-3 py-2 rounded text-sm w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 text-sm rounded"
                onClick={() => {
                  setActiveId(null);
                  setDescription("");
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-sg text-white text-sm rounded"
                onClick={handleReport}
              >
                Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewItem && !editItem && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-2xl shadow-xl flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Diagnosis Details</h2>
            <p><span className="font-semibold">Name:</span> {viewItem.name}</p>
            <p><span className="font-semibold">Description:</span> {viewItem.description}</p>
            <p><span className="font-semibold">Status:</span> {viewItem.status}</p>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-sg text-white text-sm rounded"
                onClick={() => setViewItem(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-xl shadow-xl w-[90%] max-w-2xl">
            <DiagnosticListEditForm
              initialData={editItem}
              onCloseAction={() => setEditItem(null)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DiagnosisList;
