# Nezeal & Shintal Wedding RSVP

A simple, professional wedding RSVP website inspired by the uploaded dusty-blue/beige floral reference.

## Included
- Next.js + Tailwind CSS
- No Supabase
- No database connection
- No search bar
- Smooth CSS animations
- Responsive wedding invitation
- RSVP form
- Local admin dashboard at `/admin`
- RSVP data stored in browser `localStorage`
- Seat assignment from the admin dashboard
- CSV export

## Run
```bash
npm install
npm run dev
```

Open:
- Invitation: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`

## Admin
Demo password: `admin123`

Change the password in `app/admin/page.tsx` before real use.

## Important limitation
This version is intentionally local-only. `localStorage` means the RSVP list is tied to the browser/device where the RSVP was submitted. It is suitable for a local/demo/single-device setup, but not for collecting RSVPs from many guests over the internet.

For a real public RSVP system without Supabase, the next step would be a small PHP/MySQL or Node/SQLite backend.
