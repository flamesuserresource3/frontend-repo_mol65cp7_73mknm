import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    setMessage('');
    if (!name.trim() || !email.trim() || !password) {
      setMessage('Please fill in all fields.');
      return;
    }
    if (password !== confirm) {
      setMessage('Passwords do not match.');
      return;
    }
    setMessage(`Welcome, ${name}! Your account has been created.`);
    setName('');
    setEmail('');
    setPassword('');
    setConfirm('');
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-2xl p-6 shadow-sm bg-gradient-to-br from-violet-50 to-fuchsia-50 border border-violet-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-9 w-9 rounded-lg bg-violet-200 text-violet-900 flex items-center justify-center">
          <UserPlus className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-semibold text-slate-700">Create your account</h2>
      </div>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-600 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-lg border border-violet-200 bg-white/70 px-3 py-2 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-600 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-violet-200 bg-white/70 px-3 py-2 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-slate-600 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-violet-200 bg-white/70 px-3 py-2 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Confirm</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-violet-200 bg-white/70 px-3 py-2 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-violet-500 text-white px-4 py-2 shadow hover:bg-violet-600 transition focus:outline-none focus:ring-2 focus:ring-violet-300"
        >
          <UserPlus className="h-4 w-4" /> Create account
        </button>
        {message && (
          <p className="text-sm mt-2 rounded-md bg-white/70 border border-violet-200 px-3 py-2 text-violet-900">{message}</p>
        )}
      </form>
    </div>
  );
};

export default Register;
