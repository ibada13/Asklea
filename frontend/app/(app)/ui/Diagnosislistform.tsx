'use client';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { post } from "@/app/lib/utlis";
import { StatusOptions } from "../doctor/components/Lib/defintions";
// const StatusOptions = ["pending", "in-progress", "resolved"] as const;
type Status = typeof StatusOptions[number];

export default function DiagnosticListForm({
  onCloseAction,
  patient_id,
}: {
  onCloseAction: () => void;
  patient_id: string;
}) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "pending" as Status,
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await post(`/doctor/${patient_id}/diagnosticlist`, formData);
      router.replace(window.location.pathname + "?msg=Diagnostic saved successfully", {scroll:false});
      onCloseAction();
    } catch (err :any){
    const errorMsg =
      err?.response?.data?.detail || "Some error occurred";
    router.push(`${window.location.pathname}?msg=${errorMsg}&color=red`, {
      scroll: false,
    });
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 w-full max-w-2xl mx-auto p-6 bg-white rounded shadow max-h-[400px] overflow-y-auto"
    >
      <div>
        <label htmlFor="name" className="block mb-1 font-semibold">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Diagnosis name"
          required
          className="w-full border rounded p-2"
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor="description" className="block mb-1 font-semibold">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          rows={4}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label htmlFor="status" className="block mb-1 font-semibold">Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        >
          {StatusOptions.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCloseAction}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </form>
  );
}
