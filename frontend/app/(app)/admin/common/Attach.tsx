'use client';
import { useEffect, useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { post, get, deletePrivileged } from '@/app/lib/utlis';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Human {
  id: string;
  username: string;
  profile_picture?: string;
}

interface AttachProps {
  fetch_url: string;
  post_url: string;
  attachedUsersUrl: string;
  del_url: string;
}

function Card({
  human,
  onDelete,
  onClick,
  showDelete = true,
}: {
  human: Human;
  onDelete?: (human: Human) => void;
  onClick?: (human: Human) => void;
  showDelete?: boolean;
}) {
  return (
    <div
      onClick={onClick ? () => onClick(human) : undefined}
      className={`relative flex flex-col items-center p-4 border rounded-lg cursor-pointer shadow-sm hover:shadow-md transition ${
        onClick ? 'hover:bg-gray-50' : ''
      }`}
      style={{ width: 140 }}
    >
      {showDelete && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(human);
          }}
          className="absolute top-2 right-2 text-red-600 hover:text-red-800 transition"
          aria-label="Delete"
        >
          <MdOutlineCancel size={20} />
        </button>
      )}

      <Image
        src={human.profile_picture || "/pfp.jpg"}
        alt={human.username}
        width={70}
        height={70}
        className="rounded-full mb-3"
      />
      <span className="text-center font-medium break-words">{human.username}</span>
    </div>
  );
}

export default function Attach({
  fetch_url,
  post_url,
  attachedUsersUrl,
  del_url,
}: AttachProps) {
  const [humanName, setHumanName] = useState('');
  const [humans, setHumans] = useState<Human[]>([]);
  const [selectedHumans, setSelectedHumans] = useState<Human[]>([]);
  const [attachedUsers, setAttachedUsers] = useState<Human[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const selectedHumanIds = selectedHumans.map((h) => h.id);

  useEffect(() => {
    if (!attachedUsersUrl) return;
    get(attachedUsersUrl).then(setAttachedUsers).catch(() => {});
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
    if (!selectedHumanIds.length) return;
    setLoading(true);
    try {
      await post(post_url, JSON.stringify(selectedHumanIds));
      router.push(`${location.pathname}?msg=users were been attached`, {
        scroll: false,
      });
      setSelectedHumans([]);
      const updated = await get(attachedUsersUrl);
      setAttachedUsers(updated);
    } catch {}
    setLoading(false);
  };

  const handleHumanSelection = (human: Human) => {
    setSelectedHumans((prev) => [...prev, human]);
    setHumans((prev) => prev.filter((h) => h.id !== human.id));
  };

  const handleHumanDelete = (human: Human) => {
    setSelectedHumans((prev) => prev.filter((h) => h.id !== human.id));
  };

  const handleUserDelete = async (userId: string) => {
    try {
      const response = await deletePrivileged(`${del_url}/${userId}`);
      if (response) {
        router.push(`${location.pathname}?msg=users were deattached`, {
          scroll: false,
        });
        setAttachedUsers((prev) => prev.filter((user) => user.id !== userId));
      }
    } catch(err) {
      router.push(`${location.pathname}?msg=Failed to deattach users check log for more infos&&color=red`, {scroll:false});
    }
  };

  return (
    <div className="mt-8 space-y-8">
      {attachedUsers.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-4">Attached Users:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {attachedUsers.map((user) => (
              <Card
                key={user.id}
                human={user}
                onDelete={() => handleUserDelete(user.id)}
              />
            ))}
          </div>
        </div>
      )}

      {selectedHumans.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-4">Selected Users:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {selectedHumans.map((human) => (
              <Card
                key={human.id}
                human={human}
                onDelete={() => handleHumanDelete(human)}
              />
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

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {humans.length ? (
          humans.map((human) => (
            <Card
              key={human.id}
              human={human}
              onClick={handleHumanSelection}
              showDelete={false}
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">No users found</p>
        )}
      </div>

      <button
        onClick={handleAttachHumans}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-full w-full"
        disabled={loading}
      >
        {loading ? 'Attaching...' : 'Attach Users'}
      </button>
    </div>
  );
}
