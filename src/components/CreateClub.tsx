import { useState } from "react";
import "./CreateClub.css";

export function CreateClub() {
  const [etapa, setEtapa] = useState(1);
  const [formData, setFormData] = useState({});

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

  const avancar = () => setEtapa((prev) => prev + 1);
  const voltar = () => setEtapa((prev) => prev - 1);

  return (
    <div className="criarclub-page">
      <header className="hero">
        <h1>Crie seu Club</h1>
        <p>Dê início ao seu próprio clube do livro.</p>
      </header>

      <div className="form-container">
        <div className="form-tabs">
          <span className={etapa === 1 ? "active" : ""}>Informações Gerais</span>
          <span className={etapa === 2 ? "active" : ""}>Imagens do Clube</span>
          <span className={etapa === 3 ? "active" : ""}>Regras e Preferências</span>
        </div>

        {etapa === 1 && (
          <div className="form-step">
            <h2>Informações gerais</h2>
            <input type="text" name="nome" placeholder="Nome do Clube" onChange={handleInputChange} />
            <textarea name="descricao" placeholder="Descrição do Clube" onChange={handleInputChange} />
            <select name="genero" onChange={handleInputChange}>
              <option>Gênero Literário Principal</option>
              <option>Romance</option>
              <option>Terror</option>
            </select>
            <select name="tipo" onChange={handleInputChange}>
              <option>Tipo do Clube</option>
              <option>Público</option>
              <option>Privado</option>
            </select>
            <select name="formato" onChange={handleInputChange}>
              <option>Formato dos Encontros</option>
              <option>Presencial</option>
              <option>Online</option>
            </select>
            <select name="frequencia" onChange={handleInputChange}>
              <option>Frequência dos Encontros</option>
              <option>Semanal</option>
              <option>Mensal</option>
            </select>
            <input type="number" name="limite" placeholder="Número Máximo de Participantes" onChange={handleInputChange} />
            <input type="text" name="faixa" placeholder="Idade recomendada/Faixa Etária" onChange={handleInputChange} />
            <div className="form-actions">
              <button disabled>Voltar</button>
              <button onClick={avancar}>Próximo</button>
            </div>
          </div>
        )}

        {etapa === 2 && (
          <div className="form-step">
            <h2>Imagens do Club</h2>
            <div className="upload-box">
              <p>Capa do Club</p>
              <input type="file" accept="image/*" />
            </div>
            <div className="upload-box">
              <p>Foto de Perfil do Club</p>
              <input type="file" accept="image/*" />
            </div>
            <div className="form-actions">
              <button onClick={voltar}>Voltar</button>
              <button onClick={avancar}>Próximo</button>
            </div>
          </div>
        )}

        {etapa === 3 && (
          <div className="form-step">
            <h2>Regras e Preferências</h2>
            <textarea name="regras" placeholder="Regras de Convivência" onChange={handleInputChange} />
            <input name="politica" placeholder="Política de Faltas" onChange={handleInputChange} />
            <div className="radio-group">
              <label> Aceita novos membros?
                <input type="radio" name="novos" value="Sim" onChange={handleInputChange} /> Sim
                <input type="radio" name="novos" value="Não" onChange={handleInputChange} /> Não
              </label>
            </div>
            <div className="radio-group">
              <label> Aceita convidados nos encontros?
                <input type="radio" name="convidados" value="Sim" onChange={handleInputChange} /> Sim
                <input type="radio" name="convidados" value="Não" onChange={handleInputChange} /> Não
              </label>
            </div>
            <div className="form-actions">
              <button onClick={voltar}>Voltar</button>
              <button onClick={() => console.log(formData)}>Criar Club</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
