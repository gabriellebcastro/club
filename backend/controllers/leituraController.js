import Leitura from "../models/Leitura.js";
import Club from "../models/Club.js";  // importou como Club

export const criarLeitura = async (req, res) => {
  const { clubeId } = req.params;
  const { titulo, autor, genero, descricao, dataFim } = req.body;

  try {
    const clube = await Club.findById(clubeId); // aqui: Club, não Clube
    if (!clube) return res.status(404).json({ message: "Clube não encontrado." });

    if (clube.moderador.toString() !== req.user.id) {
      return res.status(403).json({ message: "Apenas o moderador pode cadastrar a leitura." });
    }

    const leituraExistente = await Leitura.findOne({ clube: clubeId });
    if (leituraExistente) {
      return res.status(400).json({ message: "Já existe uma leitura cadastrada para esse clube." });
    }

    const leitura = new Leitura({
      clube: clubeId,
      titulo,
      autor,
      genero,
      descricao,
      dataFim,
      capa: req.file?.filename || null,
    });

    await leitura.save();
    res.status(201).json(leitura);
  } catch (error) {
    console.error("Erro ao criar leitura:", error);
    res.status(500).json({ message: "Erro ao criar leitura." });
  }
};

export const obterLeitura = async (req, res) => {
  const { clubeId } = req.params;

  try {
    const leitura = await Leitura.findOne({ clube: clubeId });
    if (!leitura) {
      return res.status(404).json({ message: "Nenhuma leitura cadastrada." });
    }

    res.json(leitura);
  } catch (error) {
    console.error("Erro ao buscar leitura:", error);
    res.status(500).json({ message: "Erro ao buscar leitura." });
  }
};