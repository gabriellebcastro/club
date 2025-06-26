import express from 'express';
import { criarClube } from '../controllers/clubController.js';
import { autenticar } from '../middleware/auth.js';

const router = express.Router();
router.post('/clubes', autenticar, criarClube);

export default router;