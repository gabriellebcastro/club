import { useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import "./UserProfile.css";

type Usuario = {
  _id: string;
  username: string;
  descricao?: string;
  foto?: string;
};

export function UserProfile() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUsuario = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/usuario", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erro ao buscar perfil");
        const data = await res.json();
        setUsuario(data);
      } catch (err) {
        console.error("Erro ao carregar perfil do usuário", err);
      }
    };

    fetchUsuario();
  }, []);

  return (
    <>
      <Navbar />

      <header className="perfil-hero">
        <div className="perfil-header-content">
          <img
            className="perfil-foto"
            src={usuario?.foto || "/assets/placeholder.jpg"}
            alt="Foto de Perfil"
          />
          <h1>{usuario?.username || "Usuário Desconhecido"}</h1>
          <p className="perfil-bio">
            {usuario?.descricao || "Este usuário ainda não escreveu uma bio."}
          </p>
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
        </div>
      </main>
    </>
  );
}