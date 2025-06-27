import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateClub.css";
import { Navbar } from "./Navbar";

export function CreateClub() {
  const [etapa, setEtapa] = useState(1);
  const [formData, setFormData] = useState<Record<string, string | number>>({});
  const navigate = useNavigate(); // ✅ isso que está faltando


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const avancar = () => setEtapa((prev) => prev + 1);
  const voltar = () => setEtapa((prev) => prev - 1);

  const criarClube = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Você precisa estar logado para criar um clube.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/clubes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Clube criado com sucesso!");
        console.log("Novo clube:", data);
        navigate("/home");
      } else {
        alert(data.message || "Erro ao criar clube.");
      }
    } catch (error) {
      console.error("Erro ao criar clube:", error);
      alert("Erro na comunicação com o servidor.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="criarclub-container">
        <header className="clubes-hero">
          <h1>Crie seu Club</h1>
          <p className="subheading">Dê início ao seu próprio clube do livro.</p>
        </header>

        <div className="form-box">
          <div className="step-tabs">
            <div className={etapa === 1 ? "active" : ""}>Informações Gerais</div>
            <div className={etapa === 2 ? "active" : ""}>Imagens do Clube</div>
            <div className={etapa === 3 ? "active" : ""}>Regras e Preferências</div>
          </div>

          {etapa === 1 && (
            <div className="step-content">
              <label>Nome do Clube</label>
              <input type="text" name="nome" onChange={handleInputChange} />
              <label>Descrição do Clube</label>
              <textarea name="descricao" onChange={handleInputChange} />
              <label>Gênero</label>
              <select name="genero" onChange={handleInputChange}>
                <option value="">Escolha o gênero</option>
                <option value="Romance">Romance</option>
                <option value="Terror">Terror</option>
              </select>

              <label>Tipo</label>
              <select name="tipo" onChange={handleInputChange}>
                <option value="">Escolha o tipo</option>
                <option value="Público">Público</option>
                <option value="Privado">Privado</option>
              </select>

              <label>Formato</label>
              <select name="formato" onChange={handleInputChange}>
                <option value="">Escolha o formato</option>
                <option value="Presencial">Presencial</option>
                <option value="Online">Online</option>
              </select>

              <label>Frequência</label>
              <select name="frequencia" onChange={handleInputChange}>
                <option value="">Escolha a frequência</option>
                <option value="Semanal">Semanal</option>
                <option value="Mensal">Mensal</option>
              </select>

              <label>Limite</label>
              <input type="number" name="limite" onChange={handleInputChange} />
              <label>Faixa Etária</label>
              <input type="text" name="faixa" onChange={handleInputChange} />
              <div className="form-navigation">
                <button disabled>Voltar</button>
                <button onClick={avancar}>Próximo</button>
              </div>
            </div>
          )}

          {etapa === 2 && (
            <div className="step-content">
              <label>Capa</label>
              <input type="file" disabled />
              <label>Foto Perfil</label>
              <input type="file" disabled />
              <div className="form-navigation">
                <button onClick={voltar}>Voltar</button>
                <button onClick={avancar}>Próximo</button>
              </div>
            </div>
          )}

          {etapa === 3 && (
            <div className="step-content">
              <label>Regras</label>
              <textarea name="regras" onChange={handleInputChange} />
              <label>Política</label>
              <input name="politica" onChange={handleInputChange} />
              <label>Novos Membros</label>
              <input
                type="radio"
                name="novos"
                value="Sim"
                onChange={handleInputChange}
              />{" "}
              Sim
              <input
                type="radio"
                name="novos"
                value="Não"
                onChange={handleInputChange}
              />{" "}
              Não
              <label>Convidados</label>
              <input
                type="radio"
                name="convidados"
                value="Sim"
                onChange={handleInputChange}
              />{" "}
              Sim
              <input
                type="radio"
                name="convidados"
                value="Não"
                onChange={handleInputChange}
              />{" "}
              Não
              <div className="form-navigation">
                <button onClick={voltar}>Voltar</button>
                <button onClick={criarClube}>Criar Club</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
