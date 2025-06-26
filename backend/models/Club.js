import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema({
  nome: String,
  descricao: String,
  genero: String,
  tipo: String,
  formato: String,
  frequencia: String,
  limite: Number,
  faixa: String,
  regras: String,
  politica: String,
  novos: String,
  convidados: String,
  moderador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const Club = mongoose.model('Club', clubSchema);
export default Club;