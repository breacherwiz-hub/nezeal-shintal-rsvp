"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Download, LockKeyhole, LogOut, Users, X, UserPlus, Trash2, Armchair } from "lucide-react";
import { getInvitedGuests, saveInvitedGuests, InvitedGuest } from "../invited-data";

type Guest = {
  id: string;
  name: string;
  contact: string;
  attendance: "yes" | "no";
  seat: string;
  plusOne: "yes" | "no";
  plusOneName: string;
  seatsRequested: number;
  submittedAt: string;
};

const KEY = "nezeal-shintal-rsvps";
const ADMIN_KEY = "nezeal-shintal-admin";

export default function AdminPage() {
  const [logged, setLogged] = useState(false);
  const [password, setPassword] = useState("");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [invited, setInvited] = useState<InvitedGuest[]>([]);
  const [filter, setFilter] = useState<"all" | "yes" | "no">("all");
  const [activeTab, setActiveTab] = useState<"rsvps" | "invited">("rsvps");

  // Add invited guest form
  const [newInvitedName, setNewInvitedName] = useState("");
  const [newInvitedSeats, setNewInvitedSeats] = useState(1);
  const [newInvitedPlusOne, setNewInvitedPlusOne] = useState(false);
  const [newInvitedSeat, setNewInvitedSeat] = useState("");

  useEffect(() => {
    setLogged(sessionStorage.getItem(ADMIN_KEY) === "1");
    load();
  }, []);

  function load() {
    setGuests(JSON.parse(localStorage.getItem(KEY) || "[]"));
    setInvited(getInvitedGuests());
  }

  function login(e: React.FormEvent) {
    e.preventDefault();
    if (password === "admin123") {
      sessionStorage.setItem(ADMIN_KEY, "1");
      setLogged(true);
      setPassword("");
    } else alert("Incorrect password.");
  }

  function save(list: Guest[]) {
    setGuests(list);
    localStorage.setItem(KEY, JSON.stringify(list));
  }

  function updateSeat(id: string, seat: string) {
    save(guests.map(g => g.id === id ? { ...g, seat } : g));
  }

  function remove(id: string) {
    if (!confirm("Delete this RSVP?")) return;
    save(guests.filter(g => g.id !== id));
  }

  // Add guest to master invited list
  function handleAddInvited(e: React.FormEvent) {
    e.preventDefault();
    if (!newInvitedName.trim()) return;

    const newGuest: InvitedGuest = {
      id: "inv-" + Date.now(),
      name: newInvitedName.trim(),
      category: "Guests",
      allowedSeats: Number(newInvitedSeats) || 1,
      plusOneAllowed: newInvitedPlusOne || newInvitedSeats > 1,
      assignedSeat: newInvitedSeat.trim()
    };

    const updated = [newGuest, ...invited];
    setInvited(updated);
    saveInvitedGuests(updated);

    setNewInvitedName("");
    setNewInvitedSeats(1);
    setNewInvitedPlusOne(false);
    setNewInvitedSeat("");
  }

  function handleRemoveInvited(id: string, name: string) {
    if (!confirm(`Remove "${name}" from the invited guest list? They will no longer be able to RSVP.`)) return;
    const updated = invited.filter(i => i.id !== id);
    setInvited(updated);
    saveInvitedGuests(updated);
  }

  function exportCsv() {
    const rows = [
      ["Name", "Contact", "Attendance", "Plus-one", "Seats Requested", "Assigned Seat", "Submitted At"],
      ...guests.map(g => [
        g.name,
        g.contact,
        g.attendance,
        g.plusOne === "yes" ? g.plusOneName : "None",
        g.seatsRequested || 1,
        g.seat,
        g.submittedAt
      ])
    ];
    const csv = rows.map(row => row.map(cell => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nezeal-shintal-rsvps.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = useMemo(() => filter === "all" ? guests : guests.filter(g => g.attendance === filter), [filter, guests]);
  const attending = guests.filter(g => g.attendance === "yes").length;
  const declined = guests.filter(g => g.attendance === "no").length;
  const seats = guests.reduce((sum, g) => sum + (g.attendance === "yes" ? (g.seatsRequested || (g.plusOne === "yes" ? 2 : 1)) : 0), 0);

  if (!logged) return (
    <main className="min-h-screen flex items-center justify-center bg-[#eee8df] px-5">
      <form onSubmit={login} className="glass paper-shadow rounded-[2rem] p-8 sm:p-10 w-full max-w-sm text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-[#e8eef0] flex items-center justify-center text-[#718d9b]"><LockKeyhole size={23}/></div>
        <h1 className="font-display text-4xl text-[#536b77] mt-5">Admin</h1>
        <p className="text-xs text-slate-500 mt-1">Nezeal &amp; Shintal RSVP</p>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Admin password" className="field mt-7" />
        <button className="w-full mt-4 rounded-full bg-[#718d9b] text-white py-3 text-xs font-bold tracking-widest uppercase cursor-pointer">Sign in</button>
        <p className="text-[10px] text-slate-400 mt-5">Demo password: admin123</p>
      </form>
    </main>
  );

  return (
    <main className="min-h-screen bg-[#f5f2ed]">
      <header className="bg-[#536b77] text-white px-5 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="font-display text-3xl">Nezeal &amp; Shintal</p>
            <p className="text-[9px] tracking-[.25em] uppercase opacity-70">RSVP &amp; Seating Administration</p>
          </div>
          <div className="flex gap-2">
            <button onClick={exportCsv} className="rounded-full bg-white/10 px-4 py-2 text-xs flex items-center gap-2 hover:bg-white/20 cursor-pointer">
              <Download size={15}/> Export CSV
            </button>
            <button onClick={() => {sessionStorage.removeItem(ADMIN_KEY); setLogged(false)}} className="rounded-full bg-white/10 px-4 py-2 text-xs flex items-center gap-2 hover:bg-white/20 cursor-pointer">
              <LogOut size={15}/> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-5 py-8">
        
        {/* Metric Cards */}
        <div className="grid sm:grid-cols-4 gap-4">
          <Stat icon={<Users size={19}/>} label="Invited Guests" value={invited.length}/>
          <Stat icon={<Check size={19}/>} label="Attending" value={attending}/>
          <Stat icon={<X size={19}/>} label="Unable to attend" value={declined}/>
          <Stat icon={<Armchair size={19}/>} label="Seats Confirmed" value={seats}/>
        </div>

        {/* Tab Selector */}
        <div className="mt-8 flex gap-3 border-b border-[#d9e2e6] pb-3">
          <button
            onClick={() => setActiveTab("rsvps")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition cursor-pointer ${
              activeTab === "rsvps"
                ? "bg-[#718d9b] text-white shadow-sm"
                : "bg-white/60 text-[#536b77] hover:bg-white"
            }`}
          >
            RSVP Responses ({guests.length})
          </button>
          <button
            onClick={() => setActiveTab("invited")}
            className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition cursor-pointer ${
              activeTab === "invited"
                ? "bg-[#718d9b] text-white shadow-sm"
                : "bg-white/60 text-[#536b77] hover:bg-white"
            }`}
          >
            Master Invited List ({invited.length})
          </button>
        </div>

        {/* TAB 1: RSVP RESPONSES */}
        {activeTab === "rsvps" && (
          <div className="mt-6 bg-white/70 border border-white rounded-3xl paper-shadow overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-3xl text-[#536b77]">RSVP Responses</h2>
                <p className="text-xs text-slate-400 mt-1">Assign or adjust seats directly below.</p>
              </div>
              <div className="flex rounded-full bg-slate-100 p-1">
                {(["all","yes","no"] as const).map(x => (
                  <button
                    key={x}
                    onClick={() => setFilter(x)}
                    className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-wider cursor-pointer ${
                      filter===x ? "bg-white shadow text-[#536b77]" : "text-slate-400"
                    }`}
                  >
                    {x === "all" ? "All" : x === "yes" ? "Attending" : "Declined"}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#f7f5f1] text-[10px] uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="text-left p-4">Guest</th>
                    <th className="text-left p-4">Contact</th>
                    <th className="text-left p-4">RSVP</th>
                    <th className="text-left p-4">Plus-one</th>
                    <th className="text-left p-4">Assigned Seat(s)</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="p-10 text-center text-slate-400">No RSVPs yet.</td></tr>
                  ) : (
                    filtered.map(g => (
                      <tr key={g.id} className="border-t border-slate-100 hover:bg-[#fbfaf7] transition">
                        <td className="p-4 font-medium">{g.name}</td>
                        <td className="p-4 text-slate-500">{g.contact || "—"}</td>
                        <td className="p-4">
                          {g.attendance === "yes" ? <span className="pill yes">Attending</span> : <span className="pill no">Declined</span>}
                        </td>
                        <td className="p-4">
                          {g.attendance === "yes" ? (
                            g.plusOne === "yes" ? (
                              <div>
                                <p className="font-medium">{g.plusOneName || "Plus-one"}</p>
                                <p className="text-[10px] text-slate-400">2 seats requested</p>
                              </div>
                            ) : (
                              <div>
                                <p className="text-slate-500">None</p>
                                <p className="text-[10px] text-slate-400">1 seat requested</p>
                              </div>
                            )
                          ) : "—"}
                        </td>
                        <td className="p-4">
                          {g.attendance === "yes" ? (
                            <input
                              value={g.seat}
                              onChange={e => updateSeat(g.id, e.target.value)}
                              placeholder="e.g. Table 2 • Seats 4–5"
                              className="seat-field"
                            />
                          ) : "—"}
                        </td>
                        <td className="p-4 text-right">
                          <button onClick={() => remove(g.id)} className="text-slate-400 hover:text-red-500 text-xs cursor-pointer">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: MASTER INVITED LIST */}
        {activeTab === "invited" && (
          <div className="mt-6 space-y-6">
            
            {/* Add Invited Guest Form */}
            <div className="bg-white/80 border border-white rounded-3xl p-6 paper-shadow">
              <h3 className="font-display text-2xl text-[#536b77] mb-2 flex items-center gap-2">
                <UserPlus size={20} />
                <span>Add Invited Guest</span>
              </h3>
              <p className="text-xs text-slate-400 mb-5">
                Guests added here are permitted to find their invitation and accept their RSVP.
              </p>

              <form onSubmit={handleAddInvited} className="grid sm:grid-cols-4 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1">Guest Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newInvitedName}
                    onChange={(e) => setNewInvitedName(e.target.value)}
                    placeholder="e.g. Atty. Roberto Mendoza"
                    className="field text-xs py-2.5"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1">Reserved Seats</label>
                  <select
                    value={newInvitedSeats}
                    onChange={(e) => {
                      const s = Number(e.target.value);
                      setNewInvitedSeats(s);
                      if (s > 1) setNewInvitedPlusOne(true);
                    }}
                    className="field text-xs py-2.5 bg-white"
                  >
                    <option value={1}>1 Seat (Individual)</option>
                    <option value={2}>2 Seats (With Plus-One)</option>
                    <option value={3}>3 Seats</option>
                    <option value={4}>4 Seats (Family)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1">Pre-Assigned Seat/Table</label>
                  <input
                    type="text"
                    value={newInvitedSeat}
                    onChange={(e) => setNewInvitedSeat(e.target.value)}
                    placeholder="e.g. Table 1 • Seat 1"
                    className="field text-xs py-2.5"
                  />
                </div>

                <div className="sm:col-span-4 flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#718d9b] hover:bg-[#607b89] text-white text-xs font-bold tracking-wider uppercase transition shadow-sm cursor-pointer"
                  >
                    + Add to Invited List
                  </button>
                </div>
              </form>
            </div>

            {/* Invited Guests Table */}
            <div className="bg-white/70 border border-white rounded-3xl paper-shadow overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-2xl text-[#536b77]">Invited Guests ({invited.length})</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Guests who can search and submit their RSVP.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#f7f5f1] text-[10px] uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="text-left p-4">Guest Name</th>
                      <th className="text-left p-4">Category</th>
                      <th className="text-left p-4">Reserved Seats</th>
                      <th className="text-left p-4">Pre-Assigned Seat</th>
                      <th className="text-left p-4">RSVP Status</th>
                      <th className="p-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {invited.map(inv => {
                      const guestRsvp = guests.find(g => g.name.toLowerCase() === inv.name.toLowerCase());
                      return (
                        <tr key={inv.id} className="border-t border-slate-100 hover:bg-[#fbfaf7] transition">
                          <td className="p-4 font-medium text-[#293844]">{inv.name}</td>
                          <td className="p-4 text-xs text-slate-500">{inv.category || "Guest"}</td>
                          <td className="p-4 text-xs font-semibold text-[#536b77]">
                            {inv.allowedSeats} Seat{inv.allowedSeats > 1 ? "s" : ""}
                          </td>
                          <td className="p-4 text-xs text-slate-600">{inv.assignedSeat || "To be assigned"}</td>
                          <td className="p-4 text-xs">
                            {guestRsvp ? (
                              guestRsvp.attendance === "yes" ? (
                                <span className="pill yes">Attending ({guestRsvp.seatsRequested || 1} seat)</span>
                              ) : (
                                <span className="pill no">Declined</span>
                              )
                            ) : (
                              <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] bg-amber-50 text-amber-700 border border-amber-200">
                                Awaiting Search / RSVP
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleRemoveInvited(inv.id, inv.name)}
                              className="text-slate-400 hover:text-red-500 text-xs p-1 cursor-pointer"
                              title="Delete Invited Guest"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}

function Stat({icon,label,value}:{icon:React.ReactNode;label:string;value:number}) {
  return (
    <div className="glass rounded-3xl p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-2xl bg-[#e8eef0] text-[#718d9b] flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-slate-400">{label}</p>
        <p className="font-display text-3xl text-[#536b77]">{value}</p>
      </div>
    </div>
  );
}