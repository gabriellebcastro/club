import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import "./Home.css";
import illustration from "../assets/illustration-login.svg";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  username: string;
  // Adicione outras propriedades se necessário
};

export function Home() {
  const [primeiroNome, setPrimeiroNome] = useState("Usuário");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.username) {
          const primeiro = decoded.username.split(" ")[0];
          setPrimeiroNome(primeiro);
        }
      } catch (err) {
        console.error("Erro ao decodificar token:", err);
      }
    }
  }, []);

  return (
    <div className="home-container">
      <Navbar />
      <div className="home-content">
        <div className="text-section">
          <p className="greeting">Bem vinda,</p>
          <h1 className="username">{primeiroNome}.</h1>
          <p className="subtitle">Pronta para embarcar em uma nova leitura?</p>

          <div className="buttons">
            <Link to="/clubes?tab=meus" className="btn black">Ver meus clubes</Link>
            <Link to="/clubes?tab=encontrar" className="btn white">Encontrar clubes</Link>
          </div>
        </div>
        <div className="illustration">
          <img src={illustration} alt="Ilustração de leitura" />
        </div>
      </div>
    </div>
  );
}
