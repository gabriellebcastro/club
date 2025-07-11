import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateClub.css";
import { Navbar } from "./Navbar";
import { FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa";

// Tipagem explícita para os dados do formulário, incluindo File para uploads
type FormDataType = {
  [key: string]: string | number | File | undefined;
};

export function CreateClub() {
  const [etapa, setEtapa] = useState(1);
  const [formData, setFormData] = useState<FormDataType>({});
  const navigate = useNavigate();

  // Manipula inputs de texto, select e textarea
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manipula o input de arquivo (upload de imagem)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const { name } = e.target;
    setFormData((prev) => ({ ...prev, [name]: file }));
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
      // Cria FormData para enviar dados multipart (textos + arquivo)
      const formPayload = new FormData();

      for (const key in formData) {
        const value = formData[key];
        if (value instanceof File) {
          formPayload.append(key, value);
        } else if (value !== undefined) {
          formPayload.append(key, String(value));
        }
      }

      const response = await fetch("http://localhost:4000/api/clubes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // NÃO colocar Content-Type aqui!
        },
        body: formPayload,
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

      <header className="clubes-hero">
        <h1>Crie seu Club</h1>
        <p className="subheading">Dê início ao seu próprio clube do livro.</p>
      </header>
      <div className="criarclub-container">
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
                <option value="Ficção Científica">Ficção Científica</option>
                <option value="Fantasia">Fantasia</option>
                <option value="Mistério">Mistério</option>
                <option value="Thriller">Thriller</option>
                <option value="Terror">Terror</option>
                <option value="Aventura">Aventura</option>
                <option value="Biografia">Biografia</option>
                <option value="História">História</option>
                <option value="Clássicos">Clássicos</option>
                <option value="Poesia">Poesia</option>
                <option value="Drama">Drama</option>
                <option value="Autoajuda">Autoajuda</option>
                <option value="Não Ficção">Não Ficção</option>
                <option value="Young Adult (YA)">Young Adult (YA)</option>
                <option value="Infantojuvenil">Infantojuvenil</option>
                <option value="Erótico">Erótico</option>
                <option value="Filosofia">Filosofia</option>
                <option value="Espiritualidade">Espiritualidade</option>
                <option value="Psicologia">Psicologia</option>
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
                <button disabled>
                  <FaArrowLeft style={{ marginRight: 8 }} />
                  Voltar
                </button>
                <button onClick={avancar}>
                  Próximo
                  <FaArrowRight style={{ marginLeft: 8 }} />
                </button>
              </div>
            </div>
          )}

          {etapa === 2 && (
            <div className="step-content">
              <label>Capa</label>
              <input type="file" name="capa" onChange={handleFileChange} />
              {/* Foto perfil removida */}
              <div className="form-navigation">
                <button onClick={voltar}>
                  <FaArrowLeft style={{ marginRight: 8 }} />
                  Voltar
                </button>
                <button onClick={avancar}>
                  Próximo
                  <FaArrowRight style={{ marginLeft: 8 }} />
                </button>
              </div>
            </div>
          )}

          {etapa === 3 && (
            <div className="step-content">
              <label>Regras</label>
              <textarea name="regras" onChange={handleInputChange} />

              <label>Política de faltas</label>
              <input name="politica" onChange={handleInputChange} />

              <label>Aceita novos membros?</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="novos"
                    value="Sim"
                    onChange={handleInputChange}
                  />
                  Sim
                </label>
                <label>
                  <input
                    type="radio"
                    name="novos"
                    value="Não"
                    onChange={handleInputChange}
                  />
                  Não
                </label>
              </div>

              <label>Aceita convidados?</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="convidados"
                    value="Sim"
                    onChange={handleInputChange}
                  />
                  Sim
                </label>
                <label>
                  <input
                    type="radio"
                    name="convidados"
                    value="Não"
                    onChange={handleInputChange}
                  />
                  Não
                </label>
              </div>

              <div className="form-navigation">
                <button onClick={voltar}>
                  <FaArrowLeft style={{ marginRight: 8 }} />
                  Voltar
                </button>
                <button onClick={criarClube}>
                  <FaCheck style={{ marginRight: 8 }} />
                  Criar Club
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}