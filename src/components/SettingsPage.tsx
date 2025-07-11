import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import "./SettingsPage.css";

type Clube = {
  _id: string;
  nome: string;
  descricao?: string;
  genero?: string;
  tipo?: string;
  formato?: string;
  frequencia?: string;
  limite?: number;
  faixa?: string;
  regras?: string;
  politica?: string;
  novos?: string;
  convidados?: string;
  membros?: Usuario[];
  moderador?: Usuario | null;
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
  value: string | number | undefined;
  type?: "text" | "textarea" | "number" | "select" | "radio";
  options?: string[]; // para select e radio
  name?: string; // para radio group name
  disabled?: boolean;
  onChange: (novoValor: any) => void;
};

function EditableField({
  label,
  value,
  onChange,
  type = "text",
  options,
  name,
  disabled = false,
}: EditableFieldProps) {
  const [editando, setEditando] = useState(false);
  const [valorInterno, setValorInterno] = useState(value ?? "");

  useEffect(() => {
    setValorInterno(value ?? "");
  }, [value]);

  function salvar() {
    onChange(valorInterno);
    setEditando(false);
  }
  function cancelar() {
    setValorInterno(value ?? "");
    setEditando(false);
  }

  if (disabled) {
    // modo somente leitura, só mostra o valor com label
    return (
      <div className="editable-field">
        <label>{label}:</label>
        <div className="field-display" tabIndex={0}>
          <span>{String(value ?? "(não definido)")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="editable-field">
      <label>{label}:</label>
      {editando ? (
        <>
          {type === "textarea" ? (
            <textarea
              value={valorInterno}
              onChange={(e) => setValorInterno(e.target.value)}
              rows={4}
            />
          ) : type === "select" && options ? (
            <select
              value={valorInterno}
              onChange={(e) => setValorInterno(e.target.value)}
            >
              <option value="">Selecione...</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : type === "radio" && options && name ? (
            <fieldset>
              <legend>{label}</legend>
              {options.map((opt) => (
                <label key={opt} style={{ marginRight: "1rem" }}>
                  <input
                    type="radio"
                    name={name}
                    value={opt}
                    checked={valorInterno === opt}
                    onChange={() => setValorInterno(opt)}
                  />
                  {opt}
                </label>
              ))}
            </fieldset>
          ) : (
            <input
              type={type}
              value={valorInterno}
              onChange={(e) => {
                if (type === "number") setValorInterno(e.target.value);
                else setValorInterno(e.target.value);
              }}
            />
          )}
          <div className="edit-controls">
            <button className="btn-primary" onClick={salvar}>
              Salvar
            </button>
            <button className="btn-secondary" onClick={cancelar}>
              Cancelar
            </button>
          </div>
        </>
      ) : (
        <div className="field-display" tabIndex={0}>
          <span>{String(value ?? "(não definido)")}</span>
          <button
            type="button"
            className="edit-btn"
            aria-label={`Editar ${label}`}
            onClick={() => setEditando(true)}
          >
            ✏️
          </button>
        </div>
      )}
    </div>
  );
}

export function SettingsPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [clubesModerados, setClubesModerados] = useState<Clube[]>([]);
  const [clubesEditando, setClubesEditando] = useState<Record<string, Clube>>({});
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

  // Atualizar usuário localmente
  const atualizarCampoUsuario = (campo: keyof Usuario, valor: string) => {
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
    if (
      !window.confirm(
        "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita."
      )
    )
      return;

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

  // Edição dos clubes

  // Iniciar edição: cria cópia editável
  const iniciarEdicaoClube = (clube: Clube) => {
    setClubesEditando((prev) => ({ ...prev, [clube._id]: { ...clube } }));
  };

  // Cancelar edição
  const cancelarEdicaoClube = (id: string) => {
    setClubesEditando((prev) => {
      const novo = { ...prev };
      delete novo[id];
      return novo;
    });
  };

  // Atualiza campo clube em edição
  const atualizarCampoClube = (
    id: string,
    campo: keyof Clube,
    valor: string | number
  ) => {
    setClubesEditando((prev) => ({
      ...prev,
      [id]: { ...prev[id], [campo]: valor },
    }));
  };

  // Salvar clube
  const salvarClube = async (id: string) => {
    const clubeParaSalvar = clubesEditando[id];
    if (!clubeParaSalvar) return;

    setLoading(true);
    setStatusMsg(null);

    if (typeof clubeParaSalvar.limite === "string") {
      clubeParaSalvar.limite = Number(clubeParaSalvar.limite);
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/clubes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(clubeParaSalvar),
      });

      if (!res.ok) throw new Error("Erro ao salvar clube");
      const atualizado = await res.json();

      setClubesModerados((prev) =>
        prev.map((c) => (c._id === id ? atualizado : c))
      );

      cancelarEdicaoClube(id);

      setStatusMsg("Clube atualizado com sucesso!");
    } catch {
      setStatusMsg("Erro ao atualizar clube.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="settings-container" aria-live="polite">
        <h1>⚙️ Configurações</h1>

        {statusMsg && (
          <div
            className={`status-msg ${
              statusMsg.toLowerCase().includes("erro") ? "error" : "success"
            }`}
            role="alert"
          >
            {statusMsg}
          </div>
        )}

        {usuario && (
          <section className="perfil-section" aria-label="Seção Meu Perfil">
            <h2>🧍 Meu Perfil</h2>

            <div className="foto-preview-container">
              {usuario.foto ? (
                <img
                  src={usuario.foto}
                  alt="Foto de perfil"
                  className="foto-preview"
                />
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
              onChange={(v) => atualizarCampoUsuario("username", v)}
            />

            <div className="readonly-field">
              <label>Email:</label>
              <span>{usuario.email}</span>
            </div>

            <EditableField
              label="Descrição do perfil"
              value={usuario.descricao || ""}
              type="textarea"
              onChange={(v) => atualizarCampoUsuario("descricao", v)}
            />

            <button
              onClick={salvarPerfil}
              disabled={loading}
              className="btn-primary"
              style={{ marginTop: "1rem" }}
            >
              {loading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </section>
        )}

        {/* Alterar Senha */}
        <section className="perfil-section" aria-label="Seção Alterar Senha">
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
        <section className="perfil-section" aria-label="Seção Excluir Conta">
          <h2>⚠️ Excluir Conta</h2>
          <p>Essa ação é irreversível. Sua conta será removida permanentemente.</p>
          <button onClick={excluirConta} className="btn-danger">
            Excluir Conta
          </button>
        </section>

        {/* Clubes Moderados */}
        {clubesModerados.length > 0 && (
          <section className="clubes-section" aria-label="Seção Meus Clubes Moderados">
            <h2>📘 Meus Clubes (Moderador)</h2>
            <ul className="clubes-lista">
              {clubesModerados.map((clube) => {
                const editando = Boolean(clubesEditando[clube._id]);
                const clubeEditado = clubesEditando[clube._id];

                return (
                  <li key={clube._id} className="clube-config" aria-label={`Clube ${clube.nome}`}>
                    {/* Mostrar dados salvos no banco antes de editar */}
                    {!editando && (
                      <>
                        <strong>{clube.nome}</strong>
                        <p>{clube.descricao || "(Sem descrição)"}</p>

                        <p><b>Gênero:</b> {clube.genero || "(não definido)"}</p>
                        <p><b>Tipo:</b> {clube.tipo || "(não definido)"}</p>
                        <p><b>Formato:</b> {clube.formato || "(não definido)"}</p>
                        <p><b>Frequência:</b> {clube.frequencia || "(não definido)"}</p>
                        <p><b>Limite:</b> {clube.limite ?? "(não definido)"}</p>
                        <p><b>Faixa Etária:</b> {clube.faixa || "(não definido)"}</p>
                        <p><b>Regras:</b> {clube.regras || "(não definido)"}</p>
                        <p><b>Política:</b> {clube.politica || "(não definido)"}</p>
                        <p><b>Novos Membros:</b> {clube.novos || "(não definido)"}</p>
                        <p><b>Convidados:</b> {clube.convidados || "(não definido)"}</p>

                        <button
                          className="btn-secondary"
                          onClick={() => iniciarEdicaoClube(clube)}
                          aria-label={`Editar clube ${clube.nome}`}
                        >
                          Editar Clube
                        </button>
                      </>
                    )}

                    {/* Formulário de edição */}
                    {editando && clubeEditado && (
                      <>
                        <EditableField
                          label="Nome do Clube"
                          value={clubeEditado.nome}
                          onChange={(v) => atualizarCampoClube(clube._id, "nome", v)}
                        />

                        <EditableField
                          label="Descrição do Clube"
                          value={clubeEditado.descricao || ""}
                          type="textarea"
                          onChange={(v) => atualizarCampoClube(clube._id, "descricao", v)}
                        />

                        <EditableField
                          label="Gênero"
                          type="select"
                          value={clubeEditado.genero || ""}
                          options={["Romance", "Terror"]}
                          onChange={(v) => atualizarCampoClube(clube._id, "genero", v)}
                        />

                        <EditableField
                          label="Tipo"
                          type="select"
                          value={clubeEditado.tipo || ""}
                          options={["Público", "Privado"]}
                          onChange={(v) => atualizarCampoClube(clube._id, "tipo", v)}
                        />

                        <EditableField
                          label="Formato"
                          type="select"
                          value={clubeEditado.formato || ""}
                          options={["Presencial", "Online"]}
                          onChange={(v) => atualizarCampoClube(clube._id, "formato", v)}
                        />

                        <EditableField
                          label="Frequência"
                          type="select"
                          value={clubeEditado.frequencia || ""}
                          options={["Semanal", "Mensal"]}
                          onChange={(v) => atualizarCampoClube(clube._id, "frequencia", v)}
                        />

                        <EditableField
                          label="Limite"
                          type="number"
                          value={clubeEditado.limite ?? ""}
                          onChange={(v) => atualizarCampoClube(clube._id, "limite", v)}
                        />

                        <EditableField
                          label="Faixa Etária"
                          value={clubeEditado.faixa || ""}
                          onChange={(v) => atualizarCampoClube(clube._id, "faixa", v)}
                        />

                        <EditableField
                          label="Regras"
                          type="textarea"
                          value={clubeEditado.regras || ""}
                          onChange={(v) => atualizarCampoClube(clube._id, "regras", v)}
                        />

                        <EditableField
                          label="Política"
                          value={clubeEditado.politica || ""}
                          onChange={(v) => atualizarCampoClube(clube._id, "politica", v)}
                        />

                        <EditableField
                          label="Novos Membros"
                          value={clubeEditado.novos || ""}
                          onChange={(v) => atualizarCampoClube(clube._id, "novos", v)}
                        />

                        <EditableField
                          label="Convidados"
                          value={clubeEditado.convidados || ""}
                          onChange={(v) => atualizarCampoClube(clube._id, "convidados", v)}
                        />

                        <div className="edit-controls">
                          <button
                            className="btn-primary"
                            onClick={() => salvarClube(clube._id)}
                            disabled={loading}
                          >
                            {loading ? "Salvando..." : "Salvar"}
                          </button>
                          <button
                            className="btn-secondary"
                            onClick={() => cancelarEdicaoClube(clube._id)}
                            disabled={loading}
                          >
                            Cancelar
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}