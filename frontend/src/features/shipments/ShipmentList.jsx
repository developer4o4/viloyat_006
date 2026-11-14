import { useState } from "react";
import { ArrowLeftRight, ArrowUpRight, Clock3, PackageCheck, PackagePlus, Search, X } from "lucide-react";
import { formatDate, formatTime } from "../../lib/format.js";
import ShipmentDetails from "./ShipmentDetails.jsx";

export default function ShipmentList({ shipments, onCreate }) {
  const [query, setQuery] = useState("");
  const [locationMode, setLocationMode] = useState("all");
  const [selectedCity, setSelectedCity] = useState("");
  const locationField = locationMode === "from" ? "origin" : "destination";
  const cities = [...new Set(shipments.map((shipment) => shipment[locationField]))].sort((first, second) => first.localeCompare(second, "uz"));
  const visible = shipments.filter((shipment) => {
    const matchesQuery = `${shipment.code} ${shipment.origin} ${shipment.destination} ${shipment.cargo_description}`.toLocaleLowerCase("uz").includes(query.trim().toLocaleLowerCase("uz"));
    const matchesCity = !selectedCity || shipment[locationField] === selectedCity;
    return matchesQuery && (locationMode === "all" || matchesCity);
  });

  const [selectedShipment, setSelectedShipment] = useState(null);

  if (selectedShipment) {
    return <ShipmentDetails shipment={selectedShipment} onBack={() => setSelectedShipment(null)} />;
  }

  return (
    <section className="shipments-panel">
      <div className="section-heading"><div><div className="section-title-row"><h2>Mening yuklarim</h2><span className="section-count">{shipments.length}</span></div><p>Har bir so'rov o'z tartib raqami bilan saqlanadi.</p></div><div className="table-actions"><label className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Yuk yoki manzil qidirish" aria-label="Yuk yoki manzil qidirish" /></label><div className="location-filters"><div className="filter-segment" role="group" aria-label="Hudud bo'yicha saralash"><button className={locationMode === "all" ? "selected" : ""} type="button" onClick={() => { setLocationMode("all"); setSelectedCity(""); }}>Barchasi</button><button className={locationMode === "from" ? "selected" : ""} type="button" onClick={() => { setLocationMode("from"); setSelectedCity(""); }}>Qayerdan</button><button className={locationMode === "to" ? "selected" : ""} type="button" onClick={() => { setLocationMode("to"); setSelectedCity(""); }}>Qayerga</button></div>{locationMode !== "all" && <select className="city-filter" aria-label={locationMode === "from" ? "Jo'nash hududi" : "Yetib borish hududi"} value={selectedCity} onChange={(event) => setSelectedCity(event.target.value)}><option value="">Barcha hududlar</option>{cities.map((city) => <option value={city} key={city}>{city}</option>)}</select>}</div><button className="button button-dark compact-button" type="button" onClick={onCreate}><PackagePlus size={16} /> Yangi yuk</button></div></div>
      {visible.length ? <div className="shipment-list">{visible.map((shipment) => <button className="shipment-card" key={shipment.id} type="button" onClick={() => setSelectedShipment(shipment)} aria-label={`${shipment.code}, ${shipment.origin} dan ${shipment.destination} ga`}><span className="shipment-code"><span>YUK RAQAMI</span><strong>{shipment.code}</strong></span><span className="shipment-route"><span>{shipment.origin}</span><ArrowLeftRight size={15} /><span>{shipment.destination}</span></span><span className="shipment-date"><Clock3 size={15} /><span>{formatDate(shipment.departure_at)}<small>{formatTime(shipment.departure_at)}</small></span></span><span className={`shipment-status status-${shipment.status || "pending"}`}>{shipment.status === "approved" ? <PackageCheck size={13} /> : shipment.status === "rejected" ? <X size={13} /> : <Clock3 size={13} />}{shipment.status_label || "Tasdiqlash kutilmoqda"}</span><ArrowUpRight className="shipment-open-icon" size={16} aria-hidden="true" /></button>)}</div> : <div className="empty-shipments"><div className="empty-icon"><PackageCheck size={21} /></div><strong>{shipments.length ? "Bu hudud bo'yicha yuk topilmadi" : "Hali yuk so'rovi yo'q"}</strong><p>{shipments.length ? "Boshqa hudud yoki saralash turini tanlang." : "Yangi yuk so'rovingizni yaratib ko'ring."}</p><button className="button button-dark" type="button" onClick={onCreate}>Yuk jo'natish<ArrowUpRight size={16} /></button></div>}
    </section>
  );
}