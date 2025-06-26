import Club from '../models/Club.js';

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