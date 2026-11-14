import { ArrowLeft, ArrowLeftRight, CalendarClock, Clock3, MapPin, PackageCheck, UserRound, X } from "lucide-react";
import { formatDate, formatTime } from "../../lib/format.js";

function ShipmentStatus({ shipment }) {
  const icon = shipment.status === "approved"
    ? <PackageCheck size={14} />
    : shipment.status === "rejected"
      ? <X size={14} />
      : <Clock3 size={14} />;

  return <span className={`shipment-status status-${shipment.status || "pending"}`}>{icon}{shipment.status_label || "Tasdiqlash kutilmoqda"}</span>;
}

export default function ShipmentDetails({ shipment, onBack }) {
  return (
    <section className="shipment-detail">
      <button className="detail-back" type="button" onClick={onBack}><ArrowLeft size={16} /> Mening yuklarim</button>
      <header className="detail-header">
        <div><p className="detail-overline">YUK MA'LUMOTI</p><h2>{shipment.code}</h2></div>
        <ShipmentStatus shipment={shipment} />
      </header>

      <section className="detail-route" aria-label="Yo'nalish">
        <div className="detail-location"><MapPin size={17} /><div><span>QAYERDAN</span><strong>{shipment.origin}</strong></div></div>
        <ArrowLeftRight className="detail-route-arrow" size={19} />
        <div className="detail-location"><MapPin size={17} /><div><span>QAYERGA</span><strong>{shipment.destination}</strong></div></div>
      </section>

      <div className="detail-info-grid">
        <div className="detail-info"><CalendarClock size={17} /><div><span>QATNOV SANASI</span><strong>{formatDate(shipment.departure_at)}</strong></div></div>
        <div className="detail-info"><Clock3 size={17} /><div><span>JO'NASH VAQTI</span><strong>{formatTime(shipment.departure_at)}</strong></div></div>
        <div className="detail-info"><UserRound size={17} /><div><span>JO'NATUVCHI</span><strong>{shipment.sender_name}</strong></div></div>
        <div className="detail-info"><Clock3 size={17} /><div><span>YARATILGAN VAQT</span><strong>{formatDate(shipment.created_at)} · {formatTime(shipment.created_at)}</strong></div></div>
      </div>

      <section className="detail-description">
        <h3>Yuk tavsifi</h3>
        <p>{shipment.cargo_description}</p>
      </section>
    </section>
  );
}