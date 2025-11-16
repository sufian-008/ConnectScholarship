
const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  siteName: { type: String, default: 'Connect Scholarship' },
  siteEmail: { type: String, default: 'admin@Scholarship.com' },
  enableNotifications: { type: Boolean, default: true },
  autoApprove: { type: Boolean, default: false },
  maintenanceMode: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
