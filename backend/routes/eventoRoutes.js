import express from 'express';
import { autenticar } from '../middleware/auth.js';
import { criarEvento, listarEventosPorClube, listarEventosDoUsuario } from '../controllers/eventoController.js';

const router = express.Router();

// POST /api/clubes/:clubeId/eventos
router.post('/clubes/:clubeId/eventos', autenticar, criarEvento);

// GET /api/clubes/:clubeId/eventos
router.get('/clubes/:clubeId/eventos', autenticar, listarEventosPorClube);
router.get("/eventos", autenticar, listarEventosDoUsuario);

export default router;
