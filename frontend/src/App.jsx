import { useEffect, useState } from "react";
import { ArrowLeftRight, ArrowUpRight, CircleHelp, MapPin, PackageCheck, PackagePlus, ShieldCheck, Truck, X } from "lucide-react";
import RouteSummary from "./features/routes/RouteSummary.jsx";
import ShipmentForm from "./features/shipments/ShipmentForm.jsx";
import ShipmentList from "./features/shipments/ShipmentList.jsx";
import { request } from "./lib/api.js";

function readShipments() {
  try {
    const stored = JSON.parse(localStorage.getItem("shipments") || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [routes, setRoutes] = useState([]);
  const [shipments, setShipments] = useState(readShipments);
  const [status, setStatus] = useState("loading");
  const [view, setView] = useState("create");
  const [notice, setNotice] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    request("/api/routes/")
      .then((routeData) => {
        if (!active) return;
        setRoutes(routeData.routes);
        setStatus("ready");
      })
      .catch(() => active && setStatus("error"));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (view !== "shipments") return undefined;
    let active = true;

    const refreshStatuses = async () => {
      const currentShipments = readShipments();
      const updatedShipments = await Promise.all(currentShipments.map(async (shipment) => {
        if (!shipment.tracking_token) return shipment;
        try {
          const result = await request("/api/shipments/status/", {
            method: "POST",
            body: JSON.stringify({ tracking_token: shipment.tracking_token }),
          });
          return { ...shipment, ...result.shipment };
        } catch {
          return shipment;
        }
      }));

      if (!active) return;
      localStorage.setItem("shipments", JSON.stringify(updatedShipments));
      setShipments(updatedShipments);
    };

    refreshStatuses();
    const intervalId = window.setInterval(refreshStatuses, 10000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [view]);

  const createShipment = async (values, resetForm) => {
    setSaving(true);
    setNotice(null);
    try {
      const result = await request("/api/shipments/create/", {
        method: "POST",
        body: JSON.stringify({
          route_id: values.routeId,
          slot_id: values.slotId,
          sender_name: values.senderName,
          cargo_description: values.description,
        }),
      });
      setShipments((current) => {
        const updated = [{ ...result.shipment, tracking_token: result.tracking_token }, ...current];
        localStorage.setItem("shipments", JSON.stringify(updated));
        return updated;
      });
      resetForm();
      setView("shipments");
      setNotice({ type: "success", text: `${result.shipment.code} raqamli yuk yaratildi.` });
    } catch (error) {
      setNotice({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const openShipments = () => setView("shipments");
  const today = new Intl.DateTimeFormat("uz-UZ", { day: "2-digit", month: "long", year: "numeric" }).format(new Date());

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#home" aria-label="YukYo'l bosh sahifa"><span className="brand-mark"><ArrowLeftRight size={20} /></span><span className="brand-name">yukyo'l<span>.</span></span></a>
        <div className="workspace-switcher"><span className="workspace-icon"><Truck size={17} /></span><span className="workspace-copy"><strong>Yuk tashish</strong><small>O'zbekiston bo'ylab</small></span><ArrowUpRight size={14} className="muted-icon" /></div>
        <p className="nav-label">ASOSIY</p>
        <nav className="primary-nav" aria-label="Asosiy menyu">
          <button className={`nav-item ${view === "create" ? "active" : ""}`} type="button" onClick={() => setView("create")}><PackagePlus size={17} /> Yuk jo'natish</button>
          <button className={`nav-item ${view === "shipments" ? "active" : ""}`} type="button" onClick={openShipments}><PackageCheck size={17} /> Mening yuklarim <span className="nav-count">{shipments.length}</span></button>
        </nav>
        <div className="sidebar-bottom">
          {/* <a className="nav-item help-link" href="mailto:yordam@yukyol.uz"><CircleHelp size={17} /> Yordam</a> */}
          <div className="sidebar-note"><PackageCheck size={15} /><span>Yuklar bo'limi</span></div>
        </div>
      </aside>

      <main className="main-content" id="home">
        <header className="topbar"><div className="breadcrumbs"><span>Yuk tashish</span><span className="crumb-slash">/</span><strong>{view === "create" ? "Yangi so'rov" : "Mening yuklarim"}</strong></div><div className="topbar-right"><span className={`connection ${status === "ready" ? "is-online" : status === "error" ? "is-error" : ""}`}><span className="connection-dot" />{status === "ready" ? "Qatnovlar yangilandi" : status === "error" ? "Server bilan aloqa yo'q" : "Ulanmoqda"}</span><span className="topbar-date">{today}<MapPin size={13} /></span></div></header>
        <div className="page-wrap">
          <section className="page-heading"><div><p className="eyebrow"><span className="eyebrow-line" /> KICHIK YUKLAR UCHUN QATNOVLAR</p><h1>{view === "create" ? <>Yukingizga mos <em>qatnov.</em></> : <>Yuklaringiz <em>yo'lda.</em></>}</h1><p className="page-subtitle">{view === "create" ? "Yo'nalishni tanlang, mavjud qatnovni toping va yukingizni yuboring." : "Yaratilgan yuk so'rovlaringiz holati va qatnov ma'lumotlari."}</p></div><div className="heading-badge"><span className="badge-icon"><ShieldCheck size={16} /></span> Ishonchli qatnovlar</div></section>
          {notice && <div className={`notice ${notice.type}`} role="status"><span>{notice.text}</span><button type="button" onClick={() => setNotice(null)} aria-label="Xabarni yopish"><X size={15} /></button></div>}
          {view === "create" ? <div className="content-grid"><ShipmentForm routes={routes} status={status} onSubmit={createShipment} saving={saving} /><RouteSummary routes={routes} status={status} /></div> : <ShipmentList shipments={shipments} onCreate={() => setView("create")} />}
          <footer className="page-footer"><span>YUKYO'L <span className="footer-separator">/</span> QATNOVLAR VA YUKLAR</span><span><span className="footer-status" /> Tizim ishlayapti</span></footer>
        </div>
      </main>
    </div>
  );
}