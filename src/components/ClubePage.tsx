import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import "./ClubePage.css";

type Clube = {
  _id: string;
  nome: string;
  descricao: string;
  genero: string;
  tipo: string;
  formato: string;
  frequencia: string;
  limite: number;
  regras: string;
  politica: string;
  moderador: string | { _id: string };
  ehModerador?: boolean;
  ehMembro?: boolean;
};

export function ClubePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clube, setClube] = useState<Clube | null>(null);

  useEffect(() => {
    const fetchClube = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:4000/api/clubes/${id}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        const data = await res.json();
        setClube(data);
      } catch (err) {
        console.error("Erro ao buscar clube:", err);
      }
    };

    fetchClube();
  }, [id]);

  const participarDoClube = async (clubeId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/clubes/${clubeId}/entrar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert("Você agora faz parte do clube!");
        setClube(prev => (prev ? { ...prev, ehMembro: true } : prev));
      } else {
        alert(data.message || "Erro ao entrar no clube.");
      }
    } catch (error) {
      console.error("Erro ao entrar no clube:", error);
    }
  };

  return (
    <>
      <Navbar />

      <header className="clubes-hero">
        <h1>{clube?.nome || "Carregando..."}</h1>
        <p className="subheading">{clube?.descricao || "Buscando informações do clube..."}</p>
      </header>

      {clube?.tipo === "Público" && !clube.ehMembro && (
        <div className="btn-container">
          <button
            className="btn-fazer-parte"
            onClick={() => {
              if (window.confirm("Deseja entrar neste clube?")) {
                participarDoClube(clube._id);
              }
            }}
          >
            Fazer parte do clube
          </button>
        </div>
      )}

      <main className="clube-container">
        <section className="clube-info">
          <h2>Informações Gerais</h2>
          <ul>
            <li><strong>Gênero:</strong> {clube?.genero || "—"}</li>
            <li><strong>Tipo:</strong> {clube?.tipo || "—"}</li>
            <li><strong>Formato:</strong> {clube?.formato || "—"}</li>
            <li><strong>Frequência:</strong> {clube?.frequencia || "—"}</li>
            <li><strong>Participantes:</strong> — / {clube?.limite || "—"}</li>
          </ul>
        </section>

        <section className="clube-leitura">
          <h2>Leitura do Mês</h2>
          <div className="leitura-box">
            <img src="/capa-livro-exemplo.jpg" alt="Capa do Livro" />
            <div>
              <h3>A Biblioteca da Meia-Noite</h3>
              <p>Autor: Matt Haig</p>
              <p>Início: 01/06/2025</p>
              <p>Término previsto: 30/06/2025</p>
            </div>
          </div>
        </section>

        <section className="clube-progresso">
          <h2>Progresso</h2>
          <div className="progress-bar">
            <div className="progress" style={{ width: "45%" }}>45%</div>
          </div>
        </section>

        <section className="clube-eventos">
          <div className="eventos-header">
            <h2>📅 Próximos Eventos</h2>

            {clube?.ehModerador ? (
              <button
                className="btn-criar-evento"
                onClick={() => navigate(`/clubes/${clube._id}/eventos/novo`)} // ✅ REDIRECIONAMENTO AQUI
              >
                + Criar Evento
              </button>
            ) : clube?.ehMembro ? (
              <p>Próximo evento: 28/06/2025</p>
            ) : (
              <p>Entre no clube para ver os eventos.</p>
            )}
          </div>

          {(clube?.ehModerador || clube?.ehMembro) && (
            <div className="eventos-lista">
              <div className="evento-card">
                <h3>Discussão da Parte 1</h3>
                <p><strong>Data:</strong> 28/06/2025</p>
                <p><strong>Horário:</strong> 19:00</p>
                <p><strong>Plataforma:</strong> Google Meet</p>
              </div>

              <div className="evento-card">
                <h3>Encontro Literário Especial</h3>
                <p><strong>Data:</strong> 05/07/2025</p>
                <p><strong>Horário:</strong> 20:00</p>
                <p><strong>Plataforma:</strong> Zoom</p>
              </div>
            </div>
          )}
        </section>

        <section className="clube-regras">
          <h2>Regras do Clube</h2>
          <ul>
            {clube?.regras ? (
              clube.regras.split(".").map((r, i) => r.trim() && <li key={i}>{r.trim()}.</li>)
            ) : (
              <>
                <li>Respeito é essencial.</li>
                <li>Evite spoilers sem aviso.</li>
                <li>Participação nos encontros é incentivada.</li>
              </>
            )}
          </ul>

          <h3>Política de Faltas</h3>
          <p>{clube?.politica || "3 faltas consecutivas sem aviso resultam em remoção do clube."}</p>
        </section>

        <section className="clube-participantes">
          <h2>Membros</h2>
          <div className="membros-lista">
            <div className="membro">📚 Ana Paula</div>
            <div className="membro">📚 João Silva</div>
            <div className="membro">📚 Carla Mendes</div>
          </div>
        </section>
      </main>
    </>
  );
}