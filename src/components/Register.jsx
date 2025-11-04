import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setMsg('Please complete all fields.');
      return;
    }
    if (password !== confirm) {
      setMsg('Passwords do not match.');
      return;
    }
    setMsg('Account created! (Demo only)');
  };

  return (
    <section className="rounded-2xl p-6 bg-gradient-to-br from-rose-50 via-fuchsia-50 to-indigo-50 border border-white shadow-sm max-w-xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <UserPlus className="h-5 w-5 text-rose-500" />
        <h2 className="text-lg font-semibold text-slate-800">Create your account</h2>
      </div>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm text-slate-600 mb-1">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-white bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-rose-200" />
        </div>
        <div>
          <label className="block text-sm text-slate-600 mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-white bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-fuchsia-200" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-slate-600 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-white bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200" />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Confirm</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full rounded-lg border border-white bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200" />
          </div>
        </div>
        <button type="submit" className="w-full rounded-lg bg-gradient-to-r from-rose-400 to-indigo-400 text-white px-4 py-2 shadow hover:brightness-105">Register</button>
        {msg && (
          <div className={`text-sm ${msg.includes('created') ? 'text-green-600' : 'text-rose-600'}`}>{msg}</div>
        )}
      </form>
    </section>
  );
};

export default Register;
