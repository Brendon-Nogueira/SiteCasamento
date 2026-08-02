import Image from "next/image";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero-image-wrapper">
        <Image
          src="/images/hero.jpg"
          //src="/images/hero2.png"
          alt="Franciele e Brendon"
          fill
          priority
          style={{ objectFit: "cover" }}
          sizes="100vw"
        />
      </div>
      <div className="hero-overlay" />
      <div className="hero-content">
        {/* Logo oficial do Canva */}
        <div className="hero-logo-container" style={{ marginBottom: "1rem", display: "flex", justifyContent: "center" }}>
          <div style={{ 
            position: "relative", 
            width: "160px", 
            height: "160px",
            background: "#ffffff", // Fundo branco sólido para a logo
            borderRadius: "50%",
            boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
            overflow: "hidden", // Corta as pontas quadradas da imagem
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Image
              src="/images/logo.png"
              alt="Logo Franciele e Brendon"
              fill
              style={{
                objectFit: "cover", // Garante que a imagem preencha o círculo sem distorcer e sem mostrar cantos brancos
                borderRadius: "50%",
              }}
              priority
            />
          </div>
        </div>

        <h1 className="hero-names">
          Franciele <span className="hero-ampersand">&amp;</span> Brendon
        </h1>
        <p className="hero-subtitle">O grande dia está chegando!</p>
      </div>
      <div className="hero-scroll-indicator">
        <span>Scroll</span>
        <ChevronDown size={20} color="rgba(255,255,255,0.7)" />
      </div>
    </section>
  );
}
