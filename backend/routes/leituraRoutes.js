import express from "express";
import multer from "multer";
import path from "path";
import { criarLeitura, obterLeitura } from "../controllers/leituraController.js";
import { autenticar } from "../middleware/auth.js";

const router = express.Router();

// Configuração do multer para upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

// Rota POST - criar leitura
router.post(
  "/clubes/:clubeId/leitura",
  autenticar,
  upload.single("capa"),
  criarLeitura
);

// Rota GET - obter leitura do clube
router.get("/clubes/:clubeId/leitura", autenticar, obterLeitura);

// ✅ Exporta como default, igual nos outros arquivos
export default router;