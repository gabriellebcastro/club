import { useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import "./EventosPage.css";

type Evento = {
  _id: string;
  nome: string;
  descricao?: string;
  data: string;
  horario: string;
  plataforma: string;
  clube: {
    _id: string;
    nome: string;
    imagem?: string;
  };
};

export function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:4000/api/eventos", {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const data = await res.json();
        setEventos(data);
      } catch (err) {
        console.error("Erro ao buscar eventos:", err);
      }
    };

    fetchEventos();
  }, []);

  return (
    <>
      <Navbar />
  <header className="eventos-hero">
    <h1> Seus Eventos</h1>
    <p className="subheading">
          Seus próximos eventos agendados.
        </p>
  </header>
  <main className="eventos-page-container">
    {eventos.length === 0 ? (
      <p className="sem-eventos">Nenhum evento encontrado.</p>
    ) : (
      <div className="eventos-grid">
        {eventos.map((evento) => (
          <div key={evento._id} className="evento-card-grid">
            <div className="evento-clube-header">
              <strong>Clube:</strong> {evento.clube.nome}
            </div>
            <h2>{evento.nome}</h2>
            {evento.descricao && <p className="descricao">{evento.descricao}</p>}
            <p><strong>Data:</strong> {new Date(evento.data).toLocaleDateString()}</p>
            <p><strong>Horário:</strong> {evento.horario}</p>
            <p><strong>Plataforma:</strong> {evento.plataforma}</p>
          </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
