import { MapPin } from "lucide-react";

function ChurchIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 8V20" stroke="#4A4A4A" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M34 14H46" stroke="#4A4A4A" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M25 40L40 22L55 40" stroke="#4A4A4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="22" y="40" width="36" height="30" rx="1" stroke="#4A4A4A" strokeWidth="1.5" />
      <path d="M35 70V55C35 52.2386 37.2386 50 40 50V50C42.7614 50 45 52.2386 45 55V70" stroke="#4A4A4A" strokeWidth="1.5" />
      <circle cx="40" cy="36" r="3" stroke="#4A4A4A" strokeWidth="1.2" />
      <path d="M15 42H22" stroke="#4A4A4A" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M58 42H65" stroke="#4A4A4A" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="15" y="42" width="7" height="28" rx="1" stroke="#4A4A4A" strokeWidth="1.2" />
      <rect x="58" y="42" width="7" height="28" rx="1" stroke="#4A4A4A" strokeWidth="1.2" />
    </svg>
  );
}

function PartyIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 65C20 65 25 40 40 40C55 40 60 65 60 65" stroke="#4A4A4A" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15 65H65" stroke="#4A4A4A" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M40 40V25" stroke="#4A4A4A" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M32 28C36 22 44 22 48 28" stroke="#4A4A4A" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M28 32C34 24 46 24 52 32" stroke="#4A4A4A" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="40" cy="22" r="3" stroke="#4A4A4A" strokeWidth="1.2" />
      <path d="M25 55C30 50 35 52 40 50C45 52 50 50 55 55" stroke="#4A4A4A" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <circle cx="30" cy="18" r="1" fill="#5B8C5A" />
      <circle cx="50" cy="16" r="1" fill="#5B8C5A" />
      <circle cx="35" cy="12" r="0.8" fill="#8E9E85" />
      <circle cx="46" cy="14" r="0.8" fill="#8E9E85" />
    </svg>
  );
}

export default function Venue() {
  const ceremonyAddress =
    "Rod. Antônio Simões de Almeida, 83, Paraisópolis - MG, 37660-000, Brasil";
  const ceremonyMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Igreja Santa Edwiges, " + ceremonyAddress)}`;
  const receptionMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Clube Aptiv Paraisópolis MG")}`;

  return (
    <section className="section venue" id="local">
      <h2 className="section-title">Cerimônia &amp; Recepção</h2>
      <div className="section-divider" />

      <div className="venue-cards">
        {/* Cerimônia */}
        <div className="venue-card fade-in">
          <div className="venue-icon">
            <ChurchIcon />
          </div>
          <h3>Igreja Santa Edwiges</h3>
          <p className="venue-type">Cerimônia</p>
          <p className="venue-date">
            <strong>22/05/2027</strong> às <strong>17:00</strong>
          </p>
          <p className="venue-phrase">
            Uma cerimônia repleta de amor, fé e emoção.
          </p>
          <p className="venue-address">
            <MapPin size={14} style={{ display: "inline", verticalAlign: "middle" }} />{" "}
            {ceremonyAddress}
          </p>
          <a
            href={ceremonyMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="venue-btn"
          >
            Abrir no Google Maps
          </a>
        </div>

        {/* Recepção */}
        <div className="venue-card fade-in fade-in-delay-1">
          <div className="venue-icon">
            <PartyIcon />
          </div>
          <h3>Clube – Aptiv</h3>
          <p className="venue-type">Recepção</p>
          <p className="venue-date">
            <strong>22/05/2027</strong> às <strong>18:30</strong>
          </p>
          <p className="venue-phrase">
            Brindaremos ao amor que nos trouxe até aqui.
          </p>
          <p className="venue-address">
            <MapPin size={14} style={{ display: "inline", verticalAlign: "middle" }} />{" "}
            Paraisópolis - MG
          </p>
          <a
            href={receptionMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="venue-btn"
          >
            Abrir no Google Maps
          </a>
        </div>
      </div>
    </section>
  );
}
