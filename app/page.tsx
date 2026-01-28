'use client';

import { useState, useEffect } from 'react';

interface UserData {
  status: 'SETUP' | 'ACTIVE' | 'ENDED';
  teamId: string | null;
  teamLabel: string | null;
  teamUrl: string | null;
  teamStats: Array<{ id: string; label: string; count: number; url: string }>;
}

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize user ID from cookies
  useEffect(() => {
    const initUser = async () => {
      try {
        // Check if user exists
        const checkRes = await fetch('/api/user-id');
        const checkData = await checkRes.json();

        if (!checkData.userId) {
          // Create new user
          const createRes = await fetch('/api/user-id', { method: 'POST' });
          const createData = await createRes.json();
          setUserId(createData.userId);
        } else {
          setUserId(checkData.userId);
        }
      } catch (err) {
        console.error('Failed to initialize user', err);
      }
    };

    initUser();
  }, []);

  // Poll user data
  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        const res = await fetch(`/api/user/${userId}`);
        const data = await res.json();
        setUserData(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch user data', err);
      }
    };

    fetchUserData();
    const interval = setInterval(fetchUserData, 3000);

    return () => clearInterval(interval);
  }, [userId]);

  if (loading || !userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-2xl text-gray-600 font-semibold">
          Připravujeme hru. Čekejte...
        </p>
      </div>
    );
  }

  // SETUP status
  if (userData.status === 'SETUP') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-2xl text-gray-600 font-semibold">
          Připravujeme hru. Čekejte...
        </p>
      </div>
    );
  }

  // ACTIVE status
  if (userData.status === 'ACTIVE' && userData.teamUrl) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col items-center justify-center h-full w-full">
          <img
            src={userData.teamUrl}
            alt={userData.teamLabel ?? 'Team'}
            className="max-h-96 max-w-96 object-contain mb-8"
          />
          <p className="text-white text-4xl font-bold mb-4">
            Tvůj symbol: <span className="text-blue-400">{userData.teamLabel}</span>
          </p>
          <div className="mt-8 bg-white p-6 rounded-lg shadow-lg max-w-3xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Počty hráčů v každém týmu ({userData.teamStats.length} týmů)
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 max-h-64 overflow-y-auto">
              {userData.teamStats.map((stat) => (
                <div
                  key={stat.id}
                  className={`p-2 rounded-lg text-center font-bold text-sm transition ${
                    stat.id === userData.teamId
                      ? 'bg-blue-600 text-white scale-105 shadow-lg'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p className="font-bold text-base">{stat.label}</p>
                  <p className="text-lg font-bold">{stat.count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ENDED status
  if (userData.status === 'ENDED') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <p className="text-2xl font-bold text-gray-800 mb-4">
            Kolo skončilo.
          </p>
          <p className="text-lg text-gray-600">
            Najděte si parťáky nebo čekejte na pokyny.
          </p>
          {userData.teamLabel && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-700 font-semibold">
                Tvůj symbol byl:{' '}
                <span className="text-blue-600 text-2xl">
                  {userData.teamLabel}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
