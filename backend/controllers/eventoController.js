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
  const { clubeId } = req.params;

  try {
    const eventosFuturos = await Evento.find({
      clube: clubeId,
      data: { $gte: new Date() }, // apenas eventos com data >= hoje
    }).sort({ data: 1 }); // ordena por data ascendente

    res.json(eventosFuturos);
  } catch (error) {
    console.error("Erro ao listar eventos:", error);
    res.status(500).json({ message: "Erro ao buscar eventos." });
  }
}

export async function listarEventosDoUsuario(req, res) {
  try {
    const userId = req.user.id;

    // 1. Buscar clubes onde o usuário é membro ou moderador
    const clubes = await Club.find({
      $or: [{ membros: userId }, { moderador: userId }]
    }).select("_id");

    const clubesIds = clubes.map(clube => clube._id);

    // 2. Buscar eventos futuros desses clubes
    const hoje = new Date();
    const eventos = await Evento.find({
      clube: { $in: clubesIds },
      data: { $gte: hoje }
    })
      .populate("clube", "nome imagem")
      .sort({ data: 1 });

    res.json(eventos);
  } catch (err) {
    console.error("Erro ao listar eventos do usuário:", err);
    res.status(500).json({ message: "Erro ao buscar eventos do usuário." });
  }
}