
// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const notifications = require('./routes/notifications');
const avatars = require('./routes/avatars');
const insurers = require('./routes/insurers');
const patientRoutes = require('./routes/patients');
const doctorRoutes = require('./routes/doctors');
const insurerRoutes = require('./routes/insurers');
const labRoutes = require('./routes/labReports');
const claimRoutes = require('./routes/claims');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/EHR360')
  .then(()=> console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/notifications', notifications);
app.use('/api/uploads/avatar', avatars);
app.use('/api/insurers', insurers);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/insurers', insurerRoutes);
app.use('/api/labs', labRoutes);
app.use('/api/claims', claimRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server running on ${PORT}`));
