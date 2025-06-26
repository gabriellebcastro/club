import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Club } from "./models/create_club.js";
import clubRoutes from './routes/clubRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', clubRoutes);

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.log(err));

// Modelo de Usuário
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Registro
app.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  if(!email || !username || !password) {
    return res.status(400).json({ message: "Preencha todos os campos." });
  }

  try {
    const existingUser = await User.findOne({ $or: [{email}, {username}] });
    if(existingUser) {
      return res.status(400).json({ message: "Usuário ou email já cadastrado." });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({ email, username, passwordHash });
    await newUser.save();

    res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (err) {
    res.status(500).json({ message: "Erro no servidor." });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { emailOrUsername, password } = req.body;

  if(!emailOrUsername || !password) {
    return res.status(400).json({ message: "Preencha todos os campos." });
  }

  try {
    // Busca usuário por email ou username
    const user = await User.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });
    if(!user) {
      return res.status(400).json({ message: "Usuário não encontrado." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if(!isMatch) {
      return res.status(400).json({ message: "Senha incorreta." });
    }

    // Cria token JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, username: user.username, email: user.email });
  } catch (err) {
    res.status(500).json({ message: "Erro no servidor." });
  }
});

// Rota protegida de teste
app.get('/profile', async (req, res) => {
  const authHeader = req.headers.authorization;

  if(!authHeader) return res.status(401).json({ message: 'Token não fornecido' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ message: 'Acesso autorizado', user: decoded });
  } catch (err) {
    res.status(401).json({ message: 'Token inválido' });
  }
});

app.listen(process.env.PORT || 4000, () => console.log('Servidor rodando na porta 4000'));
