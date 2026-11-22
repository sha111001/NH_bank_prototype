/* 홈: 일반(미연동) / 마이데이터 연동 후 / 큰글 모드 + 마이데이터 연동 팝업 */
(function () {
  const { def, img, I, won } = App;
  const S = App.state;

  const toggle = (on) => `<button data-act="large" aria-label="큰글 모드" style="width:65px;height:32px;border-radius:16px;background:${on ? '#0066b3' : '#888'};position:relative;--hr:16px;transition:.2s">
      <i style="position:absolute;top:3px;${on ? 'right:3px' : 'left:3px'};width:26px;height:26px;border-radius:50%;background:#fff"></i>
      <span style="position:absolute;top:0;line-height:32px;${on ? 'left:7px' : 'right:6px'};font-size:12.5px;font-weight:600;color:#fff">큰글</span></button>`;
  const nameRow = (large) => `<div class="row" style="height:30px;margin:${large ? '35px 23px 0 24px' : '13px 25px 0 24px'}">
      <button data-go="menu" data-u class="row" style="gap:14px;font-size:${large ? 22 : 20}px;font-weight:700;height:30px;padding-right:6px">${S.user} 님 ${I.chev('#111', 12)}</button><span class="sp"></span>
      <span style="font-size:13.5px;color:${large ? '#999' : '#111'};margin-right:17px">청주축산농협 분평지점</span>
      <button data-todo="혜택 안내 화면은 디자인에 없습니다." style="height:20px;padding:0 7px;border-radius:3px;background:${large ? '#999' : '#0066b3'};color:#fff;font-size:10px;font-weight:600">혜택보기</button></div>
    <div class="row" style="margin:${large ? '23px 0 0 22px' : (S.mydata ? '20px 0 0 22px' : '24px 0 0 22px')};gap:16px;font-size:22px;font-weight:700;height:30px">
      <button data-act="bank" data-v="nh" id="tbNh">NH농협</button><button data-act="bank" data-v="other" id="tbOt" style="color:#bbb;font-weight:600">다른금융</button></div>`;
  const acctCard = (mt) => `<div class="card" style="margin:${mt}px 23px 0;height:216px;border-radius:14px;position:relative;border-color:#d9d9d9">
      ${img('ic_nh40', 39, 39, 'position:absolute;left:18px;top:19px')}
      <div class="abs" style="left:63px;top:18px;font-size:17px;line-height:22px;font-weight:500">자립예탁금</div>
      <div class="abs row" style="left:63px;top:41px;font-size:14px;line-height:18px;gap:8px">농협은행 000-0000-0000-00 <span data-act="copy" style="padding:3px;margin:-3px">${I.copy}</span></div>
      <button class="abs" data-act="more" style="right:26px;top:19px;width:22px;height:26px;display:flex;align-items:center;justify-content:center">${I.dots3}</button>
      <div class="abs row" style="left:0;right:0;top:90px;justify-content:center;gap:8px;font-size:28px;line-height:40px;font-weight:700"><span id="bal">${S.hideBal ? '잔액숨김' : won(S.balance) + '원'}</span>
        <span data-act="refresh" style="padding:4px;display:flex">${I.refresh('#111', 14)}</span></div>
      <i class="abs" style="left:0;right:0;top:164px;height:1px;background:#d9d9d9"></i>
      <div class="abs row" style="left:0;right:0;top:165px;height:50px;font-size:14px">
        <button data-go="history" data-u style="flex:1;height:100%;--hr:0 0 0 14px">거래내역</button><i style="width:1px;height:10px;background:#ccc"></i>
        <button data-go="tx1" style="flex:1;height:100%;--hr:0 0 14px 0">이체</button></div></div>`;
  const favs = () => `<div class="row" style="margin:33px 23px 0;height:22px;font-size:16px;font-weight:600">즐겨찾기<span class="sp"></span>
      <button data-go="menu" data-u style="padding:4px;margin-right:-5px;display:flex">${I.gear('#333', 17)}</button></div>
    <div class="row" style="margin:18px 14px 0;justify-content:space-between;align-items:flex-start;font-size:12.5px;line-height:14.5px;text-align:center">
      ${[['fav_add', 44, 43, '메뉴추가', 'menu', 1], ['fav_all', 40, 33, '전체계좌<br>조회', S.mydata ? 'asset' : 'history', S.mydata ? 0 : 1], ['fav_atm', 29, 41, '모바일<br>ATM출금', ''], ['fav_tax', 36, 36, '공과금<br>납부', ''], ['fav_travel', 39, 38, 'NH트래블리', '']].map((f) =>
        `<button ${f[4] ? `data-go="${f[4]}" ${f[5] ? 'data-u' : ''}` : `data-todo="‘${f[3].replace('<br>', ' ')}’ 화면은 디자인에 없습니다."`} style="width:68px;--hr:10px"><span style="height:46px;display:flex;align-items:center;justify-content:center;mix-blend-mode:multiply">${img(f[0], f[1], f[2])}</span><span style="display:block;margin-top:9px">${f[3]}</span></button>`).join('')}</div>`;
  const promo = (title) => `<div class="hs" id="pc" style="margin-top:14px;padding:0 16px;gap:9px">
      ${[0, 1, 2, 3].map((i) => `<button data-go="product" style="flex:none;width:338px;height:213px;border-radius:14px;overflow:hidden;scroll-snap-align:center;--hr:14px;${i ? `filter:hue-rotate(${i * 22}deg)` : ''}">${img('promo_blue', 338, 213)}</button>`).join('')}</div>
    <div class="row pdots" style="justify-content:center;gap:5px;margin-top:17px">${[0, 1, 2, 3].map((i) => `<i style="height:5px;border-radius:3px;${i ? 'width:5px;background:#d9d9d9' : 'width:14px;background:#0066b3'}"></i>`).join('')}</div>`;
  const eventNews = () => `<div class="card" style="margin:37px 29px 0;height:120px;border-radius:14px;position:relative;border-color:#d9d9d9">
      <button data-todo="이벤트 상세 화면은 디자인에 없습니다." class="abs" style="left:0;top:0;width:100%;height:100%;text-align:left;--hr:14px">
        <b style="position:absolute;left:21px;top:18px;font-size:12.5px;line-height:24px;font-weight:600" id="evT">피싱 · 스미싱 방지서비스<br>가입 이벤트</b>
        <span style="position:absolute;left:21px;top:77px;font-size:9px;color:#666">서비스 가입하러 가기 &nbsp;&gt;</span>
        ${img('ev_phishing', 138, 78, 'position:absolute;left:183px;top:25px')}</button>
      <div class="abs row" style="left:234px;top:82px;height:19px;border-radius:10px;background:#9a9a9a;color:#fff;font-size:11px;padding:0 3px;gap:2px">
        <button data-act="ev" data-v="-1" style="width:14px;height:19px;color:#fff">&lt;</button><span id="evN">2 / 3</span><button data-act="ev" data-v="1" style="width:14px;height:19px;color:#fff">&gt;</button></div>
      <button data-act="evPause" class="abs" style="left:303px;top:82px;width:19px;height:19px;border-radius:50%;background:#9a9a9a;color:#fff;font-size:8px;font-weight:900;letter-spacing:1px" id="evP">❙❙</button></div>
    <button data-go="notice" data-u class="row" style="margin:26px 23px 0 34px;width:343px;height:30px;font-size:14px;gap:10px;text-align:left">
      <span style="height:22px;line-height:22px;padding:0 9px;border-radius:11px;background:#eee;font-size:11.5px">새소식</span>여신거래약정서 2종 개정 알림<span class="sp"></span>${I.chev('#111', 12)}</button>
    <div style="height:28px"></div>`;
  const tabRow = `<div class="row" style="margin:${0}px 16px 0 22px;height:30px"><b style="font-size:21px">추천 상품</b><span class="sp"></span>
      <span style="font-size:16px;font-weight:600">농 · 축협</span><i style="width:1px;height:14px;background:#ccc;margin:0 7px"></i><span style="font-size:16px;color:#0066b3">NH농협은행</span></div>`;
  /* 이번달 사용금액 차트(SVG) */
  App.areaChart = (w = 367, h = 162) => {
    const pts = [[28, 82], [54, 40], [80, 52], [106, 82], [132, 92], [158, 62], [184, 48], [208, 24], [234, 60], [260, 64], [284, 50], [310, 66], [336, 138]];
    const sx = (w - 34) / 310, x = (p) => 17 + (p[0] - 28) * sx + 0;
    let d = `M${x(pts[0])},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i], mx = (x(a) + x(b)) / 2; d += ` C${mx},${a[1]} ${mx},${b[1]} ${x(b)},${b[1]}`; }
    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="display:block"><defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f8fe6"/><stop offset="1" stop-color="#cfe6fb" stop-opacity=".55"/></linearGradient></defs>
      ${pts.map((p) => `<line x1="${x(p)}" y1="14" x2="${x(p)}" y2="138" stroke="#eef1f4"/>`).join('')}
      <path class="areaFill" d="${d} L${x(pts[12])},138 L${x(pts[0])},138 Z" fill="url(#ag)"/>
      ${pts.map((p) => `<circle cx="${x(p)}" cy="${p[1]}" r="1.4" fill="#123"/>`).join('')}
      ${pts.map((p) => `<text x="${x(p)}" y="150" font-size="7" fill="#aaa" text-anchor="middle">00</text>`).join('')}
      <text x="${x(pts[11])}" y="37" font-size="8.5" font-weight="700" text-anchor="middle">이번달</text>
      <rect x="${x(pts[11]) - 30}" y="43" width="60" height="16" rx="2" fill="#0066b3"/><text x="${x(pts[11])}" y="54.5" font-size="9" font-weight="700" fill="#fff" text-anchor="middle">00,000원</text></svg>`;
  };

  function homeNormal() {
    const linked = S.mydata;
    return `<div class="bd" style="background:#f8f9fb">
      <div class="row" style="height:32px;margin:25px 21px 0 27px">${toggle(false)}<span class="sp"></span>
        <button data-go="notice" data-u style="width:34px;height:34px;display:flex;align-items:center;justify-content:center">${I.bell.replace('width="20" height="20"', 'width="23" height="23"')}</button>
        <button data-go="menu" data-u data-search style="width:34px;height:34px;margin-left:7px;display:flex;align-items:center;justify-content:center">${I.search('#111', 19)}</button>
        <button data-go="menu" style="width:34px;height:34px;margin-left:7px;display:flex;align-items:center;justify-content:center">${I.menu.replace('width="20" height="16"', 'width="22" height="17"')}</button></div>
      ${linked ? `<button data-go="spend" data-u class="row" style="margin:32px 22px 0 26px;width:348px;height:66px;border-radius:8px;background:#e2f1fe;padding:0 24px 0 22px;text-align:left;font-size:14px;line-height:19px;font-weight:500">
          ${img('bn_plant', 24, 32)}<span style="margin-left:13px">이번 달 카드 사용금액이<br>지난달보다 <b style="color:#0066b3">12%</b> 줄었어요!</span><span class="sp"></span>${img('bn_chart', 36, 36)}</button>`
        : `<button data-go="mall" data-u class="row" style="margin:26px 26px 0;width:348px;height:44px;border-radius:22px;background:#fff;border:1px solid #d9d9d9;padding:0 14px;gap:9px;font-size:15px;white-space:nowrap;--hr:22px">
          ${img('ic_spark', 25, 25)}20대 사회 초년생을 위한 재테크 바로 확인하기!</button>`}
      ${nameRow(false).replace('13px 25px 0 24px', linked ? '28px 21px 0 24px' : '13px 25px 0 24px')}
      ${acctCard(11)}
      ${favs()}
      ${linked ? `<div style="margin:36px 0 0 23px;font-size:21px;line-height:28px;font-weight:700">이번달 사용금액은 <span style="color:#0066b3">000,000</span>원 입니다</div>
          <div style="margin:5px 0 0 23px;font-size:16px;line-height:22px">지난달 보다 000,000원 <span style="color:#888">덜 사용하셨습니다.</span></div>
          <button data-go="spend" class="sec" style="display:block;margin:11px 16px 0 17px;border-radius:10px;--hr:10px">${App.areaChart()}</button>
          <div class="row" style="margin:42px 17px 0 23px;height:24px"><b style="font-size:16px;font-weight:600">지금 집중할 관리</b><span class="sp"></span><button data-go="goals" class="row" style="font-size:13.5px;color:#666;gap:14px;padding:4px">전체보기 ${I.chev('#666', 10, 1.4)}</button></div>
          <button data-go="spend" data-u class="card" style="display:block;position:relative;margin:13px 15px 0 23px;width:354px;height:110px;border-radius:14px;text-align:left;--hr:14px;border-color:#d9d9d9">
            ${img('foc_wallet', 38, 39, 'position:absolute;left:17px;top:18px')}
            <b style="position:absolute;left:74px;top:16px;font-size:17px;line-height:22px;font-weight:600">소비 예산</b>
            <i style="position:absolute;left:74px;top:40px;width:228px;height:7px;border-radius:4px;background:#dfeaf4"><i style="display:block;width:91%;height:100%;border-radius:4px;background:linear-gradient(90deg,#0a6fd6,#35a8f3)"></i></i>
            <b style="position:absolute;right:15px;top:36px;font-size:14px;color:#0066b3">91%</b>
            <span style="position:absolute;left:74px;top:56px;font-size:14px;font-weight:600">730,000 <small style="font-size:12px;color:#888;font-weight:400">/ 800,000원</small></span>
            <span style="position:absolute;left:74px;top:78px;font-size:12px;color:#777">남은 00일 동안 70,000원 사용할 수 있어요</span></button>
          ${[['foc_home', 37, 37, '내 집 마련 목표', '<b style="color:#0066b3;font-weight:600">80%</b> 달성', '목표까지 80,000,000원', 86, 'goals'], ['foc_diag', 38, 38, '자산 진단', '', '예금 비중이 설정한 기준보자 높아요', 70, 'diagForm']].map((r) => `
          <button data-go="${r[7]}" data-u class="card" style="display:block;position:relative;margin:7px 15px 0 23px;width:354px;height:${r[6]}px;border-radius:14px;text-align:left;--hr:14px;border-color:#d9d9d9">
            ${img(r[0], r[1], r[2], 'position:absolute;left:18px;top:' + (r[4] ? 20 : 14) + 'px')}
            <b style="position:absolute;left:74px;top:${r[4] ? 12 : 13}px;font-size:17px;line-height:22px;font-weight:600">${r[3]}</b>
            ${r[4] ? `<span style="position:absolute;left:74px;top:35px;font-size:13px">${r[4]}</span>` : ''}
            <span style="position:absolute;left:74px;top:${r[4] ? 54 : 38}px;font-size:12px;color:#777">${r[5]}</span>
            <span style="position:absolute;right:16px;top:14px">${I.chev('#111', 12)}</span></button>`).join('')}
          <div style="margin:44px 0 0 23px;font-size:21px;line-height:28px;font-weight:700">${S.user}을 위한 맞춤 상품</div>
          <div style="margin:5px 0 0 23px;font-size:16px;line-height:22px"><span style="color:#0066b3">20대 여성</span>들이 이 상품을 많이 찾았어요!</div>
          <div class="row" style="justify-content:flex-end;margin:13px 22px 0 0;height:22px"><span style="font-size:16px;font-weight:600">농 · 축협</span><i style="width:1px;height:14px;background:#ccc;margin:0 7px"></i><span style="font-size:16px;color:#0066b3">NH농협은행</span></div>
          <div style="margin-top:-6px">${promo()}</div>`
        : `<button data-act="mdPopup" class="abs" style="display:block;position:relative;margin:42px 23px 0;width:354px;height:172px;border-radius:14px;background:#e2f1fe;text-align:left;--hr:14px">
            <b style="position:absolute;left:16px;top:31px;font-size:19px;line-height:30px;font-weight:600">다른 금융기관까지<br><span style="color:#0066b3">한번에 관리해 보세요</span></b>
            <span style="position:absolute;left:16px;top:94px;font-size:15px;line-height:25px;color:#444">마이데이터를 연결하면<br>자산·소비·목표까지 확인할 수 있어요</span>
            ${img('ill_mydata', 115, 111, 'position:absolute;left:218px;top:30px')}</button>
          <div style="height:29px"></div>${tabRow}<div style="margin-top:-4px">${promo()}</div>`}
      ${eventNews()}</div>${App.tabbar('home')}`;
  }

  function homeLarge() {
    const tile = (t, ic, w, h, go, u) => `<button ${go ? `data-go="${go}" ${u ? 'data-u' : ''}` : `data-todo="‘${t.replace('<br>', ' ')}’ 화면은 디자인에 없습니다."`} class="card" style="position:relative;width:170px;height:126px;border-radius:14px;text-align:left;--hr:14px;border-color:#d9d9d9">
        <b style="position:absolute;left:13px;top:19px;font-size:18px;line-height:22px;font-weight:600">${t}</b>${img(ic, w, h, `position:absolute;right:${ic === 'l_atm' ? 14 : 18}px;bottom:14px`)}</button>`;
    return `<div class="bd" style="background:#f8f9fb">
      <div class="row" style="height:32px;margin:25px 27px 0 25px">${toggle(true)}<span class="sp"></span>
        <button data-go="notice" data-u style="font-size:14px;height:30px;padding:0 4px">알림</button><button data-go="menu" style="font-size:14px;height:30px;padding:0 4px;margin-left:2px">메뉴</button></div>
      ${nameRow(true)}
      ${acctCard(9)}
      <button data-go="history" data-u class="row" style="margin:9px 23px 0;width:354px;height:82px;border-radius:14px;background:#e2f1fe;padding:0 21px;text-align:left;--hr:14px">
        ${img('l_bell', 32, 34)}<span style="margin-left:17px;font-size:16px;line-height:21px;font-weight:600">이번달 자동이체 예정<br><small style="font-size:14px;font-weight:400;color:#666">9월 25일 &nbsp;&nbsp; 100,000원</small></span><span class="sp"></span>${I.chev('#111', 13)}</button>
      <div style="display:grid;grid-template-columns:170px 170px;gap:9px 14px;margin:9px 23px 0">
        ${tile('계좌조회', 'l_acct', 36, 32, 'history', 1)}${tile('모바일ATM', 'l_atm', 30, 30)}${tile('공과금<br>납부', 'l_tax', 34, 33)}${tile('금융상품', 'l_prod', 36, 32, 'mall')}</div>
      <button data-todo="금융피해신고 화면은 디자인에 없습니다." class="card row" style="margin:9px 23px 0;width:354px;height:76px;border-radius:14px;padding:0 0 0 28px;gap:19px;font-size:18px;font-weight:600;--hr:14px;border-color:#d9d9d9">${img('l_siren', 27, 35)}금융피해신고</button>
      <div style="height:22px"></div></div>${App.tabbar('home')}`;
  }

  def('home', {
    title: '홈',
    html: () => (S.large ? homeLarge() : homeNormal()),
    init(el) {
      const hs = el.querySelector('#pc');
      if (hs) hs.addEventListener('scroll', () => { const i = Math.round(hs.scrollLeft / 347); el.querySelectorAll('.pdots i').forEach((d, k) => { d.style.width = k === i ? '14px' : '5px'; d.style.background = k === i ? '#0066b3' : '#d9d9d9'; }); });
      /* 로그인 직후 1회: 마이데이터 연동 팝업 (After delay · 추정) */
      el._ev = 2; el._evT = setInterval(() => { if (!document.body.contains(el)) return clearInterval(el._evT); if (!el._paused) evMove(el, 1); }, 3500);
    },
    acts: {
      large() { S.large = !S.large; App.rerender(); App.el.querySelector('.bd').scrollTop = 0; },
      bank(t, el) { const nh = t.dataset.v === 'nh'; if (!nh && !S.mydata) { mdPopup(); return; }
        if (!nh) { App.go('asset'); return; } },
      copy() { try { navigator.clipboard.writeText('000-0000-0000-00'); } catch (e) {} App.toast('계좌번호가 복사되었습니다.'); },
      refresh(t, el) { t.firstElementChild.style.transition = 'transform .5s'; t.firstElementChild.style.transform = 'rotate(360deg)'; setTimeout(() => (t.firstElementChild.style.cssText = ''), 520); App.toast('잔액 재조회는 실제 서버가 필요합니다. (테스트 데이터 유지)', '테스트 동작'); },
      more() {
        App.sheet(`<div class="sheet" style="padding:26px 20px 18px"><b style="font-size:19px">자립예탁금</b><button class="x" data-close style="right:14px;top:18px">${I.x(15)}</button>
          <div style="margin-top:16px;font-size:16px">${[['거래내역 조회', 'data-go="history"'], ['이체하기', 'data-go="tx1"'], [S.hideBal ? '잔액 보이기' : '잔액 숨기기', 'data-act="hide"'], ['계좌번호 복사', 'data-act="copy"']].map((m) =>
            `<button ${m[1]} class="row" style="width:100%;height:52px;border-bottom:1px solid #eee;text-align:left">${m[0]}<span class="sp"></span>${I.chev('#999', 11)}</button>`).join('')}</div></div>`);
      },
      hide() { S.hideBal = !S.hideBal; App.rerender(); },
      mdPopup() { mdPopup(); },
      ev(t, el) { evMove(el, Number(t.dataset.v)); },
      evPause(t, el) { el._paused = !el._paused; t.textContent = el._paused ? '▶' : '❙❙'; },
    },
  });
  const EV = ['NH멤버스 포인트<br>더블 적립 이벤트', '피싱 · 스미싱 방지서비스<br>가입 이벤트', '올원뱅크 출석체크<br>경품 이벤트'];
  function evMove(el, d) { el._ev = ((el._ev - 1 + d + 3) % 3) + 1; const n = el.querySelector('#evN'); if (!n) return; n.textContent = el._ev + ' / 3'; el.querySelector('#evT').innerHTML = EV[el._ev - 1]; }

  /* 마이데이터 연동 팝업 */
  function mdPopup() {
    App.sheet(`<div class="pop" style="left:24px;top:248px;width:352px;height:274px;border-radius:8px">
        <button class="xbtn" data-close style="right:3px;top:2px">${I.x(14, '#999', 1.3)}</button>
        <b style="position:absolute;left:16px;top:38px;font-size:19px;line-height:30px;font-weight:600">마이데이터를 연동해<br>다른 금융기관까지<br><span style="color:#0066b3">한번에 관리해 보세요</span></b>
        <span style="position:absolute;left:16px;top:134px;font-size:15px;line-height:25px;color:#444">마이데이터를 연결하면<br>자산·소비·목표까지 확인할 수 있어요</span>
        ${img('ill_mydata', 115, 111, 'position:absolute;left:209px;top:52px')}
        <button class="btn" data-act="mdLink" style="position:absolute;left:14px;top:204px;width:325px;height:47px;border-radius:8px;font-size:18px">연동하기</button></div>`);
  }
  App.acts.mdLink = () => {
    App.closeSheets(); S.mydata = true;
    App.toast('마이데이터 연동(본인인증·기관 선택)은 실제 서버가 필요해 즉시 연동된 것으로 처리합니다.', '테스트 동작');
    App.go('mydata'); /* Figma: 연동하기 → NH마이데이터 */
  };
  App.mdPopup = mdPopup;
})();
