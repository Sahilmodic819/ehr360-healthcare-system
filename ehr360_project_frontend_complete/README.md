
EHR360 - Full-stack scaffold (React + Tailwind | Node + Express | MongoDB | Firebase Auth)

Contents:
- frontend/ : React (Vite) app using Tailwind CSS. Pages for Patient/Doctor/Insurer, Auth flows, Firebase Google sign-in integration (placeholder config).
- backend/  : Express server with Mongoose models, auth routes, middleware (Firebase token verification, 30-day rule), seed script for `masterRecords`.
- .env.example : Environment variables placeholders.
- scripts/seedMasterRecords.js : Seed script to create 10 master records in local MongoDB (database name: EHR360).
- README contains start instructions.

Important:
- Firebase service account JSON is NOT included (you must download from Firebase console). Place it at backend/serviceAccountKey.json and set GOOGLE_APPLICATION_CREDENTIALS_PATH in .env.
- The included Firebase API key in sample files is the key you provided; replace other Firebase placeholders with your project's values.
- MongoDB default points to local: mongodb://127.0.0.1:27017/EHR360

How to run (quick):
1. Backend
   cd backend
   cp ../.env.example .env
   # edit .env to set correct values, and place service account JSON if using Firebase Admin
   npm install
   npm run dev

2. Seed DB (creates masterRecords)
   node scripts/seedMasterRecords.js

3. Frontend
   cd frontend
   npm install
   # create .env.local or set Vite envs if needed
   npm run dev

Files included are a working scaffold with routes and minimal frontend pages. Finish filling Firebase config and fine-tune UI if desired.

