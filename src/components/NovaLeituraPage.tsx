import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "./Navbar";
import "./NovaLeituraPage.css";

export function NovaLeituraPage() {
  const { id: clubeId } = useParams();
  const navigate = useNavigate();

  // Estado do formulário, sem campo nota (que vai ser depois inserida por cada usuário)
  const [formData, setFormData] = useState({
    titulo: "",
    autor: "",
    genero: "",
    descricao: "",
    dataTermino: "",
  });
  const [capa, setCapa] = useState<File | null>(null);

  const [isModerador, setIsModerador] = useState(false);
  const [loading, setLoading] = useState(true);

  // Função para buscar clube e verificar se o usuário é moderador
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado.");
      navigate("/");
      return;
    }

    async function fetchClube() {
      try {
        const res = await fetch(`http://localhost:4000/api/clubes/${clubeId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Falha ao buscar clube");

        const clube = await res.json();

        // Pegando id do moderador (string)
        const moderadorId = typeof clube.moderador === "object" ? clube.moderador._id : clube.moderador;

        // Decodifica token para pegar id do usuário
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (moderadorId === payload.id) {
          setIsModerador(true);
        } else {
          setIsModerador(false);
        }
      } catch (err) {
        console.error(err);
        alert("Erro ao verificar permissão.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    }

    fetchClube();
  }, [clubeId, navigate]);

  // Atualiza campos do form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Função para criar a leitura
  const criarLeitura = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado.");
      return;
    }

    try {
      const formPayload = new FormData();
      if (capa) formPayload.append("capa", capa);
      formPayload.append("titulo", formData.titulo);
      formPayload.append("autor", formData.autor);
      formPayload.append("genero", formData.genero);
      formPayload.append("descricao", formData.descricao);
      formPayload.append("dataFim", formData.dataTermino);

      const res = await fetch(`http://localhost:4000/api/clubes/${clubeId}/leitura`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formPayload,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Leitura cadastrada com sucesso!");
        navigate(`/clube/${clubeId}`);
      } else {
        alert(data.message || "Erro ao cadastrar leitura.");
      }
    } catch (err) {
      console.error("Erro:", err);
      alert("Erro na comunicação com o servidor.");
    }
  };

  if (loading) return <p>Carregando...</p>;

  if (!isModerador) {
    return (
      <>
        <Navbar />
        <div style={{ padding: 20 }}>
          <h2>Você não tem permissão para cadastrar a leitura neste clube.</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="criar-evento-container">
        <header className="clubes-hero">
          <h1>📚 Nova Leitura</h1>
          <p className="subheading">Cadastre a leitura do mês para este clube</p>
        </header>

        <div className="form-box">
          <div className="step-content">
            <label>Imagem da Capa</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCapa(e.target.files?.[0] || null)}
            />

            <label>Nome do Livro</label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
            />

            <label>Autor</label>
            <input
              type="text"
              name="autor"
              value={formData.autor}
              onChange={handleChange}
              required
            />

            <label>Gênero</label>
            <input
              type="text"
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              required
            />

            <label>Descrição</label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              rows={4}
              required
            />

            <label>Data Final de Leitura</label>
            <input
              type="date"
              name="dataTermino"
              value={formData.dataTermino}
              onChange={handleChange}
              required
            />

            <div className="form-navigation">
              <button onClick={() => navigate(`/clube/${clubeId}`)}>Cancelar</button>
              <button onClick={criarLeitura}>Salvar Leitura</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}