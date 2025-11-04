import React, { useEffect, useMemo, useState } from 'react';
import { DoorOpen, Eye, Video, VideoOff } from 'lucide-react';

const JoinRoom = () => {
  const [code, setCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [joined, setJoined] = useState(false);
  const [roomState, setRoomState] = useState({ name: '', capacity: 0, message: '', cameraOn: false });

  const urlParams = new URLSearchParams(window.location.search);
  const prefillCode = urlParams.get('room') || '';
  const role = urlParams.get('role') || 'guest';

  useEffect(() => {
    if (prefillCode) setCode(prefillCode);
  }, [prefillCode]);

  const channel = useMemo(() => (joined && code ? new BroadcastChannel(`room-${code}`) : null), [joined, code]);

  useEffect(() => {
    if (!channel) return;
    const onMsg = (ev) => {
      const { type, payload } = ev.data || {};
      if (type === 'state') setRoomState(payload);
    };
    channel.addEventListener('message', onMsg);
    return () => channel.removeEventListener('message', onMsg);
  }, [channel]);

  const handleJoin = (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setJoined(true);
  };

  return (
    <section className="rounded-2xl p-5 bg-gradient-to-br from-blue-50 to-teal-50 border border-white shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <DoorOpen className="h-5 w-5 text-blue-500" />
        <h2 className="text-lg font-semibold text-slate-800">Join a Room</h2>
      </div>
      <form onSubmit={handleJoin} className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-slate-600 mb-1">Room code</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="ABC123"
              className="w-full rounded-lg border border-white bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200 tracking-widest"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Nickname</label>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Viewer name"
              className="w-full rounded-lg border border-white bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-teal-200"
            />
          </div>
          <button
            type="submit"
            className="mt-2 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-400 to-teal-400 text-white px-4 py-2 shadow hover:brightness-105"
          >
            <DoorOpen className="h-4 w-4" />
            Join
          </button>
          {role === 'viewer' && (
            <p className="text-xs text-slate-500">You opened a viewer link. Enter your nickname and join to start watching.</p>
          )}
        </div>

        <div className="space-y-3">
          <div className="rounded-xl p-3 bg-white/70 border border-white">
            <div className="flex items-center justify-between mb-2">
              <div className="inline-flex items-center gap-2 text-slate-700">
                <Eye className="h-4 w-4" />
                Viewer Display
              </div>
              <span className="text-xs text-slate-500">{joined ? 'Connected' : 'Waiting'}</span>
            </div>
            <div className="rounded-lg h-28 flex items-center justify-center bg-gradient-to-br from-blue-100 via-teal-100 to-emerald-100 text-slate-700 text-sm text-center px-3">
              {joined ? (roomState.message || 'Waiting for host message...') : 'Join to start watching the room display'}
            </div>
          </div>

          <div className="rounded-xl p-3 bg-white/70 border border-white">
            <div className="flex items-center justify-between mb-2">
              <div className="inline-flex items-center gap-2 text-slate-700">
                {roomState.cameraOn ? <Video className="h-4 w-4 text-green-500" /> : <VideoOff className="h-4 w-4 text-slate-400" />}
                Host Camera Status
              </div>
              <span className={`text-xs ${roomState.cameraOn ? 'text-green-600' : 'text-slate-500'}`}>{roomState.cameraOn ? 'On' : 'Off'}</span>
            </div>
            <div className="rounded-lg h-36 bg-slate-100 flex items-center justify-center text-slate-500 text-sm">
              {roomState.cameraOn ? 'Camera is ON (viewer preview not available in demo)' : 'Camera is OFF'}
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default JoinRoom;
