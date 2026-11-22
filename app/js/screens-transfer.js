/* 계좌이체: 받는 계좌 → 금액 → 이체정보 확인 → 계좌 비밀번호 → 완료 */
(function () {
  const { def, img, I, keypad, dots, hd, won } = App;
  const $ = (s, el) => el.querySelector(s);
  const S = App.state;
  const D = App.data;

  const head = hd('계좌이체', { right: App.rCancel() });
  const sub = `<button class="abs row" data-todo="출금계좌 변경 화면은 디자인에 없습니다." style="right:12px;top:0;height:24px;padding:0 6px;font-size:13px;color:#777;gap:8px">출금계좌 변경하기 ${I.refresh('#777', 11)}</button>`;

  /* ① 받는 계좌 선택 */
  def('tx1', {
    title: '계좌이체 · 받는 계좌',
    html() {
      const tab = S.tx.tab || '최근';
      const list = D.payees.filter((p) => tab === '최근' ? p.recent : tab === '즐겨찾기' ? p.fav : tab === '내 계좌' ? p.mine : p.contact);
      return `${head}<div class="bd">
        <h1 style="margin:27px 16px 0;font-size:22px;line-height:28px;font-weight:700">어디로 이체하시겠어요?</h1>
        <div class="inp" data-act="direct" style="margin:23px 38px 0 39px;height:51px;border-radius:10px;--hr:10px"><span class="ph" style="flex:1">계좌번호 직접 입력</span>
          <span data-todo="QR/카메라 스캔은 실제 기기가 필요합니다." style="padding:6px;margin-right:-4px">${img('ic_qr', 20, 20)}</span></div>
        <div class="chips" style="margin:23px 16px 0">${['최근', '즐겨찾기', '내 계좌', '연락처'].map((t) => `<button class="chip ${t === tab ? 'on' : ''}" data-act="tab" data-v="${t}">${t}</button>`).join('')}</div>
        <div class="r" style="margin:5px 16px 0;height:18px"><button data-act="del" style="height:18px;padding:0 11px;border:1px solid #ddd;border-radius:4px;font-size:10px;font-weight:600;${S.tx.del ? 'background:#0066b3;color:#fff;border-color:#0066b3' : ''}">${S.tx.del ? '완료' : '삭제'}</button></div>
        <ul style="list-style:none;margin-top:6px">${list.map((p) => `<li class="row" style="height:76px;padding:0 17px 0 24px">
            <div class="row" data-act="pick" data-id="${p.id}" style="flex:1;height:68px;gap:8px">
              <i style="width:34px;height:34px;border-radius:9px;background:#8e8e8e;flex:none"></i>
              <div style="line-height:16px"><div style="font-size:16px;line-height:20px">${p.name}</div><div style="font-size:13px;color:#888">${p.bank} ${p.acct}</div><div style="font-size:13px;color:#888">${p.date}</div></div></div>
            ${S.tx.del ? `<button data-act="rm" data-id="${p.id}" style="width:30px;height:30px;display:flex;align-items:center;justify-content:center">${I.x(13, '#e03131', 2)}</button>`
              : `<button data-act="fav" data-id="${p.id}" style="width:30px;height:30px;display:flex;align-items:center;justify-content:center;margin-top:-28px">${p.fav ? img('ic_star', 21, 20) : I.star(false)}</button>`}</li>`).join('')
          || '<li class="c" style="padding:60px 0;color:#999;font-size:14px">표시할 계좌가 없습니다.</li>'}</ul></div>`;
    },
    acts: {
      tab(t) { S.tx.tab = t.dataset.v; App.rerender(); },
      del() { S.tx.del = !S.tx.del; App.rerender(); },
      rm(t) { D.payees = D.payees.filter((p) => p.id != t.dataset.id); App.rerender(); },
      fav(t) { const p = D.payees.find((p) => p.id == t.dataset.id); p.fav = !p.fav; App.rerender(); },
      pick(t) { const p = D.payees.find((p) => p.id == t.dataset.id); Object.assign(S.tx, { name: p.name, bank: p.bank, acct: p.acct, amount: '' }); App.go('tx2'); },
      direct() { openDirect(); },
    },
  });

  /* 계좌번호 직접 입력 시트 + 기관 선택 시트 */
  function openDirect() {
    const st = { bank: '', acct: '' };
    const sh = App.sheet(`<div class="sheet" style="height:575px">
        <div class="abs" style="left:21px;top:31px;font-size:21px;line-height:30px;font-weight:700">계좌번호를 직접 입력해 주세요</div>
        <button class="x" data-close style="right:15px;top:28px">${I.x(15)}</button>
        <div class="inp abs" data-act2="bank" style="left:16px;right:16px;top:77px;--hr:8px;cursor:pointer"><span id="dBank" class="ph" style="flex:1">은행선택</span>${I.down('#333', 17)}</div>
        <div class="inp abs" style="left:16px;right:16px;top:140px"><span id="dAcct" class="ph" style="flex:1">계좌번호 입력</span></div>
        ${keypad(['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'], { top: 205, rh: 68, fs: 21, px: 22, del: 28 })}
        <div class="cta"><button class="btn" data-act2="ok">확인</button></div></div>`);
    const root = sh;
    const upd = () => {
      const b = $('#dBank', root), a = $('#dAcct', root);
      b.textContent = st.bank || '은행선택'; b.className = st.bank ? '' : 'ph'; b.style.flex = 1;
      a.textContent = st.acct || '계좌번호 입력'; a.className = st.acct ? '' : 'ph'; a.style.flex = 1;
    };
    root._key = (k) => { if (k === 'del') st.acct = st.acct.slice(0, -1); else if (st.acct.length < 16) st.acct += k; upd(); };
    root.addEventListener('click', (e) => {
      const t = e.target.closest('[data-act2]'); if (!t) return;
      if (t.dataset.act2 === 'bank') openBank((b) => { st.bank = b; upd(); });
      if (t.dataset.act2 === 'ok') {
        if (!st.bank) return App.toast('은행을 선택해 주세요.');
        if (st.acct.length < 10) return App.toast('계좌번호를 10자리 이상 입력해 주세요.');
        Object.assign(S.tx, { name: '김농협', bank: st.bank, acct: st.acct.replace(/(\d{3})(\d{4})(\d{4})(\d+)/, '$1-$2-$3-$4'), amount: '' });
        App.toast('예금주 조회는 실제 서버가 필요해 테스트 이름으로 표시합니다.', '테스트 동작');
        App.go('tx2');
      }
    });
  }
  function openBank(cb) {
    const tabs = ['은행', '증권', '국세/지방세입'];
    let cur = '은행';
    const body = () => {
      const list = cur === '은행' ? D.banks : cur === '증권' ? D.secs : D.taxes;
      return `<div style="display:grid;grid-template-columns:192px 1fr;padding:0 28px">${list.map((b) => `<button class="row" data-bank="${b[0]}" style="height:70px;gap:12px;font-size:14px;--hr:12px;cursor:pointer">
        ${b[1] ? img('bank_' + b[1], 50, 50, 'border-radius:14px') : `<i style="width:50px;height:50px;border-radius:14px;background:#e9eef4;display:flex;align-items:center;justify-content:center;font-style:normal;font-weight:700;color:#0066b3;font-size:15px">${b[0][0]}</i>`}<span>${b[0]}</span></button>`).join('')}</div>`;
    };
    const sh = App.sheet(`<div class="sheet" style="height:686px;display:flex;flex-direction:column">
        <div style="height:87px;flex:none;position:relative"><div class="abs" style="left:21px;top:31px;font-size:22px;line-height:30px;font-weight:700">기관 선택</div>
        <button class="x" data-close style="right:14px;top:29px">${I.x(15)}</button></div>
        <div class="row" id="seg" style="margin:0 32px 0 30px;height:48px;flex:none;background:#f0f0f0;border-radius:9px;padding:2px;font-size:14px;color:#555">
          ${tabs.map((t, i) => `<button data-seg="${t}" style="flex:${i === 2 ? 1.55 : 1};height:44px;border-radius:8px;--hr:8px;cursor:pointer">${t}</button>`).join('')}</div>
        <div id="bk" class="bd" style="margin-top:26px;padding-bottom:20px"></div></div>`);
    const paint = () => {
      sh.querySelectorAll('[data-seg]').forEach((b) => { const on = b.dataset.seg === cur; b.style.background = on ? '#fff' : 'none'; b.style.fontWeight = on ? 600 : 400; b.style.color = on ? '#111' : '#555'; b.style.boxShadow = on ? '0 1px 3px rgba(0,0,0,.08)' : ''; });
      $('#bk', sh).innerHTML = body();
    };
    paint();
    sh.addEventListener('click', (e) => {
      const s = e.target.closest('[data-seg]'); if (s) { cur = s.dataset.seg; paint(); return; }
      const b = e.target.closest('[data-bank]'); if (b) { cb(b.dataset.bank); sh.close(); }
    });
  }
  App.openBank = openBank;

  /* ② 금액 입력 */
  const who = (top) => `<div class="abs c" style="left:0;right:0;top:${top}px;font-size:17px;line-height:22px;color:#888"><b style="color:#111">${S.tx.name || '김농협'}</b>님에게</div>`;
  const amountView = () => `${img('ic_nh36', 36, 35, 'position:absolute;left:182px;top:90px')}${who(133)}
      <div class="abs c" style="left:0;right:0;top:158px;font-size:30px;line-height:40px;font-weight:700">${won(S.tx.amount)}원</div>
      <div class="abs c" style="left:0;right:0;top:195px;font-size:19px;line-height:26px;color:#777">이체하시겠습니까?</div>`;
  def('tx2', {
    title: '계좌이체 · 금액',
    html() {
      const has = Number(S.tx.amount) > 0;
      return `${head}<div class="fix">${sub}
        <div id="amt">${has ? amountView() : `${who(114)}
          <div class="abs c" style="left:0;right:0;top:139px;font-size:28px;line-height:38px;font-weight:700;color:#8a8a8a">얼마를 보낼까요?</div>
          <div class="abs c" style="left:0;right:0;top:183px;font-size:10px;line-height:14px;color:#555">${S.tx.bank || 'NH농협'} ${S.tx.acct || '333-3333-3333-33'}</div>`}</div>
        <div class="abs row" style="left:17px;right:17px;top:292px;gap:7px">${[['+1만', 1e4, 59], ['+5만', 5e4, 63], ['+10만', 1e5, 71], ['+1,00만', 1e6, 85], ['전액', -1, 56]].map((c) =>
          `<button data-act="add" data-v="${c[1]}" style="width:${c[2]}px;height:39px;border-radius:20px;background:#f6f6f6;color:#999;font-size:14px;--hr:20px">${c[0]}</button>`).join('')}</div>
        ${keypad(['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', 'del'], { top: 351, rh: 68, fs: 21, px: 22, del: 30 })}
        <div class="cta"><button class="btn" data-act="next">다음</button></div></div>`;
    },
    key(k) {
      let a = String(S.tx.amount || '');
      if (k === 'del') a = a.slice(0, -1); else a = (a + k).replace(/^0+/, '').slice(0, 10);
      S.tx.amount = a; App.rerender();
    },
    acts: {
      add(t) { const v = Number(t.dataset.v); S.tx.amount = String(v < 0 ? S.balance : Math.min(Number(S.tx.amount || 0) + v, 9999999999)); App.rerender(); },
      next() {
        const a = Number(S.tx.amount);
        if (!a) return App.toast('이체 금액을 입력해 주세요.');
        if (a > S.balance) return App.toast(`출금 가능 잔액(${won(S.balance)}원)을 초과했습니다.`);
        App.go('tx4');
      },
    },
  });

  /* ③ 이체정보 확인 */
  def('tx3', {
    title: '이체정보 확인',
    html: () => `<header class="hd" style="height:74px"><div class="abs" style="left:25px;top:25px;font-size:16px;line-height:24px;font-weight:700">이체정보 확인</div>
        <button class="xbtn" data-act="x" style="right:15px;top:19px">${I.x(19, '#777', 2)}</button></header>
      <div class="fix" style="margin-top:-74px">
        <div class="abs" style="left:0;right:0;top:56px;height:230px">${amountView()}</div>
        <div class="abs" style="left:17px;right:16px;top:325px;height:297px;border:1px solid #d9d9d9;border-radius:20px;font-size:15px;color:#333">
          <div class="abs row" style="left:29px;top:27px;gap:5px">수수료 <span data-act="fee" style="display:flex">${img('ic_help', 17, 17)}</span></div><div class="abs" style="right:28px;top:27px;color:#111">0원</div>
          <div class="abs" style="left:29px;top:68px">출금계좌</div><div class="abs r" style="right:28px;top:66px;line-height:24px;color:#111">농축협<br>333-3333-3333-33</div>
          <i class="abs" style="left:25px;right:25px;top:136px;height:1px;background:#d9d9d9"></i>
          <div class="abs" style="left:29px;top:165px">받는 분에게 표기</div>
          <label class="abs row" style="right:28px;top:161px;gap:6px"><input id="m1" value="${S.user}" maxlength="10" style="width:120px;text-align:right;border:0;outline:0;font-weight:600;color:#111;height:26px">${img('ic_pencil', 13, 13)}</label>
          <div class="abs" style="left:29px;top:207px">나에게 표기</div>
          <label class="abs row" style="right:28px;top:203px;gap:6px"><input id="m2" value="${S.tx.name}" maxlength="10" style="width:120px;text-align:right;border:0;outline:0;font-weight:600;color:#111;height:26px">${img('ic_pencil', 13, 13)}</label>
          <div class="abs" style="left:29px;top:249px">메모</div>
          <input id="m3" class="abs" placeholder="입력해주세요" maxlength="20" style="right:28px;top:245px;width:200px;text-align:right;border:0;outline:0;height:26px">
        </div>
        <button class="abs row" data-todo="보이스피싱 유의 안내 화면은 디자인에 없습니다." style="right:8px;top:628px;height:24px;padding:0 6px;font-size:13px;color:#333;gap:5px">${img('ic_warn_s', 12, 11)} 보이스피싱 유의 안내 ${I.chev('#333', 11, 1.4)}</button>
        <div class="cta"><button class="btn o" data-go="tx1">이체추가</button><button class="btn" data-act="next">다음</button></div></div>`,
    acts: {
      fee() { App.toast('NH농협 간 이체 수수료는 면제됩니다. (테스트 데이터)'); },
      x() { App.stack.pop(); App.back(); }, /* Figma: X → 금액 입력 */
      send() {
        App.closeSheets();
        App.loading('load_tx', 3000, () => { /* Figma: 로딩 GIF 3s → 이체 완료 */
          S.balance -= Number(S.tx.amount);
          D.history.unshift({ d: '오늘', t: '방금', n: S.tx.name, a: -Number(S.tx.amount), m: '이체' });
          App.go('tx5', { reset: true, anim: false }); App.stack.unshift('home');
        });
      },
      next() {
        App.sheet(`<div class="sheet" style="height:297px">
            <div class="row" style="justify-content:center;gap:10px;margin-top:30px;height:32px">${img('ic_warn_b', 30, 27)}<b style="font-size:21px">계좌번호를 확인해 주세요</b></div>
            <p class="c" style="margin-top:30px;font-size:16px;line-height:23px;color:#555">${S.tx.name}님과(${S.tx.bank} ${S.tx.acct})<br>최근 6개월간 거래하지 않은 계좌입니다.</p>
            <div class="row" style="justify-content:center;gap:7px;margin-top:27px;font-size:15px;color:#555">${img('ic_info_g', 18, 18)} 이체를 계속 하시겠습니까?</div>
            <div class="cta"><button class="btn o" data-close>취소</button><button class="btn g" data-act="send">다음</button></div></div>`);
      },
    },
  });

  /* ④ 계좌 비밀번호 (보안 키패드 · 재배열) */
  function shuffled() {
    const d = '0123456789'.split('').sort(() => Math.random() - 0.5);
    const slots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];           // 12칸 중 마지막은 삭제
    const nhAt = 1 + Math.floor(Math.random() * 9);
    const out = []; let i = 0;
    slots.forEach((s) => out.push(s === nhAt ? 'nh' : d[i++]));
    out.push('del'); return out.slice(0, 12);
  }
  def('tx4', {
    title: '계좌 비밀번호',
    html: () => `${head}<div class="fix">${sub}<div class="abs" style="left:0;right:0;top:0;height:230px">${amountView()}</div>
      <div class="abs" style="left:0;right:0;top:279px;bottom:0;background:#fff">
        <div class="abs" style="left:22px;top:21px;font-size:21px;line-height:30px;font-weight:700">계좌 비밀번호</div>
        <button class="xbtn" data-back style="right:13px;top:18px">${I.x(15)}</button>
        ${dots(4, 0, { top: 91, gap: 9, d: 18 })}
        <div id="kpw">${keypad(shuffled(), { top: 124, cols: 4, rh: 78, fs: 21, px: 0, del: 30 }).replace(/<button data-k="(\d)"/g, '<button data-k="$1" data-digit')}</div>
        <div class="cta" style="left:18px;right:12px;gap:10px"><button class="btn o" data-act="shuffle" style="gap:6px;font-size:18px;color:#777">재배열 ${I.refresh('#777', 18)}</button><button class="btn" data-act="ok">다음</button></div>
      </div></div>`,
    init(el) { el._pw = ''; },
    key(k, el) {
      let p = el._pw; if (k === 'del') p = p.slice(0, -1); else p = (p + k).slice(0, 4);
      el._pw = p; el.querySelectorAll('.dots i').forEach((d, i) => d.classList.toggle('on', i < p.length));
    },
    acts: {
      shuffle(t, el) { $('#kpw', el).innerHTML = keypad(shuffled(), { top: 124, cols: 4, rh: 78, fs: 21, px: 0, del: 30 }); },
      ok(t, el) {
        if (el._pw.length < 4) return App.toast('계좌 비밀번호 4자리를 입력해 주세요.');
        App.go('tx3');
      },
    },
  });

  /* ⑤ 이체 완료 */
  def('tx5', {
    title: '이체 완료',
    html: () => `<div class="fix">
      ${img('ic_done', 62, 63, 'position:absolute;left:169px;top:176px')}
      <div class="abs c" style="left:0;right:0;top:279px;font-size:17px;line-height:22px;color:#888"><b style="color:#111">${S.tx.name}</b>님에게</div>
      <div class="abs c" style="left:0;right:0;top:304px;font-size:30px;line-height:40px;font-weight:700">${won(S.tx.amount)}원</div>
      <div class="abs c" style="left:0;right:0;top:341px;font-size:19px;line-height:26px;color:#777">이체 완료했습니다</div>
      <div class="abs c" style="left:0;right:0;top:462px;font-size:16px;line-height:22px;color:#555">이체 사실을 <b style="color:#111">${S.tx.name}</b>님께 전송하시고 싶은신가요?</div>
      <div class="abs row" style="left:71px;top:517px;gap:14px">${[['ic_kakao', '카카오톡'], ['ic_sms', '문자'], ['ic_mail', '이메일']].map((s) =>
        `<button data-todo="${s[1]} 전송은 실제 기기·서버 연동이 필요합니다." style="width:77px;height:104px;display:flex;flex-direction:column;align-items:center;gap:22px;padding-top:9px;font-size:13px;--hr:12px">${img(s[0], 46, 46)}${s[1]}</button>`).join('')}</div>
      <div class="cta"><button class="btn o" data-go="tx1" data-reset-tx>이체하기</button><button class="btn" data-home>확인</button></div></div>`,
  });
})();
