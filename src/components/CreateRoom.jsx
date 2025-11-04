import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

const CreateRoom = () => {
  const [roomName, setRoomName] = useState('');
  const [capacity, setCapacity] = useState(4);
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    if (!roomName.trim()) {
      setMessage('Please enter a room name.');
      return;
    }
    if (capacity < 1) {
      setMessage('Capacity must be at least 1.');
      return;
    }
    // For now we just simulate creating a room
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setMessage(`Room "${roomName}" created! Share this code: ${code}`);
    setRoomName('');
    setCapacity(4);
  };

  return (
    <div className="rounded-2xl p-6 shadow-sm bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-9 w-9 rounded-lg bg-pink-200 text-pink-800 flex items-center justify-center">
          <PlusCircle className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-semibold text-slate-700">Create a Room</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-600 mb-1">Room name</label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="e.g. Pastel Hangout"
            className="w-full rounded-lg border border-pink-200 bg-white/70 px-3 py-2 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-600 mb-1">Capacity</label>
          <input
            type="number"
            min={1}
            max={50}
            value={capacity}
            onChange={(e) => setCapacity(parseInt(e.target.value) || 1)}
            className="w-full rounded-lg border border-pink-200 bg-white/70 px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-pink-500 text-white px-4 py-2 shadow hover:bg-pink-600 transition focus:outline-none focus:ring-2 focus:ring-pink-300"
        >
          <PlusCircle className="h-4 w-4" /> Create Room
        </button>
        {message && (
          <p className="text-sm mt-2 rounded-md bg-white/70 border border-pink-200 px-3 py-2 text-pink-800">{message}</p>
        )}
      </form>
    </div>
  );
};

export default CreateRoom;
