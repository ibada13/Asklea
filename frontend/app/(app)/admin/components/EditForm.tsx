'use client';
import { useState } from 'react';
import { UserField } from './def/definitios';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { put } from '@/app/lib/utlis';
import { useRouter } from 'next/navigation';
const EditForm = ({
  userFields,
  title,
  userdata = {},
  route,
  redirect,
  msg
}: {
  userFields: UserField[];
  title: string;
    userdata?: Record<string, string>;
    route: string
    redirect: string
  msg:string
}) => {
  const [formData, setFormData] = useState<Record<string, string>>(
    Object.fromEntries(userFields.map((f) => [f.name, userdata[f.name] || '']))
  );
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    try { 
     await put(route, formData )
      router.push(redirect + `?msg=${msg}`)
    } catch (err) {
      router.push(redirect + "?msg=some error occured&color=red")

      console.log(err)
     }
    console.log(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-6xl w-3/4 mx-auto p-6 bg-white shadow-xl rounded-2xl space-y-6"
    >
      <h2 className="text-4xl font-semibold text-sg text-center">{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {userFields.map((field) => (
          <div key={field.name} className="flex flex-col relative">
            <label className="text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            {field.type === 'select' ? (
              <select
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-sg focus:outline-none"
              >
                <option value="">Select {field.label}</option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : field.type === 'password' ? (
              <>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name={field.name}
                  value={formData[field.name]}
                    onChange={handleChange}
                  className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-sg focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-8 text-gray-500 hover:text-sg focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                </button>
              </>
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required
                className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-sg focus:outline-none"
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="reset"
          onClick={() =>
            setFormData(Object.fromEntries(userFields.map((f) => [f.name, userdata[f.name] || ''])))
          }
          className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
        >
          Reset
        </button>
        <button
          type="submit"
          className="bg-sg text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default EditForm;
