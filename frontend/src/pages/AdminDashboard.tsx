import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  Shield,
  Users,
  Building,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const fleetData = [
    { month: 'Jan', cost: 1200, repairs: 4 },
    { month: 'Feb', cost: 1900, repairs: 6 },
    { month: 'Mar', cost: 850, repairs: 2 },
    { month: 'Apr', cost: 2400, repairs: 8 },
    { month: 'May', cost: 1600, repairs: 5 },
    { month: 'Jun', cost: 2100, repairs: 7 },
  ];

  const statusDistribution = [
    { name: 'Operational', value: 18, color: '#10B981' },
    { name: 'Maintenance Due', value: 4, color: '#F59E0B' },
    { name: 'Critical', value: 1, color: '#EF4444' },
    { name: 'Under Repair', value: 1, color: '#8B5CF6' },
  ];

  const teamMembers = [
    { name: 'Rajesh Varma', role: 'Chief Mechanical Engineer', email: 'rajesh@plant.io', access: 'Administrator' },
    { name: 'Priya Joshi', role: 'Vibration Analyst Specialist', email: 'priya@plant.io', access: 'Reliability Engineer' },
    { name: 'Vikram Mehta', role: 'Senior Maintenance Technician', email: 'vikram@plant.io', access: 'Maintenance Tech' },
    { name: 'Anil Shah', role: 'Condition Monitoring Trainee', email: 'anil@plant.io', access: 'Viewer / Student' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white">Fleet Operations & Admin Control</h1>
            <span className="text-[10px] font-bold bg-primary/20 border border-primary/40 text-cyan-accent px-2 py-0.5 rounded-full uppercase">
              Role: Administrator
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Plant-wide machinery reliability health, maintenance expenditure analytics, and role-based access management.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-navy-900 border border-navy-700 rounded-2xl p-4">
          <span className="text-[11px] text-slate-400 font-medium">Fleet Reliability Score</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">94.8%</p>
          <span className="text-[10px] text-emerald-400 font-mono mt-1 block">▲ +2.1% this quarter</span>
        </div>

        <div className="bg-navy-900 border border-navy-700 rounded-2xl p-4">
          <span className="text-[11px] text-slate-400 font-medium">Total Machines</span>
          <p className="text-2xl font-black text-white mt-1">24 Assets</p>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">4 Bays Monitored</span>
        </div>

        <div className="bg-navy-900 border border-navy-700 rounded-2xl p-4">
          <span className="text-[11px] text-slate-400 font-medium">YTD Maintenance Spend</span>
          <p className="text-2xl font-black text-cyan-accent mt-1">$10,050</p>
          <span className="text-[10px] text-cyan-accent font-mono mt-1 block">Within budget limit</span>
        </div>

        <div className="bg-navy-900 border border-navy-700 rounded-2xl p-4">
          <span className="text-[11px] text-slate-400 font-medium">Active Tech Team</span>
          <p className="text-2xl font-black text-white mt-1">4 Engineers</p>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">All certified</span>
        </div>
      </div>

      {/* Recharts Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Maintenance Expenditure Bar Chart */}
        <div className="bg-navy-900 border border-navy-700 rounded-2xl p-5 shadow-card-soft">
          <h2 className="text-sm font-bold text-white mb-1">Monthly Maintenance Expenditure ($)</h2>
          <p className="text-xs text-slate-400 mb-4">Historical 6-month repair & replacement parts expenses</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fleetData}>
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B1F3B', borderColor: '#1E4B8B', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                />
                <Bar dataKey="cost" fill="#007BFF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fleet Equipment Status Distribution Pie Chart */}
        <div className="bg-navy-900 border border-navy-700 rounded-2xl p-5 shadow-card-soft">
          <h2 className="text-sm font-bold text-white mb-1">Equipment Operational Status</h2>
          <p className="text-xs text-slate-400 mb-4">Distribution across total registered industrial assets</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B1F3B', borderColor: '#1E4B8B', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                />
                <Legend
                  formatter={(value) => <span className="text-xs text-slate-300 font-medium">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Authorized Organization Users Table */}
      <div className="bg-navy-900 border border-navy-700 rounded-2xl p-5 shadow-card-soft">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-accent" />
            <span>Organization Technical Staff & Roles</span>
          </h2>
          <span className="text-xs text-slate-400">4 Active Licenses</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-navy-800 text-slate-400 text-[11px] uppercase font-mono">
                <th className="py-2.5 px-3">Engineer / Staff Name</th>
                <th className="py-2.5 px-3">Discipline Role</th>
                <th className="py-2.5 px-3">Email</th>
                <th className="py-2.5 px-3">Access Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60 text-slate-200">
              {teamMembers.map((m, idx) => (
                <tr key={idx} className="hover:bg-navy-800/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/20 text-cyan-accent flex items-center justify-center font-bold text-[10px]">
                      {m.name.charAt(0)}
                    </div>
                    <span>{m.name}</span>
                  </td>
                  <td className="py-3 px-3">{m.role}</td>
                  <td className="py-3 px-3 font-mono text-slate-400">{m.email}</td>
                  <td className="py-3 px-3">
                    <span className="bg-navy-950 border border-navy-800 px-2 py-0.5 rounded text-[11px] text-cyan-accent font-semibold">
                      {m.access}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
