import Club from '../models/Club.js';
import Notificacao from '../models/Notificacao.js';

export async function criarClube(req, res) {
  try {
    const clubeData = {
      ...req.body,
      moderador: req.user.id,
    };

    const novoClube = new Club(clubeData);
    await novoClube.save();

    res.status(201).json({ message: 'Clube criado com sucesso!', clube: novoClube });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar clube.' });
  }
}

export async function listarClubes(req, res) {
  try {
    const clubes = await Club.find().populate('moderador', 'username');
    res.json(clubes);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar clubes.' });
  }
}

export async function obterClubePorId(req, res) {
  try {
    const clube = await Club.findById(req.params.id).populate('moderador', 'username');
    if (!clube) return res.status(404).json({ message: 'Clube não encontrado' });

    res.json(clube);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar clube.' });
  }
}

export async function solicitarEntrada(req, res) {
  try {
    const clube = await Club.findById(req.params.id);
    if (!clube) return res.status(404).json({ message: 'Clube não encontrado.' });

    if (clube.tipo === "Público") {
      return res.status(400).json({ message: 'Este clube é público, não é necessário solicitar entrada.' });
    }

    // Criar notificação para o moderador
    const novaNotificacao = new Notificacao({
      destinatario: clube.moderador,
      tipo: 'solicitacao_entrada',
      remetente: req.user.id,
      clube: clube._id,
      mensagem: `${req.user.username} solicitou entrada no clube ${clube.nome}`
    });

    await novaNotificacao.save();

    res.status(200).json({ message: 'Solicitação enviada ao moderador.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao solicitar entrada.' });
  }
}
