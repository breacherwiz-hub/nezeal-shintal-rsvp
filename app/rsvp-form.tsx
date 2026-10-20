"use client";

import { FormEvent, useEffect, useState } from "react";
import { getInvitedGuests, InvitedGuest } from "./invited-data";
import { Search, UserCheck, MessageCircle, AlertCircle, Sparkles } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [invitedList, setInvitedList] = useState<InvitedGuest[]>([]);
  const [selectedInvitedGuest, setSelectedInvitedGuest] = useState<InvitedGuest | null>(null);
  
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [attendance, setAttendance] = useState<"yes" | "no">("yes");
  const [status, setStatus] = useState("");
  const [seat, setSeat] = useState("");
  const [plusOne, setPlusOne] = useState<"yes" | "no">("no");
  const [plusOneName, setPlusOneName] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  
  // Modals
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showNotFoundModal, setShowNotFoundModal] = useState(false);
  const [notFoundQuery, setNotFoundQuery] = useState("");
  const [currentGuest, setCurrentGuest] = useState<Guest | null>(null);

  useEffect(() => {
    setInvitedList(getInvitedGuests());
  }, []);

  // Search invited guest list
  function handleSearch(e?: FormEvent) {
    if (e) e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setStatus("Please type your name to search.");
      return;
    }

    setStatus("");
    const currentInvited = getInvitedGuests();
    setInvitedList(currentInvited);

    // Also check existing RSVPs
    const savedRsvps: Guest[] = JSON.parse(localStorage.getItem(KEY) || "[]");

    // Search match
    const match = currentInvited.find(g => 
      g.name.toLowerCase() === q ||
      g.name.toLowerCase().includes(q) ||
      q.includes(g.name.toLowerCase())
    ) || (savedRsvps.find(g => 
      g.name.toLowerCase() === q ||
      g.name.toLowerCase().includes(q) ||
      q.includes(g.name.toLowerCase())
    ) ? {
      id: "from-rsvp",
      name: savedRsvps.find(g => g.name.toLowerCase().includes(q) || q.includes(g.name.toLowerCase()))!.name,
      allowedSeats: savedRsvps.find(g => g.name.toLowerCase().includes(q) || q.includes(g.name.toLowerCase()))!.plusOne === "yes" ? 2 : 1,
      plusOneAllowed: true,
      assignedSeat: savedRsvps.find(g => g.name.toLowerCase().includes(q) || q.includes(g.name.toLowerCase()))!.seat || ""
    } : null);

    if (match) {
      // Invited guest found!
      setSelectedInvitedGuest(match);
      setName(match.name);
      
      // Check if they previously submitted an RSVP
      const existingRsvp = savedRsvps.find(r => r.name.toLowerCase() === match.name.toLowerCase());
      if (existingRsvp) {
        setAttendance(existingRsvp.attendance);
        setContact(existingRsvp.contact || "");
        setPlusOne(existingRsvp.plusOne || "no");
        setPlusOneName(existingRsvp.plusOneName || "");
        setSeat(existingRsvp.seat || match.assignedSeat || "");
      } else {
        setSeat(match.assignedSeat || "");
        if (match.allowedSeats > 1 && match.plusOneAllowed) {
          setPlusOne("no");
        }
      }
    } else {
      // NOT INVITED -> Open Contact Couple Modal
      setSelectedInvitedGuest(null);
      setNotFoundQuery(searchQuery.trim());
      setShowNotFoundModal(true);
    }
  }

  function handleResetSearch() {
    setSelectedInvitedGuest(null);
    setSearchQuery("");
    setName("");
    setContact("");
    setPlusOne("no");
    setPlusOneName("");
    setStatus("");
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const guestNameToVerify = name.trim() || searchQuery.trim();
    if (!guestNameToVerify) {
      setStatus("Please enter or search your name.");
      return;
    }

    // Verify if guest is invited
    const currentInvited = getInvitedGuests();
    const savedRsvps: Guest[] = JSON.parse(localStorage.getItem(KEY) || "[]");
    const q = guestNameToVerify.toLowerCase();

    const isInvited = currentInvited.some(g => 
      g.name.toLowerCase() === q ||
      g.name.toLowerCase().includes(q) ||
      q.includes(g.name.toLowerCase())
    ) || savedRsvps.some(g => 
      g.name.toLowerCase() === q ||
      g.name.toLowerCase().includes(q) ||
      q.includes(g.name.toLowerCase())
    );

    if (!isInvited) {
      setNotFoundQuery(guestNameToVerify);
      setShowNotFoundModal(true);
      return;
    }

    if (attendance === "yes" && plusOne === "yes" && !plusOneName.trim()) {
      setStatus("Please enter your guest’s full name.");
      return;
    }

    const guests: Guest[] = JSON.parse(localStorage.getItem(KEY) || "[]");
    const existingIndex = guests.findIndex(g => g.name.toLowerCase() === guestNameToVerify.toLowerCase());

    const guest: Guest = {
      id: existingIndex >= 0 ? guests[existingIndex].id : crypto.randomUUID(),
      name: guestNameToVerify,
      contact: contact.trim(),
      attendance,
      seat: existingIndex >= 0 && guests[existingIndex].seat ? guests[existingIndex].seat : (selectedInvitedGuest?.assignedSeat || seat || ""),
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
    setShowSuccessModal(true);

    setStatus(attendance === "yes"
      ? (guest.seat ? `Thank you! Your assigned seat is ${guest.seat}.` : "Thank you! Your RSVP is confirmed. Your assigned seat will be provided by the couple.")
      : "Thank you for letting us know. We’ll miss you!");
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
      <div className="glass paper-shadow rounded-[1.75rem] p-6 sm:p-9 space-y-6">
        
        {/* STEP 1: Search Invitation Section */}
        {!selectedInvitedGuest ? (
          <div>
            <div className="text-center mb-5">
              <span className="text-[10px] font-bold tracking-[.25em] text-[#536b77] uppercase bg-[#e8eef0] px-3.5 py-1 rounded-full">
                Step 1 · Guest Verification
              </span>
              <h3 className="font-display text-2xl sm:text-3xl text-[#536b77] mt-3">
                Find Your Invitation
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Please enter your name below to verify your invitation and proceed to RSVP.
              </p>
            </div>

            <form onSubmit={handleSearch} className="space-y-3">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type your first or last name..."
                  className="field pr-28 text-sm"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-5 py-2.5 rounded-xl bg-[#718d9b] hover:bg-[#607b89] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Search size={14} />
                  <span>Search</span>
                </button>
              </div>

              {/* Sample guest hints */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 text-[11px] text-slate-400">
                <span>Quick check:</span>
                {["Roberto Mendoza", "Maria Clara Gomez", "xebec & kim"].map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => {
                      setSearchQuery(sample);
                      setTimeout(() => {
                        const currentInvited = getInvitedGuests();
                        const match = currentInvited.find(g => g.name.toLowerCase().includes(sample.toLowerCase()));
                        if (match) {
                          setSelectedInvitedGuest(match);
                          setName(match.name);
                          setSeat(match.assignedSeat || "");
                        }
                      }, 50);
                    }}
                    className="px-2.5 py-0.5 rounded-full bg-white/70 hover:bg-white text-[#536b77] border border-[#d9e2e6] text-[10px] transition cursor-pointer"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </form>
          </div>
        ) : (
          /* STEP 2: Invitation Verified & RSVP Form */
          <form onSubmit={submit} className="animate-rise space-y-6">
            
            {/* Verified Guest Welcome Banner */}
            <div className="rounded-2xl border border-[#cbe6d7] bg-[#edf6f1] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[#718d9b] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <UserCheck size={18} />
                </div>
                <div>
                  <div className="text-[10px] font-bold tracking-widest text-[#23583e] uppercase">
                    Invitation Confirmed
                  </div>
                  <h4 className="font-display text-xl sm:text-2xl text-[#1f4934] leading-tight">
                    {selectedInvitedGuest.name}
                  </h4>
                  <p className="text-xs text-[#2d6a4f] mt-0.5">
                    Reserved for {selectedInvitedGuest.allowedSeats || 1} guest(s) {selectedInvitedGuest.assignedSeat ? `• ${selectedInvitedGuest.assignedSeat}` : ""}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetSearch}
                className="text-[11px] text-[#536b77] hover:underline font-semibold self-start sm:self-center"
              >
                Change Name / Search Again
              </button>
            </div>

            {/* Attendance Question */}
            <div>
              <label className="block text-xs font-semibold tracking-wider text-slate-500 mb-2.5">
                WILL YOU ATTEND OUR WEDDING?
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                <Choice active={attendance === "yes"} onClick={() => setAttendance("yes")} title="Yes, I’ll be there!" />
                <Choice active={attendance === "no"} onClick={() => setAttendance("no")} title="Sorry, I can’t attend." />
              </div>
            </div>

            {/* Plus One (if allowed or 2 seats reserved) */}
            {attendance === "yes" && (selectedInvitedGuest.plusOneAllowed || selectedInvitedGuest.allowedSeats > 1) && (
              <div className="pt-1">
                <label className="block text-xs font-semibold tracking-wider text-slate-500 mb-2.5">
                  WILL YOU BRING YOUR PERMITTED COMPANION?
                </label>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Choice active={plusOne === "no"} onClick={() => setPlusOne("no")} title="No, just me" />
                  <Choice active={plusOne === "yes"} onClick={() => setPlusOne("yes")} title="Yes, bringing my companion" />
                </div>
                {plusOne === "yes" && (
                  <input
                    value={plusOneName}
                    onChange={e => setPlusOneName(e.target.value)}
                    placeholder="Companion's full name (for assigned seat)"
                    className="field mt-3 text-sm"
                  />
                )}
                <p className="text-[11px] text-slate-400 mt-2">
                  Seating is assigned for each confirmed companion.
                </p>
              </div>
            )}

            {/* Contact details */}
            <div>
              <label className="block text-xs font-semibold tracking-wider text-slate-500 mb-1.5">
                CONTACT NUMBER (FOR UPDATES &amp; USHERING)
              </label>
              <input
                value={contact}
                onChange={e => setContact(e.target.value)}
                placeholder="+63 917 123 4567 or email"
                className="field text-sm"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-full bg-[#718d9b] hover:bg-[#607b89] text-white py-3.5 text-xs font-bold tracking-[.2em] uppercase transition hover:-translate-y-0.5 cursor-pointer shadow-lg shadow-slate-300/40"
            >
              Submit RSVP
            </button>

          </form>
        )}

        {status && <p className="text-center text-sm text-[#607b89] mt-3 animate-rise">{status}</p>}

        {confirmed && currentGuest && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setShowSuccessModal(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#9db3c0] bg-white/70 hover:bg-white text-[#536b77] text-xs font-semibold tracking-[.15em] uppercase transition hover:-translate-y-0.5 cursor-pointer shadow-sm"
            >
              View RSVP Confirmation Card
            </button>
          </div>
        )}

        {confirmed && attendance === "yes" && (
          <div className="mt-6 rounded-3xl border border-[#d9e2e6] bg-[#f4f7f8] p-6 text-center animate-rise">
            <p className="text-[10px] tracking-[.28em] uppercase font-bold text-[#536b77]">SAVE THE DATE</p>
            <p className="font-display text-2xl text-[#536b77] mt-2">April 23, 2026 · 4:00 PM</p>
            <p className="text-xs text-slate-500 mt-1">E&amp;J Grand Pavilion · Don Carlos, Bukidnon</p>
            {seat && (
              <div className="mt-4 rounded-2xl bg-white/70 p-4">
                <p className="text-[9px] tracking-[.25em] text-slate-500 uppercase">Assigned seat</p>
                <p className="font-display text-3xl text-[#536b77] mt-1">{seat}</p>
              </div>
            )}
            {plusOne === "yes" && plusOneName && (
              <p className="text-xs text-slate-500 mt-3">Plus-one: <span className="font-semibold text-[#536b77]">{plusOneName}</span></p>
            )}
            <div className="grid sm:grid-cols-2 gap-3 mt-5">
              <button type="button" onClick={addToGoogleCalendar} className="rounded-full bg-[#718d9b] text-white py-3 px-4 text-[10px] font-bold tracking-[.16em] uppercase transition hover:-translate-y-0.5 cursor-pointer">📅 Add to Google Calendar</button>
              <button type="button" onClick={downloadCalendarFile} className="rounded-full border border-[#aabcc4] bg-white/60 text-[#536b77] py-3 px-4 text-[10px] font-bold tracking-[.16em] uppercase transition hover:-translate-y-0.5 cursor-pointer">Download .ICS</button>
            </div>
          </div>
        )}

      </div>

      {/* POPUP MODAL 1: NOT INVITED / CONTACT COUPLE MODAL (Exact design pair with website) */}
      {showNotFoundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-rise">
          <div className="fixed inset-0" onClick={() => setShowNotFoundModal(false)} />

          <div className="relative w-full max-w-[360px] sm:max-w-[400px] bg-[#fcfbfa] rounded-[2rem] px-7 py-8 text-center paper-shadow border border-white/90 z-10">
            {/* Top Close Button */}
            <button
              type="button"
              onClick={() => setShowNotFoundModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg leading-none p-1 cursor-pointer transition"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Top Emblem: Soft Dusty Blue Alert Badge */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-[#e8eef0] border-2 border-white shadow-md shadow-slate-200 flex items-center justify-center text-[#718d9b]">
                <MessageCircle size={28} />
              </div>
            </div>

            {/* Title */}
            <h2 className="font-display text-3xl sm:text-4xl text-[#536b77] leading-tight mb-2 tracking-tight">
              Invitation Not Found
            </h2>

            {/* Subtitle / Searched Name */}
            <p className="font-display text-lg text-[#31383c] leading-snug mb-3 font-semibold">
              We couldn’t find “{notFoundQuery}” on the guest list.
            </p>

            {/* Explanation Note */}
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-5 font-normal">
              Due to reserved seating and pavilion capacity at <strong>E&amp;J Grand Pavilion</strong>, our guest list is strictly pre-allocated.
              <br className="hidden sm:inline" /> If you received an invitation or believe this is an error, please kindly contact the couple directly.
            </p>

            {/* Couple Contact Box */}
            <div className="rounded-2xl border border-[#d9e2e6] bg-[#f4f7f8] p-4 text-center mb-6">
              <p className="text-[11px] font-bold tracking-widest uppercase text-[#536b77] mb-1">
                Please Contact the Couple
              </p>
              <p className="font-display text-lg text-[#31383c] font-medium">
                Nezeal &amp; Shintal
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Reach out via Messenger or phone to verify your seat reservation.
              </p>
            </div>

            {/* Try Another Name Button */}
            <button
              type="button"
              onClick={() => setShowNotFoundModal(false)}
              className="w-full py-3.5 rounded-full bg-[#718d9b] hover:bg-[#607b89] active:scale-95 text-white text-xs font-bold tracking-[.2em] uppercase shadow-lg shadow-slate-300/40 transition hover:-translate-y-0.5 cursor-pointer"
            >
              Try Another Name
            </button>
          </div>
        </div>
      )}

      {/* POPUP MODAL 2: RSVP CONFIRMATION MODAL (Paired with website) */}
      {showSuccessModal && currentGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-rise">
          <div className="fixed inset-0" onClick={() => setShowSuccessModal(false)} />

          <div className="relative w-full max-w-[350px] sm:max-w-[380px] bg-[#fcfbfa] rounded-[2rem] px-7 py-9 text-center paper-shadow border border-white/90 z-10">
            {/* Top Close Button */}
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg leading-none p-1 cursor-pointer transition"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Dusty Blue Monogram Wax Seal Emblem */}
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

            {/* Highlighted Confirmation Box */}
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

            {/* Done Button */}
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
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