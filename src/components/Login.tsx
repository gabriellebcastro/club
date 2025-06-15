import "./Login.css";
import illustration from "../assets/illustration-login.svg";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export function LoginForm() {
  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:4000/login", {
        emailOrUsername: form.identifier,
        password: form.password,
      });

      const { token } = response.data;

      localStorage.setItem("token", token);
      setMessage("Login realizado com sucesso!");

      // Redireciona para a página principal (ajuste a rota conforme seu projeto)
      navigate("/home");
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Erro ao conectar com o servidor.");
      }
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h1>Entrar</h1>
        <p>Faça seu login no Club.</p>

        {message && <p className="message">{message}</p>}

        <div className="input-group">
          <label>
            Email ou usuário
            <input
              type="text"
              name="identifier"
              placeholder="Digite seu email ou usuário"
              value={form.identifier}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div className="input-group">
          <label>
            Senha
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Digite sua senha"
                value={form.password}
                onChange={handleChange}
                required
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

        <div className="options">
          <label>
            <input type="checkbox" /> Manter conectado
          </label>
          <Link to="/recover" className="forgot-password">Esqueceu a senha?</Link>
        </div>

        <button type="submit">Entrar</button>

        <p className="register-link">
          Ainda não tem uma conta? <Link to="/register">Cadastre-se.</Link>
        </p>
      </form>

      <div className="illustration">
        <img src={illustration} alt="Ilustração" />
      </div>
    </div>
  );
}
