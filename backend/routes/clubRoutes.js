import express from 'express';
import { criarClube, listarClubes, obterClubePorId, solicitarEntrada, entrarNoClube, listarSolicitacoes, aceitarSolicitacao, negarSolicitacao } from '../controllers/clubController.js';
import { autenticar } from '../middleware/auth.js';

const router = express.Router();
router.post('/clubes', autenticar, criarClube);
router.get('/clubes', listarClubes);
router.get('/clubes/:id', obterClubePorId);
router.post('/clubes/:id/solicitar', autenticar, solicitarEntrada);
router.post('/clubes/:id/entrar', autenticar, entrarNoClube);
router.get('/notificacoes', autenticar, listarSolicitacoes);
router.post('/notificacoes/:id/aceitar', autenticar, aceitarSolicitacao);
router.post('/notificacoes/:id/negar', autenticar, negarSolicitacao);

export default router;