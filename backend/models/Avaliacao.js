import mongoose from "mongoose";

const avaliacaoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  leitura: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Leitura",
    required: true,
  },
  nota: {
    type: Number,
    min: 0,
    max: 10,
  },
  status: {
    type: String,
    enum: ["lido", "lendo"],
    required: true,
  },
  favorito: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Impede avaliações duplicadas por usuário para uma mesma leitura
avaliacaoSchema.index({ usuario: 1, leitura: 1 }, { unique: true });

export const Avaliacao = mongoose.model("Avaliacao", avaliacaoSchema);