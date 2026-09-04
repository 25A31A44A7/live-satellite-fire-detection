'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Terminal, 
  RefreshCw, 
  Activity, 
  Flame, 
  Database, 
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/components/AuthContext';

export default function AdminPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [usersRes, logsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/logs'),
      ]);

      if (usersRes.ok) {
        const uData = await usersRes.json();
        setUsers(uData.users || []);
      }
      if (logsRes.ok) {
        const lData = await logsRes.json();
        setLogs(lData.logs || []);
      }
    } catch (e) {
      console.error('Admin data fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const triggerIngestion = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/data/refresh', { method: 'POST' });
      if (res.ok) {
        const d = await res.json();
        setMsg(`Ingestion completed: ${d.count} records synchronized.`);
        await fetchAdminData();
      }
    } catch (e) {
      setMsg('Failed to trigger ingestion.');
    } finally {
      setRefreshing(false);
      setTimeout(() => setMsg(null), 4000);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            <span>ADMINISTRATIVE CONTROL CONSOLE</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            System audit trail, operator user credentials, and manual NASA pipeline overrides
          </p>
        </div>

        <button
          onClick={triggerIngestion}
          disabled={refreshing}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Triggering...' : 'Force Pipeline Re-Sync'}</span>
        </button>
      </div>

      {msg && (
        <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{msg}</span>
        </div>
      )}

      {/* Users & Logs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: User Directory */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Registered Operations Terminals ({users.length})</span>
          </h3>

          <div className="divide-y divide-slate-800/80 max-h-80 overflow-y-auto">
            {users.map((u) => (
              <div key={u.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">{u.name}</div>
                  <div className="text-[11px] text-slate-400">{u.email}</div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    u.role === 'ADMIN' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {u.role}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Joined: {new Date(u.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: System Audit Trail */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-orange-400" />
            <span>System Pipeline Audit Trail</span>
          </h3>

          <div className="divide-y divide-slate-800/80 max-h-80 overflow-y-auto font-mono text-xs">
            {logs.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">No audit entries.</div>
            ) : (
              logs.map((l) => (
                <div key={l.id} className="py-2.5 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      l.level === 'SUCCESS' ? 'text-emerald-400 bg-emerald-500/10' :
                      l.level === 'WARN' ? 'text-amber-400 bg-amber-500/10' :
                      'text-cyan-400 bg-cyan-500/10'
                    }`}>
                      [{l.source}] {l.level}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(l.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">{l.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
