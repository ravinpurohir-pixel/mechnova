import React, { useState, useEffect } from 'react';
import { EquipmentRecord } from '../types';
import {
  ClipboardList,
  Plus,
  Search,
  Filter,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Wrench,
  Trash2,
  Edit2,
  Download,
  DollarSign,
  Building2,
  FileSpreadsheet,
  X,
  ChevronDown
} from 'lucide-react';

const INITIAL_RECORDS: EquipmentRecord[] = [
  {
    id: 'eq_1',
    name: 'Centrifugal Slurry Pump #3',
    machine_id: 'PMP-SL-301',
    category: 'Pumping Systems',
    manufacturer: 'Kirloskar Brothers',
    model: 'DB-150/32 Heavy Duty',
    serial_number: 'KB-2022-9981',
    installation_date: '2022-03-15',
    status: 'Maintenance Due',
    last_service_date: '2024-08-10',
    next_service_date: '2024-11-10',
    location: 'Pump House Bay 2',
    operator_name: 'Dinesh Sharma',
    maintenance_history: [
      {
        id: 'h1',
        date: '2024-08-10',
        fault_description: 'Shaft gland packing weeping excessive slurry',
        action_taken: 'Replaced mechanical cartridge seal and balanced impeller',
        parts_replaced: 'Silicon Carbide Mechanical Seal, Gasket kit',
        technician: 'V. Mehta',
        cost: 450
      }
    ]
  },
  {
    id: 'eq_2',
    name: 'CNC 5-Axis Milling Machine',
    machine_id: 'CNC-VF-502',
    category: 'Machine Tools',
    manufacturer: 'Haas Automation',
    model: 'VF-4SS Super Speed',
    serial_number: 'H-9812401',
    installation_date: '2021-06-20',
    status: 'Operational',
    last_service_date: '2024-09-01',
    next_service_date: '2025-03-01',
    location: 'Toolroom Shop Floor',
    operator_name: 'Amit Rathod',
    maintenance_history: [
      {
        id: 'h2',
        date: '2024-09-01',
        fault_description: 'Spindle chiller reservoir temperature alarm',
        action_taken: 'Flushed coolant lines, replaced heat exchanger filter',
        parts_replaced: 'Hydac Coolant Filter Cartridge',
        technician: 'R. Dave',
        cost: 280
      }
    ]
  },
  {
    id: 'eq_3',
    name: 'Rotary Screw Air Compressor',
    machine_id: 'CMP-AT-105',
    category: 'Compressed Air',
    manufacturer: 'Atlas Copco',
    model: 'GA 55 VSD+ Rotary',
    serial_number: 'AC-776102',
    installation_date: '2020-11-12',
    status: 'Critical',
    last_service_date: '2024-05-15',
    next_service_date: '2024-08-15',
    location: 'Utility Compressor Room',
    operator_name: 'Ketan Patel',
    maintenance_history: [
      {
        id: 'h3',
        date: '2024-05-15',
        fault_description: 'Oil separator element ΔP exceeded 0.8 bar',
        action_taken: 'Changed air-oil separator and refilled Roto-Inject fluid',
        parts_replaced: 'Air-Oil Separator, 20L Synthetic Oil',
        technician: 'V. Mehta',
        cost: 820
      }
    ]
  }
];

export const MaintenanceRecords: React.FC = () => {
  const [records, setRecords] = useState<EquipmentRecord[]>(() => {
    try {
      const saved = localStorage.getItem('mechnova_maintenance_records');
      return saved ? JSON.parse(saved) : INITIAL_RECORDS;
    } catch {
      return INITIAL_RECORDS;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedRecord, setSelectedRecord] = useState<EquipmentRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddLogOpen, setIsAddLogOpen] = useState(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formId, setFormId] = useState('');
  const [formManufacturer, setFormManufacturer] = useState('');
  const [formModel, setFormModel] = useState('');
  const [formInstallDate, setFormInstallDate] = useState('');
  const [formStatus, setFormStatus] = useState<EquipmentRecord['status']>('Operational');
  const [formNextService, setFormNextService] = useState('');
  const [formLocation, setFormLocation] = useState('');

  // Add Log form states
  const [logFault, setLogFault] = useState('');
  const [logAction, setLogAction] = useState('');
  const [logParts, setLogParts] = useState('');
  const [logTech, setLogTech] = useState('');
  const [logCost, setLogCost] = useState('150');

  useEffect(() => {
    localStorage.setItem('mechnova_maintenance_records', JSON.stringify(records));
  }, [records]);

  const handleOpenAddModal = () => {
    setFormName('');
    setFormId(`EQ-${Math.floor(100 + Math.random() * 900)}`);
    setFormManufacturer('');
    setFormModel('');
    setFormInstallDate(new Date().toISOString().split('T')[0]);
    setFormStatus('Operational');
    setFormNextService(new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0]);
    setFormLocation('Main Machine Bay');
    setIsModalOpen(true);
  };

  const handleSaveEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formId) return;

    const newRecord: EquipmentRecord = {
      id: `eq_${Date.now()}`,
      name: formName,
      machine_id: formId,
      category: 'Industrial Plant Asset',
      manufacturer: formManufacturer || 'Standard OEM',
      model: formModel || 'Series 1',
      serial_number: `SN-${Date.now().toString().slice(-6)}`,
      installation_date: formInstallDate || new Date().toISOString().split('T')[0],
      status: formStatus,
      last_service_date: new Date().toISOString().split('T')[0],
      next_service_date: formNextService || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      location: formLocation || 'Plant Floor',
      operator_name: 'Field Technician',
      maintenance_history: []
    };

    setRecords([newRecord, ...records]);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this equipment maintenance record?')) {
      setRecords(records.filter((r) => r.id !== id));
      if (selectedRecord?.id === id) setSelectedRecord(null);
    }
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord || !logFault) return;

    const newHistory = {
      id: `log_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      fault_description: logFault,
      action_taken: logAction || 'Inspected and lubricated',
      parts_replaced: logParts || 'None',
      technician: logTech || 'Plant Engineer',
      cost: parseFloat(logCost) || 0
    };

    const updated = {
      ...selectedRecord,
      last_service_date: newHistory.date,
      maintenance_history: [newHistory, ...selectedRecord.maintenance_history]
    };

    setRecords(records.map((r) => (r.id === selectedRecord.id ? updated : r)));
    setSelectedRecord(updated);
    setIsAddLogOpen(false);
    setLogFault('');
    setLogAction('');
    setLogParts('');
  };

  const exportCSV = () => {
    const headers = ['Machine ID', 'Name', 'Manufacturer', 'Model', 'Status', 'Next Service', 'Location'];
    const rows = records.map((r) => [
      r.machine_id,
      `"${r.name}"`,
      `"${r.manufacturer}"`,
      `"${r.model}"`,
      r.status,
      r.next_service_date,
      `"${r.location}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MechNova_Equipment_Fleet_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.machine_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const dueCount = records.filter((r) => r.status === 'Maintenance Due' || r.status === 'Critical').length;
  const totalCost = records.reduce((acc, r) => acc + r.maintenance_history.reduce((hAcc, h) => hAcc + h.cost, 0), 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white">Maintenance Management</h1>
            <span className="text-[10px] font-bold bg-cyan-accent/15 border border-cyan-accent/30 text-cyan-accent px-2 py-0.5 rounded-full uppercase">
              Fleet Records
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Track industrial equipment assets, fault logs, parts replaced, service schedules, and repair costs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 bg-navy-900 hover:bg-navy-800 border border-navy-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-accent" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2 rounded-xl shadow-glow-primary transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Equipment</span>
          </button>
        </div>
      </div>

      {/* Overdue Alert Banner if any equipment needs attention */}
      {dueCount > 0 && (
        <div className="bg-amber-500/15 border border-amber-500/40 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              <strong className="text-amber-300">{dueCount} machine(s)</strong> require immediate preventive maintenance or corrective service inspection.
            </span>
          </div>
          <button
            onClick={() => setStatusFilter('Maintenance Due')}
            className="text-xs font-bold text-amber-300 underline shrink-0 cursor-pointer"
          >
            Filter Due Units
          </button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-navy-900 border border-navy-700 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 text-cyan-accent flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Total Registered Assets</span>
            <p className="text-xl font-black text-white">{records.length} Units</p>
          </div>
        </div>

        <div className="bg-navy-900 border border-navy-700 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Service Due / Critical</span>
            <p className="text-xl font-black text-amber-400">{dueCount} Units</p>
          </div>
        </div>

        <div className="bg-navy-900 border border-navy-700 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Total Recorded Maintenance</span>
            <p className="text-xl font-black text-emerald-400">${totalCost.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by equipment name, ID, or manufacturer..."
            className="w-full bg-navy-900 border border-navy-700 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-accent"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'Operational', 'Maintenance Due', 'Critical', 'Under Repair'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-cyan-accent/20 border-cyan-accent text-cyan-accent font-bold'
                  : 'bg-navy-900 border-navy-800 text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecords.map((eq) => {
          const statusColors = {
            Operational: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
            'Maintenance Due': 'bg-amber-500/15 border-amber-500/40 text-amber-300',
            Critical: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
            'Under Repair': 'bg-purple-500/15 border-purple-500/40 text-purple-300'
          };

          return (
            <div
              key={eq.id}
              onClick={() => setSelectedRecord(eq)}
              className="bg-navy-900 hover:bg-navy-850 border border-navy-700 hover:border-cyan-accent/50 rounded-2xl p-5 shadow-card-soft cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold bg-navy-950 border border-navy-800 text-cyan-accent px-2 py-0.5 rounded">
                    {eq.machine_id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                      statusColors[eq.status]
                    }`}
                  >
                    {eq.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-cyan-accent transition-colors">
                  {eq.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{eq.manufacturer} • {eq.model}</p>

                <div className="mt-4 pt-3 border-t border-navy-800 space-y-1.5 text-[11px] text-slate-300 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="text-white">{eq.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Next Service:</span>
                    <span className="text-cyan-accent font-bold">{eq.next_service_date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">History Logs:</span>
                    <span className="text-white">{eq.maintenance_history.length} records</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-navy-800 flex items-center justify-between text-xs">
                <span className="text-cyan-accent font-semibold group-hover:underline">View History & Add Log</span>
                <button
                  onClick={(e) => handleDelete(eq.id, e)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Equipment Detail Modal with Maintenance History */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-navy-700 max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-navy-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-accent bg-cyan-accent/15 px-2 py-0.5 rounded uppercase font-bold">
                  {selectedRecord.machine_id}
                </span>
                <h2 className="text-lg font-bold text-white mt-1">{selectedRecord.name}</h2>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-navy-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 flex-1 scrollbar-thin text-xs">
              {/* Asset Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-navy-950 p-4 rounded-xl border border-navy-800">
                <div>
                  <span className="text-slate-400 text-[10px]">Manufacturer:</span>
                  <p className="font-bold text-white mt-0.5">{selectedRecord.manufacturer}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Model:</span>
                  <p className="font-bold text-white mt-0.5">{selectedRecord.model}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Installation Date:</span>
                  <p className="font-bold text-white mt-0.5">{selectedRecord.installation_date}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Current Status:</span>
                  <p className="font-bold text-cyan-accent mt-0.5">{selectedRecord.status}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Next Scheduled Service:</span>
                  <p className="font-bold text-amber-300 mt-0.5">{selectedRecord.next_service_date}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Location:</span>
                  <p className="font-bold text-white mt-0.5">{selectedRecord.location}</p>
                </div>
              </div>

              {/* Maintenance History Timeline */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Wrench className="w-4 h-4 text-cyan-accent" />
                    <span>Maintenance History Log ({selectedRecord.maintenance_history.length})</span>
                  </h3>
                  <button
                    onClick={() => setIsAddLogOpen(true)}
                    className="flex items-center gap-1 bg-primary hover:bg-primary-hover text-white px-3 py-1 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log Service</span>
                  </button>
                </div>

                {selectedRecord.maintenance_history.length === 0 ? (
                  <div className="bg-navy-950 p-6 rounded-xl border border-navy-800 text-center text-slate-400">
                    No repair or maintenance events recorded yet for this equipment.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedRecord.maintenance_history.map((log) => (
                      <div key={log.id} className="bg-navy-950 p-4 rounded-xl border border-navy-800 space-y-2">
                        <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                          <span className="font-bold text-cyan-accent">{log.date}</span>
                          <span>Technician: {log.technician} • Cost: ${log.cost}</span>
                        </div>
                        <div>
                          <span className="text-rose-300 font-semibold">Fault: </span>
                          <span className="text-slate-200">{log.fault_description}</span>
                        </div>
                        <div>
                          <span className="text-emerald-300 font-semibold">Corrective Action: </span>
                          <span className="text-slate-200">{log.action_taken}</span>
                        </div>
                        {log.parts_replaced && (
                          <div className="text-[11px] text-slate-400">
                            <span className="font-semibold text-slate-300">Parts: </span>
                            {log.parts_replaced}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Equipment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-navy-700 max-w-md w-full rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-navy-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Add Equipment Asset</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEquipment} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Equipment Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Hydraulic Press 200T"
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Machine Tag ID *</label>
                  <input
                    type="text"
                    required
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-accent"
                  >
                    <option value="Operational">Operational</option>
                    <option value="Maintenance Due">Maintenance Due</option>
                    <option value="Critical">Critical</option>
                    <option value="Under Repair">Under Repair</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Manufacturer</label>
                  <input
                    type="text"
                    value={formManufacturer}
                    onChange={(e) => setFormManufacturer(e.target.value)}
                    placeholder="e.g. Siemens"
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Model</label>
                  <input
                    type="text"
                    value={formModel}
                    onChange={(e) => setFormModel(e.target.value)}
                    placeholder="e.g. S-200"
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Next Service Date</label>
                  <input
                    type="date"
                    value={formNextService}
                    onChange={(e) => setFormNextService(e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Plant Location</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. Bay 4"
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-2.5 rounded-xl shadow-glow-primary transition-all cursor-pointer"
                >
                  Save Equipment Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Maintenance Log Event Modal */}
      {isAddLogOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-navy-700 max-w-md w-full rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-navy-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Log Maintenance Event</h2>
              <button onClick={() => setIsAddLogOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLog} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Fault Description *</label>
                <input
                  type="text"
                  required
                  value={logFault}
                  onChange={(e) => setLogFault(e.target.value)}
                  placeholder="e.g. Bearing overheating / Seal drip"
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-accent"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Corrective Action Taken</label>
                <textarea
                  rows={2}
                  value={logAction}
                  onChange={(e) => setLogAction(e.target.value)}
                  placeholder="e.g. Flushed grease, aligned coupling with laser..."
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-accent resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Parts Replaced</label>
                <input
                  type="text"
                  value={logParts}
                  onChange={(e) => setLogParts(e.target.value)}
                  placeholder="e.g. 6208 Deep groove bearing, O-ring kit"
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Technician Name</label>
                  <input
                    type="text"
                    value={logTech}
                    onChange={(e) => setLogTech(e.target.value)}
                    placeholder="e.g. V. Patel"
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Service Cost ($)</label>
                  <input
                    type="number"
                    value={logCost}
                    onChange={(e) => setLogCost(e.target.value)}
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-accent"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-2.5 rounded-xl shadow-glow-primary transition-all cursor-pointer"
                >
                  Save Maintenance Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
