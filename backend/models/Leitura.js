import mongoose from "mongoose";

const LeituraSchema = new mongoose.Schema({
  clube: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clube",
    required: true,
    unique: true, // Um clube só pode ter uma leitura ativa por vez
  },
  titulo: {
    type: String,
    required: true,
  },
  autor: {
    type: String,
    required: true,
  },
  genero: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
  },
  dataFim: {
    type: Date,
    required: true,
  },
  capa: {
    type: String,
  },
});

const Leitura = mongoose.model("Leitura", LeituraSchema);
export default Leitura;