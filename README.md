# 📚 Club — Plataforma de Gestão de Clubes do Livro

O **Club** é um sistema web desenvolvido em **React + TypeScript + Node.js + Express + MongoDB**, criado para gerenciar clubes do livro.  
Usuários podem criar clubes, participar de leituras, organizar eventos e acompanhar o progresso das leituras mensais.

---

## 🧠 Funcionalidades Principais
- Cadastro e autenticação de usuários com **JWT**
- Criação e gerenciamento de clubes do livro
- Participação em clubes públicos ou privados
- Sistema de **eventos** para encontros e discussões literárias
- Edição de perfil e configuração de clubes
- Interface responsiva e intuitiva

---

## 🧩 Tecnologias Utilizadas

### **Frontend**
- [React](https://reactjs.org/)
- [React Router DOM](https://reactrouter.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [React Icons](https://react-icons.github.io/react-icons/)

### **Backend**
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/) — ODM para integração com MongoDB
- [JWT (jsonwebtoken)](https://www.npmjs.com/package/jsonwebtoken)
- [BcryptJS](https://www.npmjs.com/package/bcryptjs)
- [Multer](https://www.npmjs.com/package/multer) — Upload de arquivos
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [CORS](https://www.npmjs.com/package/cors)

### **Ferramentas de Desenvolvimento**
- [ESLint](https://eslint.org/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [PostCSS](https://postcss.org/)
- [Autoprefixer](https://github.com/postcss/autoprefixer)
- [Vite Plugin React](https://www.npmjs.com/package/@vitejs/plugin-react)

---

## ⚙️ Instalação

### 🔧 Pré-requisitos
- Node.js (versão 18 ou superior)
- MongoDB em execução localmente
- Gerenciador de pacotes **npm**

---

### 📦 1️⃣ Instalar dependências
Execute o comando na raiz do projeto:
```bash
npm install
```
### 📦 2️⃣ Rodar o projeto
Na pasta backend, crie o arquivo .env com suas credenciais e inicie o servidor com o comando:
```
node index.js
```
Por fim, na pasta raiz do projeto, inicie o front-end com
```
npm run dev
```
