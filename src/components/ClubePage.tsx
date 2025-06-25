import { Navbar } from "./Navbar";
import "./ClubePage.css";

export function ClubePage() {
  return (
    <>
      <Navbar />

      <header className="clubes-hero">
        <h1>Clube Café com Livros</h1>
        <p className="subheading">Um espaço para amantes da literatura contemporânea se reunirem e discutirem grandes obras.</p>
      </header>

      <main className="clube-container">
        <section className="clube-info">
          <h2>Informações Gerais</h2>
          <ul>
            <li><strong>Gênero:</strong> Romance contemporâneo</li>
            <li><strong>Tipo:</strong> Público</li>
            <li><strong>Formato:</strong> Online</li>
            <li><strong>Frequência:</strong> Semanal</li>
            <li><strong>Participantes:</strong> 14 / 20</li>
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

        <section className="clube-regras">
          <h2>Regras do Clube</h2>
          <ul>
            <li>Respeito é essencial.</li>
            <li>Evite spoilers sem aviso.</li>
            <li>Participação nos encontros é incentivada.</li>
          </ul>

          <h3>Política de Faltas</h3>
          <p>3 faltas consecutivas sem aviso resultam em remoção do clube.</p>
        </section>

        <section className="clube-participantes">
          <h2>Membros</h2>
          <div className="membros-lista">
            <div className="membro">📚 Ana Paula</div>
            <div className="membro">📚 João Silva</div>
            <div className="membro">📚 Carla Mendes</div>
            {/* Adicione mais conforme necessário */}
          </div>
        </section>
      </main>
    </>
  );
}
