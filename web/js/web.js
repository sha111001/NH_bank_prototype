/* =========================================================
   NH 프로토타입 (웹 1920×1080) — 라우터 / 플로우 / 화면 맞춤
   화면 HTML은 js/pages/*.js (Figma 레이어에서 자동 변환)
   화면 이동은 data-go / data-act 가 붙은 UI 요소로만 일어납니다.
   ========================================================= */
(function () {
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const WEB = (window.WEB = { pages: {}, stack: [], cur: null, hooks: {}, state: {} });

  WEB.TITLES = {
    '1:998': '메인', '1:1795': '마이뱅킹', '1:31': '자산관리', '1:2254': '소비관리', '1:2676': '목표관리',
    '1:5260': '금융상품몰', '1:5710': '상품조회', '1:6132': '상품조회(전체)', '79:98': '상품비교', '1:6579': '상품비교(전체)',
    '1:7144': '상품상세', '1:3067': '가입절차 1/3', '1:4663': '가입절차 2/3', '1:5021': '가입절차 3/3',
    '1:3432': '지점상담예약 1', '1:3723': '지점상담예약 · 지점 선택', '74:1571': '지점상담예약 · 지점 선택됨',
    '74:2715': '지점상담예약 · 일정 선택', '74:2315': '지점상담예약 · 날짜 선택됨', '74:1909': '지점상담예약 · 시간 선택됨', '1:4436': '지점상담예약 완료',
  };
  WEB.FLOWS = [['농협은행메인화면', '1:998'], ['마이뱅킹', '1:1795'], ['금융상품몰', '1:5260'], ['상품상세', '1:7144'], ['상품조회', '1:5710'], ['가입절차', '1:3067'], ['지점상담예약', '1:3432']];
  WEB.START = '1:998';
  WEB.flow = 0;

  /* 변환된 화면 등록 (pages/*.js 가 호출) */
  WEB.page = (p) => { WEB.pages[p.id] = p; (WEB._wait[p.id] || []).forEach((f) => f()); delete WEB._wait[p.id]; };
  WEB._wait = {};
  function load(id, cb) {
    if (WEB.pages[id]) return cb();
    (WEB._wait[id] = WEB._wait[id] || []).push(cb);
    if (WEB._wait[id].length > 1) return;
    const s = document.createElement('script');
    s.src = 'js/pages/p' + id.replace(':', '_') + '.js';
    s.onerror = () => toast('화면을 불러오지 못했습니다: ' + id);
    document.head.appendChild(s);
  }
  WEB.preload = (ids) => ids.forEach((id) => load(id, () => {}));

  function render(id, o = {}) {
    const p = WEB.pages[id];
    const el = document.createElement('section');
    el.className = 'pg' + (o.anim === false ? '' : ' in');
    el.dataset.id = id;
    if (p.bg) el.style.cssText = p.bg;
    const bodyH = 1080 - p.bodyTop;
    el.innerHTML = `${p.body || p.bodyH ? `<div class="body" style="top:${p.bodyTop}px;height:${bodyH}px"><div class="in" style="height:${p.bodyH}px;${p.bodyBg}">${p.body}</div></div>` : ''}
      <div class="head" style="height:${p.headH}px">${p.head}</div>${p.fixed ? `<div class="fixed">${p.fixed}</div>` : ''}`;
    const stage = $('#stage');
    stage.innerHTML = ''; stage.appendChild(el);
    WEB.cur = id; WEB.el = el;
    if (o.scroll) { const b = $('.body', el); if (b) b.scrollTop = o.scroll; }
    document.title = (WEB.TITLES[id] || id) + ' · NH 프로토타입(웹)';
    $('#curName').textContent = WEB.TITLES[id] || id;
    (WEB.hooks['*'] || []).forEach((f) => f(el, id));
    (WEB.hooks[id] || []).forEach((f) => f(el, id));
  }
  WEB.go = function (id, o = {}) {
    if (!WEB.TITLES[id]) return toast('연결된 화면이 없습니다');
    load(id, () => {
      if (o.reset) WEB.stack = [];
      if (!o.replace) { if (WEB.cur && WEB.cur !== id) WEB.stack.push(WEB.cur); }
      render(id, o);
    });
  };
  WEB.back = function () {
    const prev = WEB.stack.pop();
    if (prev) load(prev, () => render(prev, {}));
  };
  WEB.rerender = function () { const b = $('.body', WEB.el); const y = b ? b.scrollTop : 0; render(WEB.cur, { anim: false, scroll: y }); };
  /* 같은 화면 안에서 Figma 다른 상태 프레임으로 교체(스크롤 위치 유지) */
  WEB.swap = function (id) { const b = $('.body', WEB.el); const y = b ? b.scrollTop : 0; load(id, () => render(id, { anim: false, scroll: y })); };
  WEB.on = (id, f) => { (WEB.hooks[id] = WEB.hooks[id] || []).push(f); };

  /* ---------- 토스트 ---------- */
  let tt;
  function toast(msg, tag) {
    const t = $('#toast'); t.innerHTML = `<div>${tag ? `<small>${tag}</small>` : ''}${msg}</div>`;
    clearTimeout(tt); tt = setTimeout(() => (t.innerHTML = ''), 2600);
  }
  WEB.toast = toast;

  /* ---------- 클릭 위임 ---------- */
  WEB.acts = {};
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#stage')) return;
    const t = e.target.closest('[data-go],[data-act],[data-todo]');
    if (!t) { if (!e.target.closest('#gnb2')) closeGnb(); return; }
    if (t.dataset.todo != null) { toast(t.dataset.todo || '이 기능은 디자인에 연결된 화면이 없습니다.', '프로토타입 안내'); return; }
    if (t.dataset.act) { const f = WEB.acts[t.dataset.act]; if (f) f(t, e); return; }
    if (t.dataset.go) { closeGnb(); WEB.go(t.dataset.go); }
  });

  /* ---------- 금융상품몰 GNB 2depth (Figma: Open overlay 1:7638) ---------- */
  function closeGnb() { const g = $('#gnb2'); if (g) g.remove(); }
  WEB.closeGnb = closeGnb;
  WEB.acts.gnb = (t) => {
    if ($('#gnb2')) return closeGnb();
    load('1:7638', () => {
      const p = WEB.pages['1:7638'];
      const g = document.createElement('div'); g.id = 'gnb2';
      g.style.cssText = 'top:0;height:407px;pointer-events:none';
      g.innerHTML = `<div style="position:absolute;inset:0;clip-path:inset(139px 0 0 0);pointer-events:auto">${p.head}</div>`;
      // 보완 연결: 2단 메뉴 '전체상품'·'예금' → 상품조회(예금 목록) — Figma에는 연결 없음
      $$('.t1, .t', g).forEach((t) => { const s = t.textContent.trim(); if (s === '전체상품' || s === '예금') { const box = t.closest('[data-go]') || t.closest('[data-ui]') || t; if (box.dataset.go) return; box.removeAttribute('data-ui'); box.removeAttribute('data-todo'); box.dataset.go = '1:5710'; box.dataset.u = '1'; } });
      WEB.el.appendChild(g);
    });
  };

  /* ---------- 가로 캐러셀: 마우스 드래그·세로 휠로도 옆으로 스크롤 ---------- */
  const isH = (el) => el && el.classList && el.classList.contains('b') && getComputedStyle(el).overflowX === 'auto';
  const hOf = (t) => { let a = t; while (a && a.id !== 'stage') { if (isH(a) && a.scrollWidth > a.clientWidth + 4) return a; a = a.parentElement; } return null; };
  document.addEventListener('mousedown', (e) => {
    const hs = hOf(e.target); if (!hs || e.target.closest('input')) return;
    let x = e.pageX, sl = hs.scrollLeft, moved = false;
    const mv = (ev) => { if (Math.abs(ev.pageX - x) > 4) moved = true; hs.scrollLeft = sl - (ev.pageX - x) / (WEB.scale || 1); };
    const up = () => { document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up);
      if (moved) { const stop = (ev) => { ev.stopPropagation(); ev.preventDefault(); }; document.addEventListener('click', stop, { capture: true, once: true }); setTimeout(() => document.removeEventListener('click', stop, { capture: true }), 60); } };
    document.addEventListener('mousemove', mv); document.addEventListener('mouseup', up);
  });
  document.addEventListener('wheel', (e) => {
    const hs = hOf(e.target); if (!hs || !e.shiftKey) return;
    hs.scrollLeft += e.deltaY; e.preventDefault();
  }, { passive: false });

  /* ---------- 플로우 ---------- */
  WEB.startFlow = function (i) {
    WEB.flow = i; WEB.state = {}; closeGnb();
    WEB.go(WEB.FLOWS[i][1], { reset: true });
    paintFlows();
  };
  function paintFlows() { $$('#flowList [data-flow]').forEach((b) => b.classList.toggle('on', Number(b.dataset.flow) === WEB.flow)); }

  /* ---------- 화면 맞춤 ---------- */
  function fit() {
    const r = $('#wrap').getBoundingClientRect();
    const s = Math.min((r.width - 24) / 1920, (r.height - 24) / 1080);
    WEB.scale = s; $('#scaler').style.transform = `scale(${s})`;
  }
  window.addEventListener('resize', fit);
  WEB.fit = fit;
  window.addEventListener('DOMContentLoaded', () => {
    $('#flowList').innerHTML = WEB.FLOWS.map((f, i) => `<button data-flow="${i}" type="button" title="${f[0]}"><i>✓</i><b class="no">${i + 1}</b><span>${f[0]}</span></button>`).join('');
    $('#flowList').addEventListener('click', (e) => { const b = e.target.closest('[data-flow]'); if (!b) return; WEB.startFlow(Number(b.dataset.flow)); });
    $('#btnStart').addEventListener('click', () => WEB.startFlow(0));
    $('#btnBack').addEventListener('click', () => WEB.back());
    $('#btnLinks').addEventListener('click', (e) => { $('#stage').classList.toggle('links'); e.currentTarget.classList.toggle('on'); $('#legend').style.display = $('#stage').classList.contains('links') ? 'flex' : 'none'; });
    fit();
    const q = new URLSearchParams(location.search).get('s');
    const first = q && WEB.TITLES[q] ? q : WEB.START;
    const fi = WEB.FLOWS.findIndex((f) => f[1] === first); if (fi >= 0) WEB.flow = fi;
    paintFlows();
    WEB.go(first, { anim: false });
  });
})();
