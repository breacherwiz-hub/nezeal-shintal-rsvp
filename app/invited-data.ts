export type InvitedGuest = {
  id: string;
  name: string;
  category?: string;
  allowedSeats: number;
  plusOneAllowed: boolean;
  assignedSeat?: string;
};

export const DEFAULT_INVITED_GUESTS: InvitedGuest[] = [
  { id: "inv-1", name: "Atty. Roberto Mendoza", category: "VIP Sponsor", allowedSeats: 2, plusOneAllowed: true, assignedSeat: "Table 1 • Seat 1" },
  { id: "inv-2", name: "Dr. Elena Santos-Mendoza", category: "VIP Sponsor", allowedSeats: 2, plusOneAllowed: true, assignedSeat: "Table 1 • Seat 2" },
  { id: "inv-3", name: "Engr. Daniel Villanueva", category: "VIP Sponsor", allowedSeats: 2, plusOneAllowed: true, assignedSeat: "Table 1 • Seat 3" },
  { id: "inv-4", name: "Mrs. Cynthia Villanueva", category: "VIP Sponsor", allowedSeats: 2, plusOneAllowed: true, assignedSeat: "Table 1 • Seat 4" },
  { id: "inv-5", name: "Maria Clara Gomez", category: "Entourage", allowedSeats: 2, plusOneAllowed: true, assignedSeat: "Table 4 • Seat 1" },
  { id: "inv-6", name: "Carlos Miguel Tan", category: "Entourage", allowedSeats: 1, plusOneAllowed: false, assignedSeat: "Table 5 • Seat 1" },
  { id: "inv-7", name: "Jonathan Reyes", category: "Friends", allowedSeats: 2, plusOneAllowed: true, assignedSeat: "Table 6 • Seat 1" },
  { id: "inv-8", name: "Sarah Reyes", category: "Friends", allowedSeats: 1, plusOneAllowed: false, assignedSeat: "Table 6 • Seat 2" },
  { id: "inv-9", name: "Jessica Lee", category: "Friends", allowedSeats: 1, plusOneAllowed: false, assignedSeat: "Table 6 • Seat 3" },
  { id: "inv-10", name: "Mark Bautista", category: "Colleagues", allowedSeats: 1, plusOneAllowed: false, assignedSeat: "Table 8 • Seat 1" },
  { id: "inv-11", name: "Vincent Paul Garcia", category: "Entourage", allowedSeats: 1, plusOneAllowed: false, assignedSeat: "Table 5 • Seat 2" },
  { id: "inv-12", name: "xebec", category: "Friends", allowedSeats: 2, plusOneAllowed: true, assignedSeat: "Table 6 • Seat 4" },
  { id: "inv-13", name: "xebec & kim", category: "Friends", allowedSeats: 2, plusOneAllowed: true, assignedSeat: "Table 6 • Seats 4–5" },
  { id: "inv-14", name: "kim", category: "Friends", allowedSeats: 1, plusOneAllowed: false, assignedSeat: "Table 6 • Seat 5" },
];

export const INVITED_STORAGE_KEY = "nezeal-shintal-invited-list";

export function getInvitedGuests(): InvitedGuest[] {
  if (typeof window === "undefined") return DEFAULT_INVITED_GUESTS;
  try {
    const saved = localStorage.getItem(INVITED_STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(INVITED_STORAGE_KEY, JSON.stringify(DEFAULT_INVITED_GUESTS));
      return DEFAULT_INVITED_GUESTS;
    }
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_INVITED_GUESTS;
  } catch {
    return DEFAULT_INVITED_GUESTS;
  }
}

export function saveInvitedGuests(list: InvitedGuest[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(INVITED_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Failed to save invited guests", e);
  }
}
