// server/models/User.js
// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phoneNumber: { type: String, default: '', trim: true },   // ← NEW: for M‑PESA payments
    password: { type: String, required: true, minlength: 6 },
    gender: { type: String, enum: ['male', 'female'], required: true },
    lookingFor: { type: String, enum: ['male', 'female', 'both'], required: true },
    age: { type: Number, required: true, min: 18, max: 99 },
    city: { type: String, default: '' },
    country: { type: String, default: 'Kenya' },
    bio: { type: String, default: '', maxlength: 500 },
    occupation: { type: String, default: '' },
    height: { type: String, default: '' },
    weight: { type: String, default: '' },
    bodyType: { type: String, default: '' },
    smoking: { type: String, enum: ['Never', 'Occasionally', 'Regularly', ''], default: '' },
    drinking: { type: String, enum: ['Never', 'Occasionally', 'Regularly', ''], default: '' },
    religion: { type: String, default: '' },
    education: { type: String, default: '' },
    photos: { type: [String], default: [], validate: [v => v.length <= 6, 'Max 6 photos'] },
    premium: { type: Boolean, default: false },
    premiumExpiry: { type: Date, default: null },
    chatCredits: { type: Number, default: 0 },
    freeMessagesUsed: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Pre-save hook to hash password (fixed)
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);