import { ArrowDownUp, MapPin, PackageCheck, Truck } from "lucide-react";

export default function RouteSummary({ routes, status }) {
  return (
    <aside className="side-column">
      <section className="match-panel">
        <div className="match-top"><div><span className="overline">MOS QATNOVLAR</span><h2>{status === "ready" ? String(routes.length).padStart(2, "0") : "--"}<small> yo'nalish</small></h2></div><span className="match-symbol"><ArrowDownUp size={18} /></span></div>
        <div className="match-rule" />
        <div className="match-route-list">
          {routes.slice(0, 4).map((route) => <div className="match-route" key={route.id}><span className="route-node" /><div><strong>{route.origin}</strong><span>{route.destination}</span></div><span className="route-time-count">{route.slots.length} vaqt</span></div>)}
          {status === "ready" && routes.length === 0 && <p className="match-empty">Yangi qatnovlar qo'shilishi bilan shu yerda ko'rinadi.</p>}
        </div>
        <div className="match-foot"><span className="pulse-dot" /> Jonli qatnovlar bazasi</div>
      </section>
      <section className="code-panel"><span className="code-panel-icon"><PackageCheck size={18} /></span><div><strong>Yuk raqami</strong><span>Har bir so'rov Y01 tartibida saqlanadi</span></div></section>
      <div className="note-line"><Truck size={15} /><span>O'zbekiston bo'ylab qatnovlar</span><MapPin size={14} /></div>
    </aside>
  );
}