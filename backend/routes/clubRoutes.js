import express from 'express';
import { criarClube, listarClubes, obterClubePorId, solicitarEntrada } from '../controllers/clubController.js';
import { autenticar } from '../middleware/auth.js';

const router = express.Router();
router.post('/clubes', autenticar, criarClube);
router.get('/clubes', listarClubes);
router.get('/clubes/:id', obterClubePorId);
router.post('/clubes/:id/solicitar', autenticar, solicitarEntrada);

export default router;