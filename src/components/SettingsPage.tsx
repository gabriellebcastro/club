import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import "./SettingsPage.css";

type Clube = {
  _id: string;
  nome: string;
  descricao: string;
};

type Usuario = {
  _id: string;
  username: string;
  email: string;
  descricao?: string;
  foto?: string;
};

type EditableFieldProps = {
  label: string;
  value: string;
  multiline?: boolean;
  onChange: (newValue: string) => void;
};

function EditableField({ label, value, multiline = false, onChange }: EditableFieldProps) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
  if (editing) {
    if (multiline) {
      textareaRef.current?.focus();
    } else {
      inputRef.current?.focus();
    }
  }
}, [editing, multiline]);


  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleSave = () => {
    if (tempValue.trim() === "") {
      alert(`${label} não pode ficar vazio.`);
      return;
    }
    onChange(tempValue.trim());
    setEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setEditing(false);
  };

  return (
    <div className="editable-field">
      <label>{label}:</label>
      {!editing ? (
        <div className="field-display" tabIndex={0} aria-label={`${label}: ${value}`}>
          <span>{value || <i>Não informado</i>}</span>
          <button
            aria-label={`Editar ${label}`}
            className="edit-btn"
            onClick={() => setEditing(true)}
            type="button"
          >
            ✏️
          </button>
        </div>
      ) : multiline ? (
        <>
          <textarea
            ref={textareaRef}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            rows={4}
          />
          <div className="edit-controls">
            <button onClick={handleSave} className="btn-primary" type="button">Salvar</button>
            <button onClick={handleCancel} className="btn-secondary" type="button">Cancelar</button>
          </div>
        </>
      ) : (
        <>
          <input
            ref={inputRef}
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
          />
          <div className="edit-controls">
            <button onClick={handleSave} className="btn-primary" type="button">Salvar</button>
            <button onClick={handleCancel} className="btn-secondary" type="button">Cancelar</button>
          </div>
        </>
      )}
    </div>
  );
}

export function SettingsPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [clubesModerados, setClubesModerados] = useState<Clube[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function fetchUsuario() {
      try {
        const res = await fetch("http://localhost:4000/api/usuario", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erro ao buscar usuário");
        const data = await res.json();
        setUsuario(data);
      } catch {
        setStatusMsg("Erro ao carregar dados do usuário");
      }
    }

    async function fetchClubes() {
      try {
        const res = await fetch("http://localhost:4000/api/clubes/moderados", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erro ao buscar clubes");
        const data = await res.json();
        setClubesModerados(data);
      } catch {
        setStatusMsg("Erro ao carregar clubes moderados");
      }
    }

    fetchUsuario();
    fetchClubes();
  }, []);

  const atualizarCampo = (campo: keyof Usuario, valor: string) => {
    if (!usuario) return;
    setUsuario({ ...usuario, [campo]: valor });
  };

  const salvarPerfil = async () => {
    if (!usuario) return;
    setLoading(true);
    setStatusMsg(null);

    const dados = {
      username: usuario.username,
      descricao: usuario.descricao,
      foto: usuario.foto,
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/usuario", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dados),
      });

      if (!res.ok) throw new Error("Erro ao salvar perfil");
      const atualizado = await res.json();
      setUsuario(atualizado);
      setStatusMsg("Perfil atualizado com sucesso!");
    } catch {
      setStatusMsg("Erro ao salvar perfil. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const atualizarSenha = async () => {
    if (novaSenha !== confirmarSenha) {
      setStatusMsg("As senhas não coincidem.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/usuario/senha", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ novaSenha }),
      });

      if (!res.ok) throw new Error("Erro ao alterar senha");
      setNovaSenha("");
      setConfirmarSenha("");
      setStatusMsg("Senha alterada com sucesso!");
    } catch {
      setStatusMsg("Erro ao alterar senha.");
    }
  };

  const excluirConta = async () => {
    const confirmar = confirm("Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.");

    if (!confirmar) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/usuario", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erro ao excluir conta");

      localStorage.removeItem("token");
      navigate("/login");
    } catch {
      setStatusMsg("Erro ao excluir conta.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="settings-container" aria-live="polite">
        <h1>⚙️ Configurações</h1>

        {statusMsg && (
          <div className={`status-msg ${statusMsg.toLowerCase().includes("erro") ? "error" : "success"}`}>
            {statusMsg}
          </div>
        )}

        {usuario && (
          <section className="perfil-section">
            <h2>🧍 Meu Perfil</h2>

            <div className="foto-preview-container">
  {usuario.foto ? (
    <img src={usuario.foto} alt="Foto de perfil" className="foto-preview" />
  ) : (
    <div className="foto-placeholder">Sem foto</div>
  )}
</div>

<label htmlFor="uploadFoto" className="upload-label" tabIndex={0}>
  Alterar foto de perfil
</label>
<input
  id="uploadFoto"
  type="file"
  accept="image/*"
  style={{ display: "none" }}
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (!file || !usuario) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setUsuario({ ...usuario, foto: reader.result as string });
    };
    reader.readAsDataURL(file);
  }}
/>

            <EditableField
              label="Nome de usuário"
              value={usuario.username}
              onChange={(v) => atualizarCampo("username", v)}
            />

            <div className="readonly-field">
              <label>Email:</label>
              <span>{usuario.email}</span>
            </div>

            <EditableField
              label="Descrição do perfil"
              value={usuario.descricao || ""}
              multiline
              onChange={(v) => atualizarCampo("descricao", v)}
            />

            <button onClick={salvarPerfil} disabled={loading} className="btn-primary" style={{ marginTop: "1rem" }}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </section>
        )}

        {/* Alterar Senha */}
        <section className="perfil-section">
          <h2>🔐 Alterar Senha</h2>

          <label>
            Nova Senha:
            <input
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
            />
          </label>

          <label>
            Confirmar Nova Senha:
            <input
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />
          </label>

          <button onClick={atualizarSenha} className="btn-primary">
            Atualizar Senha
          </button>
        </section>

        {/* Excluir Conta */}
        <section className="perfil-section">
          <h2>⚠️ Excluir Conta</h2>
          <p>Essa ação é irreversível. Sua conta será removida permanentemente.</p>
          <button onClick={excluirConta} className="btn-danger">
            Excluir Conta
          </button>
        </section>

        {clubesModerados.length > 0 && (
          <section className="clubes-section">
            <h2>📘 Meus Clubes (Moderador)</h2>
            <ul className="clubes-lista">
              {clubesModerados.map((clube) => (
                <li key={clube._id} className="clube-config">
                  <strong>{clube.nome}</strong>
                  <p>{clube.descricao}</p>
                  <button onClick={() => (window.location.href = `/clube/${clube._id}`)} className="btn-secondary">
                    Ver Clube
                  </button>
                  <button onClick={() => (window.location.href = `/clubes/${clube._id}/editar`)} className="btn-secondary">
                    Editar Clube
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}
