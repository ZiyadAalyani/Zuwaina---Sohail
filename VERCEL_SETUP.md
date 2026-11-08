# Deploying the Wedding Invitation to Vercel

## Why the Previous Deployment Failed (HTTP 500)

1. **Root `server.js` Conflict**: When `server.js` was in the root directory, Vercel automatically deployed it as a monolithic custom Node.js server instead of deploying the dedicated serverless functions in `/api`.
2. **Read-Only File System**: On Vercel, the server environment is read-only. When guests submitted an RSVP, `server.js` tried to run `fs.writeFileSync()` to write to `data.json`. This crashed the serverless function immediately with `EROFS: read-only file system` (producing the `FUNCTION_INVOCATION_FAILED` HTTP 500 error shown on your mobile screen).
3. **Missing Database**: Vercel serverless functions cannot store data in local files on disk. Live guest RSVPs and wishes require a persistent cloud database (Neon PostgreSQL).

---

## Step 1: Create a Free Neon PostgreSQL Database (2 minutes)

1. Go to **[https://neon.tech/](https://neon.tech/)** and click **Sign Up** (or log in with Google / GitHub).
2. Create a new project (e.g., `wedding-invitation`).
3. On the Neon dashboard, copy the **Connection string** (Postgres URL):
   - Example format: `postgresql://username:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require`
   - *(Prefer the **Pooled connection** string if Neon provides both)*.
4. Keep this connection string ready for Step 3. You do not need to create any database tables manually — the API functions create them automatically!

---

## Step 2: Push the Fixed Code to GitHub

1. Extract the updated files from this project folder.
2. In your GitHub repository, make sure the files are at the root:
   - `api/` (contains `_db.js`, `rsvp.js`, `wishes.js`, `health.js`, `admin.js`)
   - `public/` (contains `index.html`, `admin.html`, backdrop image)
   - `package.json`
   - `vercel.json`
   - `.vercelignore`
   - `local-server.js`
   - `START_NIKAH.bat` / `STOP_NIKAH.bat`
3. Commit and push the changes to GitHub.

---

## Step 3: Configure Environment Variables in Vercel

1. Open your project on **[Vercel Dashboard](https://vercel.com/)** (`zuwaina-sohail`).
2. Go to **Settings** → **Environment Variables**.
3. Add the following two variables:
   - **`DATABASE_URL`**: Paste your Neon connection string from Step 1.
   - **`ADMIN_KEY`**: A secure password of your choice for accessing the admin dashboard at `/admin` (e.g. `MyWedding2026!`).
4. Ensure **Production**, **Preview**, and **Development** are checked.
5. Click **Save**.

---

## Step 4: Redeploy on Vercel

1. Go to the **Deployments** tab in your Vercel project.
2. Click the three dots (`...`) on the latest deployment and select **Redeploy** (or simply push a new commit to GitHub).
   *(Note: Adding environment variables in Vercel only takes effect on new deployments).*

---

## Step 5: Verify Everything is Working

Open these URLs in your mobile or desktop browser:

1. **Health Check**:
   Visit `https://zuwaina-sohail.vercel.app/api/health`
   - It should return:
     `{"ok":true,"database":"connected"}`
2. **Submit a Test RSVP**:
   Open `https://zuwaina-sohail.vercel.app/` on your mobile phone and submit an RSVP. It will now succeed with:
   *“RSVP received. Jazakallahu khayran!”*
3. **Submit a Test Wish**:
   Leave a dua/wish on the home page. It will submit and show up in the wishes list.
4. **Admin Dashboard**:
   Visit `https://zuwaina-sohail.vercel.app/admin` and enter your `ADMIN_KEY`.
   - You can see total guests attending, download a CSV spreadsheet for caterers/planners, and delete test entries.

---

## Running Locally on PC

To run the site offline on your computer:
- Double-click `START_NIKAH.bat`. It will launch `local-server.js` and open `http://localhost:3000` saving locally to `data.json`.
- Double-click `STOP_NIKAH.bat` when you want to stop the local server.
