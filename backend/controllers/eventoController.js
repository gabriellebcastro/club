import Evento from '../models/Evento.js';
import Club from '../models/Club.js';

export async function criarEvento(req, res) {
  try {
    const { nome, descricao, data, horario, plataforma } = req.body;
    const { clubeId } = req.params;

    const clube = await Club.findById(clubeId);
    if (!clube) return res.status(404).json({ message: "Clube não encontrado." });

    if (clube.moderador.toString() !== req.user.id) {
      return res.status(403).json({ message: "Apenas o moderador pode criar eventos." });
    }

    const novoEvento = new Evento({
      nome,
      descricao,
      data,
      horario,
      plataforma,
      clube: clube._id,
      criadoPor: req.user.id
    });

    await novoEvento.save();

    res.status(201).json({ message: "Evento criado com sucesso.", evento: novoEvento });
  } catch (err) {
    console.error("Erro ao criar evento:", err);
    res.status(500).json({ message: "Erro interno ao criar evento." });
  }
}

export async function listarEventosPorClube(req, res) {
  try {
    const { clubeId } = req.params;

    const eventos = await Evento.find({ clube: clubeId }).sort({ data: 1 });

    res.status(200).json(eventos);
  } catch (err) {
    console.error("Erro ao listar eventos:", err);
    res.status(500).json({ message: "Erro ao buscar eventos." });
  }
}
