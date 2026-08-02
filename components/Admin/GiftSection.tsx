"use client";

import { useState } from "react";
import Image from "next/image";

interface Gift {
  id: string;
  name: string;
  description: string | null;
  price: number;
  pixKey: string;
  imageUrl: string;
  qrCodeImage: string | null;
}

interface GiftSectionProps {
  gifts: Gift[];
  onRefresh: () => void;
}

export default function GiftSection({ gifts, onRefresh }: GiftSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGift, setEditingGift] = useState<Gift | null>(null);
  const [loading, setLoading] = useState(false);

  // States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [base64QrCode, setBase64QrCode] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingGift(null);
    setName("");
    setDescription("");
    setPrice("");
    setPixKey("");
    setBase64Image(null);
    setBase64QrCode(null);
    setModalOpen(true);
  };

  const openEditModal = (gift: Gift) => {
    setEditingGift(gift);
    setName(gift.name);
    setDescription(gift.description || "");
    setPrice(String(gift.price));
    setPixKey(gift.pixKey);
    setBase64Image(null);
    setBase64QrCode(null);
    setModalOpen(true);
  };

  // Converte arquivo de imagem para string Base64
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Converte imagem do QR Code 
  const handleQrCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64QrCode(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name,
      description,
      price,
      pixKey,
      image: base64Image,
      qrCodeImage: base64QrCode,
    };

    const url = editingGift ? `/api/gifts/${editingGift.id}` : "/api/gifts";
    const method = editingGift ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (response.ok) {
      setModalOpen(false);
      onRefresh();
    } else {
      const err = await response.json();
      alert(err.error || "Erro ao salvar presente");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Deseja realmente remover este presente da lista?")) {
      const response = await fetch(`/api/gifts/${id}`, { method: "DELETE" });
      if (response.ok) {
        onRefresh();
      } else {
        alert("Erro ao remover presente");
      }
    }
  };

  return (
    <div>
      <div className="admin-action-bar" style={{ justifyContent: "flex-end" }}>
        <button onClick={openAddModal} className="admin-add-btn">
          Adicionar Presente
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Imagem</th>
              <th>Nome</th>
              <th>Preço</th>
              <th>Chave PIX</th>
              <th>QR Code</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {gifts.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "2rem" }}>
                  Nenhum presente cadastrado.
                </td>
              </tr>
            ) : (
              gifts.map((gift) => (
                <tr key={gift.id}>
                  <td>
                    <div style={{ position: "relative", width: "50px", height: "50px", borderRadius: "4px", overflow: "hidden" }}>
                      <Image
                        src={gift.imageUrl}
                        alt={gift.name}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  </td>
                  <td><strong>{gift.name}</strong></td>
                  <td>R$ {gift.price.toFixed(2).replace(".", ",")}</td>
                  <td><code style={{ fontSize: "0.75rem", wordBreak: "break-all" }}>{gift.pixKey}</code></td>
                  <td>
                    {gift.qrCodeImage ? (
                      <span style={{ color: "#5B8C5A", fontWeight: "bold", fontSize: "0.8rem" }}>✅ Enviado</span>
                    ) : (
                      <span style={{ color: "#d9534f", fontSize: "0.8rem" }}>❌ Pendente</span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => openEditModal(gift)} className="edit-btn">
                        Editar
                      </button>
                      <button onClick={() => handleDelete(gift.id)} className="delete-btn">
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
            <h2>{editingGift ? "Editar Presente" : "Adicionar Presente"}</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="form-group">
                <label>Nome do presente *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Descrição / Mensagem</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-input"
                  placeholder="Ex: Contribuição para nossa viagem de lua de mel"
                />
              </div>

              <div className="form-group">
                <label>Preço sugerido (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="form-input"
                  placeholder="Ex: 150.00"
                  required
                />
              </div>

              <div className="form-group">
                <label>Chave PIX (para copiar e colar) *</label>
                <input
                  type="text"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  className="form-input"
                  placeholder="E-mail, CPF, celular ou chave aleatória"
                  required
                />
              </div>

              <div className="form-group">
                <label>Imagem do Presente</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="form-input"
                  style={{ padding: "0.4rem" }}
                  required={!editingGift}
                />
                {editingGift && (
                  <span style={{ fontSize: "0.8rem", color: "#666" }}>
                    Deixe em branco para manter a imagem atual
                  </span>
                )}
              </div>

              <div className="form-group">
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  📱 Imagem do QR Code PIX (gerada pelo banco)
                </label>
                <span style={{ fontSize: "0.78rem", color: "#666", marginBottom: "0.3rem", display: "block" }}>
                  Abra seu app do banco → PIX → Gerar QR Code com o valor → Salve/capture a imagem e faça upload aqui
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleQrCodeChange}
                  className="form-input"
                  style={{ padding: "0.4rem" }}
                />
                {base64QrCode && (
                  <div style={{ marginTop: "0.5rem", textAlign: "center" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={base64QrCode}
                      alt="Preview do QR Code"
                      style={{ maxWidth: "150px", maxHeight: "150px", border: "1px solid #ddd", borderRadius: "8px" }}
                    />
                    <p style={{ fontSize: "0.75rem", color: "#5B8C5A", marginTop: "0.3rem" }}>✅ QR Code carregado</p>
                  </div>
                )}
                {editingGift && !base64QrCode && editingGift.qrCodeImage && (
                  <span style={{ fontSize: "0.8rem", color: "#5B8C5A" }}>
                    ✅ QR Code já cadastrado. Deixe em branco para manter.
                  </span>
                )}
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setModalOpen(false)} className="cancel-btn" disabled={loading}>
                  Cancelar
                </button>
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
