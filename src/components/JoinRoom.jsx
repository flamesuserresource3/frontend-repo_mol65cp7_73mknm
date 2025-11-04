import React, { useState } from 'react';
import { DoorOpen } from 'lucide-react';

const JoinRoom = () => {
  const [code, setCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');

  const handleJoin = (e) => {
    e.preventDefault();
    setMessage('');
    if (!code.trim() || !nickname.trim()) {
      setMessage('Enter both the room code and your nickname.');
      return;
    }
    setMessage(`Joining room ${code.toUpperCase()} as ${nickname}...`);
    setCode('');
    setNickname('');
  };

  return (
    <div className="rounded-2xl p-6 shadow-sm bg-gradient-to-br from-sky-50 to-indigo-50 border border-sky-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-9 w-9 rounded-lg bg-sky-200 text-sky-900 flex items-center justify-center">
          <DoorOpen className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-semibold text-slate-700">Join a Room</h2>
      </div>
      <form onSubmit={handleJoin} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-600 mb-1">Room code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. 8F2KQZ"
            className="w-full uppercase tracking-wider rounded-lg border border-sky-200 bg-white/70 px-3 py-2 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-600 mb-1">Nickname</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Your display name"
            className="w-full rounded-lg border border-sky-200 bg-white/70 px-3 py-2 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300"
          />
        </div>
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-sky-500 text-white px-4 py-2 shadow hover:bg-sky-600 transition focus:outline-none focus:ring-2 focus:ring-sky-300"
        >
          <DoorOpen className="h-4 w-4" /> Join Room
        </button>
        {message && (
          <p className="text-sm mt-2 rounded-md bg-white/70 border border-sky-200 px-3 py-2 text-sky-900">{message}</p>
        )}
      </form>
    </div>
  );
};

export default JoinRoom;
