import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import "./ClubePage.css";

type Usuario = {
  _id: string;
  username: string;
};

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
  moderador: Usuario;
  membros?: Usuario[];
  ehModerador?: boolean;
  ehMembro?: boolean;
};

type Evento = {
  _id: string;
  nome: string;
  descricao?: string;
  data: string;
  horario: string;
  plataforma: string;
};

type Leitura = {
  _id: string;
  titulo: string;
  autor: string;
  genero: string;
  descricao?: string;
  dataFim: string;
  capa?: string;
};

export function ClubePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clube, setClube] = useState<Clube | null>(null);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [leitura, setLeitura] = useState<Leitura | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchClube = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/clubes/${id}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        if (!res.ok) throw new Error("Erro ao buscar clube");
        const data = await res.json();
        setClube(data);
      } catch (err) {
        console.error("Erro ao buscar clube:", err);
      }
    };

    const fetchEventos = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/clubes/${id}/eventos`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        if (!res.ok) throw new Error("Erro ao buscar eventos");
        const data = await res.json();
        const hoje = new Date();
        const eventosFuturos = data.filter(
          (evento: Evento) => new Date(evento.data) >= hoje
        );
        setEventos(eventosFuturos);
      } catch (err) {
        console.error("Erro ao buscar eventos:", err);
      }
    };

    const fetchLeitura = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/clubes/${id}/leitura`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        if (res.ok) {
          const data = await res.json();
          setLeitura(data);
        } else {
          // Nenhuma leitura cadastrada ou erro, limpa leitura
          setLeitura(null);
        }
      } catch (err) {
        console.error("Erro ao buscar leitura:", err);
        setLeitura(null);
      }
    };

    fetchClube();
    fetchEventos();
    fetchLeitura();
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
        setClube((prev) =>
          prev ? { ...prev, ehMembro: true, membros: data.membros } : prev
        );
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
        <p className="subheading">
          {clube?.descricao || "Buscando informações do clube..."}
        </p>
      </header>

      {clube?.tipo === "Público" && !clube?.ehMembro && (
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
            <li>
              <strong>Gênero:</strong> {clube?.genero || "—"}
            </li>
            <li>
              <strong>Tipo:</strong> {clube?.tipo || "—"}
            </li>
            <li>
              <strong>Formato:</strong> {clube?.formato || "—"}
            </li>
            <li>
              <strong>Frequência:</strong> {clube?.frequencia || "—"}
            </li>
            <li>
              <strong>Participantes:</strong> {clube?.membros?.length ?? 0} /{" "}
              {clube?.limite ?? "—"}
            </li>
          </ul>
        </section>

        <section className="clube-leitura">
          <div className="leitura-header">
            <h2>Leitura do Mês</h2>
            {clube?.ehModerador && (
              <button
                className="btn-criar-evento"
                onClick={() => navigate(`/clubes/${clube?._id}/leitura/nova`)}
              >
                + Cadastrar Leitura
              </button>
            )}
          </div>

          {leitura ? (
            <div className="leitura-box">
              <img
                src={
                  leitura.capa
                    ? `http://localhost:4000/uploads/${leitura.capa}`
                    : "/capa-livro-exemplo.jpg"
                }
                alt={`Capa do livro ${leitura.titulo}`}
              />
              <div>
                <h3>{leitura.titulo}</h3>
                <p>Autor: {leitura.autor}</p>
                <p>Gênero: {leitura.genero}</p>
                <p>
                  Término previsto:{" "}
                  {new Date(leitura.dataFim).toLocaleDateString("pt-BR")}
                </p>
                {leitura.descricao && <p>{leitura.descricao}</p>}
              </div>
            </div>
          ) : (
            <p>Nenhuma leitura cadastrada.</p>
          )}
        </section>

        {/* resto da página permanece igual... */}

        <section className="clube-progresso">
          <h2>Progresso</h2>
          <div className="progress-bar">
            <div className="progress" style={{ width: "45%" }}>
              45%
            </div>
          </div>
        </section>

        <section className="clube-eventos">
          <div className="eventos-header">
            <h2>📅 Próximos Eventos</h2>

            {clube?.ehModerador ? (
              <button
                className="btn-criar-evento"
                onClick={() => navigate(`/clubes/${clube._id}/eventos/novo`)}
              >
                + Criar Evento
              </button>
            ) : clube?.ehMembro ? (
              eventos.length > 0 ? (
                <p>
                  Próximo evento:{" "}
                  {new Date(eventos[0].data).toLocaleDateString()}
                </p>
              ) : (
                <p>Não há eventos agendados.</p>
              )
            ) : (
              <p>Entre no clube para ver os eventos.</p>
            )}
          </div>

          {(clube?.ehModerador || clube?.ehMembro) && (
            <div className="eventos-lista">
              {eventos.length > 0 ? (
                eventos.map((evento) => (
                  <div key={evento._id} className="evento-card">
                    <h3>{evento.nome}</h3>
                    {evento.descricao && <p>{evento.descricao}</p>}
                    <p>
                      <strong>Data:</strong>{" "}
                      {new Date(evento.data).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Horário:</strong> {evento.horario}
                    </p>
                    <p>
                      <strong>Plataforma:</strong> {evento.plataforma}
                    </p>
                  </div>
                ))
              ) : (
                <p style={{ padding: "8px" }}>Nenhum evento futuro agendado.</p>
              )}
            </div>
          )}
        </section>

        <section className="clube-regras">
          <h2>Regras do Clube</h2>
          <ul>
            {clube?.regras ? (
              clube.regras
                .split(".")
                .map((r, i) => r.trim() && <li key={i}>{r.trim()}.</li>)
            ) : (
              <>
                <li>Respeito é essencial.</li>
                <li>Evite spoilers sem aviso.</li>
                <li>Participação nos encontros é incentivada.</li>
              </>
            )}
          </ul>

          <h3>Política de Faltas</h3>
          <p>
            {clube?.politica ||
              "3 faltas consecutivas sem aviso resultam em remoção do clube."}
          </p>
        </section>

        <section className="clube-participantes">
          <h2>Membros</h2>
          <div className="membros-lista">
            {clube?.membros?.length ? (
              clube.membros.map((membro) => (
                <div key={membro._id} className="membro">
                  📚 {membro.username}
                </div>
              ))
            ) : (
              <p>Nenhum membro ainda.</p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}