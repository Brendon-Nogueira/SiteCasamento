import Image from "next/image";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero-image-wrapper">
        <Image
          src="/images/hero.jpg"
          alt="Franciele e Brendon"
          fill
          priority
          style={{ objectFit: "cover" }}
          sizes="100vw"
        />
      </div>
      <div className="hero-overlay" />
      <div className="hero-content">
        <h1 className="hero-names">
          Franciele <span className="hero-ampersand">&amp;</span> Brendon
        </h1>
        <p className="hero-subtitle">O grande dia está chegando!</p>
      </div>
      <div className="hero-scroll-indicator">
        {/* <span>Scroll</span> */}
        <ChevronDown size={20} color="rgba(255,255,255,0.7)" />
      </div>
    </section>
  );
}
