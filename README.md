
# EHR360 - Enterprise Healthcare Management System

A comprehensive healthcare management platform built with React, Node.js, Express, and MongoDB. Features separate dashboards for patients, doctors, and insurance companies with real-time data visualization and document management.

## 🏥 Features

### Patient Dashboard
- Personal health records management
- Symptom tracking and medical history
- Lab reports and immunization records
- Insurance claim creation and tracking
- Medication and allergy management

### Doctor Dashboard
- Patient portfolio management
- Medical record access and updates
- Insurance request processing
- Lab report uploads and management
- Patient search and communication

### Insurer Dashboard
- Client portfolio and risk analysis
- Claims review and processing
- Document management system
- Risk assessment with data visualization
- Premium and policy management

## 🚀 Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Recharts
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: Firebase Authentication
- **File Storage**: Google Cloud Storage / Local uploads
- **Charts**: Recharts library for data visualization

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Firebase project setup

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🔧 Configuration

1. Set up Firebase project and download service account key
2. Configure MongoDB connection string
3. Set up environment variables for production

## 🌐 Live Demo

[Deployed on Vercel] - Coming Soon

## 👥 User Roles

- **Patient**: Manage personal health records and insurance
- **Doctor**: Access patient records and process medical requests  
- **Insurer**: Review claims and assess client risk

## 📊 Key Features

- Real-time data visualization with charts and graphs
- Document upload and management system
- Role-based access control and authentication
- Responsive design for mobile and desktop
- Advanced search and filtering capabilities
- Risk analysis algorithms for insurance assessment

## 🤝 Contributing

This is an enterprise healthcare system. Please follow security best practices when contributing.

## 📄 License

Enterprise License - All Rights Reserved

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

