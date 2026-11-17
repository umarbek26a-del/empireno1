import { useEffect, useRef, useState } from "react";

// All styles live here, so this single file is the whole app.
const CSS = String.raw`
@import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@500;700&family=Inter:wght@400;600&display=swap");

:root{--bg:#07050d;--sf:#120d20;--bd:#2b1f4a;--tx:#ece8f8;--mut:#9a90b8;--pr:#8b5cf6;--ne:#22d3ee;--rd:#f43f5e;--gr:#22c55e;--yl:#eab308;--gy:#6b7280;color-scheme:dark;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
@media (prefers-color-scheme:light){:root:not([data-theme="dark"]){--bg:#fff;--sf:#f3f1fa;--bd:#ddd6f3;--tx:#1b1530;--mut:#645b82;--pr:#6d3fe0;--ne:#0891b2;color-scheme:light}}
:root[data-theme="light"]{--bg:#fff;--sf:#f3f1fa;--bd:#ddd6f3;--tx:#1b1530;--mut:#645b82;--pr:#6d3fe0;--ne:#0891b2;color-scheme:light}
:root[data-theme="dark"]{--bg:#07050d;--sf:#120d20;--bd:#2b1f4a;--tx:#ece8f8;--mut:#9a90b8;--pr:#8b5cf6;--ne:#22d3ee;color-scheme:dark}
html{scroll-padding-top:env(safe-area-inset-top,0px);height:100%}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--tx);font:16px/1.5 Inter,system-ui,sans-serif}
h1,h2,h3,.logo{font-family:Rajdhani,Impact,sans-serif;margin:0;letter-spacing:.04em}
header{position:sticky;top:env(safe-area-inset-top,0px);z-index:5;display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:10px 18px;background:var(--bg);border-bottom:1px solid var(--bd)}
.logo{font-size:28px;font-weight:700;color:var(--pr);margin-right:auto;text-shadow:0 0 14px var(--pr)}
nav a{color:var(--mut);text-decoration:none;margin:0 8px;font-weight:600}
nav a:hover{color:var(--ne)}
select,button{font:inherit;color:var(--tx);background:var(--sf);border:1px solid var(--bd);border-radius:8px;padding:7px 12px;cursor:pointer}
button.p{background:var(--pr);border-color:var(--pr);color:#fff;font-weight:600}
button:focus-visible,select:focus-visible,a:focus-visible{outline:2px solid var(--ne);outline-offset:2px}
.hero{padding:90px 20px 70px;text-align:center;background:radial-gradient(ellipse at 50% 0,rgba(139,92,246,.35),transparent 65%)}
.hero h1{font-size:clamp(40px,9vw,92px);line-height:1;text-shadow:0 0 30px var(--pr)}
.hero p{color:var(--mut);font-size:20px;letter-spacing:.2em}
.hero .row{display:flex;gap:12px;justify-content:center;margin-top:28px;flex-wrap:wrap}
.hero button{padding:12px 26px;font-size:17px}
section{max-width:1100px;margin:0 auto;padding:44px 18px}
h2{font-size:34px;margin-bottom:18px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px}
.card{background:var(--sf);border:1px solid var(--bd);border-radius:12px;padding:14px}
.pc{border-left:5px solid var(--gy)}
.pc.AVAILABLE{border-left-color:var(--gr)}.pc.OCCUPIED{border-left-color:var(--rd)}.pc.RESERVED{border-left-color:var(--yl)}
.pc b{font-family:Rajdhani;font-size:22px}
.st{font-size:13px;font-weight:700}
.AVAILABLE .st{color:var(--gr)}.OCCUPIED .st{color:var(--rd)}.RESERVED .st{color:var(--yl)}.OFFLINE .st{color:var(--gy)}
.t{font:700 22px Rajdhani;color:var(--ne)}
small{color:var(--mut)}
.tabs{display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap}
.tabs button.on{background:var(--pr);color:#fff}
.price{font:700 30px Rajdhani;color:var(--ne)}
dialog{background:var(--sf);color:var(--tx);border:1px solid var(--pr);border-radius:14px;max-width:420px;width:92%}
dialog::backdrop{background:rgba(0,0,0,.65)}
label{display:block;margin:10px 0 4px;color:var(--mut);font-size:14px}
input{width:100%;font:inherit;color:var(--tx);background:var(--bg);border:1px solid var(--bd);border-radius:8px;padding:8px}
#msg{margin-top:10px;font-weight:600}
footer{padding:30px 18px;text-align:center;color:var(--mut);border-top:1px solid var(--bd)}
.note{background:var(--sf);border:1px dashed var(--yl);padding:10px;border-radius:8px;color:var(--mut);font-size:14px}
header{background:color-mix(in srgb,var(--bg) 78%,transparent);backdrop-filter:blur(12px);padding-bottom:8px}
nav{order:3;width:100%;display:flex;gap:8px;overflow-x:auto;margin:0}
nav button{border-radius:999px;padding:8px 20px;font-weight:600;white-space:nowrap}
nav button.on{background:var(--pr);border-color:var(--pr);color:#fff;box-shadow:0 0 16px var(--pr)}
.view{display:none}.view.cur{display:block}
.hero{background:none;padding:110px 20px 90px}
.bg{position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden}
.o{position:absolute;border-radius:50%;filter:blur(90px);opacity:.45;animation:dr 14s ease-in-out infinite alternate}
.o1{width:420px;height:420px;background:var(--pr);top:-100px;left:-80px}
.o2{width:360px;height:360px;background:var(--ne);right:-80px;top:30%;animation-delay:-5s}
.o3{width:300px;height:300px;background:var(--rd);left:30%;bottom:-120px;opacity:.3;animation-delay:-9s}
@keyframes dr{to{transform:translate(60px,40px) scale(1.15)}}
.bg svg{position:absolute;inset:0;width:100%;height:100%;opacity:.28;color:var(--ne)}
.bg .gr{position:absolute;inset:0;background-image:linear-gradient(var(--bd) 1px,transparent 1px),linear-gradient(90deg,var(--bd) 1px,transparent 1px);background-size:48px 48px;opacity:.35;-webkit-mask-image:linear-gradient(transparent,#000 40%,transparent);mask-image:linear-gradient(transparent,#000 40%,transparent)}
:root[data-theme="light"] .o{opacity:.18}
@media (prefers-color-scheme:light){:root:not([data-theme="dark"]) .o{opacity:.18}}
@media (prefers-reduced-motion:reduce){.o{animation:none}}
.logo{font-family:Orbitron,Rajdhani,sans-serif;font-weight:900;font-size:24px;letter-spacing:.14em}
header{border-image:linear-gradient(90deg,transparent,var(--pr),var(--ne),transparent) 1}
.hero h1{font-family:Orbitron,Rajdhani,sans-serif;font-weight:900;font-size:clamp(30px,6.4vw,72px);line-height:1.1;text-wrap:balance;text-shadow:none;background:linear-gradient(90deg,var(--tx),var(--ne) 50%,var(--pr));-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 22px rgba(139,92,246,.55))}
.hero p{margin-top:16px;letter-spacing:.32em;font-weight:600}
button{transition:transform .15s,box-shadow .2s,border-color .2s}
button:hover{transform:translateY(-2px);border-color:var(--ne)}
button.p{background:linear-gradient(135deg,var(--pr),#6d28d9);box-shadow:0 0 18px rgba(139,92,246,.5)}
button.p:hover{box-shadow:0 0 28px rgba(139,92,246,.85)}
.chips{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin:38px auto 0;max-width:760px}
.chips span{padding:6px 14px;border:1px solid var(--bd);border-radius:999px;color:var(--mut);background:color-mix(in srgb,var(--sf) 70%,transparent);font-weight:600;font-size:14px;transition:.2s}
.chips span:hover{color:var(--ne);border-color:var(--ne);box-shadow:0 0 14px rgba(34,211,238,.35)}
button.bn{margin-top:28px;padding:11px 24px;border-radius:999px;border:1px solid var(--yl);color:var(--yl);background:rgba(234,179,8,.08);font-weight:700;animation:pu 2.4s ease-in-out infinite}
@keyframes pu{50%{box-shadow:0 0 24px rgba(234,179,8,.45)}}
h2{font-size:40px;font-family:Orbitron,Rajdhani,sans-serif;font-weight:700;letter-spacing:.06em}
h2::after{content:"";display:block;width:70px;height:3px;margin-top:10px;border-radius:2px;background:linear-gradient(90deg,var(--pr),var(--ne));box-shadow:0 0 12px var(--pr)}
.card{transition:transform .2s,box-shadow .25s,border-color .25s}
.card:hover{transform:translateY(-4px);box-shadow:0 10px 34px -8px rgba(139,92,246,.55)}
.card:not(.pc){border-color:transparent;background:linear-gradient(var(--sf),var(--sf)) padding-box,linear-gradient(135deg,var(--pr),transparent 45%,var(--ne)) border-box}
.pc.AVAILABLE{background:linear-gradient(90deg,rgba(34,197,94,.14),var(--sf) 55%)}
.pc.OCCUPIED{background:linear-gradient(90deg,rgba(244,63,94,.16),var(--sf) 55%)}
.pc.RESERVED{background:linear-gradient(90deg,rgba(234,179,8,.14),var(--sf) 55%)}
.pc.OFFLINE{background:linear-gradient(90deg,rgba(107,114,128,.14),var(--sf) 55%)}
.pc b{font-size:24px;letter-spacing:.08em}
.st::before{content:"";display:inline-block;width:8px;height:8px;border-radius:50%;background:currentColor;margin-right:6px;box-shadow:0 0 8px currentColor}
.tabs button{border-radius:999px;padding:7px 18px}
.tabs button.on{background:var(--pr);border-color:var(--pr);box-shadow:0 0 14px var(--pr)}
.zc{--a:var(--ne)}.zc.VIP{--a:var(--pr)}.zc.BOOTCAMP{--a:var(--rd)}
.zc h3{color:var(--a);font-family:Orbitron,Rajdhani,sans-serif;font-size:22px;text-shadow:0 0 12px var(--a)}
.zc .price{font-size:34px;color:var(--tx)}
.zc::before{content:"";display:block;height:3px;margin:-14px -14px 12px;border-radius:12px 12px 0 0;background:var(--a);box-shadow:0 0 14px var(--a)}
dialog{border-color:transparent;background:linear-gradient(var(--sf),var(--sf)) padding-box,linear-gradient(135deg,var(--pr),var(--ne)) border-box;border:1px solid transparent;box-shadow:0 0 50px rgba(139,92,246,.4)}
dialog::backdrop{backdrop-filter:blur(5px)}
input:focus{border-color:var(--ne);outline:none;box-shadow:0 0 0 3px rgba(34,211,238,.25)}
.ph{display:flex;align-items:center;background:var(--bg);border:1px solid var(--bd);border-radius:8px}
.ph span{padding:8px 0 8px 12px;color:var(--ne);font-weight:700}
.ph input{border:0;background:transparent;padding-left:6px}
.ph:focus-within{border-color:var(--ne);box-shadow:0 0 0 3px rgba(34,211,238,.25)}
.ph input:focus{box-shadow:none}
@media (prefers-reduced-motion:reduce){button.bn{animation:none}}
.bg .gr{display:none}
.bg svg{filter:drop-shadow(0 0 8px var(--ne));opacity:.3}
.beams i{position:absolute;top:-10%;width:3px;height:125%;background:linear-gradient(transparent,var(--c),transparent);box-shadow:0 0 36px 6px var(--c);opacity:.42;transform:rotate(16deg);animation:bm 10s ease-in-out infinite alternate}
@keyframes bm{to{opacity:.12;transform:rotate(16deg) translateX(46px)}}
.dots{position:absolute;inset:0;background-image:radial-gradient(1.6px 1.6px at 20px 30px,var(--ne),transparent),radial-gradient(1.6px 1.6px at 130px 95px,var(--pr),transparent),radial-gradient(1px 1px at 205px 155px,#fff,transparent);background-size:240px 200px;opacity:.55;animation:dt 45s linear infinite}
@keyframes dt{to{background-position:0 -200px}}
.floor{position:absolute;left:-30%;right:-30%;bottom:0;height:46%;background-image:linear-gradient(var(--pr) 1px,transparent 1px),linear-gradient(90deg,var(--pr) 1px,transparent 1px);background-size:64px 64px;transform:perspective(460px) rotateX(62deg);transform-origin:50% 100%;opacity:.4;animation:fl 3.2s linear infinite;-webkit-mask-image:linear-gradient(transparent,#000 70%);mask-image:linear-gradient(transparent,#000 70%)}
@keyframes fl{to{background-position:0 64px}}
.scan{position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.14) 0 1px,transparent 1px 3px);opacity:.5}
:root[data-theme="light"] .scan{display:none}:root[data-theme="light"] .floor{opacity:.2}:root[data-theme="light"] .beams{opacity:.4}:root[data-theme="light"] .dots{opacity:.3}
@media (prefers-color-scheme:light){:root:not([data-theme="dark"]) .scan{display:none}:root:not([data-theme="dark"]) .floor{opacity:.2}:root:not([data-theme="dark"]) .beams{opacity:.4}:root:not([data-theme="dark"]) .dots{opacity:.3}}
@media (prefers-reduced-motion:reduce){.beams i,.dots,.floor{animation:none}}
#prices h2{text-align:center}
#prices h2::after{margin-left:auto;margin-right:auto}
#zones{display:flex;flex-wrap:wrap;justify-content:center;gap:20px}
#zones .card{width:min(100%,300px);text-align:center;padding:26px 18px}
#zones .zc::before{margin:-26px -18px 18px}
#zones .zc .price{font-size:38px}
html{-webkit-text-size-adjust:100%}
body{overflow-x:clip}
:root{padding-left:env(safe-area-inset-left,0px);padding-right:env(safe-area-inset-right,0px)}
.logo{flex:0 0 auto}
#acc{min-width:0;max-width:44vw;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
button,select{min-height:40px}
dialog{max-height:90vh;max-height:90dvh;overflow:auto}
@media (hover:none){button:hover,.card:hover{transform:none}}
@media (min-width:641px) and (max-width:1024px){section{padding:38px 26px}.hero{padding:90px 26px 70px}#zones .card{width:min(100%,calc(33.333% - 14px));min-width:210px}}
@media (max-width:640px){
header{padding:8px 12px;gap:6px}
.logo{font-size:19px;letter-spacing:.1em}
#acc{font-size:13px;padding:6px 10px}
select{padding:6px 6px}
nav button{padding:7px 16px}
.hero{padding:56px 16px 48px}
.hero p{font-size:14px;letter-spacing:.18em}
.hero button{padding:11px 22px;font-size:16px}
.hero .row{flex-direction:column;align-items:stretch;max-width:320px;margin-left:auto;margin-right:auto}
.chips{margin-top:26px}
.chips span{font-size:13px;padding:5px 11px}
button.bn{border-radius:16px;white-space:normal;max-width:100%;padding:10px 16px}
section{padding:30px 14px}
h2{font-size:26px}
.grid{grid-template-columns:1fr}
.tabs{flex-wrap:nowrap;overflow-x:auto}
.tabs button{white-space:nowrap}
#zones .card{width:100%}
.o{filter:blur(60px)}.o1{width:280px;height:280px}.o2{width:240px;height:240px}.o3{width:220px;height:220px}
.scan{display:none}
.beams i:nth-child(n+3){display:none}
.floor{height:36%}
dialog{width:94%;padding:16px}
}
@media (max-width:360px){.hero h1{font-size:26px}h2{font-size:22px}}
@media (max-height:500px) and (orientation:landscape){.hero{padding:30px 16px}header{position:static}}
.glow{position:fixed;left:0;top:0;pointer-events:none;z-index:9999;border-radius:50%;opacity:0;transition:opacity .35s;will-change:transform;mix-blend-mode:screen}
.glow.on{opacity:1}
.g1{width:360px;height:360px;margin:-180px 0 0 -180px;background:radial-gradient(circle,rgba(34,211,238,.34),rgba(59,130,246,.14) 42%,transparent 70%)}
.g2{width:54px;height:54px;margin:-27px 0 0 -27px;background:radial-gradient(circle,rgba(125,235,255,.95),rgba(34,211,238,.35) 45%,transparent 72%);filter:blur(2px)}
:root[data-theme="light"] .glow{mix-blend-mode:normal}:root[data-theme="light"] .g1{opacity:.55}
@media (prefers-color-scheme:light){:root:not([data-theme="dark"]) .glow{mix-blend-mode:normal}}
@media (hover:none),(pointer:coarse){.glow{display:none}}
.hl{max-width:1100px;margin:0 auto;text-align:left}
.hl .row,.hl .chips{justify-content:flex-start;margin-left:0}
.hgrid{display:grid;grid-template-columns:1.15fr .85fr;gap:36px;align-items:center;margin-top:10px}
.livebar{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:8px}
.pill{display:inline-flex;gap:8px;align-items:center;padding:9px 16px;border:1px solid var(--bd);border-radius:12px;background:color-mix(in srgb,var(--sf) 80%,transparent);font-weight:600;font-size:14px}
.pill b{color:var(--ne)}
.dot{width:9px;height:9px;border-radius:50%;background:var(--gr);box-shadow:0 0 10px var(--gr)}
.seg{display:inline-flex;padding:4px;border:1px solid var(--bd);border-radius:12px;background:var(--sf)}
.seg button{border:0;background:transparent;border-radius:8px;padding:6px 14px;min-height:34px}
.seg button.on{background:var(--pr);color:#fff;box-shadow:0 0 12px var(--pr)}
.hv{position:relative;transform:rotate(3deg);border-radius:22px;border:1px solid var(--bd);overflow:hidden;aspect-ratio:4/3.3;background:radial-gradient(circle at 70% 25%,rgba(139,92,246,.5),transparent 60%),var(--sf);box-shadow:0 20px 60px -10px rgba(139,92,246,.55)}
.hv svg,.hv img{width:100%;height:100%;object-fit:cover;display:block}
.hb{position:absolute;left:14px;right:14px;bottom:14px;display:flex;gap:12px;align-items:center;padding:12px 14px;border:1px solid var(--bd);border-radius:14px;background:color-mix(in srgb,var(--bg) 85%,transparent);backdrop-filter:blur(8px)}
.hb small{color:var(--rd);font-weight:700;letter-spacing:.06em}
.feats{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;max-width:1100px;margin:0 auto;padding:0 18px}
.fc{display:flex;gap:14px;align-items:center;cursor:pointer}
.fi{width:44px;height:44px;flex:0 0 44px;border-radius:12px;display:grid;place-items:center;background:rgba(139,92,246,.2);font-size:22px}
.map{position:relative;border-radius:16px;overflow:hidden;border:1px solid var(--bd);background:#0c0a14}
.map svg{display:block;width:100%;height:auto}.map iframe{display:block;width:100%;height:360px;border:0}
.ping{transform-box:fill-box;transform-origin:center;animation:pg 2s ease-out infinite}
@keyframes pg{from{transform:scale(.4);opacity:.9}to{transform:scale(2.6);opacity:0}}
.xp{height:10px;border-radius:6px;background:var(--bd);overflow:hidden}
.xp i{display:block;height:100%;background:linear-gradient(90deg,var(--pr),var(--ne))}
.row2{display:flex;justify-content:space-between;gap:10px;padding:10px 0;border-bottom:1px solid var(--bd);flex-wrap:wrap}
#acc.av{width:42px;max-width:none;padding:0;border-radius:50%;position:relative;font-weight:700}
#acc.av::after{content:"";position:absolute;right:0;bottom:0;width:10px;height:10px;border-radius:50%;background:var(--gr);border:2px solid var(--bg)}
button:disabled{opacity:.55;cursor:not-allowed;transform:none}
@media (prefers-reduced-motion:reduce){.ping{animation:none}}
@media (max-width:860px){.hgrid{grid-template-columns:1fr}.hl{text-align:center}.hl .row,.hl .chips{justify-content:center;margin-left:auto;margin-right:auto}.hv{transform:none;max-width:440px;margin:0 auto;width:100%}.livebar{justify-content:center}}
`;

const L = {
  ru: { nHome: "Главная", nArena: "PC Arena", nPrices: "Цены", nContact: "Контакты", h1: "WELCOME TO EMPIRE", sub: "ENTER THE WORLD OF GAMING", book: "BOOK YOUR PC", view: "VIEW PRICES", demo: "Демо-режим: данные и брони хранятся только в этом браузере. Реальная синхронизация придёт с Supabase.", AVAILABLE: "СВОБОДЕН", OCCUPIED: "ЗАНЯТ", RESERVED: "ЗАБРОНИРОВАН", OFFLINE: "ОФЛАЙН", left: "осталось", reserve: "Забронировать", extend: "+1 час", start: "Начало", dur: "Длительность", confirm: "Подтвердить бронь", close: "Закрыть", all: "Все", hr: "в час", addr: "Адрес и телефон: заполняется администратором", hours: "Часы работы: заполняются администратором", busy: "Конфликт: это время уже занято.", done: "Бронь создана №", past: "Выберите время не раньше текущего.", extbad: "Продление конфликтует с другой бронью.", acc: "Войти / Регистрация", accReg: "Создать аккаунт", name: "Имя и фамилия", phone: "Телефон", pass: "Пароль (мин. 6 символов)", create: "Создать аккаунт", bonus: "Новым игрокам: 1 час бесплатно!", mins: "мин", logout: "Выйти", bad: "Проверьте имя, телефон и пароль.", free: "БЕСПЛАТНО", freeUsed: "бонус", promo: "Промокод", apply: "Применить", promoOk: "Промокод принят:", promoBad: "Такого промокода нет.", promoUsed: "Вы уже использовали этот промокод." },
  uz: { nHome: "Bosh sahifa", nArena: "PC Arena", nPrices: "Narxlar", nContact: "Aloqa", h1: "WELCOME TO EMPIRE", sub: "ENTER THE WORLD OF GAMING", book: "BOOK YOUR PC", view: "VIEW PRICES", demo: "Demo rejim: ma’lumotlar faqat shu brauzerda saqlanadi. Haqiqiy sinxronlash Supabase bilan keladi.", AVAILABLE: "BO‘SH", OCCUPIED: "BAND", RESERVED: "BRON QILINGAN", OFFLINE: "OFFLAYN", left: "qoldi", reserve: "Bron qilish", extend: "+1 soat", start: "Boshlanish", dur: "Davomiyligi", confirm: "Bronni tasdiqlash", close: "Yopish", all: "Hammasi", hr: "soatiga", addr: "Manzil va telefon: administrator kiritadi", hours: "Ish vaqti: administrator kiritadi", busy: "Ziddiyat: bu vaqt band.", done: "Bron yaratildi №", past: "Hozirdan keyingi vaqtni tanlang.", extbad: "Uzaytirish boshqa bron bilan to‘qnashadi.", acc: "Kirish / Ro‘yxatdan o‘tish", accReg: "Akkaunt ochish", name: "Ism va familiya", phone: "Telefon", pass: "Parol (kamida 6 belgi)", create: "Akkaunt ochish", bonus: "Yangi o‘yinchilarga: 1 soat tekin!", mins: "daq", logout: "Chiqish", bad: "Ism, telefon va parolni tekshiring.", free: "TEKIN", freeUsed: "bonus", promo: "Promo kod", apply: "Qo‘llash", promoOk: "Promo kod qabul qilindi:", promoBad: "Bunday promo kod yo‘q.", promoUsed: "Bu promo koddan allaqachon foydalangansiz." },
  en: { nHome: "Home", nArena: "PC Arena", nPrices: "Prices", nContact: "Contact", h1: "WELCOME TO EMPIRE", sub: "ENTER THE WORLD OF GAMING", book: "BOOK YOUR PC", view: "VIEW PRICES", demo: "Demo mode: data and bookings live only in this browser. Real sync arrives with Supabase.", AVAILABLE: "AVAILABLE", OCCUPIED: "OCCUPIED", RESERVED: "RESERVED", OFFLINE: "OFFLINE", left: "remaining", reserve: "Reserve", extend: "+1 hour", start: "Start", dur: "Duration", confirm: "Confirm booking", close: "Close", all: "All", hr: "per hour", addr: "Address and phone: set by the administrator", hours: "Opening hours: set by the administrator", busy: "Conflict: that time is already taken.", done: "Booking created #", past: "Pick a time from now onward.", extbad: "Extension conflicts with another booking.", acc: "Log in / Sign up", accReg: "Create account", name: "Full name", phone: "Phone", pass: "Password (min. 6 characters)", create: "Create account", bonus: "New players get 1 hour free!", mins: "min", logout: "Log out", bad: "Check name, phone and password.", free: "FREE", freeUsed: "bonus", promo: "Promo code", apply: "Apply", promoOk: "Promo code applied:", promoBad: "This promo code doesn’t exist.", promoUsed: "You already used this promo code." },
};
Object.assign(L.ru, { nTour: "Турниры", nTop: "Топ", nProf: "Профиль", liveA: "В EMPIRE свободно", now: "Сейчас", in2h: "Через 2 часа", liveNote: "Занятость обновляется в реальном времени", topDev: "ТОП ДЕВАЙСЫ", f1t: "Кибертурниры", f1d: "Смотри расписание и участвуй", f2t: "Уровни и прогресс", f2d: "Зарабатывай XP за каждую бронь", mapT: "ИНТЕРАКТИВНАЯ КАРТА", mapS: "Где найти EMPIRE", addrSet: "Адрес укажет администратор", route: "Построить маршрут", demo2: "Демо: турниры и рейтинг — примеры.", slots: "Мест", join: "Участвовать", joined: "Вы участвуете", level: "Уровень", bonusLeft: "Бонусное время", hist: "История броней", noHist: "Пока нет броней." });
Object.assign(L.uz, { nTour: "Turnirlar", nTop: "Top", nProf: "Profil", liveA: "EMPIRE da bo‘sh:", now: "Hozir", in2h: "2 soatdan keyin", liveNote: "Band-bo‘shlik real vaqtda yangilanadi", topDev: "TOP QURILMALAR", f1t: "Kiber turnirlar", f1d: "Jadvalni ko‘ring va qatnashing", f2t: "Darajalar va yutuqlar", f2d: "Har bir bron uchun XP to‘plang", mapT: "INTERAKTIV XARITA", mapS: "EMPIRE qayerda joylashgan", addrSet: "Manzilni administrator kiritadi", route: "Marshrut qurish", demo2: "Demo: turnirlar va reyting — namunalar.", slots: "O‘rinlar", join: "Qatnashish", joined: "Siz qatnashyapsiz", level: "Daraja", bonusLeft: "Bonus vaqt", hist: "Bronlar tarixi", noHist: "Hozircha bron yo‘q." });
Object.assign(L.en, { nTour: "Tournaments", nTop: "Top", nProf: "Profile", liveA: "Free at EMPIRE:", now: "Now", in2h: "In 2 hours", liveNote: "Availability updates in real time", topDev: "TOP DEVICES", f1t: "Cyber tournaments", f1d: "Check the schedule and join", f2t: "Levels and progress", f2d: "Earn XP for every booking", mapT: "INTERACTIVE MAP", mapS: "Where to find EMPIRE", addrSet: "Address set by the administrator", route: "Get directions", demo2: "Demo: tournaments and ranking are samples.", slots: "Slots", join: "Join", joined: "You’re in", level: "Level", bonusLeft: "Bonus time", hist: "Booking history", noHist: "No bookings yet." });
Object.assign(L.ru, { esT: "Киберспорт", esS: "Турниры зоны BOOTCAMP: записывайся и зарабатывай XP" });
Object.assign(L.uz, { esT: "Kibersport", esS: "BOOTCAMP zonasi turnirlari: yoziling va XP to‘plang" });
Object.assign(L.en, { esT: "Esports", esS: "BOOTCAMP tournaments: sign up and earn XP" });
const ES_ICON = { cs2: "🎯", dota: "🛡️", val: "⚔️" };
const ZONES = {
  STANDARD: { p: 15000, s: "i5 · RTX 3060 · 16GB · 165Hz" },
  VIP: { p: 25000, s: "i7 · RTX 4070 · 32GB · 240Hz" },
  BOOTCAMP: { p: 35000, s: "i9 · RTX 4080 · 32GB · 360Hz" },
};
const PROMO = { EMPIRE10: 10, GAMER20: 20, VIP15: 15 };
const VIEWS = ["home", "arena", "prices", "tour", "top", "prof", "contact"];
const NAV = { home: "nHome", arena: "nArena", prices: "nPrices", tour: "nTour", top: "nTop", prof: "nProf", contact: "nContact" };
// Club info: fill in the real address/phone. "map" = a Google Maps embed URL (optional).
const CLUB = { address: "", phone: "", map: "" };
const HERO_IMG = ""; // put a real photo URL here to replace the drawing
const LOC = { ru: "ru-RU", uz: "uz-UZ", en: "en-GB" };
const TOURS = [{ id: "cs2", g: "Counter-Strike 2", d: 2, sl: [11, 16] }, { id: "dota", g: "Dota 2", d: 5, sl: [7, 16] }, { id: "val", g: "Valorant", d: 9, sl: [5, 10] }];
const DEMO_TOP = [["Shadow", 1240], ["Nova", 980], ["Blaze", 760], ["Viper", 540], ["Ghost", 320]];
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
    onCreate({ name: n.trim(), phone: "+998" + p, free: 60, used: [], xp: 0, hist: [], tours: [] });
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

function ClubMap({ t }) {
  if (CLUB.map) return <div className="map"><iframe title="EMPIRE" src={CLUB.map} loading="lazy" /></div>;
  return (
    <div className="map">
      <svg viewBox="0 0 800 340" aria-hidden="true">
        <rect width="800" height="340" fill="#0c0a14" />
        <g stroke="#3a2b57" strokeWidth="1" opacity=".6">{[...Array(12)].map((_, i) => <path key={i} d={`M${i * 70} 0L${i * 70 - 90} 340`} />)}</g>
        <g stroke="#7a4518" strokeWidth="2.5" fill="none" opacity=".75">
          <path d="M0 250C150 220 260 260 400 170S650 120 800 150" /><path d="M120 0C160 120 220 200 300 340" />
          <path d="M560 0C540 100 600 220 520 340" /><path d="M0 90C200 110 420 60 800 80" />
        </g>
        <g transform="translate(400 160)">
          <circle className="ping" r="26" fill="#8b5cf6" /><circle r="14" fill="#8b5cf6" stroke="#22d3ee" strokeWidth="3" />
          <text y="5" textAnchor="middle" fontSize="14" fontWeight="700" fill="#fff">E</text>
        </g>
      </svg>
      <div className="pill" style={{ position: "absolute", left: 12, top: 12 }}>📍 EMPIRE · {CLUB.address || t("addrSet")}</div>
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
  const [when, setWhen] = useState("now");
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
    saveUser({ ...user, free: user.free - Math.min(user.free, dur), used: code ? [...(user.used || []), code] : user.used, xp: (user.xp || 0) + Math.max(5, Math.round(dur / 6)), hist: [{ n: booking.n, pc: id, s: booking.s, dur }, ...(user.hist || [])].slice(0, 20) });
  };
  const bookPc = pcs.find((p) => p.id === bookId);
  const tt = when === "now" ? now : now + 72e5;
  const freeN = pcs.filter((p) => !p.off && !p.bk.some((b) => b.s <= tt && tt < b.e)).length;
  const xp = user?.xp || 0, lvl = Math.floor(xp / 100) + 1;
  const board = [...DEMO_TOP.map(([n, x]) => ({ n, x })), ...(user ? [{ n: user.name, x: xp, me: 1 }] : [])].sort((a, b) => b.x - a.x);
  const joinTour = (id) => {
    if (!user) return setAuth(true);
    if ((user.tours || []).includes(id)) return;
    saveUser({ ...user, tours: [...(user.tours || []), id], xp: xp + 25 });
  };

  return (
    <>
      <style>{CSS}</style>
      <Bg />
      <header>
        <a className="logo" href="#home" style={{ textDecoration: "none" }} onClick={(e) => { e.preventDefault(); setView("home"); }}>EMPIRE</a>
        {user ? <button id="acc" className="p av" onClick={() => setView("prof")} aria-label={t("nProf")}>{user.name[0].toUpperCase()}</button> : <button id="acc" className="p" onClick={onAcc}>{t("acc")}</button>}
        <select id="lang" aria-label="Language" value={lang} onChange={(e) => setLang(e.target.value)}>
          <option value="ru">RU</option><option value="uz">UZ</option><option value="en">EN</option>
        </select>
        <button id="th" aria-label="Theme" onClick={toggleTheme}>◐</button>
        <nav id="nv">{VIEWS.map((v) => <button key={v} className={view === v ? "on" : ""} onClick={() => setView(v)}>{t(NAV[v])}</button>)}</nav>
      </header>

      {view === "home" && (
        <>
          <div className="hero view cur" id="home">
            <div className="hl">
              <div className="livebar">
                <span className="pill"><i className="dot" />{t("liveA")} <b>{freeN} PC</b> {t(when === "now" ? "now" : "in2h").toLowerCase()}</span>
                <span className="seg">
                  <button className={when === "now" ? "on" : ""} onClick={() => setWhen("now")}>{t("now")}</button>
                  <button className={when === "2h" ? "on" : ""} onClick={() => setWhen("2h")}>{t("in2h")}</button>
                </span>
              </div>
              <small>{t("liveNote")}</small>
              <div className="hgrid">
                <div>
                  <h1>{t("h1")}</h1>
                  <p>{t("sub")}</p>
                  <div className="row">
                    <button className="p" onClick={() => setView("arena")}>{t("book")}</button>
                    <button onClick={() => setView("prices")}>{t("view")}</button>
                  </div>
                  <div className="chips">{GAMES.map((g) => <span key={g}>{g}</span>)}</div>
                  <button className="bn" onClick={() => (user ? setView("arena") : setAuth(true))}>{t("bonus")}</button>
                </div>
                <div className="hv">
                  {HERO_IMG ? <img src={HERO_IMG} alt="EMPIRE" /> : (
                    <svg viewBox="0 0 400 320" fill="none" aria-hidden="true">
                      <defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8b5cf6" /><stop offset="1" stopColor="#22d3ee" /></linearGradient></defs>
                      <rect x="70" y="40" width="260" height="150" rx="12" stroke="url(#hg)" strokeWidth="4" />
                      <rect x="82" y="52" width="236" height="126" rx="6" fill="url(#hg)" opacity=".22" />
                      <path d="M200 190v34M150 226h100" stroke="url(#hg)" strokeWidth="4" />
                      <rect x="95" y="244" width="210" height="22" rx="6" stroke="url(#hg)" strokeWidth="3" />
                      <circle cx="200" cy="115" r="26" stroke="#22d3ee" strokeWidth="2" />
                      <path d="M200 82v16M200 132v16M167 115h16M217 115h16" stroke="#22d3ee" strokeWidth="2" />
                    </svg>
                  )}
                  <div className="hb"><span className="fi">⚡</span><div><small>{t("topDev")}</small><br /><b>{ZONES.BOOTCAMP.s}</b></div></div>
                </div>
              </div>
            </div>
          </div>
          <div className="feats">
            <div className="card fc" onClick={() => setView("tour")}><span className="fi">🏆</span><div><b>{t("f1t")}</b><br /><small>{t("f1d")}</small></div></div>
            <div className="card fc" onClick={() => setView("prof")}><span className="fi">⚡</span><div><b>{t("f2t")}</b><br /><small>{t("f2d")}</small></div></div>
          </div>
          <section>
            <h2>{t("mapT")}</h2>
            <small>{t("mapS")}</small><br /><br />
            <ClubMap t={t} />
            <div className="row2">
              <span>📍 {CLUB.address || t("addrSet")}{CLUB.phone ? " · " + CLUB.phone : ""}</span>
              <button className="p" disabled={!CLUB.address} onClick={() => window.open("https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(CLUB.address), "_blank")}>{t("route")}</button>
            </div>
          </section>
        </>
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
          {zone === "BOOTCAMP" && (
            <div style={{ marginTop: 32 }}>
              <h2 style={{ fontSize: 30 }}>{t("esT")}</h2>
              <small>{t("esS")}</small>
              <div className="note" style={{ margin: "12px 0" }}>{t("demo2")}</div>
              <div className="grid">
                {TOURS.map((x) => {
                  const j = (user?.tours || []).includes(x.id);
                  return (
                    <div key={x.id} className="card fc" style={{ cursor: "default" }}>
                      <span className="fi">{ES_ICON[x.id]}</span>
                      <div>
                        <b style={{ fontFamily: "Rajdhani", fontSize: 22 }}>{x.g}</b><br />
                        <small>{new Date(Date.now() + x.d * 864e5).toLocaleDateString(LOC[lang])} · {t("slots")} {x.sl[0]}/{x.sl[1]}</small><br />
                        <button className="p" style={{ marginTop: 8 }} disabled={j} onClick={() => joinTour(x.id)}>{j ? t("joined") : t("join")}</button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <br /><button onClick={() => setView("tour")}>{t("nTour")} →</button>
            </div>
          )}
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

      {view === "tour" && (
        <section className="view cur">
          <h2>{t("nTour")}</h2>
          <div className="note">{t("demo2")}</div><br />
          <div className="grid">
            {TOURS.map((x) => {
              const j = (user?.tours || []).includes(x.id);
              return (
                <div key={x.id} className="card">
                  <b style={{ fontFamily: "Rajdhani", fontSize: 22 }}>{x.g}</b><br />
                  <small>{new Date(Date.now() + x.d * 864e5).toLocaleDateString(LOC[lang])} · {t("slots")} {x.sl[0]}/{x.sl[1]}</small><br />
                  <button className="p" style={{ marginTop: 8 }} disabled={j} onClick={() => joinTour(x.id)}>{j ? t("joined") : t("join")}</button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {view === "top" && (
        <section className="view cur">
          <h2>{t("nTop")}</h2>
          <div className="note">{t("demo2")}</div><br />
          <div className="card">
            {board.map((r, i) => (
              <div key={r.n + i} className="row2" style={r.me ? { color: "var(--ne)", fontWeight: 700 } : null}>
                <span>{i + 1}. {r.n}</span><span>LVL {Math.floor(r.x / 100) + 1} · {r.x} XP</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {view === "prof" && (
        <section className="view cur">
          <h2>{t("nProf")}</h2>
          {!user ? <button className="p" onClick={() => setAuth(true)}>{t("acc")}</button> : (
            <div className="card">
              <h3>{user.name}</h3><small>{user.phone}</small>
              <p>{t("level")} <b className="price">{lvl}</b> · {xp % 100}/100 XP</p>
              <div className="xp"><i style={{ width: (xp % 100) + "%" }} /></div>
              <p>{t("bonusLeft")}: <b>{user.free} {t("mins")}</b></p>
              <h3>{t("hist")}</h3>
              {(user.hist || []).length ? user.hist.slice(0, 8).map((h) => (
                <div key={h.n} className="row2"><span>{h.pc} · {h.n}</span><span>{new Date(h.s).toLocaleString(LOC[lang], { dateStyle: "short", timeStyle: "short" })} · {h.dur} {t("mins")}</span></div>
              )) : <small>{t("noHist")}</small>}
              <br /><button onClick={() => saveUser(null)}>{t("logout")}</button>
            </div>
          )}
        </section>
      )}

      {view === "contact" && (
        <section className="view cur" id="contact">
          <h2>{t("nContact")}</h2>
          <div className="card">{CLUB.address || t("addr")}{CLUB.phone ? " · " + CLUB.phone : ""}<br />{t("hours")}</div>
        </section>
      )}

      <footer>© EMPIRE</footer>
      {bookPc && user && <BookDialog pc={bookPc} user={user} t={t} onSave={onSave} onClose={() => setBookId(null)} />}
      {auth && <AuthDialog t={t} onCreate={saveUser} onClose={() => setAuth(false)} />}
      <Glow />
    </>
  );
}
