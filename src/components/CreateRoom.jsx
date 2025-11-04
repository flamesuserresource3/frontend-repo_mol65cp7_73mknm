import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PlusCircle, Users, Share2, Copy, Video, VideoOff, Monitor, PlayCircle, StopCircle } from 'lucide-react';

const randomCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();

const CreateRoom = ({ onRoomCreated }) => {
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState(10);
  const [message, setMessage] = useState('');
  const [created, setCreated] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [screenOn, setScreenOn] = useState(false);
  const videoRef = useRef(null);
  const screenVideoRef = useRef(null);
  const streamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const canvasRef = useRef(null);
  const frameTimerRef = useRef(null);

  const channel = useMemo(() => (roomCode ? new BroadcastChannel(`room-${roomCode}`) : null), [roomCode]);

  useEffect(() => {
    return () => {
      if (channel) channel.close();
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (screenStreamRef.current) screenStreamRef.current.getTracks().forEach(t => t.stop());
      if (frameTimerRef.current) clearInterval(frameTimerRef.current);
    };
  }, [channel]);

  useEffect(() => {
    if (!channel) return;
    channel.postMessage({ type: 'state', payload: { name, capacity, message, cameraOn, screenOn } });
  }, [name, capacity, message, cameraOn, screenOn, channel]);

  const handleCreate = (e) => {
    e.preventDefault();
    const code = randomCode();
    setRoomCode(code);
    setCreated(true);
    setMessage(message || 'Welcome to my room!');
    onRoomCreated?.(code);
  };

  const shareUrl = `${window.location.origin}?room=${roomCode}&role=viewer`;

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const toggleCamera = async () => {
    if (cameraOn) {
      setCameraOn(false);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) videoRef.current.srcObject = null;
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraOn(true);
    } catch (err) {
      console.error(err);
      setCameraOn(false);
    }
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      screenStreamRef.current = stream;
      if (screenVideoRef.current) screenVideoRef.current.srcObject = stream;
      setScreenOn(true);

      // When screen share ends from browser UI
      const [track] = stream.getVideoTracks();
      track.onended = () => stopScreenShare();

      // Begin lightweight frame broadcast (demo only)
      if (!canvasRef.current) canvasRef.current = document.createElement('canvas');
      const video = screenVideoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      frameTimerRef.current = setInterval(() => {
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
      setScreenOn(false);
    }
  };

  const stopScreenShare = () => {
    if (frameTimerRef.current) clearInterval(frameTimerRef.current);
    frameTimerRef.current = null;
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(t => t.stop());
      screenStreamRef.current = null;
    }
    if (screenVideoRef.current) screenVideoRef.current.srcObject = null;
    setScreenOn(false);
    channel?.postMessage({ type: 'screen_end' });
  };

  return (
    <section className="rounded-2xl p-5 bg-gradient-to-br from-pink-50 to-violet-50 border border-white shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <PlusCircle className="h-5 w-5 text-pink-500" />
        <h2 className="text-lg font-semibold text-slate-800">Create a Room</h2>
      </div>
      <form onSubmit={handleCreate} className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-slate-600 mb-1">Room name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="My Cozy Room"
              className="w-full rounded-lg border border-white bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-pink-200"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Capacity</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={2}
                max={100}
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-28 rounded-lg border border-white bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-violet-200"
              />
              <div className="inline-flex items-center gap-2 text-slate-600 text-sm">
                <Users className="h-4 w-4" />
                Up to {capacity} viewers
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Display message</label>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What should viewers see?"
              className="w-full rounded-lg border border-white bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <button
            type="submit"
            className="mt-2 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-pink-400 to-violet-400 text-white px-4 py-2 shadow hover:brightness-105"
          >
            <PlusCircle className="h-4 w-4" />
            Create Room
          </button>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl p-3 bg-white/70 border border-white">
            <div className="flex items-center justify-between mb-2">
              <div className="inline-flex items-center gap-2 text-slate-700">
                <Monitor className="h-4 w-4" />
                Public Display
              </div>
              <span className="text-xs text-slate-500">{created ? 'Live' : 'Idle'}</span>
            </div>
            <div className="rounded-lg h-28 flex items-center justify-center bg-gradient-to-br from-pink-100 via-violet-100 to-blue-100 text-slate-700 text-sm text-center px-3">
              {message || 'Your message will appear here'}
            </div>
          </div>

          <div className="rounded-xl p-3 bg-white/70 border border-white">
            <div className="flex items-center justify-between mb-2">
              <div className="inline-flex items-center gap-2 text-slate-700">
                {cameraOn ? <Video className="h-4 w-4 text-green-500" /> : <VideoOff className="h-4 w-4 text-slate-400" />}
                Host Camera
              </div>
              <button
                type="button"
                onClick={toggleCamera}
                className={`text-sm px-3 py-1 rounded-md border ${cameraOn ? 'bg-green-100 border-green-200 text-green-700' : 'bg-slate-100 border-slate-200 text-slate-700'}`}
              >
                {cameraOn ? 'Turn Off' : 'Turn On'}
              </button>
            </div>
            <div className="rounded-lg overflow-hidden bg-slate-100 h-36 flex items-center justify-center">
              {cameraOn ? (
                <video ref={videoRef} autoPlay playsInline muted className="h-36 w-full object-cover" />
              ) : (
                <div className="text-slate-500 text-sm">Camera is off</div>
              )}
            </div>
          </div>

          <div className="rounded-xl p-3 bg-white/70 border border-white">
            <div className="flex items-center justify-between mb-2">
              <div className="inline-flex items-center gap-2 text-slate-700">
                <Monitor className="h-4 w-4" />
                Share Screen
              </div>
              {screenOn ? (
                <button type="button" onClick={stopScreenShare} className="inline-flex items-center gap-1 text-sm px-3 py-1 rounded-md border bg-rose-50 border-rose-200 text-rose-600">
                  <StopCircle className="h-4 w-4" /> Stop
                </button>
              ) : (
                <button type="button" onClick={startScreenShare} className="inline-flex items-center gap-1 text-sm px-3 py-1 rounded-md border bg-emerald-50 border-emerald-200 text-emerald-600">
                  <PlayCircle className="h-4 w-4" /> Start
                </button>
              )}
            </div>
            <div className="rounded-lg overflow-hidden bg-slate-100 h-36 flex items-center justify-center">
              {screenOn ? (
                <video ref={screenVideoRef} autoPlay playsInline muted className="h-36 w-full object-cover" />
              ) : (
                <div className="text-slate-500 text-sm">Not sharing screen</div>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Demo streams lightweight previews to viewers using your browser. For full-quality, we can upgrade to WebRTC signaling.</p>
          </div>

          {created && (
            <div className="rounded-xl p-3 bg-white/70 border border-white">
              <div className="flex items-center gap-2 text-slate-700 mb-2">
                <Share2 className="h-4 w-4" />
                Share with viewers
              </div>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={shareUrl}
                  className="flex-1 rounded-lg border border-white bg-white/70 px-3 py-2 text-sm"
                />
                <button onClick={copyShare} type="button" className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm border hover:bg-pink-50">
                  <Copy className="h-4 w-4" />
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">Anyone with the link can open a viewer page and watch your display message and screen preview.</p>
            </div>
          )}
        </div>
      </form>
    </section>
  );
};

export default CreateRoom;
