import mongoose from "mongoose";

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
});

export const Club = mongoose.model("Club", clubSchema);
