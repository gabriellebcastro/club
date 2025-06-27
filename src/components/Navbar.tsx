import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

type Notificacao = {
  _id: string;
  mensagem: string;
  tipo: string;
};

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [mostrarNotificacoes, setMostrarNotificacoes] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    fetchNotificacoes();
  }, []);

  const fetchNotificacoes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/notificacoes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Erro na resposta: ${text}`);
      }

      const data = await res.json();
      console.log("Notificações recebidas:", data); // Log para ver as notificações
      setNotificacoes(data);
    } catch (err) {
      console.error("Erro ao buscar notificações:", err);
    }
  };

  const handleBellClick = async () => {
    const novoEstado = !mostrarNotificacoes;
    setMostrarNotificacoes(novoEstado);

    if (novoEstado) {
      await fetchNotificacoes();
    }
  };

  const aceitarSolicitacao = async (notificacaoId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/notificacoes/${notificacaoId}/aceitar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Solicitação aceita com sucesso.");
        await fetchNotificacoes();
      } else {
        alert(data.message || "Erro ao aceitar solicitação.");
      }
    } catch (err) {
      console.error("Erro ao aceitar solicitação:", err);
    }
  };

  const negarSolicitacao = async (notificacaoId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/notificacoes/${notificacaoId}/negar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Solicitação negada com sucesso.");
        await fetchNotificacoes(); // Atualiza a lista
      } else {
        alert(data.message || "Erro ao negar solicitação.");
      }
    } catch (err) {
      console.error("Erro ao negar solicitação:", err);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">Club</div>
      </div>

      <ul className="navbar-links">
        <li><Link to="/home">Início</Link></li>
        <li><Link to="/clubes">Clubes</Link></li>
        <li><Link to="/eventos">Eventos</Link></li>
      </ul>

      <div className="navbar-right">
        <div className="notificacoes-wrapper">
          <button className="bell" onClick={handleBellClick}>🔔</button>
          {mostrarNotificacoes && (
            <div className="notificacoes-dropdown">
              {notificacoes.length === 0 ? (
                <p className="sem-notificacao">Sem notificações</p>
              ) : (
                notificacoes.map((n) => {
                  console.log("Renderizando notificação:", n); // Log para cada notificação
                  return (
                    <div key={n._id} className="notificacao-item">
                      <span>{n.mensagem}</span>
                      {n.tipo === "solicitacao_entrada" && (
                        <>
                          <button
                            className="btn-aceitar"
                            onClick={() => aceitarSolicitacao(n._id)}
                            title="Aceitar solicitação"
                          >
                            ✔️
                          </button>
                          <button
                            className="btn-negar"
                            onClick={() => negarSolicitacao(n._id)}
                            title="Negar solicitação"
                          >
                            ❌
                          </button>
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        <div className="avatar-wrapper" onClick={toggleMenu}>
          <img
            className="avatar"
            src="https://i.pravatar.cc/40"
            alt="Perfil do usuário"
          />
          {menuOpen && (
            <div className="navbar-dropdown-menu" onMouseLeave={closeMenu}>
              <Link to="/profile">Perfil</Link>
              <Link to="/create">Criar Club</Link>
              <Link to="/estatisticas">Minhas Estatísticas</Link>
              <Link to="/configuracoes">Configurações</Link>
              <button onClick={handleLogout} className="dropdown-item">Sair</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
