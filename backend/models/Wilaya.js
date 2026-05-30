const mongoose = require('mongoose');

const wilayaSchema = new mongoose.Schema({
  code: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  homeDelivery: { type: Number, default: 600 },
  agencyDelivery: { type: Number, default: 300 },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Wilaya', wilayaSchema);
