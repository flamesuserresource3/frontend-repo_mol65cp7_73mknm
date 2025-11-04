import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DoorOpen, Eye, Video, VideoOff, Monitor, PlayCircle, StopCircle } from 'lucide-react';

const JoinRoom = () => {
  const [code, setCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [joined, setJoined] = useState(false);
  const [roomState, setRoomState] = useState({ name: '', capacity: 0, message: '', cameraOn: false, screenOn: false });
  const [remoteImg, setRemoteImg] = useState('');

  const [myScreenOn, setMyScreenOn] = useState(false);
  const myScreenVideoRef = useRef(null);
  const myScreenStreamRef = useRef(null);
  const myCanvasRef = useRef(null);
  const myFrameTimerRef = useRef(null);

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
      if (type === 'screen_frame' && payload?.img) setRemoteImg(payload.img);
      if (type === 'screen_end') setRemoteImg('');
    };
    channel.addEventListener('message', onMsg);
    return () => channel.removeEventListener('message', onMsg);
  }, [channel]);

  const handleJoin = (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setJoined(true);
  };

  const startMyScreen = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      myScreenStreamRef.current = stream;
      if (myScreenVideoRef.current) myScreenVideoRef.current.srcObject = stream;
      setMyScreenOn(true);
      const [track] = stream.getVideoTracks();
      track.onended = () => stopMyScreen();

      if (!myCanvasRef.current) myCanvasRef.current = document.createElement('canvas');
      const video = myScreenVideoRef.current;
      const canvas = myCanvasRef.current;
      const ctx = canvas.getContext('2d');
      myFrameTimerRef.current = setInterval(() => {
        if (!video || !video.videoWidth) return;
        const targetW = 640;
        const scale = targetW / video.videoWidth;
        canvas.width = targetW;
        canvas.height = Math.floor(video.videoHeight * scale);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const img = canvas.toDataURL('image/jpeg', 0.5);
        channel?.postMessage({ type: 'screen_frame', payload: { img, ts: Date.now() } });
      }, 500);
    } catch (e) {
      console.error(e);
      setMyScreenOn(false);
    }
  };

  const stopMyScreen = () => {
    if (myFrameTimerRef.current) clearInterval(myFrameTimerRef.current);
    myFrameTimerRef.current = null;
    if (myScreenStreamRef.current) {
      myScreenStreamRef.current.getTracks().forEach(t => t.stop());
      myScreenStreamRef.current = null;
    }
    if (myScreenVideoRef.current) myScreenVideoRef.current.srcObject = null;
    setMyScreenOn(false);
    channel?.postMessage({ type: 'screen_end' });
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
                <Monitor className="h-4 w-4" />
                Live Screen Preview
              </div>
              <span className="text-xs text-slate-500">{remoteImg ? 'Receiving' : 'Idle'}</span>
            </div>
            <div className="rounded-lg overflow-hidden bg-slate-100 h-36 flex items-center justify-center">
              {remoteImg ? (
                <img src={remoteImg} alt="Remote screen" className="h-36 w-full object-cover" />
              ) : (
                <div className="text-slate-500 text-sm px-3 text-center">No screen being shared yet</div>
              )}
            </div>
          </div>

          <div className="rounded-xl p-3 bg-white/70 border border-white">
            <div className="flex items-center justify-between mb-2">
              <div className="inline-flex items-center gap-2 text-slate-700">
                <Monitor className="h-4 w-4" />
                Share My Screen
              </div>
              {myScreenOn ? (
                <button type="button" onClick={stopMyScreen} className="inline-flex items-center gap-1 text-sm px-3 py-1 rounded-md border bg-rose-50 border-rose-200 text-rose-600">
                  <StopCircle className="h-4 w-4" /> Stop
                </button>
              ) : (
                <button type="button" onClick={startMyScreen} className="inline-flex items-center gap-1 text-sm px-3 py-1 rounded-md border bg-emerald-50 border-emerald-200 text-emerald-600">
                  <PlayCircle className="h-4 w-4" /> Start
                </button>
              )}
            </div>
            <div className="rounded-lg overflow-hidden bg-slate-100 h-36 flex items-center justify-center">
              {myScreenOn ? (
                <video ref={myScreenVideoRef} autoPlay playsInline muted className="h-36 w-full object-cover" />
              ) : (
                <div className="text-slate-500 text-sm">Not sharing screen</div>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Your browser shares low-res previews in this demo so others in the room can see your display.</p>
          </div>

          <div className="rounded-xl p-3 bg-white/70 border border-white">
            <div className="flex items-center justify-between mb-2">
              <div className="inline-flex items-center gap-2 text-slate-700">
                {roomState.cameraOn ? <Video className="h-4 w-4 text-green-500" /> : <VideoOff className="h-4 w-4 text-slate-400" />}
                Host Camera Status
              </div>
              <span className={`text-xs ${roomState.cameraOn ? 'text-green-600' : 'text-slate-500'}`}>{roomState.cameraOn ? 'On' : 'Off'}</span>
            </div>
            <div className="rounded-lg h-20 bg-slate-100 flex items-center justify-center text-slate-500 text-sm">
              {roomState.cameraOn ? 'Camera is ON (viewer preview not available in demo)' : 'Camera is OFF'}
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default JoinRoom;
