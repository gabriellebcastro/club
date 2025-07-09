// models/Evento.js
import mongoose from 'mongoose';

const eventoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String },
  data: { type: String, required: true },
  horario: { type: String, required: true },
  plataforma: { type: String, required: true },
  clube: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Club',
    required: true
  },
  criadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Evento = mongoose.model('Evento', eventoSchema);
export default Evento;
