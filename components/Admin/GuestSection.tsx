"use client";

import { useState } from "react";

interface Guest {
  id: string;
  nome: string;
  email: string | null;
  whatsapp: string;
  confirmed: boolean;
  qtd_adultos: number;
  qtd_criancas: number;
  observacao: string | null;
  createdAt: string;
}

interface GuestSectionProps {
  guests: Guest[];
  onRefresh: () => void;
}

export default function GuestSection({ guests, onRefresh }: GuestSectionProps) {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  // Form states
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [qtdAdultos, setQtdAdultos] = useState(1);
  const [qtdCriancas, setQtdCriancas] = useState(0);
  const [observacao, setObservacao] = useState("");

  const filteredGuests = guests.filter((g) =>
    g.nome.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingGuest(null);
    setNome("");
    setEmail("");
    setWhatsapp("");
    setConfirmed(false);
    setQtdAdultos(1);
    setQtdCriancas(0);
    setObservacao("");
    setModalOpen(true);
  };

  const openEditModal = (guest: Guest) => {
    setEditingGuest(guest);
    setNome(guest.nome);
    setEmail(guest.email || "");
    setWhatsapp(guest.whatsapp);
    setConfirmed(guest.confirmed);
    setQtdAdultos(guest.qtd_adultos || 1);
    setQtdCriancas(guest.qtd_criancas || 0);
    setObservacao(guest.observacao || "");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      nome,
      email: email || null,
      whatsapp,
      confirmed,
      qtd_adultos: Number(qtdAdultos),
      qtd_criancas: Number(qtdCriancas),
      observacao: observacao || null,
    };

    const url = editingGuest ? `/api/guests/${editingGuest.id}` : "/api/guests";
    const method = editingGuest ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      setModalOpen(false);
      onRefresh();
    } else {
      alert("Erro ao salvar convidado");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Deseja realmente excluir este convidado?")) {
      const response = await fetch(`/api/guests/${id}`, { method: "DELETE" });
      if (response.ok) {
        onRefresh();
      } else {
        alert("Erro ao excluir convidado");
      }
    }
  };

  return (
    <div>
      <div className="admin-action-bar">
        <input
          type="text"
          placeholder="Buscar convidado..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-search-input"
        />
        <button onClick={openAddModal} className="admin-add-btn">
          Adicionar Convidado
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>WhatsApp</th>
              <th>E-mail</th>
              <th>Status</th>
              <th>Adultos</th>
              <th>Crianças</th>
              <th>Observação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredGuests.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "2rem" }}>
                  Nenhum convidado encontrado.
                </td>
              </tr>
            ) : (
              filteredGuests.map((guest) => (
                <tr key={guest.id}>
                  <td><strong>{guest.nome}</strong></td>
                  <td>{guest.whatsapp}</td>
                  <td>{guest.email || "-"}</td>
                  <td>
                    <span className={`status-badge ${guest.confirmed ? "confirmed" : "pending"}`}>
                      {guest.confirmed ? "Confirmado" : "Pendente"}
                    </span>
                  </td>
                  <td>{guest.qtd_adultos || 1}</td>
                  <td>{guest.qtd_criancas}</td>
                  <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {guest.observacao || "-"}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => openEditModal(guest)} className="edit-btn">
                        Editar
                      </button>
                      <button onClick={() => handleDelete(guest.id)} className="delete-btn">
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingGuest ? "Editar Convidado" : "Adicionar Convidado"}</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="form-group">
                <label>Nome completo *</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>WhatsApp *</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="form-input"
                  placeholder="(00) 90000-0000"
                  required
                />
              </div>

              <div className="form-group">
                <label>E-mail (opcional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Presença Confirmada?</label>
                <div className="form-radio-group">
                  <label className="form-radio-label">
                    <input
                      type="radio"
                      name="confirmed"
                      checked={confirmed === true}
                      onChange={() => setConfirmed(true)}
                    />
                    Sim
                  </label>
                  <label className="form-radio-label">
                    <input
                      type="radio"
                      name="confirmed"
                      checked={confirmed === false}
                      onChange={() => setConfirmed(false)}
                    />
                    Não (Pendente)
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Quantidade de adultos (incluindo o titular)</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={qtdAdultos}
                  onChange={(e) => setQtdAdultos(Number(e.target.value))}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Quantidade de crianças (Até 4 anos)</label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={qtdCriancas}
                  onChange={(e) => setQtdCriancas(Number(e.target.value))}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Observação / Restrição Alimentar</label>
                <textarea
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  className="form-input"
                  style={{ minHeight: "80px" }}
                  placeholder="Alguma restrição ou anotação importante..."
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setModalOpen(false)} className="cancel-btn">
                  Cancelar
                </button>
                <button type="submit" className="save-btn">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
