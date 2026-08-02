"use client";

import { useState, useEffect } from "react";
import { X, Copy, Check } from "lucide-react";

interface Gift {
  id: string;
  name: string;
  description: string | null;
  price: number;
  pixKey: string;
  imageUrl: string | null;
  qrCodeImage: string | null;
}

function PixModal({
  gift,
  onClose,
}: {
  gift: Gift;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(gift.pixKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = gift.pixKey;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Fechar">
          <X size={18} />
        </button>

        <h3 className="modal-title">Presentear via PIX</h3>
        <p className="modal-gift-name" style={{ fontWeight: "bold" }}>{gift.name}</p>
        {gift.description && (
          <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.5rem" }}>
            {gift.description}
          </p>
        )}
        <p className="modal-price">
          R$ {gift.price.toFixed(2).replace(".", ",")}
        </p>

        {gift.qrCodeImage ? (
          <div className="modal-qr-wrapper">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gift.qrCodeImage}
              alt={`QR Code PIX para ${gift.name}`}
              style={{
                maxWidth: "220px",
                maxHeight: "220px",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
              }}
            />
          </div>
        ) : (
          <div className="modal-qr-wrapper" style={{
            padding: "2rem",
            background: "#f5f5f5",
            borderRadius: "12px",
            textAlign: "center",
          }}>
            <p style={{ color: "#888", fontSize: "0.85rem" }}>
              QR Code ainda não cadastrado pelo casal.
              <br />
              Use a chave PIX abaixo para fazer o pagamento.
            </p>
          </div>
        )}

        <p style={{ fontSize: "0.85rem", color: "#4A4A4A", marginBottom: "0.5rem", marginTop: "0.8rem" }}>
          {gift.qrCodeImage
            ? "Escaneie o QR Code acima ou copie a chave PIX:"
            : "Copie a chave PIX abaixo e cole no seu app do banco:"}
        </p>

        <div className="modal-pix-key">
          <input
            type="text"
            value={gift.pixKey}
            readOnly
            style={{ width: "100%", fontSize: "0.85rem" }}
          />
          <button
            className={`modal-copy-btn ${copied ? "copied" : ""}`}
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check size={14} /> Copiado!
              </>
            ) : (
              <>
                <Copy size={14} /> Copiar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GiftList() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);

  useEffect(() => {
    async function loadGifts() {
      try {
        const response = await fetch(`/api/gifts?t=${Date.now()}`);
        if (response.ok) {
          const data = await response.json();
          setGifts(data);
        }
      } catch (e) {
        console.error("Erro ao carregar lista de presentes", e);
      } finally {
        setLoading(false);
      }
    }
    loadGifts();
  }, []);

  const defaultImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%238E9E85' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'><rect width='18' height='18' x='3' y='3' rx='2' ry='2'/><circle cx='9' cy='9' r='2'/><path d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/></svg>";

  return (
    <section className="section gift-list" id="presentes">
      <h2 className="section-title">Lista de Presentes</h2>
      <div className="section-divider" />
      <p className="section-subtitle">
        Sua presença é o nosso maior presente, mas se desejar nos abençoar de outra forma,
        escolha um presente especial.
      </p>

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <p>Carregando presentes...</p>
        </div>
      ) : gifts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", background: "var(--color-cream)", borderRadius: "8px" }}>
          <p style={{ color: "#666" }}>A lista de presentes está sendo preparada pelo casal. Volte em breve! 🎁</p>
        </div>
      ) : (
        <div className="gift-grid">
          {gifts.map((gift) => (
            <div key={gift.id} className="gift-card" style={{ opacity: 1, animation: "fadeIn 0.5s ease-in-out" }}>
              <div className="gift-card-image-wrapper" style={{ position: "relative", width: "100%", height: "200px", background: "#f0f0f0" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={gift.imageUrl && gift.imageUrl.trim() !== "" ? gift.imageUrl : defaultImage}
                  alt={gift.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  className="gift-card-image"
                />
              </div>
              <div className="gift-card-body">
                <h3 className="gift-card-name">{gift.name}</h3>
                {gift.description && (
                  <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.8rem", minHeight: "36px" }}>
                    {gift.description}
                  </p>
                )}
                <p className="gift-card-price">
                  R$ {gift.price.toFixed(2).replace(".", ",")}
                </p>
                <button
                  className="gift-card-btn"
                  onClick={() => setSelectedGift(gift)}
                >
                  Presentear
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedGift && (
        <PixModal gift={selectedGift} onClose={() => setSelectedGift(null)} />
      )}
    </section>
  );
}
