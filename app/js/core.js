/* =========================================================
   NH 프로토타입 (앱) — 코어: 라우터 / 시트 / 토스트 / 키패드 / 로딩
   화면 이동은 data-go · data-back · data-home · data-act 가 붙은
   UI 요소를 통해서만 일어납니다(화면 아무 곳 클릭 이동 없음).
   ========================================================= */
(function () {
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const IMG = 'assets/img/', GIF = 'assets/gif/';

  const App = (window.App = {
    screens: {}, stack: [], cur: null,
    START: 'splash',
    /* 프로토타입 상태(서버 대신 메모리에 보관되는 테스트 데이터) */
    state: {
      user: '김농협', loggedIn: false, large: false, mydata: false, mydataPopupSeen: false,
      balance: 1250000, goals: [], favMenus: ['계좌이체', '이체내역조회', '환전'],
      tx: { name: '김농협', bank: 'NH농협', acct: '333-3333-3333-33', amount: '' }, join: {}, resv: {}, cmp: ['NH올원e예금', 'NH올원e적금', 'NH올원e 미니적금'], diag: {},
    },
  });

  /* ---------- 아이콘(SVG) ---------- */
  const I = (App.I = {
    back: '<svg width="10" height="16" viewBox="0 0 10 16" fill="none"><path d="M8 1.5 2 8l6 6.5" stroke="#111" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    x: (s = 16, c = '#111', w = 1.6) => `<svg width="${s}" height="${s}" viewBox="0 0 16 16" fill="none"><path d="M1.5 1.5l13 13M14.5 1.5l-13 13" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/></svg>`,
    home: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 8.2 10 2.6l7 5.6V16a1.4 1.4 0 0 1-1.4 1.4H4.4A1.4 1.4 0 0 1 3 16V8.2Z" stroke="#111" stroke-width="1.5" stroke-linejoin="round"/><path d="M6.5 14h7" stroke="#111" stroke-width="1.5" stroke-linecap="round"/></svg>',
    chev: (c = '#111', s = 14, w = 1.6) => `<svg width="${s * 0.6}" height="${s}" viewBox="0 0 8 14" fill="none"><path d="M1.5 1.5 6.5 7l-5 5.5" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    down: (c = '#111', s = 16, w = 1.6) => `<svg width="${s}" height="${s * 0.6}" viewBox="0 0 16 9" fill="none"><path d="M1.5 1.5 8 7.5l6.5-6" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    up: (c = '#111', s = 12) => `<svg width="${s}" height="${s * 0.6}" viewBox="0 0 16 9" fill="none"><path d="M1.5 7.5 8 1.5l6.5 6" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    check: (c = '#fff') => `<svg viewBox="0 0 12 10" fill="none"><path d="M1.5 5.2 4.6 8.2 10.5 1.8" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    refresh: (c = '#777', s = 12) => `<svg width="${s}" height="${s}" viewBox="0 0 14 14" fill="none"><path d="M12 7a5 5 0 1 1-5-5" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/><path d="M5.2 0.6 7.4 2 5.6 4" stroke="${c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    bell: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4.5 14.5V9a5.5 5.5 0 0 1 11 0v5.5l1.2 1H3.3l1.2-1Z" stroke="#111" stroke-width="1.5" stroke-linejoin="round"/><path d="M8.3 17.6a1.9 1.9 0 0 0 3.4 0" stroke="#111" stroke-width="1.5" stroke-linecap="round"/></svg>',
    grid: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#111" stroke-width="1.5"><rect x="1.5" y="1.5" width="6" height="6" rx="1.3"/><rect x="10.5" y="1.5" width="6" height="6" rx="1.3"/><rect x="1.5" y="10.5" width="6" height="6" rx="1.3"/><rect x="10.5" y="10.5" width="6" height="6" rx="1.3"/></svg>',
    search: (c = '#111', s = 18) => `<svg width="${s}" height="${s}" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="5.8" stroke="${c}" stroke-width="1.5"/><path d="m12.4 12.4 4 4" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    menu: '<svg width="20" height="16" viewBox="0 0 20 16" fill="none"><path d="M1.5 2h17M1.5 8h17M1.5 14h17" stroke="#111" stroke-width="1.7" stroke-linecap="round"/></svg>',
    cart: '<svg width="18" height="17" viewBox="0 0 18 17"><path d="M1 1.2h2.6l.6 2.4h12.4l-1.9 6.6H5.6L3.3 2.5" fill="#111"/><path d="M1 1.2h2.6l2 9h9.1" stroke="#111" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6.6" cy="14.4" r="1.5" fill="#111"/><circle cx="13.6" cy="14.4" r="1.5" fill="#111"/></svg>',
    gear: (c = '#111', s = 16) => `<svg width="${s}" height="${s}" viewBox="0 0 20 20" fill="none" stroke="${c}" stroke-width="1.5"><circle cx="10" cy="10" r="2.6"/><path d="M10 1.8l1.6 2.3 2.7-.6.6 2.7 2.3 1.6-1.3 2.2 1.3 2.2-2.3 1.6-.6 2.7-2.7-.6L10 18.2l-1.6-2.3-2.7.6-.6-2.7-2.3-1.6L4.1 10 2.8 7.8l2.3-1.6.6-2.7 2.7.6L10 1.8Z" stroke-linejoin="round"/></svg>`,
    horn: '<svg width="18" height="17" viewBox="0 0 18 17" fill="none" stroke="#333" stroke-width="1.4" stroke-linejoin="round"><path d="M2 6.2h3.2l7.3-3.7v11L5.2 9.8H2V6.2Z"/><path d="M5 10v4.5h2.4V11M15 5.4l1.6-1M15 10.6l1.6 1M15.3 8h1.9" stroke-linecap="round"/></svg>',
    plus: (c = '#fff', s = 12) => `<svg width="${s}" height="${s}" viewBox="0 0 12 12"><path d="M6 1v10M1 6h10" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    star: (on) => `<svg width="20" height="20" viewBox="0 0 20 20"><path d="M10 1.6l2.5 5.3 5.8.8-4.2 4 1 5.7L10 14.7l-5.1 2.7 1-5.7-4.2-4 5.8-.8L10 1.6Z" fill="${on ? '#f8c22c' : '#d6d6d6'}"/></svg>`,
    heart: (on) => `<svg width="22" height="20" viewBox="0 0 22 20"><path d="M11 18.2S2 12.9 2 6.7A4.7 4.7 0 0 1 11 4.8a4.7 4.7 0 0 1 9 1.9c0 6.2-9 11.5-9 11.5Z" fill="${on ? '#ff4b5c' : 'none'}" stroke="${on ? '#ff4b5c' : '#111'}" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
    share: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#111" stroke-width="1.5"><circle cx="15.2" cy="4" r="2.3"/><circle cx="4.8" cy="10" r="2.3"/><circle cx="15.2" cy="16" r="2.3"/><path d="m6.8 8.9 6.4-3.7M6.8 11.1l6.4 3.7"/></svg>',
    info: (c = '#0066b3', s = 26) => `<svg width="${s}" height="${s}" viewBox="0 0 26 26" fill="none"><circle cx="13" cy="13" r="11.5" stroke="${c}" stroke-width="1.6"/><path d="M13 11.5v7" stroke="${c}" stroke-width="2" stroke-linecap="round"/><circle cx="13" cy="7.8" r="1.3" fill="${c}"/></svg>`,
    q: (s = 14) => `<svg width="${s}" height="${s}" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#8a8a8a" stroke-width="1.1"/><path d="M6.2 6.4a1.9 1.9 0 1 1 2.7 1.7c-.6.3-.9.7-.9 1.4" stroke="#8a8a8a" stroke-width="1.2" stroke-linecap="round"/><circle cx="8" cy="11.6" r=".8" fill="#8a8a8a"/></svg>`,
    clr: '<svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill="#666"/><path d="m5.3 5.3 5.4 5.4M10.7 5.3l-5.4 5.4" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/></svg>',
    copy: '<svg width="11" height="12" viewBox="0 0 11 12" fill="none" stroke="#333" stroke-width="1.1"><rect x="3" y="3" width="7" height="8" rx="1.2"/><path d="M1.2 8.5V2.2a1 1 0 0 1 1-1h5"/></svg>',
    dots3: '<svg width="4" height="16" viewBox="0 0 4 16" fill="#555"><circle cx="2" cy="2" r="1.7"/><circle cx="2" cy="8" r="1.7"/><circle cx="2" cy="14" r="1.7"/></svg>',
    globe: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#111" stroke-width="1.4"><circle cx="10" cy="10" r="8"/><path d="M2 10h16M10 2c2.6 2.4 2.6 13.6 0 16M10 2c-2.6 2.4-2.6 13.6 0 16"/></svg>',
    mic: '<svg width="14" height="18" viewBox="0 0 14 18" fill="none" stroke="#555" stroke-width="1.4" stroke-linecap="round"><rect x="4.4" y="1" width="5.2" height="9.5" rx="2.6"/><path d="M1.5 8.5a5.5 5.5 0 0 0 11 0M7 14v3"/></svg>',
    /* 하단 탭 */
    tHome: (on) => on ? '<svg viewBox="0 0 24 24"><path d="M3.5 10 12 3.2l8.5 6.8v8.6A2.4 2.4 0 0 1 18.1 21H5.9a2.4 2.4 0 0 1-2.4-2.4V10Z" fill="#0066b3"/><path d="M3.5 17.4h17v1.2A2.4 2.4 0 0 1 18.1 21H5.9a2.4 2.4 0 0 1-2.4-2.4v-1.2Z" fill="#0a3f7a"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none"><path d="M3.8 10 12 3.6l8.2 6.4v8.4a2.2 2.2 0 0 1-2.2 2.2H6a2.2 2.2 0 0 1-2.2-2.2V10Z" stroke="#222" stroke-width="1.5" stroke-linejoin="round"/><path d="M7.5 17.2h9" stroke="#222" stroke-width="1.5" stroke-linecap="round"/></svg>',
    tMy: (on) => `<svg viewBox="0 0 24 24" fill="none"><rect x="2.8" y="4.5" width="18.4" height="15" rx="3" stroke="${on ? '#0066b3' : '#222'}" stroke-width="1.5" ${on ? 'fill="#0066b3"' : ''}/><text x="12" y="15" text-anchor="middle" font-size="7.4" font-weight="800" font-family="Arial" fill="${on ? '#fff' : '#222'}">MY</text></svg>`,
    tMall: (on) => `<svg viewBox="0 0 24 24" fill="none"><path d="M5.2 8.5h13.6l1.2 11.6a1 1 0 0 1-1 1.1H5a1 1 0 0 1-1-1.1L5.2 8.5Z" stroke="${on ? '#0066b3' : '#222'}" stroke-width="1.5" stroke-linejoin="round" ${on && on !== 'line' ? 'fill="#0066b3"' : ''}/><path d="M8.6 8.3V6.6a3.4 3.4 0 0 1 6.8 0v1.7" stroke="${on ? '#0066b3' : '#222'}" stroke-width="1.5"/></svg>`,
    tTalk: (on) => `<svg viewBox="0 0 24 24" fill="none"><path d="M12 3.5a8.5 8.5 0 0 1 0 17H4.6l1.7-2.6A8.5 8.5 0 0 1 12 3.5Z" stroke="${on ? '#0066b3' : '#222'}" stroke-width="1.5" stroke-linejoin="round" ${on ? 'fill="#0066b3"' : ''}/><circle cx="9.3" cy="10.8" r="1" fill="${on ? '#fff' : '#222'}"/><circle cx="14.7" cy="10.8" r="1" fill="${on ? '#fff' : '#222'}"/><path d="M9 14.2c1.7 1.5 4.3 1.5 6 0" stroke="${on ? '#fff' : '#222'}" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  });
  App.img = (n, w, h, st) => `<img src="${IMG}${n}.png" ${w ? `width="${w}"` : ''} ${h ? `height="${h}"` : ''} alt="" draggable="false" ${st ? `style="${st}"` : ''}>`;
  App.won = (n) => Number(n || 0).toLocaleString('ko-KR');

  /* ---------- 공통 조각 ---------- */
  App.hd = (title, o = {}) => `<header class="hd ${o.cls || ''}">
      ${o.noBack ? '' : `<button class="b" ${o.backGo ? `data-go="${o.backGo}"` : 'data-back'} aria-label="뒤로">${I.back}</button>`}
      <div class="t" ${o.left ? 'style="left:25px;text-align:left"' : ''}>${title}</div>
      <div class="rt">${o.right || ''}</div>
      ${o.prog != null ? `<i class="prog" style="width:${o.prog}%"></i>` : ''}</header>`;
  App.rHome = `<button data-home aria-label="홈">${I.home}</button>`;
  App.rCancel = (go) => `<button ${go ? `data-go="${go}"` : 'data-home'}>취소</button>`;
  App.rBellGrid = `<button data-go="notice" data-u aria-label="알림">${I.bell}</button><button data-go="menu" aria-label="전체메뉴">${I.grid}</button>`;
  App.tabbar = (on, pick) => `<nav class="tab ${pick ? 'pick' : ''}">
      <a data-go="home" class="${on === 'home' ? 'on' : ''}">${I.tHome(on === 'home')}<span>홈</span></a>
      <a data-act="tabSheet" data-v="mydata" class="${on === 'mydata' ? 'on' : ''}">${I.tMy(on === 'mydata')}<span>마이데이터</span></a>
      <a data-act="tabSheet" data-v="mall" class="${on === 'mall' ? 'on' : ''}">${I.tMall(on === 'mall' ? (pick ? 'line' : true) : false)}<span>금융상품몰</span></a>
      <a data-go="chat" data-u class="${on === 'chat' ? 'on' : ''}">${I.tTalk(on === 'chat')}<span>상담톡</span></a></nav>`;
  /* 키패드: keys 배열, cols 열 수, 옵션 */
  App.keypad = (keys, o) => `<div class="kp" style="top:${o.top}px;left:${o.l||0}px;right:${o.r||0}px;grid-template-columns:${o.tpl || `repeat(${o.cols || 3},1fr)`};padding:0 ${o.px || 0}px;font-size:${o.fs || 21}px">
      ${keys.map((k) => k === '' ? '<button></button>' : k === 'nh' ? `<button style="height:${o.rh}px;pointer-events:none">${App.img('ic_nhkey', 26, 33)}</button>`
        : `<button data-k="${k}" style="height:${o.rh}px">${k === 'del' ? App.img('ic_bksp', o.del || 30, null) : k}</button>`).join('')}</div>`;
  App.dots = (n, filled, o) => `<div class="dots" style="top:${o.top}px;gap:${o.gap}px">${Array.from({ length: n }, (_, i) =>
      `<i class="${i < filled ? 'on' : ''}" style="width:${o.d}px;height:${o.d}px"></i>`).join('')}</div>`;

  /* ---------- 라우터 ---------- */
  const stage = () => $('#stage');
  function render(id, cls) {
    const def = App.screens[id];
    if (!def) { App.toast('연결된 화면이 없습니다: ' + id); return false; }
    closeAllSheets();
    const el = document.createElement('section');
    el.className = 'scr ' + (def.cls || '') + ' ' + (cls || '');
    el.dataset.id = id;
    el.innerHTML = def.html(App.state);
    const olds = Array.from(stage().children);
    stage().appendChild(el);
    if (cls) { olds.slice(0, -1).forEach((o) => o.remove()); setTimeout(() => olds.forEach((o) => o.remove()), 200); } else olds.forEach((o) => o.remove());
    App.cur = id; App.el = el;
    if (def.init) def.init(el, App.state);
    document.title = (def.title || id) + ' · NH 프로토타입(앱)';
    const lab = $('#curName'); if (lab) lab.textContent = (def.title || id);
    return true;
  }
  App.go = function (id, o = {}) {
    if (!App.screens[id]) { App.toast('연결된 화면이 없습니다'); return; }
    if (o.reset) App.stack = [];
    if (o.replace) App.stack.pop();
    App.stack.push(id);
    render(id, o.anim === false ? '' : (o.anim || 'in'));
  };
  App.back = function () {
    if (App.stack.length < 2) return;
    App.stack.pop();
    render(App.stack[App.stack.length - 1], 'inb');
  };
  App.rerender = function () { const sc = $('.bd', App.el); const y = sc ? sc.scrollTop : 0; render(App.cur, ''); const n = $('.bd', App.el); if (n) n.scrollTop = y; };
  App.homeId = () => (App.state.loggedIn ? 'home' : 'login');
  App.def = (id, o) => { App.screens[id] = o; };

  /* ---------- 시트/팝업 ---------- */
  function closeAllSheets() { $('#overlay').innerHTML = ''; }
  App.sheet = function (html, o = {}) {
    const w = document.createElement('div');
    w.style.cssText = 'position:absolute;inset:0;isolation:isolate';
    w.innerHTML = `<div class="dim ${o.dim === false || o.clear ? 'none' : ''}" ${o.noAnim ? 'style="animation:none"' : ''} ${o.dimClose === false ? '' : 'data-dimclose'}></div>${html}`;
    if (o.dim === false) w.style.pointerEvents = 'none', $$('*', w).forEach((n) => (n.style.pointerEvents = 'auto')), ($('.dim', w).style.pointerEvents = 'none');
    $('#overlay').appendChild(w);
    w.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]') || (o.dimClose && e.target.classList.contains('dim'))) { w.remove(); o.onClose && o.onClose(); }
    });
    w.close = () => w.remove();
    if (o.init) o.init(w);
    return w;
  };
  App.closeSheets = closeAllSheets;

  /* ---------- 토스트 ---------- */
  let tt;
  App.toast = function (msg, tag) {
    let t = $('#toast'); t.innerHTML = `<div>${tag ? `<small>${tag}</small>` : ''}${msg}</div>`;
    clearTimeout(tt); tt = setTimeout(() => (t.innerHTML = ''), 2300);
  };

  /* ---------- 로딩(GIF) ---------- */
  App.loading = function (gif, ms, then) {
    const L = $('#loading');
    L.innerHTML = `<img src="${GIF}${gif}.gif?t=${Date.now()}" alt="로딩 중">`;
    L.style.display = 'block';
    clearTimeout(App._lt);
    App._lt = setTimeout(() => { then && then(); setTimeout(() => { L.style.display = 'none'; L.innerHTML = ''; }, 60); }, ms || 1900);
  };

  /* ---------- 전역 클릭 위임 ---------- */
  document.addEventListener('click', (e) => {
    const dev = e.target.closest('#device'); if (!dev) return;
    const t = e.target.closest('[data-go],[data-back],[data-home],[data-act],[data-todo],[data-k]');
    if (!t) return;
    const inSheet = t.closest('#overlay');
    if (t.dataset.k != null) {
      const host = inSheet ? inSheet.lastElementChild : App.el;
      const fn = (inSheet && host._key) || (App.screens[App.cur].key);
      if (fn) fn(t.dataset.k, inSheet ? host : App.el, App.state);
      return;
    }
    if (t.dataset.act) {
      const def = App.screens[App.cur];
      const fn = (def.acts && def.acts[t.dataset.act]) || App.acts[t.dataset.act];
      if (fn) fn(t, App.el, App.state, e); else App.toast('동작이 정의되지 않았습니다');
      return;
    }
    if (t.hasAttribute('data-todo')) { App.toast(t.dataset.todo || '이 기능은 디자인에 연결된 화면이 없습니다.', '프로토타입 안내'); return; }
    if (t.hasAttribute('data-home')) { App.go(App.homeId(), { reset: true, anim: 'fade' }); return; }
    if (t.hasAttribute('data-back')) { App.back(); return; }
    if (t.dataset.go) { App.go(t.dataset.go, t.hasAttribute('data-reset') ? { reset: true, anim: 'fade' } : {}); }
  });
  App.acts = {};
  /* 하단 탭(마이데이터·금융상품몰) → 'NH농협은행 | 농·축협' 선택 오버레이 (Figma: Open overlay) */
  App.acts.tabSheet = (t) => {
    const v = t.dataset.v;
    App.sheet(`<div style="position:absolute;left:0;right:0;bottom:0;height:131px">
        <div class="row" style="height:53px;background:#0066b3;border-radius:10px 10px 0 0;font-size:14px;font-weight:600">
          <button data-act="tabPick" data-v="${v}" style="flex:1;height:53px;color:#fff;--hr:10px 0 0 0">NH농협은행</button><i style="width:1px;height:18px;background:rgba(255,255,255,.45)"></i>
          <button data-todo="농·축협 ${v === 'mall' ? '금융상품몰' : '마이데이터'} 화면은 디자인에 없습니다." style="flex:1;height:53px;color:#fff;--hr:0 10px 0 0">농·축협</button></div>
        ${App.tabbar(v, true).replace('class="tab pick"', 'class="tab pick" style="border-top:0"')}</div>`, { dimClose: true, clear: true, noAnim: true });
  };
  App.acts.tabPick = (t) => {
    App.closeSheets(); const v = t.dataset.v;
    if (v === 'mydata' && !App.state.mydata) return App.mdPopup();
    App.go(v);
  };

  /* ---------- 가로 드래그 스크롤(마우스) ---------- */
  document.addEventListener('mousedown', (e) => {
    const hs = e.target.closest('.hs'); if (!hs) return;
    let x = e.pageX, sl = hs.scrollLeft, moved = false;
    const mv = (ev) => { if (Math.abs(ev.pageX - x) > 4) moved = true; hs.scrollLeft = sl - (ev.pageX - x) / (App.scale || 1); };
    const up = () => { document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up);
      if (moved) { const stop = (ev) => { ev.stopPropagation(); ev.preventDefault(); }; hs.addEventListener('click', stop, { capture: true, once: true }); setTimeout(() => hs.removeEventListener('click', stop, { capture: true }), 50); } };
    document.addEventListener('mousemove', mv); document.addEventListener('mouseup', up);
  });

  /* ---------- 플로우 바로가기 (Figma 'Flows' 시작점과 동일) ---------- */
  App.flows = [
    ['로그인', 'splash'], ['메인 마이데이터 연동', 'home'], ['계좌이체', 'tx1'], ['자산관리', 'asset'], ['챗봇', 'chat'],
    ['소비관리', 'spend'], ['상품가입', 'join1', ['mall', 'product']], ['상담신청', 'resv1'], ['메뉴', 'menu'], ['마이데이터', 'mydata'],
    ['금융상품몰', 'mall'], ['밸런스 진단', 'balIntro'], ['자산진단', 'diagForm'], ['목표관리', 'goals'],
  ];
  App.flow = 0;
  App.startFlow = function (i) {
    const f = App.flows[i]; App.flow = i;
    clearTimeout(App._lt); const L = $('#loading'); L.style.display = 'none'; L.innerHTML = '';
    closeAllSheets();
    const S = App.state, login = i === 0;
    S.loggedIn = !login; S.mydata = !login; S.large = false; S.mydataPopupSeen = false;
    if (f[1] === 'chat' && App.resetChat) App.resetChat();
    if (f[1] === 'goals') S.goals = [];
    App.stack = login ? [] : ['home', ...(f[2] || [])];
    if (f[1] === 'home') App.stack = [];
    App.go(f[1], { anim: 'fade' });
    paintFlows();
  };
  function paintFlows() {
    $$('#flows [data-flow]').forEach((b) => b.classList.toggle('on', Number(b.dataset.flow) === App.flow));
  }
  function buildFlows() {
    const box = $('#flowList'); if (!box) return;
    box.innerHTML = App.flows.map((f, i) => `<button data-flow="${i}" type="button" title="${f[0]}"><i>✓</i><b class="no">${i + 1}</b><span>${f[0]}</span></button>`).join('');
    box.addEventListener('click', (e) => { const b = e.target.closest('[data-flow]'); if (!b) return; App.startFlow(Number(b.dataset.flow)); });
    paintFlows();
  }

  /* ---------- 스케일 & 시작 ---------- */
  function fit() {
    const wr = $('#wrap').getBoundingClientRect();
    const w = wr.width, h = window.innerHeight - 52;
    const s = Math.min(1, (h - 16) / 780, (w - 16) / 400);
    App.scale = s; $('#scaler').style.transform = `scale(${s})`;
  }
  window.addEventListener('resize', fit);
  App.fit = fit;
  window.addEventListener('DOMContentLoaded', () => {
    fit();
    $('#btnStart').addEventListener('click', () => App.startFlow(0));
    buildFlows();
    $('#btnLinks').addEventListener('click', (e) => { $('#device').classList.toggle('links'); e.currentTarget.classList.toggle('on'); $('#legend').style.display = $('#device').classList.contains('links') ? 'flex' : 'none'; });
    const q = new URLSearchParams(location.search).get('s');
    if (q && App.screens[q]) { App.state.loggedIn = true; App.go(q, { anim: false }); } else App.go(App.START, { anim: false });
  });
})();
