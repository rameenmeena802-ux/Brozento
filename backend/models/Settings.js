const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  siteName: { type: String, default: "BROZENTO" },
  logoUrl: { type: String, default: "" },
  topBarText: { type: String, default: "100% Advance Payment • Free Delivery All Over Pakistan" },
  topBarBgColor: { type: String, default: "#1a1a1a" },
  topBarTextColor: { type: String, default: "#ffffff" },
  heroImages: [{ type: String }],
  heroTitle: { type: String, default: "Restaurant Taste At Your Home." },
  heroSubtitle: { type: String, default: "Premium restaurant masalas aur injectors." },
  heroTitleColor: { type: String, default: "#ffffff" },
  heroBgColor: { type: String, default: "#c40000" },
  heroVideoUrl: { type: String, default: "" },
  whatsappNumber: { type: String, default: "923001234567" }
});

module.exports = mongoose.model('Settings', settingsSchema);