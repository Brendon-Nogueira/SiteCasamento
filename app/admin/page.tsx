"use client";

import { useEffect, useState, useCallback } from "react";
import GuestSection from "@/components/Admin/GuestSection";
import GiftSection from "@/components/Admin/GiftSection";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<"guests" | "gifts">("guests");

  // Dados do banco
  const [guests, setGuests] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stats
  const [stats, setStats] = useState({
    totalGuests: 0,
    confirmedGuests: 0,
    pendingGuests: 0,
    totalKids: 0,
    totalAdults: 0,
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [resGuests, resGifts] = await Promise.all([
        fetch("/api/guests"),
        fetch("/api/gifts"),
      ]);

      if (resGuests.ok && resGifts.ok) {
        const guestsData = await resGuests.json();
        const giftsData = await resGifts.json();

        setGuests(guestsData);
        setGifts(giftsData);

        // Calcula estatísticas
        const confirmed = guestsData.filter((g: { confirmed: boolean }) => g.confirmed);
        const totalKids = guestsData.reduce((acc: number, g: { qtd_criancas: number }) => acc + g.qtd_criancas, 0);
        
        // Adultos confirmados
        const confirmedAdults = confirmed.length;

        setStats({
          totalGuests: guestsData.length,
          confirmedGuests: confirmed.length,
          pendingGuests: guestsData.length - confirmed.length,
          totalKids,
          totalAdults: confirmedAdults,
        });
      }
    } catch (e) {
      console.error("Erro ao buscar dados do dashboard", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Verifica se já tem o cookie no client-side
    const hasSession = document.cookie.includes("admin_session=authenticated");
    if (hasSession) {
      setIsAuthenticated(true);
      fetchData();
    } else {
      setLoading(false);
    }
  }, [fetchData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const response = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      setIsAuthenticated(true);
      fetchData();
    } else {
      setLoginError("Senha incorreta");
    }
  };

  const handleLogout = () => {
    // Remove cookie definindo expiração no passado
    document.cookie = "admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsAuthenticated(false);
  };

  if (loading && !isAuthenticated) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <p>Carregando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-card">
          <h1>Área do Casal 💍</h1>
          <p style={{ marginBottom: "1.5rem", color: "#666", fontSize: "0.9rem" }}>
            Digite a senha administrativa para acessar o painel.
          </p>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input
              type="password"
              placeholder="Senha de Acesso"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              style={{ textAlign: "center" }}
              required
            />
            {loginError && <p style={{ color: "#d9534f", fontSize: "0.85rem" }}>{loginError}</p>}
            <button type="submit" className="form-submit-btn" style={{ marginTop: "0.5rem" }}>
              Acessar Painel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h1>Painel do Casamento</h1>
          <p style={{ color: "#666", fontSize: "0.95rem" }}>Franciele & Brendon — 22/05/2027</p>
        </div>
        <button onClick={handleLogout} className="admin-logout-btn">
          Sair do Painel
        </button>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-title">Total de Convidados</div>
          <div className="admin-stat-value">{stats.totalGuests}</div>
        </div>
        <div className="admin-stat-card confirmed">
          <div className="admin-stat-title">Confirmados (Adultos)</div>
          <div className="admin-stat-value">{stats.confirmedGuests}</div>
        </div>
        <div className="admin-stat-card pending">
          <div className="admin-stat-title">Pendentes</div>
          <div className="admin-stat-value">{stats.pendingGuests}</div>
        </div>
        <div className="admin-stat-card kids">
          <div className="admin-stat-title">Crianças (Até 4 anos)</div>
          <div className="admin-stat-value">{stats.totalKids}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          onClick={() => setActiveTab("guests")}
          className={`admin-tab ${activeTab === "guests" ? "active" : ""}`}
        >
          Convidados (RSVP)
        </button>
        <button
          onClick={() => setActiveTab("gifts")}
          className={`admin-tab ${activeTab === "gifts" ? "active" : ""}`}
        >
          Lista de Presentes
        </button>
      </div>

      {loading ? (
        <p>Atualizando dados...</p>
      ) : activeTab === "guests" ? (
        <GuestSection guests={guests} onRefresh={fetchData} />
      ) : (
        <GiftSection gifts={gifts} onRefresh={fetchData} />
      )}
    </div>
  );
}
