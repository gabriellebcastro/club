import User from '../models/User.js';
import Club from '../models/Club.js';

export async function obterUsuario(req, res) {
  try {
    const usuario = await User.findById(req.user.id).select('-senha');
    if (!usuario) return res.status(404).json({ message: 'Usuário não encontrado.' });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar usuário.' });
  }
}

export async function atualizarUsuario(req, res) {
  try {
    const campos = ['nome', 'descricao', 'foto'];
    const atualizacoes = {};

    campos.forEach((campo) => {
      if (req.body[campo] !== undefined) {
        atualizacoes[campo] = req.body[campo];
      }
    });

    const usuarioAtualizado = await User.findByIdAndUpdate(req.user.id, atualizacoes, { new: true }).select('-senha');

    res.json(usuarioAtualizado);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar usuário.' });
  }
}

export async function listarClubesModerados(req, res) {
  try {
    const clubes = await Club.find({ moderador: req.user.id }).select('_id nome descricao');
    res.json(clubes);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar clubes.' });
  }
}