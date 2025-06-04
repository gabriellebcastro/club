import "./Register.css";
import illustration from "../assets/illustration-login.svg";
import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Link } from "react-router-dom";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Criar conta</h1>
        <p>Cadastre-se no Club.</p>

        <div className="input-group">
          <label>
            Email
            <input type="email" placeholder="Digite seu email" />
          </label>
        </div>

        <div className="input-group">
          <label>
            Usuário
            <input type="text" placeholder="Crie seu usuário" />
          </label>
        </div>

        <div className="input-group">
          <label>
            Senha
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Crie sua senha"
              />
              <button
                type="button"
                className="eye-button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </label>
        </div>

        <div className="input-group">
          <label>
            Confirmar senha
            <div className="password-wrapper">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Repita sua senha"
              />
              <button
                type="button"
                className="eye-button"
                onClick={() => setShowConfirm(!showConfirm)}
                tabIndex={-1}
              >
                {showConfirm ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </label>
        </div>

        <button>Cadastrar</button>

        <p className="register-link">
          Já tem uma conta? <Link to="/login">Entrar.</Link>
        </p>
      </div>

      <div className="illustration">
        <img src={illustration} alt="Ilustração" />
      </div>
    </div>
  );
}
