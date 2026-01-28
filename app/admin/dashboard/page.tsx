'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface TeamStat {
  id: string;
  label: string;
  url: string;
  count: number;
}

export default function AdminDashboard() {
  const [imageLinks, setImageLinks] = useState('');
  const [gameStatus, setGameStatus] = useState<'SETUP' | 'ACTIVE' | 'ENDED'>(
    'SETUP'
  );
  const [teamStats, setTeamStats] = useState<TeamStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await fetch('/api/game');
        setIsLoading(false);
      } catch {
        router.push('/admin');
      }
    };
    checkAuth();
  }, [router]);

  // Poll game status and stats
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const [gameRes, statsRes] = await Promise.all([
          fetch('/api/game'),
          fetch('/api/stats'),
        ]);
        const gameData = await gameRes.json();
        const statsData = await statsRes.json();
        setGameStatus(gameData.status);
        setTeamStats(statsData);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleAddTeams = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const urls = imageLinks
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (urls.length === 0) {
      alert('Prosím zadejte alespoň jednu URL obrázku');
      return;
    }

    try {
      const res = await fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setTeams', teams: urls }),
      });

      if (res.ok) {
        const gameRes = await fetch('/api/game');
        const gameData = await gameRes.json();
        setGameStatus(gameData.status);
        alert('Týmy byly nastaveny! Nyní můžete spustit kolo.');
      }
    } catch (err) {
      alert('Chyba při nastavování týmů');
      console.error(err);
    }
  };

  const handleStartRound = async () => {
    if (teamStats.length === 0) {
      alert('Nejprve nastavte týmy');
      return;
    }

    try {
      const res = await fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'startRound' }),
      });

      if (res.ok) {
        setGameStatus('ACTIVE');
      }
    } catch (err) {
      alert('Chyba při spouštění kola');
      console.error(err);
    }
  };

  const handleEndRound = async () => {
    try {
      const res = await fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'endRound' }),
      });

      if (res.ok) {
        setGameStatus('ENDED');
      }
    } catch (err) {
      alert('Chyba při ukončování kola');
      console.error(err);
    }
  };

  const handleReset = async () => {
    if (!confirm('Opravdu chcete resetovat hru?')) return;

    try {
      const res = await fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resetGame' }),
      });

      if (res.ok) {
        setGameStatus('SETUP');
        setImageLinks('');
        setTeamStats([]);
      }
    } catch (err) {
      alert('Chyba při resetování hry');
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-600">Načítání...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Panel Administátora - Team Sorter
        </h1>

        {/* Setup Section */}
        {gameStatus === 'SETUP' && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Nastavení Týmů
            </h2>
            <form onSubmit={handleAddTeams}>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Vložte adresy obrázků (jeden na řádek):
              </label>
              <textarea
                value={imageLinks}
                onChange={(e) => setImageLinks(e.target.value)}
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                className="w-full h-32 px-4 py-2 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:border-blue-500 mb-4"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg text-lg hover:bg-blue-700 transition mb-4"
              >
                Uložit Týmy
              </button>
            </form>
          </div>
        )}

        {/* Active/Ended Section */}
        {(gameStatus === 'ACTIVE' || gameStatus === 'ENDED') && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Statistiky Týmů
            </h2>
            {gameStatus === 'ACTIVE' && (
              <p className="text-lg text-green-600 font-semibold mb-4">
                Stav: AKTIVNÍ
              </p>
            )}
            {gameStatus === 'ENDED' && (
              <p className="text-lg text-red-600 font-semibold mb-4">
                Stav: UKONČENO
              </p>
            )}

            <div className="mb-4">
              <p className="text-gray-600 font-semibold mb-4">
                Celkem týmů: <span className="text-blue-600 text-lg">{teamStats.length}</span> | 
                Celkem hráčů: <span className="text-green-600 text-lg">{teamStats.reduce((sum, t) => sum + t.count, 0)}</span>
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 mb-6 overflow-y-auto max-h-96">
              {teamStats.map((stat) => (
                <div
                  key={stat.id}
                  className="bg-gradient-to-br from-blue-50 to-gray-50 p-3 rounded-lg border-2 border-blue-200 hover:border-blue-400 transition"
                >
                  {stat.url && (
                    <img
                      src={stat.url}
                      alt={stat.label}
                      className="w-full h-20 object-cover rounded mb-2"
                    />
                  )}
                  <h3 className="text-lg font-bold text-gray-800 mb-1 text-center">
                    {stat.label}
                  </h3>
                  <p className="text-xl font-bold text-blue-600 text-center">
                    {stat.count}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {gameStatus === 'SETUP' && (
              <button
                onClick={handleStartRound}
                disabled={teamStats.length === 0}
                className="bg-green-600 text-white font-bold py-3 rounded-lg text-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Spustit kolo
              </button>
            )}

            {gameStatus === 'ACTIVE' && (
              <button
                onClick={handleEndRound}
                className="bg-red-600 text-white font-bold py-3 rounded-lg text-lg hover:bg-red-700 transition"
              >
                Ukončit kolo
              </button>
            )}

            <button
              onClick={handleReset}
              className="bg-yellow-600 text-white font-bold py-3 rounded-lg text-lg hover:bg-yellow-700 transition"
            >
              Nové kolo / Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
