"use client";

import { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(): TimeLeft {
  const weddingDate = new Date("2027-05-22T17:00:00-03:00").getTime();
  const now = new Date().getTime();
  const difference = weddingDate - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

import Image from "next/image";

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const items = [
    { value: timeLeft.days, label: "DIAS" },
    { value: timeLeft.hours, label: "HORAS" },
    { value: timeLeft.minutes, label: "MINUTOS" },
    { value: timeLeft.seconds, label: "SEGUNDOS" },
  ];

  return (
    <section className="section countdown-section" id="contagem" style={{ position: "relative" }}>
      <div className="ornament">
        <svg viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 20Q60 5 100 20Q140 5 170 20" stroke="#8E9E85" strokeWidth="1" fill="none" />
          <path d="M40 20Q65 35 100 20Q135 35 160 20" stroke="#8E9E85" strokeWidth="1" fill="none" />
          <path d="M50 15L55 10M55 10L60 15M55 10V25" stroke="#8E9E85" strokeWidth="0.8" />
          <path d="M140 15L145 10M145 10L150 15M145 10V25" stroke="#8E9E85" strokeWidth="0.8" />
        </svg>
      </div>

      <p style={{ 
        fontFamily: "'Pinyon Script', cursive", 
        fontSize: "2.8rem", 
        color: "#512c16", 
        textAlign: "center",
        marginBottom: "0.2rem"
      }}>
        Franciele &amp; Brendon
      </p>

      <h2 className="section-title">Nossa Data</h2>
      <div className="section-divider" />
      <p className="countdown-date-text">22/05/2027 – 17:00</p>

      {/* Ilustração da Igreja */}
      <div style={{ display: "flex", justifyContent: "center", margin: "1.5rem 0" }}>
        <div style={{ position: "relative", width: "100%", maxWidth: "260px", height: "220px" }}>
          <Image
            src="/images/igreja.png"
            alt="Igreja Santa Edwiges - Ilustração"
            fill
            style={{ objectFit: "contain" }}
            sizes="(max-width: 768px) 220px, 260px"
          />
        </div>
      </div>

      <div className="countdown-boxes">
        {(!mounted ? ["DIAS", "HORAS", "MINUTOS", "SEGUNDOS"].map((label) => ({ value: 0, label })) : items).map((item) => (
          <div key={item.label} className="countdown-box">
            <span className="countdown-number">
              {!mounted ? "--" : String(item.value).padStart(2, "0")}
            </span>
            <span className="countdown-label">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
