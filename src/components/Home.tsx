import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import "./Home.css";
import illustration from "../assets/illustration-login.svg";
import { Link } from "react-router-dom";

type Usuario = {
  username: string;
};

export function Home() {
  const [primeiroNome, setPrimeiroNome] = useState("Usuário");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUsuario = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/usuario", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Erro ao buscar usuário");

        const data: Usuario = await res.json();

        if (data.username) {
          const primeiro = data.username.split(" ")[0];
          setPrimeiroNome(primeiro);
        }
      } catch (err) {
        console.error("Erro ao carregar dados do usuário:", err);
      }
    };

    fetchUsuario();
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
            <Link to="/clubes?tab=meus" className="btn black">
              Ver meus clubes
            </Link>
            <Link to="/clubes?tab=encontrar" className="btn white">
              Encontrar clubes
            </Link>
          </div>
        </div>
        <div className="illustration">
          <img src={illustration} alt="Ilustração de leitura" />
        </div>
      </div>
    </div>
  );
}