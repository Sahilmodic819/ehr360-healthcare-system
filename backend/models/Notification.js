// backend/models/Notification.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const NotificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  message: String,
  type: { type: String, default: 'info' },
  read: { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model('Notification', NotificationSchema);
