import { Avaliacao } from "../models/Avaliacao.js";

export async function avaliarLeitura(req, res) {
  const { id: leituraId } = req.params;
  const { nota, status, favorito } = req.body;
  const usuarioId = req.user.id;

  try {
    const novaAvaliacao = await Avaliacao.findOneAndUpdate(
      { usuario: usuarioId, leitura: leituraId },
      {
        nota,
        status,
        favorito,
        usuario: usuarioId,
        leitura: leituraId,
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json(novaAvaliacao);
  } catch (err) {
    console.error("Erro ao salvar avaliação:", err);
    res.status(500).json({ message: "Erro ao salvar avaliação." });
  }
}