import { useState } from "react";
import { AlertTriangle, ArrowLeftRight, ArrowUpRight, ChevronDown, Clock3, MapPin, PackagePlus, X } from "lucide-react";
import { formatDate, formatTime } from "../../lib/format.js";

export default function ShipmentForm({ routes, status, onSubmit, saving }) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [slotId, setSlotId] = useState("");
  const [senderName, setSenderName] = useState("");
  const [description, setDescription] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const origins = [...new Set(routes.map((item) => item.origin))].sort((first, second) => first.localeCompare(second, "uz"));
  const destinations = [...new Set(routes.filter((item) => item.origin === origin).map((item) => item.destination))].sort((first, second) => first.localeCompare(second, "uz"));
  const route = routes.find((item) => item.origin === origin && item.destination === destination);
  const slot = route?.slots.find((item) => String(item.id) === slotId);

  const submit = (event) => {
    event.preventDefault();
    const errors = [];
    if (!origin) errors.push("Qayerdan: jo'nash hududini tanlang.");
    if (!destination) errors.push("Qayerga: yetib borish hududini tanlang.");
    if (origin && destination && !route) errors.push("Tanlangan yo'nalishda qatnov mavjud emas.");
    if (!slot) errors.push("Qatnov vaqti: sana va vaqtni tanlang.");
    if (!senderName.trim()) errors.push("Ismingizni to'g'ri kiriting.");
    if (!description.trim()) errors.push("Yuk tavsifini to'ldiring.");

    if (errors.length) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);
    onSubmit({ routeId: route.id, slotId: slot.id, senderName: senderName.trim(), description: description.trim() }, () => {
      setSenderName("");
      setDescription("");
    });
  };

  return (
    <section className="form-panel">
      <div className="panel-heading"><div className="panel-icon"><PackagePlus size={18} /></div><div><h2>Yuk jo'natish</h2><p>Qatnov va yuk ma'lumotlarini kiriting</p></div><span className="step-label">01 <span>/</span> 01</span></div>
      {status === "error" && <div className="inline-error">Server bilan aloqa o'rnatilmadi. Yangilab ko'ring.</div>}
      {status === "ready" && routes.length === 0 && <div className="empty-routes"><div className="empty-icon"><PackagePlus size={20} /></div><div><strong>Hozircha qatnov yo'q</strong><p>Yangi yo'nalish va vaqtlar administrator tomonidan qo'shiladi.</p></div></div>}
      <form className="shipment-form" onSubmit={submit} noValidate>
        <div className="form-section-title"><span>01</span><strong>Qatnovni tanlang</strong></div>
        <div className="field-row route-row">
          <label className="field"><span>QAYERDAN <i>*</i></span><span className="select-wrap"><MapPin size={16} /><select required value={origin} onChange={(event) => { setOrigin(event.target.value); setDestination(""); setSlotId(""); }} disabled={!origins.length}><option value="">Jo'nash shahrini tanlang</option>{origins.map((city) => { const count = routes.filter((item) => item.origin === city).reduce((total, item) => total + item.slots.length, 0); return <option value={city} key={city}>{city} · {count} ta qatnov</option>; })}</select><ChevronDown size={15} /></span></label>
          <span className="route-arrow"><ArrowLeftRight size={17} /></span>
          <label className="field"><span>QAYERGA <i>*</i></span><span className="select-wrap"><MapPin size={16} /><select required value={destination} onChange={(event) => { setDestination(event.target.value); setSlotId(""); }} disabled={!origin}><option value="">{origin ? "Yetib borish shahrini tanlang" : "Avval jo'nash shahrini tanlang"}</option>{destinations.map((city) => { const count = routes.find((item) => item.origin === origin && item.destination === city)?.slots.length ?? 0; return <option value={city} key={city}>{city} · {count} ta qatnov</option>; })}</select><ChevronDown size={15} /></span></label>
        </div>
        <label className="field departure-field"><span>QATNOV VAQTI <i>*</i></span><span className="select-wrap"><Clock3 size={16} /><select required value={slotId} onChange={(event) => setSlotId(event.target.value)} disabled={!route}><option value="">Sana va vaqtni tanlang</option>{route?.slots.map((item) => <option value={item.id} key={item.id}>{formatDate(item.departure_at)} · {formatTime(item.departure_at)} · {item.available} ta joy</option>)}</select><ChevronDown size={15} /></span></label>
        {slot && <div className="slot-summary"><span className="slot-date"><Clock3 size={15} />{formatDate(slot.departure_at)}, {formatTime(slot.departure_at)}</span><span>{slot.available} ta bo'sh joy</span></div>}
        <div className="form-section-title cargo-title"><span>02</span><strong>Yuk ma'lumotlari</strong></div>
        <label className="field"><span>ISMINGIZ <i>*</i></span><input required maxLength={120} value={senderName} onChange={(event) => setSenderName(event.target.value)} placeholder="Ism va familiya" /></label>
        <label className="field description-field"><span>YUK TAVSIFI <i>*</i></span><textarea required maxLength={2000} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Yuk turi, o'lchami yoki alohida talablar" rows={3} /><span className="field-counter">{description.length} / 2000</span></label>
        <div className="form-actions"><p><span className="required-mark">*</span> Majburiy maydonlar</p><button className="button button-dark" type="submit" disabled={saving || status !== "ready" || !routes.length}>{saving ? "Yuborilmoqda..." : "Yukni yaratish"}<ArrowUpRight size={17} /></button></div>
      </form>
      {validationErrors.length > 0 && <div className="validation-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setValidationErrors([])}>
        <section className="validation-dialog" role="alertdialog" aria-modal="true" aria-labelledby="validation-title" aria-describedby="validation-description">
          <button className="validation-close" type="button" onClick={() => setValidationErrors([])} aria-label="Yopish"><X size={17} /></button>
          <div className="validation-icon"><AlertTriangle size={20} /></div>
          <p className="validation-overline">MA'LUMOTLAR YETARLI EMAS</p>
          <h2 id="validation-title">Ma'lumotlarni to'ldiring</h2>
          <p id="validation-description">Iltimos, quyidagi ma'lumotlarni to'g'ri yozing yoki tanlang:</p>
          <ul>{validationErrors.map((error) => <li key={error}>{error}</li>)}</ul>
          <button className="button button-dark validation-confirm" type="button" onClick={() => setValidationErrors([])}>Tushunarli</button>
        </section>
      </div>}
    </section>
  );
}
