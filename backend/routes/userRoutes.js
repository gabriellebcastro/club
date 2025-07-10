import express from 'express';
import { obterUsuario, atualizarUsuario } from '../controllers/userController.js';
import { autenticar } from '../middleware/auth.js';

const router = express.Router();

router.get('/', autenticar, obterUsuario);
router.put('/', autenticar, atualizarUsuario);

export default router;
