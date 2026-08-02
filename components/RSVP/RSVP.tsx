"use client";

import { useState, useEffect } from "react";
import { Search, CheckCircle } from "lucide-react";

interface Guest {
  id: string;
  nome: string;
  email: string | null;
  whatsapp: string;
  confirmed: boolean;
  qtd_adultos: number;
  qtd_criancas: number;
  observacao: string | null;
}

export default function RSVP() {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Guest[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  
  // Form states
  const [comparecer, setComparecer] = useState<"sim" | "nao">("sim");
  const [qtdAdultos, setQtdAdultos] = useState(1);
  const [qtdCriancas, setQtdCriancas] = useState(0);
  const [observacoes, setObservacoes] = useState("");
  const [notificacoes, setNotificacoes] = useState(true);
  const [termos, setTermos] = useState(false);
  
  const [submitted, setSubmitted] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Efeito para buscar nomes com debounce
  useEffect(() => {
    if (search.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setSearching(true);
      try {
        const response = await fetch(`/api/guests?search=${encodeURIComponent(search)}`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
        }
      } catch (err) {
        console.error("Erro na busca pública", err);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleSelectGuest = (guest: Guest) => {
    setSelectedGuest(guest);
    setComparecer(guest.confirmed ? "sim" : "sim");
    setQtdAdultos(guest.qtd_adultos || 1);
    setQtdCriancas(guest.qtd_criancas || 0);
    setObservacoes(guest.observacao || "");
    setSearchResults([]);
    setSearch("");
  };

  const handleQtdAdultosChange = (val: number) => {
    // Mantém a soma no limite de 10
    if (val + qtdCriancas > 10) {
      setQtdCriancas(10 - val);
    }
    setQtdAdultos(val);
  };

  const handleQtdCriancasChange = (val: number) => {
    // Mantém a soma no limite de 10
    if (val + qtdAdultos > 10) {
      setQtdAdultos(10 - val);
    }
    setQtdCriancas(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuest) return;

    if (comparecer === "sim" && (qtdAdultos + qtdCriancas > 10)) {
      alert("O limite máximo de confirmação é de 10 pessoas por vez.");
      return;
    }

    setLoadingSubmit(true);

    try {
      const response = await fetch(`/api/guests/${selectedGuest.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirmed: comparecer === "sim",
          qtd_adultos: comparecer === "sim" ? qtdAdultos : 0,
          qtd_criancas: comparecer === "sim" ? qtdCriancas : 0,
          observacao: observacoes || null,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert("Erro ao enviar confirmação. Tente novamente.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (submitted && selectedGuest) {
    return (
      <section className="section rsvp" id="confirmacao">
        <div className="form-success fade-in" style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
          <div className="form-success-icon" style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
          <h3 className="section-title">Presença Confirmada!</h3>
          <p style={{ color: "var(--color-dark-light)", fontSize: "1.1rem" }}>
            Obrigado, <strong>{selectedGuest.nome}</strong>!
          </p>
          <p style={{ color: "var(--color-dark-light)", marginTop: "0.5rem" }}>
            {comparecer === "sim" ? (
              <>
                Confirmamos a presença de <strong>{qtdAdultos} {qtdAdultos === 1 ? "adulto" : "adultos"}</strong>
                {qtdCriancas > 0 && <> e <strong>{qtdCriancas} {qtdCriancas === 1 ? "criança" : "crianças"}</strong></>}.
                <br />
                Estamos muito felizes e ansiosos para comemorar com vocês no dia 22 de Maio de 2027!
              </>
            ) : (
              "Agradecemos o seu retorno. Sentiremos sua falta nesse dia tão especial."
            )}
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setSelectedGuest(null);
              setSearch("");
            }}
            className="venue-btn"
            style={{ marginTop: "2rem" }}
          >
            Confirmar outro nome
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="section rsvp" id="confirmacao">
      <h2 className="section-title">Confirmação de Presença</h2>
      <div className="section-divider" />
      
      {!selectedGuest ? (
        <div className="rsvp-form" style={{ maxWidth: "500px", margin: "0 auto" }}>
          <p className="section-subtitle" style={{ marginBottom: "1.5rem" }}>
            Busque seu nome na lista para confirmar sua presença no nosso casamento.
          </p>
          
          <div className="form-group" style={{ position: "relative" }}>
            <label htmlFor="search-input">Digite seu nome completo:</label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                id="search-input"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input"
                placeholder="Ex: Franciele Maria..."
                style={{ width: "100%", paddingRight: "2.5rem" }}
              />
              <Search size={18} style={{ position: "absolute", right: "1rem", color: "#666" }} />
            </div>
            
            {searching && <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.5rem" }}>Buscando...</p>}

            {searchResults.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  backgroundColor: "white",
                  border: "1px solid var(--color-border)",
                  borderRadius: "4px",
                  boxShadow: "var(--shadow-md)",
                  zIndex: 10,
                  marginTop: "0.2rem",
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                {searchResults.map((guest) => (
                  <div
                    key={guest.id}
                    onClick={() => handleSelectGuest(guest)}
                    style={{
                      padding: "0.8rem 1rem",
                      cursor: "pointer",
                      borderBottom: "1px solid #f0f0f0",
                      display: "flex",
                      justifyContent: "between",
                      alignItems: "center",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-cream)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <span style={{ fontWeight: "bold", flex: 1 }}>{guest.nome}</span>
                    {guest.confirmed && (
                      <span style={{ fontSize: "0.75rem", color: "var(--color-green-dark)", display: "flex", alignItems: "center", gap: "2px" }}>
                        <CheckCircle size={12} /> Confirmado
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {search.trim().length >= 3 && searchResults.length === 0 && !searching && (
              <p style={{ fontSize: "0.85rem", color: "#c9302c", marginTop: "0.5rem" }}>
                Nome não encontrado. Certifique-se de digitar corretamente ou fale conosco.
              </p>
            )}
          </div>
        </div>
      ) : (
        <form className="rsvp-form" onSubmit={handleSubmit}>
          <div style={{ background: "var(--color-white)", padding: "1.5rem", borderRadius: "8px", border: "1px solid var(--color-border)", marginBottom: "1rem" }}>
            <p style={{ fontSize: "0.9rem", color: "#666" }}>Convidado selecionado:</p>
            <h3 style={{ fontSize: "1.3rem", color: "var(--color-green-dark)", marginTop: "0.2rem" }}>{selectedGuest.nome}</h3>
            <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.2rem" }}>WhatsApp cadastrado: {selectedGuest.whatsapp}</p>
            <button
              type="button"
              onClick={() => setSelectedGuest(null)}
              style={{
                background: "none",
                border: "none",
                color: "#d9534f",
                fontSize: "0.85rem",
                textDecoration: "underline",
                padding: 0,
                marginTop: "0.5rem",
                cursor: "pointer",
              }}
            >
              Trocar nome
            </button>
          </div>

          {/* Comparecer */}
          <div className="form-group">
            <label>Você comparecerá ao evento?</label>
            <div className="form-radio-group">
              <label className="form-radio-label">
                <input
                  type="radio"
                  name="comparecer"
                  value="sim"
                  checked={comparecer === "sim"}
                  onChange={() => setComparecer("sim")}
                />
                Sim, com certeza!
              </label>
              <label className="form-radio-label">
                <input
                  type="radio"
                  name="comparecer"
                  value="nao"
                  checked={comparecer === "nao"}
                  onChange={() => setComparecer("nao")}
                />
                Não poderei ir
              </label>
            </div>
          </div>

          {comparecer === "sim" && (
            <>
              {/* Qtd Adultos */}
              <div className="form-group">
                <label htmlFor="rsvp-adultos">
                  Quantidade de adultos/acompanhantes (incluindo você):
                </label>
                <select
                  id="rsvp-adultos"
                  name="adultos"
                  value={qtdAdultos}
                  onChange={(e) => handleQtdAdultosChange(Number(e.target.value))}
                  className="form-select"
                  style={{ width: "100%" }}
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "adulto" : "adultos"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Qtd Crianças */}
              <div className="form-group">
                <label htmlFor="rsvp-criancas">
                  Quantidade de crianças (de colo ou até 4 anos):
                </label>
                <select
                  id="rsvp-criancas"
                  name="criancas"
                  value={qtdCriancas}
                  onChange={(e) => handleQtdCriancasChange(Number(e.target.value))}
                  className="form-select"
                  style={{ width: "100%" }}
                >
                  {Array.from({ length: 11 - qtdAdultos }, (_, i) => i).map((n) => (
                    <option key={n} value={n}>
                      {n === 0 ? "Nenhuma" : `${n} criança(s)`}
                    </option>
                  ))}
                </select>
                <span style={{ fontSize: "0.78rem", color: "#888", marginTop: "0.3rem", display: "block" }}>
                  Máximo de 10 pessoas por confirmação. (Adultos + Crianças selecionadas: {qtdAdultos + qtdCriancas})
                </span>
              </div>
            </>
          )}

          {/* Observações */}
          <div className="form-group">
            <label htmlFor="rsvp-obs">Observações / Restrições Alimentares</label>
            <textarea
              id="rsvp-obs"
              name="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="form-input form-textarea"
              placeholder="Ex: Alergia a frutos do mar, vegetariano, etc."
              maxLength={250}
            />
            <span className="form-char-count">{observacoes.length}/250</span>
          </div>

          {/* Checkboxes */}
          <div className="form-checkbox-group">
            <label className="form-checkbox-label">
              <input
                type="checkbox"
                name="notificacoes"
                checked={notificacoes}
                onChange={(e) => setNotificacoes(e.target.checked)}
              />
              Aceito receber informações sobre o casamento por WhatsApp
            </label>

            <label className="form-checkbox-label">
              <input
                type="checkbox"
                name="termos"
                checked={termos}
                onChange={(e) => setTermos(e.target.checked)}
                required
              />
              Li e concordo em confirmar minha presença oficial. *
            </label>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loadingSubmit} className="form-submit-btn">
            {loadingSubmit ? "Enviando..." : "Confirmar Presença"}
          </button>
        </form>
      )}
    </section>
  );
}
