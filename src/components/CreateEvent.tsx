import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "./Navbar";
import "./CreateEvent.css";

export function CreateEvent() {
  const { id: clubeId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    data: "",
    horario: "",
    plataforma: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const criarEvento = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/api/clubes/${clubeId}/eventos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Evento criado com sucesso!");
        navigate(`/clube/${clubeId}`); // ✅ Caminho corrigido
      } else {
        alert(data.message || "Erro ao criar evento.");
      }
    } catch (err) {
      console.error("Erro:", err);
      alert("Erro na comunicação com o servidor.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="criar-evento-container">
        <header className="clubes-hero">
          <h1>Novo Evento</h1>
          <p className="subheading">Organize um novo encontro para o clube</p>
        </header>

        <div className="form-box">
          <div className="step-content">
            <label>Nome do Evento</label>
            <input
              type="text"
              name="nome"
              onChange={handleChange}
              placeholder="Ex: Discussão do Capítulo 5"
            />

            <label>Descrição (opcional)</label>
            <input
              type="text"
              name="descricao"
              onChange={handleChange}
              placeholder="Ex: Vamos compartilhar opiniões sobre o final."
            />

            <label>Data</label>
            <input type="date" name="data" onChange={handleChange} />

            <label>Horário</label>
            <input type="time" name="horario" onChange={handleChange} />

            <label>Plataforma</label>
            <input
              type="text"
              name="plataforma"
              onChange={handleChange}
              placeholder="Ex: Zoom, Google Meet"
            />

            <div className="form-navigation">
              <button onClick={() => navigate(`/clube/${clubeId}`)}>Cancelar</button>
              <button onClick={criarEvento}>Criar Evento</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}