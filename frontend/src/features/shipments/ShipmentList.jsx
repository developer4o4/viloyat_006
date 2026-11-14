import { useState } from "react";
import { ArrowLeftRight, ArrowUpRight, Clock3, PackageCheck, PackagePlus, Search } from "lucide-react";
import { formatDate, formatTime } from "../../lib/format.js";

export default function ShipmentList({ shipments, onCreate }) {
  const [query, setQuery] = useState("");
  const visible = shipments.filter((shipment) => `${shipment.code} ${shipment.origin} ${shipment.destination} ${shipment.cargo_description}`.toLocaleLowerCase("uz").includes(query.trim().toLocaleLowerCase("uz")));

  return (
    <section className="shipments-panel">
      <div className="section-heading"><div><div className="section-title-row"><h2>Mening yuklarim</h2><span className="section-count">{shipments.length}</span></div><p>Har bir so'rov o'z tartib raqami bilan saqlanadi.</p></div><div className="table-actions"><label className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Yuk yoki manzil qidirish" aria-label="Yuk yoki manzil qidirish" /></label><button className="button button-dark compact-button" type="button" onClick={onCreate}><PackagePlus size={16} /> Yangi yuk</button></div></div>
      {visible.length ? <div className="shipment-list">{visible.map((shipment) => <article className="shipment-card" key={shipment.id}><div className="shipment-code"><span>YUK RAQAMI</span><strong>{shipment.code}</strong></div><div className="shipment-route"><span>{shipment.origin}</span><ArrowLeftRight size={15} /><span>{shipment.destination}</span></div><div className="shipment-date"><Clock3 size={15} /><span>{formatDate(shipment.departure_at)}<small>{formatTime(shipment.departure_at)}</small></span></div><div className="shipment-description"><span>{shipment.sender_name}</span><small>{shipment.cargo_description}</small></div><span className="shipment-status"><PackageCheck size={13} /> Yaratildi</span></article>)}</div> : <div className="empty-shipments"><div className="empty-icon"><PackageCheck size={21} /></div><strong>Hali yuk so'rovi yo'q</strong><p>Yangi yuk so'rovingizni yaratib ko'ring.</p><button className="button button-dark" type="button" onClick={onCreate}>Yuk jo'natish<ArrowUpRight size={16} /></button></div>}
    </section>
  );
}