'use client';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { post } from "@/app/lib/utlis";

const Levels = ["Low", "Normal", "Higher than Average", "High"] as const;
type Level = typeof Levels[number];

function getLevelForVital(name: string, value: number | null): Level {
  if (value === null) return "Normal";
  if (value < 50) return "Low";
  if (value <= 120) return "Normal";
  if (value <= 150) return "Higher than Average";
  return "High";
}

function getDefaultTimestamp() {
  const now = new Date();
  const localISO = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16); // "YYYY-MM-DDTHH:mm"
  return localISO;
}

export default function DiagnosisForm({ onCloseAction, patient_id }: { onCloseAction: () => void; patient_id: string }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    timestamp: getDefaultTimestamp(),
    blood_pressure_systolic_value: "",
    blood_pressure_systolic_levels: "Normal" as Level,
    blood_pressure_diastolic_value: "",
    blood_pressure_diastolic_levels: "Normal" as Level,
    heart_rate_value: "",
    heart_rate_levels: "Normal" as Level,
    respiratory_rate_value: "",
    respiratory_rate_levels: "Normal" as Level,
    temperature_value: "",
    temperature_levels: "Normal" as Level,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleValueBlur(e: React.FocusEvent<HTMLInputElement>, levelKey: keyof typeof formData) {
    const { name, value } = e.target;
    const numValue = value === "" ? null : Number(value);
    const inferredLevel = getLevelForVital(name, numValue);
    setFormData(prev => ({ ...prev, [levelKey]: inferredLevel }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        timestamp: new Date(formData.timestamp).toISOString(),
        blood_pressure_systolic_value: Number(formData.blood_pressure_systolic_value),
        blood_pressure_diastolic_value: Number(formData.blood_pressure_diastolic_value),
        heart_rate_value: Number(formData.heart_rate_value),
        respiratory_rate_value: Number(formData.respiratory_rate_value),
        temperature_value: Number(formData.temperature_value),
      };
      await post(`/doctor/${patient_id}/diagnosishistory`, payload);
      router.replace(window.location.pathname + "?msg=diagnostic was posted successfully");
      onCloseAction();
    } catch (error) {
      console.error("Failed to save diagnosis:", error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-2xl mx-auto p-6 bg-white rounded shadow max-h-[500px] overflow-y-auto">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Timestamp</label>
        <input
          type="datetime-local"
          name="timestamp"
          value={formData.timestamp}
          onChange={handleChange}
          required
          className="border rounded p-2"
        />
      </div>

      {[
        { name: "blood_pressure_systolic_value", level: "blood_pressure_systolic_levels", label: "Systolic" },
        { name: "blood_pressure_diastolic_value", level: "blood_pressure_diastolic_levels", label: "Diastolic" },
        { name: "heart_rate_value", level: "heart_rate_levels", label: "Heart Rate" },
        { name: "respiratory_rate_value", level: "respiratory_rate_levels", label: "Respiratory Rate" },
        { name: "temperature_value", level: "temperature_levels", label: "Temperature", step: 0.1 },
      ].map(({ name, level, label, step }) => (
        <div key={name} className="flex gap-x-4 items-center w-full">
          <input
            type="number"
            name={name}
            min={0}
            max={200}
            step={step}
            value={formData[name as keyof typeof formData]}
            onChange={handleChange}
            onBlur={e => handleValueBlur(e, level as keyof typeof formData)}
            placeholder={`${label} Value`}
            required
            className="flex-1 border rounded p-2"
          />
          <select
            name={level}
            value={formData[level as keyof typeof formData]}
            onChange={handleChange}
            required
            className="flex-1 border rounded p-2"
          >
            {Levels.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      ))}

      <div className="flex justify-end gap-4">
        <button type="button" onClick={onCloseAction} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
      </div>
    </form>
  );
}
