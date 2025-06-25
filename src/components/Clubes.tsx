import { useState } from "react";
import "./Clubes.css";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "./Navbar";

export function ClubesPage() {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [tab, setTab] = useState(tabParam || "encontrar");
  const [showEncontrosDropdown, setShowEncontrosDropdown] = useState(false);

  const clubes = Array(8).fill({
    titulo: "Clube do Terror",
    genero: "Ficção, terror",
    tipo: "Público",
    membros: 9,
    imagem: "https://via.placeholder.com/150x100",
  });

  return (
    <>
      <Navbar />
      
      <div className="clubes-hero">
        <h1>Encontre seu Club</h1>
        <p className="subheading">Sua próxima história inesquecível começa aqui.</p>

        <div className="tabs">
          <button
            className={tab === "encontrar" ? "active" : ""}
            onClick={() => setTab("encontrar")}
          >
            Encontrar Clubes
          </button>
          <button
            className={tab === "meus" ? "active" : ""}
            onClick={() => setTab("meus")}
          >
            Meus Clubes
          </button>
        </div>
      </div>

      <div className="clubes-page">
        <div className="filtros">
          <div className="search-bar">
            <input type="text" placeholder="Pesquise clubes pelo nome" />
            <button className="search-icon">🔍</button>
          </div>

          <div className="filtros-rapidos">
            <span className="filtros-label">Filtros rápidos:</span>
            <button>🎭 Gênero Literário</button>
            <button>🔒 Privacidade</button>
            <div className="dropdown-wrapper">
              <button
                className="dropdown-toggle"
                onClick={() => setShowEncontrosDropdown(!showEncontrosDropdown)}
              >
                🧍‍♂️ Encontros
              </button>
              {showEncontrosDropdown && (
                <div className="club-dropdown-menu">
                  <button>Presenciais</button>
                  <button>Virtuais</button>
                  <button>Híbridos</button>
                </div>
              )}
            </div>
            <button>📌 Vagas</button>
            <button>👥 Número de membros</button>
          </div>
        </div>

        <div className="clubes-grid">
          {clubes.map((club, index) => (
            <div className="clube-card" key={index}>
              <img src={club.imagem} alt="Clube" className="clube-img" />
              <span className="tipo">{club.tipo}</span>
              <h3>{club.titulo}</h3>
              <button className="entrar">Entrar</button>
              <p className="genero">📚 {club.genero}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
