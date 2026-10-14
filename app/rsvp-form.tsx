"use client";

import { FormEvent, useEffect, useState } from "react";

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

export default function RSVPForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [attendance, setAttendance] = useState<"yes" | "no">("yes");
  const [status, setStatus] = useState("");
  const [seat, setSeat] = useState("");
  const [plusOne, setPlusOne] = useState<"yes" | "no">("no");
  const [plusOneName, setPlusOneName] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentGuest, setCurrentGuest] = useState<Guest | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (!saved) return;
    const guests: Guest[] = JSON.parse(saved);
    setSeat("");
    void guests;
  }, []);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setStatus("Please enter your name.");
      return;
    }

    const guests: Guest[] = JSON.parse(localStorage.getItem(KEY) || "[]");
    const existingIndex = guests.findIndex(g => g.name.toLowerCase() === name.trim().toLowerCase());

    if (attendance === "yes" && plusOne === "yes" && !plusOneName.trim()) {
      setStatus("Please enter your guest’s full name.");
      return;
    }

    const guest: Guest = {
      id: existingIndex >= 0 ? guests[existingIndex].id : crypto.randomUUID(),
      name: name.trim(),
      contact: contact.trim(),
      attendance,
      seat: existingIndex >= 0 ? guests[existingIndex].seat : "",
      plusOne,
      plusOneName: plusOne === "yes" ? plusOneName.trim() : "",
      seatsRequested: attendance === "yes" ? (plusOne === "yes" ? 2 : 1) : 0,
      submittedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) guests[existingIndex] = guest;
    else guests.unshift(guest);

    localStorage.setItem(KEY, JSON.stringify(guests));
    setSeat(guest.seat);
    setConfirmed(true);
    setCurrentGuest(guest);
    setShowModal(true);

    setStatus(attendance === "yes"
      ? (guest.seat ? `Thank you! Your assigned seat is ${guest.seat}.` : "Thank you! Your RSVP is confirmed. Your assigned seat will be provided by the couple.")
      : "Thank you for letting us know. We’ll miss you!");
    setName("");
    setContact("");
    setPlusOne("no");
    setPlusOneName("");
  }

  function addToGoogleCalendar() {
    const start = "20260423T160000";
    const end = "20260423T180000";
    const details = "Wedding celebration of Nezeal & Shintal. RSVP confirmed.";
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Nezeal & Shintal Wedding")}&dates=${start}/${end}&ctz=Asia/Manila&location=${encodeURIComponent("E&J Grand Pavilion, Don Carlos, Bukidnon")}&details=${encodeURIComponent(details)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function downloadCalendarFile() {
    const esc = (value: string) => value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Nezeal & Shintal//Wedding RSVP//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      "UID:nezeal-shintal-wedding-20260423@rsvp.local",
      "DTSTAMP:20260101T000000Z",
      "DTSTART;TZID=Asia/Manila:20260423T160000",
      "DTEND;TZID=Asia/Manila:20260423T180000",
      `SUMMARY:${esc("Nezeal & Shintal Wedding")}`,
      `LOCATION:${esc("E&J Grand Pavilion, Don Carlos, Bukidnon")}`,
      `DESCRIPTION:${esc("Wedding celebration of Nezeal & Shintal. RSVP confirmed.")}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");
    const blob = new Blob([lines], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nezeal-shintal-wedding.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <form onSubmit={submit} className="glass paper-shadow rounded-[1.75rem] p-6 sm:p-9">
        <label className="block text-xs font-semibold tracking-wider text-slate-500 mb-2">FULL NAME</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="field" />

        <label className="block text-xs font-semibold tracking-wider text-slate-500 mb-2 mt-6">CONTACT (OPTIONAL)</label>
        <input value={contact} onChange={e => setContact(e.target.value)} placeholder="Phone or email" className="field" />

        <div className="mt-7 rounded-2xl border border-[#d9e2e6] bg-[#f4f7f8] p-5">
          <p className="text-[10px] font-bold tracking-[.22em] text-[#536b77] uppercase">WITH ASSIGNED SEATS</p>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">Your table and seat will be assigned by the couple. Please include your permitted plus-one below.</p>
        </div>

        <label className="block text-xs font-semibold tracking-wider text-slate-500 mb-3 mt-6">WILL YOU ATTEND?</label>
        <div className="grid sm:grid-cols-2 gap-3">
          <Choice active={attendance === "yes"} onClick={() => setAttendance("yes")} title="Yes, I’ll be there!" />
          <Choice active={attendance === "no"} onClick={() => setAttendance("no")} title="Sorry, I can’t attend." />
        </div>

        {attendance === "yes" && (
          <div className="mt-6">
            <label className="block text-xs font-semibold tracking-wider text-slate-500 mb-3">WILL YOU BRING ANOTHER PERSON?</label>
            <div className="grid sm:grid-cols-2 gap-3">
              <Choice active={plusOne === "no"} onClick={() => setPlusOne("no")} title="No, just me" />
              <Choice active={plusOne === "yes"} onClick={() => setPlusOne("yes")} title="Yes, I have a plus-one" />
            </div>
            {plusOne === "yes" && <input value={plusOneName} onChange={e => setPlusOneName(e.target.value)} placeholder="Plus-one full name" className="field mt-3" />}
            <p className="text-[11px] text-slate-400 mt-2">Only bring a guest if your invitation allows a plus-one.</p>
          </div>
        )}

        <button className="w-full mt-7 rounded-full bg-[#718d9b] hover:bg-[#607b89] text-white py-3.5 text-xs font-bold tracking-[.2em] uppercase transition hover:-translate-y-0.5 cursor-pointer shadow-lg shadow-slate-300/40">
          Submit RSVP
        </button>

        {status && <p className="text-center text-sm text-[#607b89] mt-5 animate-rise">{status}</p>}
        
        {confirmed && currentGuest && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#9db3c0] bg-white/70 hover:bg-white text-[#536b77] text-xs font-semibold tracking-[.15em] uppercase transition hover:-translate-y-0.5 cursor-pointer shadow-sm"
            >
              View Confirmation Card
            </button>
          </div>
        )}

        {confirmed && attendance === "yes" && (
          <div className="mt-6 rounded-3xl border border-[#d9e2e6] bg-[#f4f7f8] p-6 text-center animate-rise">
            <p className="text-[10px] tracking-[.28em] uppercase font-bold text-[#536b77]">SAVE THE DATE</p>
            <p className="font-display text-2xl text-[#536b77] mt-2">April 23, 2026 · 4:00 PM</p>
            <p className="text-xs text-slate-500 mt-1">E&amp;J Grand Pavilion · Don Carlos, Bukidnon</p>
            {seat && <div className="mt-4 rounded-2xl bg-white/70 p-4">
              <p className="text-[9px] tracking-[.25em] text-slate-500 uppercase">Assigned seat</p>
              <p className="font-display text-3xl text-[#536b77] mt-1">{seat}</p>
            </div>}
            {plusOne === "yes" && plusOneName && <p className="text-xs text-slate-500 mt-3">Plus-one: <span className="font-semibold text-[#536b77]">{plusOneName}</span></p>}
            <div className="grid sm:grid-cols-2 gap-3 mt-5">
              <button type="button" onClick={addToGoogleCalendar} className="rounded-full bg-[#718d9b] text-white py-3 px-4 text-[10px] font-bold tracking-[.16em] uppercase transition hover:-translate-y-0.5 cursor-pointer">📅 Add to Google Calendar</button>
              <button type="button" onClick={downloadCalendarFile} className="rounded-full border border-[#aabcc4] bg-white/60 text-[#536b77] py-3 px-4 text-[10px] font-bold tracking-[.16em] uppercase transition hover:-translate-y-0.5 cursor-pointer">Download .ICS</button>
            </div>
          </div>
        )}
      </form>

      {/* Confirmation Modal Popup - Perfectly Paired with Website Design */}
      {showModal && currentGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-rise">
          {/* Backdrop Click Dismiss */}
          <div className="fixed inset-0" onClick={() => setShowModal(false)} />

          <div className="relative w-full max-w-[350px] sm:max-w-[380px] bg-[#fcfbfa] rounded-[2rem] px-7 py-9 text-center paper-shadow border border-white/90 z-10">
            {/* Top Close Button */}
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg leading-none p-1 cursor-pointer transition"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Dusty Blue Monogram Wax Seal Emblem matching website stationery */}
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#e8eef0] to-[#d4e1e7] p-1 shadow-md shadow-slate-300/60 border border-white flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#718d9b] flex items-center justify-center text-white shadow-inner">
                  <span className="font-display text-xl font-medium tracking-widest text-white select-none">
                    N<span className="text-xs text-[#eedfd5] mx-0.5 font-sans font-light">&amp;</span>S
                  </span>
                </div>
              </div>
            </div>

            {/* Title */}
            <h2 className="font-display text-4xl text-[#536b77] leading-tight mb-2 tracking-tight">
              {currentGuest.attendance === "yes" ? "RSVP Received!" : "Response Received"}
            </h2>

            {/* Salutation */}
            <p className="font-display text-xl sm:text-2xl text-[#31383c] leading-snug mb-2 font-medium">
              Dear {currentGuest.name}{currentGuest.plusOne === "yes" && currentGuest.plusOneName ? ` & ${currentGuest.plusOneName}` : ""},
            </p>

            {/* Message */}
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6 font-normal">
              {currentGuest.attendance === "yes" ? (
                "Thank you! We are delighted you will be celebrating with us."
              ) : (
                "Thank you for letting us know! We will miss celebrating with you, but we truly appreciate your warm wishes."
              )}
            </p>

            {/* Highlighted Confirmation Box in Website's Dusty Blue/Beige Palette */}
            {currentGuest.attendance === "yes" ? (
              <div className="rounded-2xl border border-[#d9e2e6] bg-[#f4f7f8] p-5 text-center mb-6 shadow-xs">
                <div className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-[#536b77] uppercase tracking-wider mb-1">
                  <span className="w-4 h-4 rounded-full bg-[#718d9b] text-white flex items-center justify-center text-[10px]">✓</span>
                  <span>{currentGuest.seatsRequested || (currentGuest.plusOne === "yes" ? 2 : 1)} Seat(s) Confirmed</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  April 23, 2026 · 4:00 PM
                  <br />
                  <span className="font-medium text-[#536b77]">E&amp;J Grand Pavilion</span>, Don Carlos Bukidnon
                </p>

                {currentGuest.seat ? (
                  <div className="mt-3 pt-2.5 border-t border-[#d9e2e6] text-xs font-semibold text-[#536b77]">
                    Assigned Seat: <span className="font-display text-base font-bold text-[#31383c] ml-1">{currentGuest.seat}</span>
                  </div>
                ) : (
                  <div className="mt-3 pt-2.5 border-t border-[#d9e2e6] text-[11px] text-slate-400 italic">
                    Assigned seating details will be finalized by the couple.
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-[#d9e2e6] bg-[#f4f7f8] p-5 text-center mb-6 text-xs text-slate-500">
                Your response has been recorded. Should your plans change, feel free to update your RSVP before March 30, 2026.
              </div>
            )}

            {/* Done Button styled identically to the website's primary buttons */}
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="w-36 sm:w-40 py-3 rounded-full bg-[#718d9b] hover:bg-[#607b89] active:scale-95 text-white text-xs font-bold tracking-[.2em] uppercase shadow-lg shadow-slate-300/40 transition hover:-translate-y-0.5 mx-auto block cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Choice({ active, onClick, title }: { active: boolean; onClick: () => void; title: string }) {
  return (
    <button type="button" onClick={onClick} className={`rounded-2xl border p-4 text-left transition cursor-pointer ${active ? "border-[#7f9aa8] bg-[#e8eef0]" : "border-slate-200 bg-white/50 hover:bg-white"}`}>
      <span className={`inline-flex h-5 w-5 rounded-full border items-center justify-center mr-2 ${active ? "border-[#718d9b]" : "border-slate-300"}`}>
        {active && <span className="h-2.5 w-2.5 rounded-full bg-[#718d9b]" />}
      </span>
      <span className="text-sm">{title}</span>
    </button>
  );
}