import express from 'express';
import {
  criarClube,
  listarClubes,
  obterClubePorId,
  solicitarEntrada,
  entrarNoClube,
  listarSolicitacoes,
  aceitarSolicitacao,
  negarSolicitacao,
  listarMeusClubes,
  atualizarClube,
  removerMembro
} from '../controllers/clubController.js';
import { autenticar } from '../middleware/auth.js';
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post('/', autenticar, upload.single('capa'), criarClube);
router.get('/', autenticar, listarClubes);


router.get('/moderados', autenticar, listarMeusClubes);

router.get('/notificacoes', autenticar, listarSolicitacoes);
router.post('/notificacoes/:id/aceitar', autenticar, aceitarSolicitacao);
router.post('/notificacoes/:id/negar', autenticar, negarSolicitacao);

router.get('/:id', autenticar, obterClubePorId);

router.post('/:id/solicitar', autenticar, solicitarEntrada);
router.post('/:id/entrar', autenticar, entrarNoClube);
router.put('/:id', autenticar, atualizarClube);
router.delete('/:id/membros/:membroId', autenticar, removerMembro);

export default router;