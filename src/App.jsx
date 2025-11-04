import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import CreateRoom from './components/CreateRoom';
import JoinRoom from './components/JoinRoom';
import Register from './components/Register';

function App() {
  const [view, setView] = useState('home');
  const [justCreatedCode, setJustCreatedCode] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const role = params.get('role');
    if (role === 'viewer') setView('home');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-violet-50 to-blue-50">
      <Header currentView={view} onNavigate={setView} />

      {view === 'home' && (
        <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
          {justCreatedCode && (
            <div className="rounded-xl px-4 py-3 bg-white/70 border border-white text-sm text-slate-700">
              Room created! Share this link: <span className="font-medium">{`${window.location.origin}?room=${justCreatedCode}&role=viewer`}</span>
            </div>
          )}
          <div className="grid lg:grid-cols-2 gap-6">
            <CreateRoom onRoomCreated={setJustCreatedCode} />
            <JoinRoom />
          </div>
        </main>
      )}

      {view === 'register' && (
        <main className="mx-auto max-w-5xl px-4 py-8">
          <Register />
        </main>
      )}

      <footer className="mt-12 py-6 text-center text-xs text-slate-500">
        Built with soft pastel vibes • Camera toggle + shareable viewer link (demo)
      </footer>
    </div>
  );
}

export default App;
