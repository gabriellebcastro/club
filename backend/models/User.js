import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  foto: { type: String },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
