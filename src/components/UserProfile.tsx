import { Navbar } from "./Navbar";
import "./UserProfile.css";

export function UserProfile() {
  return (
    <>
      <Navbar />

      <header className="perfil-hero">
        <div className="perfil-header-content">
          <img className="perfil-foto" src="https://i.pravatar.cc/150" alt="Foto de Perfil" />
          <h1>Gabrielle Castro</h1>
          <p className="perfil-bio">Amante de romances históricos e leitora compulsiva nas madrugadas. 💫</p>
        </div>
      </header>

      <main className="perfil-container">
        <h2>📚 Livros Lidos</h2>
        <div className="livros-grid">
          <div className="livro-card">
            <img src="/assets/livro1.jpg" alt="Livro 1" />
            <h3>A Biblioteca da Meia-Noite</h3>
            <p>Matt Haig</p>
          </div>
          <div className="livro-card">
            <img src="/assets/livro2.jpg" alt="Livro 2" />
            <h3>Pequenas Grandes Mentiras</h3>
            <p>Liane Moriarty</p>
          </div>
          <div className="livro-card">
            <img src="/assets/livro3.jpg" alt="Livro 3" />
            <h3>É Assim que Acaba</h3>
            <p>Colleen Hoover</p>
          </div>
          {/* Adicione mais livros conforme necessário */}
        </div>
      </main>
    </>
  );
}
