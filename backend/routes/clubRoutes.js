import express from 'express';
import { criarClube, listarClubes } from '../controllers/clubController.js';
import { autenticar } from '../middleware/auth.js';

const router = express.Router();
router.post('/clubes', autenticar, criarClube);
router.get('/clubes', listarClubes);

export default router;