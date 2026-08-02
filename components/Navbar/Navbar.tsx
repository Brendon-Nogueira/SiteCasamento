"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const NAV_LINKS = [
  { href: "#inicio", label: "Início" },
  { href: "#nossa-historia", label: "Nossa História" },
  { href: "#local", label: "Local" },
  { href: "#contagem", label: "Nossa Data" },
  { href: "#presentes", label: "Presentes" },
  { href: "#confirmacao", label: "Confirmar Presença" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    
    // Executa uma vez no início para checar o estado atual
    handleScroll();
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);

    const targetElement = document.querySelector(href);
    if (targetElement) {
      setTimeout(() => {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
    }
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? "scrolled" : "hidden-on-top"}`} id="navbar">
        <div 
          className="navbar-logo" 
          style={{ 
            opacity: isScrolled ? 1 : 0, 
            transition: "opacity 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          {/* Logo redonda da F&B na Navbar */}
          <div style={{ position: "relative", width: "42px", height: "42px", borderRadius: "50%", overflow: "hidden", background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
            <Image
              src="/images/logo.png"
              alt="Logo F&B"
              fill
              sizes="42px"
              style={{ objectFit: "cover", borderRadius: "50%" }}
            />
          </div>
          {/* <span style={{ fontSize: "1.1rem", fontFamily: "var(--font-display)", fontWeight: 600, color: "#512c16" }}>
            F & B
          </span> */}
        </div>
        
        {/* O botão hambúrguer só fica interativo e visível a partir do scroll */}
        <button
          className={`navbar-toggle ${isOpen ? "open" : ""} ${isScrolled ? "visible" : "invisible"}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Background escurecido ao abrir o menu no mobile */}
      <div
        className={`navbar-overlay ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Menu Lateral que desliza */}
      <div className={`navbar-menu ${isOpen ? "open" : ""}`}>
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => handleLinkClick(e, link.href)}
          >
            {link.label}
          </a>
        ))}
      </div>
    </>
  );
}
