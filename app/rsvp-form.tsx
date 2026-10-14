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
    setShowModal(true); // Open the popup modal right after clicking RSVP!

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

        <button className="w-full mt-7 rounded-full bg-[#718d9b] hover:bg-[#607b89] text-white py-3.5 text-xs font-bold tracking-[.2em] uppercase transition hover:-translate-y-0.5 cursor-pointer">
          Submit RSVP
        </button>

        {status && <p className="text-center text-sm text-[#607b89] mt-5 animate-rise">{status}</p>}
        
        {confirmed && currentGuest && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#e8a572] hover:bg-[#de935c] text-white text-xs font-bold tracking-wider uppercase transition shadow-md shadow-[#e8a572]/25 cursor-pointer"
            >
              🌸 View RSVP Confirmation Card
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

      {/* Confirmation Modal Popup matching reference picture */}
      {showModal && currentGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-rise">
          {/* Backdrop Click Dismiss */}
          <div className="fixed inset-0" onClick={() => setShowModal(false)} />

          <div className="relative w-full max-w-[340px] sm:max-w-[370px] bg-white rounded-[32px] px-6 py-8 text-center shadow-2xl border border-slate-100 z-10">
            {/* Top Close Button */}
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg leading-none p-1 cursor-pointer"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Blossom Circle Icon with Soft Halo */}
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-[#fef1f3] flex items-center justify-center border-2 border-white shadow-md shadow-pink-100">
                <svg className="w-9 h-9" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Cherry Blossom Petals */}
                  <g fill="#F8A7B5">
                    <circle cx="50" cy="30" r="16" />
                    <circle cx="69" cy="44" r="16" />
                    <circle cx="62" cy="67" r="16" />
                    <circle cx="38" cy="67" r="16" />
                    <circle cx="31" cy="44" r="16" />
                  </g>
                  {/* Petal Inner Shading */}
                  <g fill="#F28B9F">
                    <circle cx="50" cy="34" r="9" />
                    <circle cx="63" cy="44" r="9" />
                    <circle cx="58" cy="60" r="9" />
                    <circle cx="42" cy="60" r="9" />
                    <circle cx="37" cy="44" r="9" />
                  </g>
                  {/* Flower Center Pistil */}
                  <circle cx="50" cy="50" r="8" fill="#C95D74" />
                  <circle cx="50" cy="50" r="4.5" fill="#E8B44A" />
                  <circle cx="50" cy="50" r="2" fill="#8B263E" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h2 className="font-display text-3xl sm:text-4xl text-[#2c3d47] font-semibold tracking-tight mb-4">
              {currentGuest.attendance === "yes" ? "RSVP Received!" : "Response Received"}
            </h2>

            {/* Salutation */}
            <p className="font-sans font-bold text-lg text-[#202c33] leading-snug mb-3">
              Dear {currentGuest.name}{currentGuest.plusOne === "yes" && currentGuest.plusOneName ? ` & ${currentGuest.plusOneName}` : ""},
            </p>

            {/* Message */}
            <p className="text-sm text-slate-500 leading-relaxed mb-6 font-normal">
              {currentGuest.attendance === "yes" ? (
                "Thank you! We are delighted you will be celebrating with us."
              ) : (
                "Thank you for letting us know! We will miss celebrating with you, but we truly appreciate your warm wishes."
              )}
            </p>

            {/* Highlighted Confirmation Box */}
            {currentGuest.attendance === "yes" ? (
              <div className="bg-[#edf6f1] border border-[#cbe6d7] rounded-2xl p-4 sm:p-5 text-center mb-6">
                <p className="text-sm font-bold text-[#1f543b] leading-snug">
                  🌸 {currentGuest.seatsRequested || (currentGuest.plusOne === "yes" ? 2 : 1)} seat(s) confirmed{" "}
                  <span className="font-normal text-[#2b6a4c]">for April 23, 2026.</span>
                </p>
                <p className="text-xs text-[#2b6a4c] mt-1.5 leading-relaxed">
                  We look forward to seeing you at <strong>E&amp;J Grand Pavilion</strong>, Don Carlos Bukidnon!
                </p>

                {currentGuest.seat ? (
                  <div className="mt-3 pt-2.5 border-t border-[#c2e2cf] text-xs font-semibold text-[#1f543b]">
                    Assigned Seat: <span className="underline decoration-[#1f543b]">{currentGuest.seat}</span>
                  </div>
                ) : (
                  <div className="mt-3 pt-2.5 border-t border-[#c2e2cf] text-[11px] text-[#2b6a4c] italic">
                    Assigned seating details will be finalized by the couple.
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#fbf9f6] border border-[#e8ded1] rounded-2xl p-4 text-center mb-6 text-xs text-slate-600">
                Your response has been recorded. Should your plans change, feel free to update your RSVP before March 30, 2026.
              </div>
            )}

            {/* Done Button */}
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="w-36 sm:w-40 py-3 rounded-full bg-[#e8a572] hover:bg-[#de935c] active:scale-95 text-white font-bold text-sm tracking-wide shadow-md shadow-[#e8a572]/30 transition-all mx-auto block cursor-pointer"
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