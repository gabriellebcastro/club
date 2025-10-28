import { useState } from "react";
import "./AvaliacaoPopup.css";

type Props = {
  leituraId: string;
  onClose: () => void;
};

export function AvaliacaoPopup({ leituraId, onClose }: Props) {
  const [nota, setNota] = useState<number>(0);
  const [status, setStatus] = useState<"lendo" | "lido">("lido");
  const [favorito, setFavorito] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const enviarAvaliacao = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Você precisa estar logado.");

    try {
      setEnviando(true);
      const res = await fetch(`http://localhost:4000/api/leitura/${leituraId}/avaliar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nota, status, favorito }),
      });

      if (res.ok) {
        alert("Avaliação enviada!");
        onClose();
      } else {
        const data = await res.json();
        alert(data.message || "Erro ao enviar avaliação.");
      }
    } catch (err) {
      console.error("Erro ao enviar avaliação:", err);
      alert("Erro de rede.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="avaliacao-popup-overlay">
      <div className="avaliacao-popup">
        <h2>Avaliar Leitura</h2>

        <label>Nota (0 a 10)</label>
        <input
          type="number"
          value={nota}
          min={0}
          max={10}
          onChange={(e) => setNota(Number(e.target.value))}
        />

        <label>Status de Leitura</label>
        <select value={status} onChange={(e) => setStatus(e.target.value as "lido" | "lendo")}>
          <option value="lido">Lido</option>
          <option value="lendo">Lendo</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={favorito}
            onChange={(e) => setFavorito(e.target.checked)}
          />
          Marcar como favorito
        </label>

        <div className="botoes-popup">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={enviarAvaliacao} disabled={enviando}>
            Enviar Avaliação
          </button>
        </div>
      </div>
    </div>
  );
}