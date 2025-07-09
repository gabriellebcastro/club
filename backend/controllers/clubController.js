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
    const clubes = await Club.find()
      .populate('moderador', 'username')
      .select('nome tipo genero imagem membros moderador');

    const userId = req.user?.id || null;

    const clubesComStatus = clubes.map(clube => {
      const membros = clube.membros || [];

      const ehMembro = Boolean(userId) && membros.some(m => m.toString() === userId.toString());

      console.log('Moderador _id:', clube.moderador?._id);
      console.log('Tipo moderador _id:', typeof clube.moderador?._id);
      console.log('userId:', userId);
      console.log('Tipo userId:', typeof userId);

      const ehModerador = Boolean(userId) && (
        (clube.moderador?._id?.toString() === userId.toString()) ||
        (typeof clube.moderador === 'string' && clube.moderador === userId.toString())
      );

      console.log(`🎯 Clube: ${clube.nome}`);
      console.log(`   🔹 ehMembro:`, ehMembro, typeof ehMembro);
      console.log(`   🔹 ehModerador:`, ehModerador, typeof ehModerador);
      console.log(`   🔸 Membros: ${membros.map(m => m.toString()).join(', ')}`);
      console.log(`   🔸 Moderador ID: ${clube.moderador?._id || clube.moderador}`);

      return {
        ...clube.toObject(),
        ehMembro,
        ehModerador,
      };
    });

    res.json(clubesComStatus);
  } catch (err) {
    console.error("Erro ao buscar clubes:", err);
    res.status(500).json({ message: 'Erro ao buscar clubes.' });
  }
}

export async function obterClubePorId(req, res) {
  try {
    const clube = await Club.findById(req.params.id).populate('moderador', 'username');

    if (!clube) return res.status(404).json({ message: 'Clube não encontrado' });

    const userId = req.user?.id || null;

    const ehModerador = Boolean(userId) && (
      (clube.moderador?._id?.toString() === userId.toString()) ||
      (typeof clube.moderador === 'string' && clube.moderador === userId.toString())
    );

    const ehMembro = Boolean(userId) && (
      clube.membros?.some(m => m.toString() === userId.toString())
    );

    return res.json({
      ...clube.toObject(),
      ehModerador,
      ehMembro,
    });
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

    // 🔒 Verificar se o usuário é o moderador do clube
    if (clube.moderador.toString() === req.user.id) {
      return res.status(403).json({ message: 'Você é o moderador deste clube e não pode solicitar entrada.' });
    }

    // 🔍 Verificar se o usuário já fez uma solicitação para este clube
    const jaSolicitou = await Notificacao.findOne({
      clube: clube._id,
      remetente: req.user.id,
      tipo: 'solicitacao_entrada',
    });

    if (jaSolicitou) {
      return res.status(400).json({ message: 'Você já solicitou entrada neste clube.' });
    }

    // ✅ Criar notificação para o moderador
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

export async function listarSolicitacoes(req, res) {
  try {
    console.log("🟡 Usuário autenticado:", req.user);
    console.log("🔍 Buscando notificações para o destinatário:", req.user.id);

    const notificacoes = await Notificacao.find({
      destinatario: req.user.id,
      tipo: 'solicitacao_entrada'
    })
      .sort({ createdAt: -1 })
      .populate('remetente', 'username')
      .populate('clube', 'nome');

    console.log("📬 Notificações encontradas:", notificacoes.length);

    const resposta = notificacoes.map(n => ({
      _id: n._id,
      mensagem: `${n.remetente.username} solicitou entrada no clube ${n.clube.nome}`,
      tipo: n.tipo,
    }));

    res.json(resposta);
  } catch (err) {
    console.error('❌ Erro ao buscar notificações:', err);
    res.status(500).json({ message: 'Erro ao buscar notificações.' });
  }
}

export async function entrarNoClube(req, res) {
  try {
    const clube = await Club.findById(req.params.id);

    if (!clube) return res.status(404).json({ message: 'Clube não encontrado.' });

    // ✅ Verifica se o campo moderador existe
    if (!clube.moderador) {
      return res.status(400).json({ message: 'Clube inválido: sem moderador definido.' });
    }

    // 🔒 Impede o moderador de entrar como membro
    if (clube.moderador.toString() === req.user.id) {
      return res.status(403).json({ message: 'Você é o moderador deste clube.' });
    }

    // Aqui você pode adicionar o usuário como membro (ainda será implementado em detalhes)
    res.status(200).json({ message: 'Entrada no clube registrada (lógica de associação pendente).' });

  } catch (err) {
    console.error("Erro ao entrar no clube público:", err);
    res.status(500).json({ message: 'Erro ao entrar no clube.' });
  }
}

export async function aceitarSolicitacao(req, res) {
  try {
    const notificacao = await Notificacao.findById(req.params.id).populate('clube remetente');

    if (!notificacao) {
      return res.status(404).json({ message: "Notificação não encontrada." });
    }

    const clube = notificacao.clube;

    // Verifica se quem está aceitando é o moderador do clube
    if (clube.moderador.toString() !== req.user.id) {
      return res.status(403).json({ message: "Você não tem permissão para aceitar essa solicitação." });
    }

    const idSolicitante = notificacao.remetente._id;

    // Adiciona como membro se ainda não for
    if (!clube.membros.includes(idSolicitante)) {
      clube.membros.push(idSolicitante);
      await clube.save();
    }

    // Remove a notificação após aceitar
    await Notificacao.findByIdAndDelete(notificacao._id);

    return res.status(200).json({ message: "Solicitação aceita. Usuário agora é membro do clube." });

  } catch (err) {
    console.error("❌ Erro ao aceitar solicitação:", err);
    return res.status(500).json({ message: "Erro ao processar solicitação." });
  }
}

export async function negarSolicitacao(req, res) {
  try {
    const notificacao = await Notificacao.findById(req.params.id).populate('clube remetente');

    if (!notificacao) {
      return res.status(404).json({ message: "Notificação não encontrada." });
    }

    const clube = notificacao.clube;

    // Verifica se quem está negando é o moderador do clube
    if (clube.moderador.toString() !== req.user.id) {
      return res.status(403).json({ message: "Você não tem permissão para negar essa solicitação." });
    }

    // Remove a notificação após negar
    await Notificacao.findByIdAndDelete(notificacao._id);

    return res.status(200).json({ message: "Solicitação negada com sucesso." });

  } catch (err) {
    console.error("Erro ao negar solicitação:", err);
    return res.status(500).json({ message: "Erro ao processar a negação da solicitação." });
  }
}

export async function listarMeusClubes(req, res) {
  try {
    const userId = req.user.id;

    const clubes = await Club.find({ membros: userId })
      .populate('moderador', 'username')
      .select('nome tipo genero imagem membros moderador');

    const clubesComStatus = clubes.map(clube => {
      return {
        ...clube.toObject(),
        ehMembro: true,
        ehModerador: clube.moderador._id.toString() === userId,
      };
    });

    res.json(clubesComStatus);
  } catch (err) {
    console.error("Erro ao listar meus clubes:", err);
    res.status(500).json({ message: "Erro ao listar seus clubes." });
  }
}
