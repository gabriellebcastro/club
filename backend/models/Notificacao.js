import mongoose from 'mongoose';

const notificacaoSchema = new mongoose.Schema({
  destinatario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  remetente: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clube: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
  tipo: { type: String, enum: ['solicitacao_entrada'], required: true },
  mensagem: { type: String, required: true },
  lida: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Notificacao', notificacaoSchema);
