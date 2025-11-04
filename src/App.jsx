import React, { useState } from 'react';
import Header from './components/Header';
import CreateRoom from './components/CreateRoom';
import JoinRoom from './components/JoinRoom';
import Register from './components/Register';

function App() {
  const [view, setView] = useState('home');

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-sky-50">
      <Header onNavigate={setView} current={view} />

      {view === 'home' && (
        <main className="max-w-6xl mx-auto px-4 py-10">
          <section className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-pink-600 via-violet-600 to-sky-600 bg-clip-text text-transparent">
              Cozy pastel rooms for you and your friends
            </h1>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
              Spin up a new space in seconds or hop into an existing one with a code. Soft, calm, and delightful.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CreateRoom />
            <JoinRoom />
          </section>
        </main>
      )}

      {view === 'register' && (
        <main className="max-w-6xl mx-auto px-4 py-10">
          <section className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
              Join the community
            </h1>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
              Create an account to save your rooms and sync across devices.
            </p>
          </section>
          <Register />
        </main>
      )}

      <footer className="mt-16 border-t border-pink-100/60">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-slate-500">
          Made with pastels and good vibes.
        </div>
      </footer>
    </div>
  );
}

export default App;
