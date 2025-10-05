'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { postForm } from '@/app/lib/utlis';
import { UserField } from './def/definitios';

const PostForm = ({
  userFields,
  title,
  route,
  redirect,
}: {
  userFields: UserField[];
  title: string;
  route: string;
  redirect: string;
}) => {
  const [formData, setFormData] = useState<Record<string, string>>(
    Object.fromEntries(userFields.map((f) => [f.name, '']))
  );
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target.type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      const file = fileInput.files?.[0];

      if (file && file.type === 'image/jpeg') {
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        alert('Only JPG images are allowed.');
        e.target.value = '';
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (image) data.append('image', image);

    try {
      const response = await postForm(route, data);
      router.push(`${redirect}/${response.id}?msg=User has been created`);
    } catch (err) {
      router.push(
        `${location.pathname}?msg=${String((err as any).response?.data?.detail || 'Submission failed')}&&color=red`,
        { scroll: false }
      );
    }
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

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Profile Image</label>
          <input
            type="file"
            name="image"
            accept=".jpg,image/jpeg"
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-sg focus:outline-none"
          />

          {imagePreview && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-300">
                <Image
                  src={imagePreview}
                  alt="Image Preview"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="reset"
          onClick={() => {
            setFormData(Object.fromEntries(userFields.map((f) => [f.name, ''])));
            setImage(null);
            setImagePreview(null);
          }}
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

export default PostForm;
