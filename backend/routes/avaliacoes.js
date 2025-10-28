import express from "express";
import { avaliarLeitura } from "../controllers/avaliacaoController.js";
import { autenticar } from "../middleware/auth.js";

const router = express.Router();

router.post("/:id/avaliar", autenticar, avaliarLeitura);

export default router;