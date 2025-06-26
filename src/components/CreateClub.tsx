import { useState } from "react";
import "./CreateClub.css";
import { Navbar } from "./Navbar";
import axios from 'axios';

export function CreateClub() {
  const [etapa, setEtapa] = useState(1);
  const [formData, setFormData] = useState({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const avancar = () => setEtapa((prev) => prev + 1);
  const voltar = () => setEtapa((prev) => prev - 1);

  const criarClub = async () => {
  try {
    const res = await axios.post('http://localhost:4000/api/clubs', formData);
    alert('Clube criado com sucesso!');
    console.log(res.data);
  } catch (err) {
    console.error(err);
    alert('Erro ao criar clube!');
  }
};


  return (
    <>
      {/* Navbar separada para não herdar estilo */}
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

          {/* Etapas do formulário */}
          {etapa === 1 && (
            <div className="step-content">
              <label>Nome do Clube</label>
              <input type="text" name="nome" onChange={handleInputChange} />

              <label>Descrição do Clube</label>
              <textarea name="descricao" onChange={handleInputChange} />

              <label>Gênero Literário Principal</label>
              <select name="genero" onChange={handleInputChange}>
                <option value="">Escolha o gênero</option>
                <option>Romance</option>
                <option>Terror</option>
              </select>

              <label>Tipo do Clube</label>
              <select name="tipo" onChange={handleInputChange}>
                <option value="">Escolha o tipo</option>
                <option>Público</option>
                <option>Privado</option>
              </select>

              <label>Formato dos Encontros</label>
              <select name="formato" onChange={handleInputChange}>
                <option value="">Escolha o formato</option>
                <option>Presencial</option>
                <option>Online</option>
              </select>

              <label>Frequência dos Encontros</label>
              <select name="frequencia" onChange={handleInputChange}>
                <option value="">Escolha a frequência</option>
                <option>Semanal</option>
                <option>Mensal</option>
              </select>

              <label>Número Máximo de Participantes</label>
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
              <label>Capa do Club</label>
              <div className="upload-box">
                <p>Arraste ou selecione uma imagem</p>
                <input type="file" accept="image/*" />
              </div>

              <label>Foto de Perfil</label>
              <div className="upload-box">
                <p>Arraste ou selecione uma imagem</p>
                <input type="file" accept="image/*" />
              </div>

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

              <label>Política de Faltas</label>
              <input name="politica" onChange={handleInputChange} />

              <label>Aceita novos membros?</label>
              <div className="radio-group">
                <label>
                  <input type="radio" name="novos" value="Sim" onChange={handleInputChange} /> Sim
                </label>
                <label>
                  <input type="radio" name="novos" value="Não" onChange={handleInputChange} /> Não
                </label>
              </div>

              <label>Aceita convidados?</label>
              <div className="radio-group">
                <label>
                  <input type="radio" name="convidados" value="Sim" onChange={handleInputChange} /> Sim
                </label>
                <label>
                  <input type="radio" name="convidados" value="Não" onChange={handleInputChange} /> Não
                </label>
              </div>

              <div className="form-navigation">
                <button onClick={voltar}>Voltar</button>
                <button onClick={criarClub}>Criar Club</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
