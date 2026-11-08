# Zuwaina & Sohail — Interactive Nikah Invitation

A responsive, animated wedding invitation for **Saturday, 19 December 2026 at 7:00 PM onwards**. The opening key-and-door experience is preserved, followed by a scroll-led invitation with soft falling petals, a rose-petal button, a live countdown, an event timeline, duas, separate RSVP and wishes forms, and Wedora Studio contact details.

## Running Locally on Windows

1. Install **Node.js 18 or newer** from https://nodejs.org/ if it is not installed.
2. Double-click `START_NIKAH.bat`.
3. Open **http://localhost:3000** in your browser if it does not open automatically.
4. When finished, double-click `STOP_NIKAH.bat` to stop the local background server.

### Manual Command Line Launch

```bat
node local-server.js
```
Then visit **http://localhost:3000**.
Local RSVPs and wishes are saved to `data.json`.
The local admin page is at **http://localhost:3000/admin** (default key: `change-me`).

## Deploying to Vercel

Follow the step-by-step instructions in [VERCEL_SETUP.md](VERCEL_SETUP.md) to connect your free Neon PostgreSQL database and deploy to Vercel.

## Main Details

- **Bride**: Dr. Zuwaina Aalyani
- **Groom**: Sohail Mohammed Gaziyani
- **Date**: Saturday, 19 December 2026
- **Countdown target**: 19 December 2026, 7:00 PM India time; changes to “Alhamdulillah, Married!” when the target is reached
- **Venue**: Rolex Banquet, Ram Mandir Rd, near Skoda Service, Somani Gram, Jogeshwari West, Mumbai 400104, Maharashtra
- **Instagram**: https://www.instagram.com/ziyad_aalyani/
- **Email**: wedorastudio.byziyad@gmail.com
