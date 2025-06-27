import { useState, useEffect } from "react";
import "./Clubes.css";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "./Navbar";
import { useNavigate } from "react-router-dom";


type Clube = {
  _id: string;
  nome: string;
  tipo: string;
  genero: string;
  imagem?: string;
};

export function ClubesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [tab, setTab] = useState(tabParam || "encontrar");
  const [showEncontrosDropdown, setShowEncontrosDropdown] = useState(false);
  const [clubes, setClubes] = useState<Clube[]>([]);

  useEffect(() => {
    const fetchClubes = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/clubes");
        const data = await res.json();
        setClubes(data);
      } catch (err) {
        console.error("Erro ao buscar clubes:", err);
      }
    };

    fetchClubes();
  }, []);

  const solicitarEntrada = async (clubeId: string) => {
  try {
    const token = localStorage.getItem("token"); // Ajuste conforme seu auth
    const res = await fetch(`http://localhost:4000/api/clubes/${clubeId}/solicitar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (res.ok) {
      alert("Solicitação enviada ao moderador!");
    } else {
      alert(data.message || "Erro ao solicitar entrada.");
    }
  } catch (error) {
    console.error("Erro ao solicitar entrada:", error);
    alert("Erro ao solicitar entrada.");
  }
};

  return (
    <>
      <Navbar />
      <div className="clubes-hero">
        <h1>Encontre seu Club</h1>
        <p className="subheading">Sua próxima história inesquecível começa aqui.</p>

        <div className="tabs">
          <button className={tab === "encontrar" ? "active" : ""} onClick={() => setTab("encontrar")}>
            Encontrar Clubes
          </button>
          <button className={tab === "meus" ? "active" : ""} onClick={() => setTab("meus")}>
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
              <button className="dropdown-toggle" onClick={() => setShowEncontrosDropdown(!showEncontrosDropdown)}>
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
              <img src="https://via.placeholder.com/150x100" alt="Clube" className="clube-img" />
              <span className="tipo">{club.tipo}</span>
              <h3>{club.nome}</h3>
              <button
                className="entrar"
                onClick={() => {
                  if (club.tipo === "Público") {
                    navigate(`/clube/${club._id}`);
                  } else {
                    if (window.confirm("Este clube é privado. Deseja solicitar entrada?")) {
                      solicitarEntrada(club._id);
                    }
                  }
                }}
              >
                Entrar
              </button>
              <p className="genero">📚 {club.genero}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
