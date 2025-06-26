import express from "express";
import { Club } from "../models/create_club.js";

const router = express.Router();

router.post("/clubs", async (req, res) => {
  try {
    const clubData = req.body;
    console.log("Dados recebidos para criar clube:", clubData);
    const newClub = new Club(clubData);
    await newClub.save();
    res.status(201).json({ message: "Clube criado com sucesso!" });
  } catch (err) {
    console.error("Erro ao salvar clube:", err);
    res.status(500).json({ message: "Erro ao criar clube." });
  }
});



export default router;
