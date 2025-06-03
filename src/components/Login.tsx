// src/components/LoginForm.tsx
import "./Login.css";
import illustration from "../assets/illustration-login.svg";
import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const togglePassword = () => setShowPassword(!showPassword);
  return (
<div className="login-container">
  <div className="login-box">
    <h1>Entrar</h1>
    <p>Faça seu login no Club.</p>

    <div className="input-group">
      <label>
        Email ou usuário
        <input type="email" placeholder="Digite seu email ou usuário" />
      </label>
    </div>

    <div className="input-group">
         <label>
      Senha
      <div className="password-wrapper">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Digite sua senha"
        />
        <button
          type="button"
          className="eye-button"
          onClick={togglePassword}
          tabIndex={-1} // evita foco duplo
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
    </label>
    </div>
    <div className="options">
      <label>
        <input type="checkbox" /> Manter conectado
      </label>
      <a href="#" className="forgot-password">Esqueceu a senha?</a>
    </div>

    <button>Entrar</button>

        <p className="register-link">
          Ainda não tem uma conta? <a href="#">Cadastre-se.</a>
        </p>
      </div>

      <div className="illustration">
        <img src={illustration} alt="Ilustração" />
      </div>
    </div>
  );
}
