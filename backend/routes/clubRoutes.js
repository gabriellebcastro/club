import express from 'express';
import { criarClube, listarClubes, obterClubePorId } from '../controllers/clubController.js';
import { autenticar } from '../middleware/auth.js';

const router = express.Router();
router.post('/clubes', autenticar, criarClube);
router.get('/clubes', listarClubes);
router.get('/clubes/:id', obterClubePorId);

export default router;