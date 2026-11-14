import { useEffect, useRef, useState } from "react";

const L = {
  ru: { nHome: "Главная", nArena: "PC Arena", nPrices: "Цены", nContact: "Контакты", h1: "WELCOME TO EMPIRE", sub: "ENTER THE WORLD OF GAMING", book: "BOOK YOUR PC", view: "VIEW PRICES", demo: "Демо-режим: данные и брони хранятся только в этом браузере. Реальная синхронизация придёт с Supabase.", AVAILABLE: "СВОБОДЕН", OCCUPIED: "ЗАНЯТ", RESERVED: "ЗАБРОНИРОВАН", OFFLINE: "ОФЛАЙН", left: "осталось", reserve: "Забронировать", extend: "+1 час", start: "Начало", dur: "Длительность", confirm: "Подтвердить бронь", close: "Закрыть", all: "Все", hr: "в час", addr: "Адрес и телефон: заполняется администратором", hours: "Часы работы: заполняются администратором", busy: "Конфликт: это время уже занято.", done: "Бронь создана №", past: "Выберите время не раньше текущего.", extbad: "Продление конфликтует с другой бронью.", acc: "Войти / Регистрация", accReg: "Создать аккаунт", name: "Имя и фамилия", phone: "Телефон", pass: "Пароль (мин. 6 символов)", create: "Создать аккаунт", bonus: "Новым игрокам: 1 час бесплатно!", mins: "мин", logout: "Выйти", bad: "Проверьте имя, телефон и пароль.", free: "БЕСПЛАТНО", freeUsed: "бонус", promo: "Промокод", apply: "Применить", promoOk: "Промокод принят:", promoBad: "Такого промокода нет.", promoUsed: "Вы уже использовали этот промокод." },
  uz: { nHome: "Bosh sahifa", nArena: "PC Arena", nPrices: "Narxlar", nContact: "Aloqa", h1: "WELCOME TO EMPIRE", sub: "ENTER THE WORLD OF GAMING", book: "BOOK YOUR PC", view: "VIEW PRICES", demo: "Demo rejim: ma’lumotlar faqat shu brauzerda saqlanadi. Haqiqiy sinxronlash Supabase bilan keladi.", AVAILABLE: "BO‘SH", OCCUPIED: "BAND", RESERVED: "BRON QILINGAN", OFFLINE: "OFFLAYN", left: "qoldi", reserve: "Bron qilish", extend: "+1 soat", start: "Boshlanish", dur: "Davomiyligi", confirm: "Bronni tasdiqlash", close: "Yopish", all: "Hammasi", hr: "soatiga", addr: "Manzil va telefon: administrator kiritadi", hours: "Ish vaqti: administrator kiritadi", busy: "Ziddiyat: bu vaqt band.", done: "Bron yaratildi №", past: "Hozirdan keyingi vaqtni tanlang.", extbad: "Uzaytirish boshqa bron bilan to‘qnashadi.", acc: "Kirish / Ro‘yxatdan o‘tish", accReg: "Akkaunt ochish", name: "Ism va familiya", phone: "Telefon", pass: "Parol (kamida 6 belgi)", create: "Akkaunt ochish", bonus: "Yangi o‘yinchilarga: 1 soat tekin!", mins: "daq", logout: "Chiqish", bad: "Ism, telefon va parolni tekshiring.", free: "TEKIN", freeUsed: "bonus", promo: "Promo kod", apply: "Qo‘llash", promoOk: "Promo kod qabul qilindi:", promoBad: "Bunday promo kod yo‘q.", promoUsed: "Bu promo koddan allaqachon foydalangansiz." },
  en: { nHome: "Home", nArena: "PC Arena", nPrices: "Prices", nContact: "Contact", h1: "WELCOME TO EMPIRE", sub: "ENTER THE WORLD OF GAMING", book: "BOOK YOUR PC", view: "VIEW PRICES", demo: "Demo mode: data and bookings live only in this browser. Real sync arrives with Supabase.", AVAILABLE: "AVAILABLE", OCCUPIED: "OCCUPIED", RESERVED: "RESERVED", OFFLINE: "OFFLINE", left: "remaining", reserve: "Reserve", extend: "+1 hour", start: "Start", dur: "Duration", confirm: "Confirm booking", close: "Close", all: "All", hr: "per hour", addr: "Address and phone: set by the administrator", hours: "Opening hours: set by the administrator", busy: "Conflict: that time is already taken.", done: "Booking created #", past: "Pick a time from now onward.", extbad: "Extension conflicts with another booking.", acc: "Log in / Sign up", accReg: "Create account", name: "Full name", phone: "Phone", pass: "Password (min. 6 characters)", create: "Create account", bonus: "New players get 1 hour free!", mins: "min", logout: "Log out", bad: "Check name, phone and password.", free: "FREE", freeUsed: "bonus", promo: "Promo code", apply: "Apply", promoOk: "Promo code applied:", promoBad: "This promo code doesn’t exist.", promoUsed: "You already used this promo code." },
};
const ZONES = {
  STANDARD: { p: 15000, s: "i5 · RTX 3060 · 16GB · 165Hz" },
  VIP: { p: 25000, s: "i7 · RTX 4070 · 32GB · 240Hz" },
  BOOTCAMP: { p: 35000, s: "i9 · RTX 4080 · 32GB · 360Hz" },
};
const PROMO = { EMPIRE10: 10, GAMER20: 20, VIP15: 15 };
const VIEWS = ["home", "arena", "prices", "contact"];
const NAV = { home: "nHome", arena: "nArena", prices: "nPrices", contact: "nContact" };
const GAMES = ["Counter-Strike 2", "Dota 2", "Valorant", "PUBG", "GTA V", "Fortnite"];

const fmt = (n) => n.toLocaleString("ru-RU") + " UZS";
const hms = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map((x) => String(x).padStart(2, "0")).join(":");
};
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const store = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const clash = (p, s, e, skip) => p.bk.some((b) => b !== skip && s < b.e && e > b.s);
const active = (p, now) => p.bk.find((b) => b.s <= now && now < b.e);
const status = (p, now) => {
  if (p.off) return "OFFLINE";
  if (active(p, now)) return "OCCUPIED";
  return p.bk.some((b) => b.s > now && b.s - now < 18e5) ? "RESERVED" : "AVAILABLE";
};
const initPcs = () => {
  const n = Date.now();
  const list = Array.from({ length: 12 }, (_, i) => ({
    id: "PC-" + String(i + 1).padStart(2, "0"),
    z: i < 6 ? "STANDARD" : i < 9 ? "VIP" : "BOOTCAMP",
    off: i === 11,
    bk: [],
  }));
  list[0].bk.push({ s: n - 6e5, e: n + 5140000, n: "DEMO" });
  list[3].bk.push({ s: n + 36e5, e: n + 72e5, n: "DEMO" });
  return list;
};

function Modal({ onClose, children }) {
  const r = useRef();
  useEffect(() => { r.current.showModal(); }, []);
  return <dialog ref={r} onClose={onClose}>{children(() => r.current.close())}</dialog>;
}

function BookDialog({ pc, user, t, onSave, onClose }) {
  const d0 = new Date(Date.now() + 9e5);
  const [start, setStart] = useState(String(d0.getHours()).padStart(2, "0") + ":" + String(d0.getMinutes()).padStart(2, "0"));
  const [dur, setDur] = useState(60);
  const [code, setCode] = useState("");
  const [pr, setPr] = useState(0);
  const [pcode, setPcode] = useState("");
  const [pm, setPm] = useState("");
  const [msg, setMsg] = useState("");
  const f = user.free;
  const c = Math.round(((ZONES[pc.z].p * Math.max(0, dur - f)) / 60) * (100 - pr) / 100);

  const apply = () => {
    const k = code.trim().toUpperCase();
    setPr(0); setPcode("");
    if (!PROMO[k]) return setPm(t("promoBad"));
    if ((user.used || []).includes(k)) return setPm(t("promoUsed"));
    setPr(PROMO[k]); setPcode(k); setPm(t("promoOk") + " −" + PROMO[k] + "%");
  };
  const confirm = () => {
    const [h, m] = start.split(":").map(Number);
    const d = new Date(); d.setHours(h, m, 0, 0);
    const s = d.getTime(), e = s + dur * 6e4;
    if (s < Date.now() - 6e4) return setMsg(t("past"));
    if (clash(pc, s, e)) return setMsg(t("busy"));
    const n = "EMP-" + Date.now().toString(36).toUpperCase();
    onSave(pc.id, { s, e, n }, dur, pr ? pcode : "");
    setMsg(t("done") + n); setPr(0); setPcode(""); setCode(""); setPm("");
  };

  return (
    <Modal onClose={onClose}>
      {(close) => (
        <>
          <h3>{pc.id} · {pc.z}</h3>
          <label>{t("start")}</label>
          <input type="time" value={start} onChange={(e) => setStart(e.target.value)} />
          <label>{t("dur")}</label>
          <select value={dur} onChange={(e) => setDur(+e.target.value)} style={{ width: "100%" }}>
            {[[30, "30 min"], [60, "1 h"], [120, "2 h"], [180, "3 h"], [300, "5 h"], [600, "10 h"]].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <label>{t("promo")}</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={code} onChange={(e) => setCode(e.target.value)} autoComplete="off" style={{ textTransform: "uppercase" }} />
            <button onClick={apply}>{t("apply")}</button>
          </div>
          <small role="status">{pm}</small>
          <p>= <span className="price">{c ? fmt(c) + (pr ? ` −${pr}%` : "") + (f ? ` (${t("freeUsed")} ${Math.min(f, dur)} ${t("mins")})` : "") : t("free")}</span></p>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="p" onClick={confirm}>{t("confirm")}</button>
            <button onClick={close}>{t("close")}</button>
          </div>
          <div id="msg" role="status">{msg}</div>
        </>
      )}
    </Modal>
  );
}

function AuthDialog({ t, onCreate, onClose }) {
  const [n, setN] = useState(""), [ph, setPh] = useState(""), [pw, setPw] = useState(""), [m, setM] = useState("");
  const submit = (close) => {
    const p = ph.replace(/\D/g, "").replace(/^998(?=\d{9}$)/, "");
    if (n.trim().length < 2 || p.length !== 9 || pw.length < 6) return setM(t("bad"));
    onCreate({ name: n.trim(), phone: "+998" + p, free: 60, used: [] });
    close();
  };
  return (
    <Modal onClose={onClose}>
      {(close) => (
        <>
          <h3>{t("accReg")}</h3>
          <p className="note">{t("bonus")}</p>
          <label>{t("name")}</label>
          <input value={n} onChange={(e) => setN(e.target.value)} autoComplete="name" />
          <label>{t("phone")}</label>
          <div className="ph"><span>+998</span><input type="tel" inputMode="numeric" maxLength={13} placeholder="90 123 45 67" value={ph} onChange={(e) => setPh(e.target.value)} autoComplete="tel-national" /></div>
          <label>{t("pass")}</label>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" />
          <br />
          <div style={{ display: "flex", gap: 8 }}>
            <button className="p" onClick={() => submit(close)}>{t("create")}</button>
            <button onClick={close}>{t("close")}</button>
          </div>
          <div id="msg" role="status">{m}</div>
        </>
      )}
    </Modal>
  );
}

function Glow() {
  const a = useRef(), b = useRef();
  useEffect(() => {
    if (matchMedia("(hover:none),(pointer:coarse)").matches) return;
    let mx = innerWidth / 2, my = innerHeight / 2, x1 = mx, y1 = my, x2 = mx, y2 = my, raf;
    const rm = matchMedia("(prefers-reduced-motion:reduce)").matches;
    const toggle = (on) => { a.current.classList.toggle("on", on); b.current.classList.toggle("on", on); };
    const move = (e) => { if (e.pointerType === "touch") return; mx = e.clientX; my = e.clientY; toggle(true); };
    const out = () => toggle(false);
    const loop = () => {
      const k1 = rm ? 1 : 0.08, k2 = rm ? 1 : 0.22;
      x1 += (mx - x1) * k1; y1 += (my - y1) * k1; x2 += (mx - x2) * k2; y2 += (my - y2) * k2;
      a.current.style.transform = `translate(${x1}px,${y1}px)`;
      b.current.style.transform = `translate(${x2}px,${y2}px)`;
      raf = requestAnimationFrame(loop);
    };
    addEventListener("pointermove", move);
    document.documentElement.addEventListener("mouseleave", out);
    loop();
    return () => { cancelAnimationFrame(raf); removeEventListener("pointermove", move); document.documentElement.removeEventListener("mouseleave", out); };
  }, []);
  return <><div ref={a} className="glow g1" aria-hidden="true" /><div ref={b} className="glow g2" aria-hidden="true" /></>;
}

function Bg() {
  const use = [[60, 90, -6, 140, 140], [900, 60, 5, 980, 110], [980, 520, -4, 1060, 570], [90, 560, 4, 170, 610], [520, 620, -3, 600, 670]];
  return (
    <div className="bg" aria-hidden="true">
      <div className="gr" /><div className="o o1" /><div className="o o2" /><div className="o o3" />
      <div className="beams">
        <i style={{ left: "10%", "--c": "var(--pr)" }} />
        <i style={{ left: "34%", "--c": "var(--ne)", animationDelay: "-3s" }} />
        <i style={{ left: "62%", "--c": "var(--rd)", animationDelay: "-6s" }} />
        <i style={{ left: "88%", "--c": "var(--pr)", animationDelay: "-2s" }} />
      </div>
      <div className="dots" /><div className="floor" /><div className="scan" />
      <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor" strokeWidth="3">
        <defs><g id="m"><rect width="160" height="100" rx="8" /><rect x="10" y="10" width="140" height="80" rx="3" strokeOpacity=".4" /><path d="M80 100v24M48 124h64" /><rect x="-10" y="138" width="180" height="18" rx="4" /></g></defs>
        {use.map(([x, y, r, cx, cy]) => <use key={x} href="#m" x={x} y={y} transform={`rotate(${r} ${cx} ${cy})`} />)}
      </svg>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState(() => load("lang", "ru"));
  const [theme, setTheme] = useState(() => load("theme", null));
  const [view, setView] = useState(() => { const h = location.hash.slice(1); return VIEWS.includes(h) ? h : "home"; });
  const [zone, setZone] = useState("ALL");
  const [pcs, setPcs] = useState(initPcs);
  const [now, setNow] = useState(Date.now());
  const [user, setUser] = useState(() => load("emp_user", null));
  const [bookId, setBookId] = useState(null);
  const [auth, setAuth] = useState(false);
  const t = (k) => L[lang][k] || k;

  useEffect(() => { const i = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(i); }, []);
  useEffect(() => { document.documentElement.lang = lang; store("lang", lang); }, [lang]);
  useEffect(() => { if (theme) { document.documentElement.dataset.theme = theme; store("theme", theme); } }, [theme]);
  useEffect(() => { window.scrollTo(0, 0); try { history.replaceState(null, "", "#" + view); } catch {} }, [view]);

  const toggleTheme = () => {
    const cur = theme || (matchMedia("(prefers-color-scheme:light)").matches ? "light" : "dark");
    setTheme(cur === "dark" ? "light" : "dark");
  };
  const saveUser = (u) => { setUser(u); if (u) store("emp_user", u); else try { localStorage.removeItem("emp_user"); } catch {} };
  const onAcc = () => { if (!user) setAuth(true); else if (confirm(t("logout") + "?")) saveUser(null); };
  const openBook = (p) => (user ? setBookId(p.id) : setAuth(true));
  const extend = (p) => {
    const cur = active(p, now);
    if (clash(p, cur.e, cur.e + 36e5, cur)) return alert(t("extbad"));
    setPcs((ps) => ps.map((x) => (x.id === p.id ? { ...x, bk: x.bk.map((b) => (b === cur ? { ...b, e: b.e + 36e5 } : b)) } : x)));
  };
  const onSave = (id, booking, dur, code) => {
    setPcs((ps) => ps.map((x) => (x.id === id ? { ...x, bk: [...x.bk, booking] } : x)));
    saveUser({ ...user, free: user.free - Math.min(user.free, dur), used: code ? [...(user.used || []), code] : user.used });
  };
  const bookPc = pcs.find((p) => p.id === bookId);

  return (
    <>
      <Bg />
      <header>
        <a className="logo" href="#home" style={{ textDecoration: "none" }} onClick={(e) => { e.preventDefault(); setView("home"); }}>EMPIRE</a>
        <button id="acc" className="p" onClick={onAcc}>{user ? `${user.name.split(" ")[0]} · ${user.free} ${t("mins")}` : t("acc")}</button>
        <select id="lang" aria-label="Language" value={lang} onChange={(e) => setLang(e.target.value)}>
          <option value="ru">RU</option><option value="uz">UZ</option><option value="en">EN</option>
        </select>
        <button id="th" aria-label="Theme" onClick={toggleTheme}>◐</button>
        <nav id="nv">{VIEWS.map((v) => <button key={v} className={view === v ? "on" : ""} onClick={() => setView(v)}>{t(NAV[v])}</button>)}</nav>
      </header>

      {view === "home" && (
        <div className="hero view cur" id="home">
          <h1>{t("h1")}</h1>
          <p>{t("sub")}</p>
          <div className="row">
            <button className="p" onClick={() => setView("arena")}>{t("book")}</button>
            <button onClick={() => setView("prices")}>{t("view")}</button>
          </div>
          <div className="chips">{GAMES.map((g) => <span key={g}>{g}</span>)}</div>
          <button className="bn" onClick={() => (user ? setView("arena") : setAuth(true))}>{t("bonus")}</button>
        </div>
      )}

      {view === "arena" && (
        <section className="view cur" id="arena">
          <h2>{t("nArena")}</h2>
          <div className="note">{t("demo")}</div><br />
          <div className="tabs">
            {["ALL", ...Object.keys(ZONES)].map((k) => <button key={k} className={zone === k ? "on" : ""} onClick={() => setZone(k)}>{k === "ALL" ? t("all") : k}</button>)}
          </div>
          <div className="grid">
            {pcs.filter((p) => zone === "ALL" || p.z === zone).map((p) => {
              const s = status(p, now), cur = active(p, now);
              return (
                <div key={p.id} className={`card pc ${s}`}>
                  <b>{p.id}</b> <small>{p.z}</small>
                  <div className="st">{t(s)}</div>
                  <small>{ZONES[p.z].s}</small><br />
                  <small>{fmt(ZONES[p.z].p)} / {t("hr")}</small>
                  {cur && <><div className="t">{hms(cur.e - now)}</div><small>{t("left")}</small><br /><button onClick={() => extend(p)}>{t("extend")}</button></>}
                  {s !== "OFFLINE" && <><br /><button className="p" style={{ marginTop: 6 }} onClick={() => openBook(p)}>{t("reserve")}</button></>}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {view === "prices" && (
        <section className="view cur" id="prices">
          <h2>{t("nPrices")}</h2>
          <div id="zones">
            {Object.entries(ZONES).map(([k, v]) => (
              <div key={k} className={`card zc ${k}`}>
                <h3>{k}</h3>
                <div className="price">{fmt(v.p)}</div>
                <small>{t("hr")}</small>
                <p><small>{v.s}</small></p>
              </div>
            ))}
          </div>
        </section>
      )}

      {view === "contact" && (
        <section className="view cur" id="contact">
          <h2>{t("nContact")}</h2>
          <div className="card">{t("addr")}<br />{t("hours")}</div>
        </section>
      )}

      <footer>© EMPIRE</footer>
      {bookPc && user && <BookDialog pc={bookPc} user={user} t={t} onSave={onSave} onClose={() => setBookId(null)} />}
      {auth && <AuthDialog t={t} onCreate={saveUser} onClose={() => setAuth(false)} />}
      <Glow />
    </>
  );
}