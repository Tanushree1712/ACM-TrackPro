# ACM-TrackPro

A centralized ACM event management dashboard built with React JS and Firebase to manage events, documentation, participants, and administrative tracking. It enforces mandatory documentation completion, secure authentication, and structured records to ensure transparency and ACM reporting compliance.



## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## AI event report setup

The event documentation page now expects a backend API for AI report generation.

1. In `backend/`, copy `.env.example` to `.env`.
2. Add your `OPENAI_API_KEY`.
3. Start the backend with `node server.js` from the `backend/` folder.
4. If needed, set `VITE_API_BASE_URL` in `frontend/.env.local` to `http://localhost:8787`.

Without the API key, the app will still show the required checklist and missing items, but it will skip AI text generation.

## Faculty email setup

To automatically email proposal PDFs to faculty when a proposal is submitted:

1. In `backend/.env`, set `FACULTY_EMAILS` to one or more faculty addresses separated by commas.
2. Add your SMTP settings: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM`.
3. Run `npm install` inside `backend/` to install `nodemailer`.
4. Restart the backend server after changing the env file.

The proposal form now sends the attached PDF to the backend, and the backend emails it to the configured faculty recipients before the proposal is marked submitted in the UI.
