'use client';
import { useEffect, useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { post, get } from '@/app/lib/utlis';
import Image from 'next/image';

interface Human {
  id: string;
  username: string;
  profile_picture?: string;
}

interface AttachProps {
  fetch_url: string;
  post_url: string;
  attachedUsersUrl: string;
}

export default function Attach({ fetch_url, post_url, attachedUsersUrl }: AttachProps) {
  const [humanName, setHumanName] = useState('');
  const [humans, setHumans] = useState<Human[]>([]);
  const [selectedHumans, setSelectedHumans] = useState<Human[]>([]);
  const [attachedUsers, setAttachedUsers] = useState<Human[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const selectedHumanIds = selectedHumans.map((h) => h.id);

  useEffect(() => {
    if (!attachedUsersUrl) return;

    get(attachedUsersUrl)
      .then((res) => setAttachedUsers(res))
      .catch(() => {});
  }, [attachedUsersUrl]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!humanName.trim()) {
        setHumans([]);
        return;
      }

      get(`${fetch_url}?name=${encodeURIComponent(humanName)}`)
        .then((res: Human[]) => {
          const filtered = res.filter((h) => !selectedHumanIds.includes(h.id));
          setHumans(filtered);
        })
        .catch(() => {});
    }, 300);

    return () => clearTimeout(timeout);
  }, [humanName, selectedHumanIds.join(',')]);

  const handleAttachHumans = async () => {
    if (selectedHumanIds.length === 0) return;
    setLoading(true);
    try {
      await post(post_url, JSON.stringify( selectedHumanIds ));
      setSuccessMessage('Users successfully attached!');
      setSelectedHumans([]);
      const updated = await get(attachedUsersUrl);
      setAttachedUsers(updated);
    } catch {
      setSuccessMessage('Failed to attach.');
    } finally {
      setLoading(false);
    }
  };

  const handleHumanSelection = (human: Human) => {
    setSelectedHumans((prev) => [...prev, human]);
    setHumans((prev) => prev.filter((h) => h.id !== human.id));
  };

  const handleHumanDelete = (human: Human) => {
    setSelectedHumans((prev) => prev.filter((h) => h.id !== human.id));
  };

  const handleUserDelete = (userId: string) => {
    setAttachedUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  return (
    <div className="mt-8">
      {attachedUsers.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700">Attached Users:</h3>
          <div className="flex flex-col gap-3">
            {attachedUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between py-2 px-3 border-2 border-gray-200 rounded-md">
                <span>{user.username}</span>
                <button
                  onClick={() => handleUserDelete(user.id)}
                  className="text-red-600 hover:text-red-800 transition"
                >
                  <MdOutlineCancel size={24} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedHumans.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700">Selected Users:</h3>
          <div className="flex flex-col gap-3">
            {selectedHumans.map((human) => (
              <div key={human.id} className="flex items-center justify-between py-2 px-3 border-2 border-gray-200 rounded-md">
                <span>{human.username}</span>
                <button
                  onClick={() => handleHumanDelete(human)}
                  className="text-red-600 hover:text-red-800 transition"
                >
                  <MdOutlineCancel size={24} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <input
        type="text"
        placeholder="Enter user name"
        value={humanName}
        onChange={(e) => setHumanName(e.target.value)}
        className="p-2 border border-gray-300 rounded-md w-full"
      />

      <div className="mt-4 space-y-2">
        {humans.length > 0 ? (
          humans.map((human) => (
            <button
              key={human.id}
              onClick={() => handleHumanSelection(human)}
              className="w-full flex items-center gap-4 p-3 bg-gray-100 rounded-md border hover:bg-gray-200"
            >
              <Image
                src={
                  human.profile_picture?.trim()
                    ? human.profile_picture
                    : 'https://fedskillstest.ct.digital/8.png'
                }
                alt={human.username}
                width={40}
                height={40}
                className="rounded-full"
              />
              <span>{human.username}</span>
            </button>
          ))
        ) : (
          <p className="text-gray-500">No users found</p>
        )}
      </div>

      <button
        onClick={handleAttachHumans}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full w-full"
        disabled={loading}
      >
        {loading ? 'Attaching...' : 'Attach Users'}
      </button>

      {successMessage && <p className="mt-4 text-green-600">{successMessage}</p>}
    </div>
  );
}
