/* 밸런스 진단 · 투자자성향 · 자산진단 · 소비모아보기 · 정기지출관리 · 상담봇 · (보완) 거래내역/알림 */
(function () {
  const { def, img, I, hd, won } = App;
  const S = App.state;
  const $ = (s, el) => el.querySelector(s);
  const BG = '#f3f4f8', timeRow = App.timeRow, pdots = App.pdots, donut = App.donut;
  const notes = `<div style="padding:0 16px 0 17px">${['NH농협은행 밸런스진단에서 사용하는 기대수익률, 투자위험(변동성) 등의 정보는 과거 데이터를 기초하여 제시된 것으로 미래의 수익률을 보장하는 것은 아니며, 향후 수익률은 변동될 수 있습니다',
    '미래 투자 환경의 예측도 다른 경제 변수에 의하여 사실과 다르게 나타날 수 있으므로 투자 의사 결정은 고객 스스로 판단하셔야 하며 당행은 투자에 따른 결과를 보장하거나 책임지지 않습니다.',
    '실제 투자 운영 시 시뮬레이션 결과와 다를 수 있으며, 투자판단을 돕는 참고 자료로만 활용하시기 바랍니다.'].map((t) => `<p class="row" style="align-items:flex-start;margin-top:8px;font-size:14.5px;line-height:23px;color:#777;gap:12px"><i style="width:3px;height:3px;background:#999;margin-top:10px;flex:none"></i>${t}</p>`).join('')}</div>`;
  const noteHead = (open) => `<button data-act="notes" class="row" style="margin:0 16px 0 20px;width:364px;height:40px;gap:5px;font-size:16px;font-weight:600;text-align:left">${I.info('#111', 18)}알아두세요<span class="sp"></span><span id="nArr" style="margin-right:7px;display:flex;transition:.2s;${open ? '' : 'transform:rotate(180deg)'}">${I.up('#111', 15)}</span></button>`;
  const toggleNotes = (t, el) => { const b = $('#nBody', el), open = b.style.display !== 'none'; b.style.display = open ? 'none' : 'block'; $('#nArr', el).style.transform = open ? 'rotate(180deg)' : ''; };

  /* ---------- 밸런스 진단 인트로 ---------- */
  def('balIntro', {
    title: '밸런스 진단',
    html: () => `${hd('밸런스 진단', { right: `<button data-go="menu" aria-label="전체메뉴">${I.grid}</button>` })}<div class="fix">
      <h1 class="abs c" style="left:0;right:0;top:59px;font-size:20px;line-height:38px;font-weight:600">내 투자 성향에 맞춘<br>최적 포트폴리오를<br>확인해 보세요.</h1>
      <div class="hs abs" id="bi" style="left:0;right:0;top:225px;height:240px">${[0, 1, 2, 3].map((i) => `<div style="flex:none;width:400px;height:240px;display:flex;align-items:center;justify-content:center;scroll-snap-align:center;${i ? `filter:hue-rotate(${i * 40}deg)` : ''}">${img('ill_balance', 216, 171)}</div>`).join('')}</div>
      <div class="abs" style="left:0;right:0;top:518px">${pdots(4, 0)}</div>
      <div class="cta" style="bottom:auto;top:588px"><button class="btn" data-act="start">밸런스진단 시작</button></div></div>`,
    acts: { start() { App.loading('balance', 2000, () => App.go('bal1', { anim: false })); } }, /* Figma: After delay 2s */
    init(el) { const hs = $('#bi', el); hs.addEventListener('scroll', () => { const i = Math.round(hs.scrollLeft / 400); el.querySelectorAll('.pdots i').forEach((d, k) => { d.style.width = k === i ? '17px' : '6px'; d.style.background = k === i ? '#0066b3' : '#cfcfcf'; }); }); },
  });

  /* ---------- 밸런스 진단 STEP 1/2 (도넛 애니메이션: 원본 GIF와 같은 동작을 코드로 구현) ---------- */
  const LEG = [['현금', '#ba89ff', '00.0%', 0, 1], ['국내주식', '#11732e', '0.0%', 1], ['해외선진국주식', '#3cdc62', '0.0%'], ['해외신흥국주식', '#ace3bc', '0.0%'], ['국내채권', '#2357aa', '0.0%', 1], ['해외채권', '#67a0ff', '0.0%']];
  def('bal1', {
    title: '밸런스 진단 STEP 1',
    html: () => `${hd('밸런스 진단', { right: `<button data-back>취소</button>`, cls: 'pg', prog: 50 })}<div class="step"><span>현황 확인</span><span><b>STEP 1</b> <i>/2</i></span></div>
      <div class="bd"><h1 style="margin:-5px 17px 0;font-size:23px;line-height:36px;font-weight:600">밸런스 진단을 위해<br>대상 자산 분석을 시작합니다.</h1>
      <div class="card" style="margin:27px 16px 0 17px;border-radius:16px;padding:22px 21px 21px;border-color:#d0d0d0">
        <div style="font-size:16px;line-height:24px">분석 대상 자산</div>
        <button data-go="asset" data-u class="row" style="margin-top:9px;height:38px;font-size:28px;font-weight:500;gap:12px"><span id="b1Amt">0</span>원 ${I.chev('#111', 14)}</button>
        <div style="position:relative;width:190px;height:190px;margin:23px auto 0">${donut([[100, '#ba89ff']], { size: 190, r: 71, w: 48, anim: 1 })}<span class="abs c" style="left:0;right:0;top:82px;font-size:9px;line-height:14px">현금<br>00.0%</span></div>
        <div style="margin-top:23px">${LEG.map((l) => `${l[3] ? '<i style="display:block;height:1px;background:#d0d0d0;margin:7px 0 6px"></i>' : ''}<div class="row" style="height:27px;font-size:14.5px;gap:8px"><i style="width:9px;height:9px;background:${l[1]}"></i>${l[0]}<span class="sp"></span>${l[2]}</div>`).join('')}</div>
        <div style="margin-top:23px;padding:10px 12px 11px 13px;border-radius:12px;background:#f4f5f9;font-size:14.5px;line-height:25px">마이데이터에 연결된 고객님의 자산을 NH농협은행 포트폴리오 분류 기준에 따라 재구성했습니다.</div></div>
      <div style="height:30px"></div></div><div class="ft"><button class="btn" data-go="balResult">다음</button></div>`,
    init(el) { const a = $('#b1Amt', el); let t0 = null; const end = 8880499; const tick = (t) => { if (!t0) t0 = t; const p = Math.min((t - t0) / 1400, 1); a.textContent = won(Math.round(end * (1 - Math.pow(1 - p, 3)))); if (p < 1 && document.body.contains(el)) requestAnimationFrame(tick); }; requestAnimationFrame(tick); },
  });

  /* ---------- 투자자성향 진단 결과 (STEP 2/2에 해당 · 추정) ---------- */
  const TYPES = [['안정형', '#0066b3', 703], ['안정<br>추구형', '#2f9ac6', 686], ['위험<br>중립형', '#2aa39a', 667], ['적극<br>투자형', '#e07b22', 648], ['공격<br>투자형', '#d01818', 628]];
  def('invest', {
    title: '투자자성향 진단 결과',
    html: () => `<div class="bd">${img('ic_done2', 66, 66, 'margin:72px 0 0 17px')}
      <h1 style="margin:36px 17px 0;font-size:23px;line-height:32px;font-weight:500">투자자성향을 진단했어요</h1>
      <p style="margin:39px 17px 0;font-size:21px;line-height:33px;font-weight:500">${S.user}님의 투자자성향은<br><span style="color:#0066b3">안정형</span>입니다.</p><p style="margin:13px 17px 0;font-size:13px;color:#888">투자자성향 진단일 2026.09.20</p>
      <div style="margin:17px 16px 0"><button class="btn" data-go="diagResult">투자자성향진단 결과 보기</button><button class="btn" data-act="dl" style="margin-top:12px;background:#d8d8d8;color:#222;font-weight:500">투자자성향진단 다운로드</button></div>
      <div style="margin:27px 16px 0;font-size:16px;line-height:22px;font-weight:500">투자자성향에 적합한 상품 위험등급</div>
      <span style="display:inline-block;margin:14px 0 0 16px;width:72px;height:26px;border:1.5px solid #0066b3;border-radius:4px;font-size:14px;line-height:23px;text-align:center;color:#0066b3;font-weight:500">6등급</span>
      <div style="position:relative;margin:22px 16px 0;height:156px;border-bottom:1px solid #999"><i style="position:absolute;left:0;top:0;width:73px;height:156px;background:linear-gradient(#f1f1f1,#fff)"></i>
        <span style="position:absolute;left:6px;top:5px;font-size:12.5px;color:#888">기대수익</span><span style="position:absolute;right:5px;bottom:5px;font-size:12.5px;color:#888">투자위험</span>
        ${[73, 146, 220, 294].map((x) => `<i style="position:absolute;left:${x}px;top:0;height:156px;border-left:1px dashed #ccc"></i>`).join('')}
        ${TYPES.map((t, i) => { const cx = 36 + i * 73.5, cy = t[2] - 597; return `<i style="position:absolute;left:${cx - 19}px;top:${cy - 19}px;width:38px;height:38px;border-radius:50%;${i ? `border:3px solid ${t[1]}` : `background:${t[1]};display:flex;align-items:center;justify-content:center`}">${i ? '' : `<span style="width:17px;display:flex">${I.check()}</span>`}</i>
          <span class="c" style="position:absolute;left:${cx - 30}px;width:60px;top:${cy + 26}px;font-size:12px;line-height:15px;${i ? 'color:#888' : 'font-weight:600'}">${t[0]}</span>`; }).join('')}</div>
      <div class="r" style="margin:12px 15px 0 0"><button data-act="guide" style="font-size:16px;height:28px">투자자성향 및 펀드 위험등급 안내 &gt;</button></div>
      <div style="margin:21px 16px 0"><button data-go="diagForm" class="btn o" style="height:60px;border-radius:14px;color:#111;font-weight:500">성향진단 다시하기</button></div>
      <p style="margin:18px 17px 0;font-size:13px;color:#777">투자자성향진단 사용 횟수 : 3회 중 1회 (금일 기준)</p>
      <div style="height:8px;background:${BG};margin-top:27px"></div><div style="margin-top:24px">${noteHead(true)}</div><div id="nBody">${notes}</div>
      <div style="margin:56px 16px 30px 18px"><button class="btn" data-go="diagResult">확인</button></div></div>`,
    acts: { notes: toggleNotes, dl() { App.toast('진단 결과 PDF 다운로드는 실제 서버가 필요합니다.', '테스트 동작'); },
      guide() { App.sheet(`<div class="sheet" style="padding:28px 20px 18px"><b style="font-size:20px">투자자성향 및 펀드 위험등급</b><button class="x" data-close style="right:14px;top:20px">${I.x(15)}</button>
        <div style="margin-top:14px;font-size:14px">${[['안정형', '6등급 (매우 낮은 위험)'], ['안정추구형', '5등급 이하'], ['위험중립형', '4등급 이하'], ['적극투자형', '2등급 이하'], ['공격투자형', '1등급 이하(전 등급)']].map((r) => `<div class="kv" style="line-height:36px;border-bottom:1px solid #eee"><span>${r[0]}</span><b>${r[1]}</b></div>`).join('')}</div>
        <p style="margin-top:10px;font-size:11px;color:#999">※ 화면 확인용 예시 데이터입니다.</p><button class="btn" data-close style="margin-top:14px">확인</button></div>`); } },
  });

  /* ---------- 밸런스 진단 결과 ---------- */
  const prod = (im, name) => `<button data-go="product" data-u class="row" style="width:100%;height:79px;text-align:left;align-items:flex-start;padding-top:9px">${img(im, 62, 60, 'border-radius:4px')}<span style="margin-left:8px;width:240px"><b style="display:block;font-size:16.5px;line-height:20px;font-weight:500">${name}</b>
      <span style="display:block;margin-top:3px;font-size:7.5px;line-height:10px">STOXX가 산출·발표하는 Stoxx Europe Total Market Defense Capped Index(Price Return, 원화환산)를 기초지수로 하여 1좌당 순자산가치의 ....</span><span style="display:block;margin-top:8px;font-size:7px;color:#888">● 높은위험 &nbsp;|&nbsp; 코드 : 000000</span></span></button>`;
  App.prodRow = prod;
  const rCard = (ic, iw, title, desc, list) => `<div class="card" style="margin:0 16px 44px 17px;border-radius:16px;padding:24px 21px ${list ? 14 : 27}px 22px;border-color:#d0d0d0">
      <div class="row" style="gap:10px;font-size:17px;color:#555;height:22px">${img(ic, iw)}${title}</div><div style="margin-top:8px;font-size:21px;line-height:30px;font-weight:700">0,000,000원 <span style="color:#888;font-weight:500">(00,00%p) 늘려요!</span></div>
      <p style="margin-top:9px;font-size:11.5px;line-height:14px">${desc}</p>${list ? `<div style="margin:24px 0 2px;font-size:15px;font-weight:500">추천상품</div>${list}` : ''}</div>`;
  const brSt = { mode: 'rec' };
  def('balResult', {
    title: '밸런스 진단 결과',
    html() {
      const rec = brSt.mode === 'rec', segs = rec ? [[25, '#12306e'], [22, '#aed3e6'], [53, '#3d86dc']] : [[8, '#12306e'], [12, '#aed3e6'], [80, '#3d86dc']];
      return `${hd('밸런스 진단 결과', { right: App.rBellGrid })}<div class="bd"><div style="background:#f4f5f9;padding:1px 0 46px;margin-top:4px">${timeRow('05.31 17:21', 24)}
        <div class="card" style="position:relative;margin:17px 16px 0 17px;height:274px;border-radius:16px;border-color:#d0d0d0">
          <span style="position:absolute;left:21px;top:22px;font-size:14.5px;color:#666">${S.user}님 진단유형</span><b style="position:absolute;left:21px;top:46px;font-size:17.5px;line-height:33px;font-weight:600">“안정형에 가까운 균형 투자자입니다”<br>해외자산 포함, 저수익 저위험</b>
          ${img('ic_shield', 50, 55, 'position:absolute;left:287px;top:87px')}<span style="position:absolute;left:21px;top:151px;font-size:14.5px;color:#555">최적 포트폴리오에 비해</span>
          <div class="row" style="position:absolute;left:23px;right:21px;top:180px;height:78px;border-radius:8px;background:#f4f5f9;text-align:center">
            <div style="flex:1"><div style="font-size:13.5px;color:#555">기대수익률</div><b style="display:block;margin-top:9px;font-size:19px;color:#0066b3;font-weight:600">높아요!</b></div><i style="width:1px;height:58px;background:#c9c9c9"></i>
            <div style="flex:1"><div style="font-size:13.5px;color:#555">투자위험</div><b style="display:block;margin-top:9px;font-size:19px;color:#f03e3e;font-weight:600">낮아요!</b></div></div></div>
        <div class="card" style="position:relative;margin:26px 16px 0 17px;height:447px;border-radius:16px;border-color:#d0d0d0">
          <span style="position:absolute;left:21px;top:21px;font-size:17px">분석 대상 자산</span><button data-go="asset" data-u class="row" style="position:absolute;left:21px;top:48px;height:40px;font-size:28px;font-weight:700;gap:14px">8,880,499원 ${I.chev('#111', 13)}</button>
          <button data-act="mode" data-v="cur" style="position:absolute;left:21px;top:106px;width:154px;height:35px;border-radius:4px;font-size:16px;--hr:4px;${rec ? 'background:#ddd;color:#555' : 'background:#0066b3;color:#fff;font-weight:500'}">현재 내 자산</button>
          <button data-act="mode" data-v="rec" style="position:absolute;left:187px;top:106px;width:161px;height:35px;border-radius:4px;font-size:16px;--hr:4px;${rec ? 'background:#0066b3;color:#fff;font-weight:500' : 'background:#ddd;color:#555'}">추천 분배</button>
          <button data-go="bal1" data-u class="row" style="position:absolute;right:19px;top:144px;height:26px;font-size:15.5px;gap:8px">다시 진단하기 ${I.refresh('#111', 12)}</button>
          <div style="position:absolute;left:37px;top:206px;width:176px;height:176px">${donut(segs, { size: 176, r: 67.5, w: 41, anim: 1 })}<span class="abs c" style="left:0;right:0;top:71px;font-size:14px;line-height:17px">${rec ? '추천' : '현재'}<br>비율</span></div>
          ${[['채권', '#aed3e6', segs[1][0]], ['주식', '#12306e', segs[0][0]], ['현금', '#3d86dc', segs[2][0]]].map((l, i) => `<span class="row" style="position:absolute;left:242px;top:${251 + i * 27}px;font-size:14px;gap:9px"><i style="width:11px;height:11px;border-radius:50%;background:${l[1]}"></i>${l[0]} &nbsp;${rec ? '00' : l[2]}%</span>`).join('')}
          <span style="position:absolute;right:19px;top:421px;font-size:12.5px;color:#888">기대수익 범위(최저 +2.4% ~ 최고 +3.2%)</span></div></div>
        <h2 style="margin:38px 21px 28px;font-size:24px;line-height:32px;font-weight:700">밸런스 진단 결과에요!</h2>
        ${rCard('ic_stock', 21, '주식 / Stock', '현재 자산 상황과 투자 기간을 고려할 때, 주식 투자는 장기적인 자산 성장을 위한 핵심 수단으로 적합합니다.', prod('hanaro_etf', 'HANARO 주식').repeat(3))}
        ${rCard('ic_bond', 17, '채권 / Bond', '현재 자산 상황에서는 채권이 포트폴리오의 변동성을 낮추고 안정성을 보완하는 역할을 합니다.', prod('hanaro_bond', 'HANARO 채권').repeat(3))}
        ${rCard('ic_cash', 18, '현금 / Cash', '현금은 예상치 못한 상황에 대비하고, 새로운 투자 기회를 빠르게 잡기 위한 기본 자산입니다.', '')}
        <div style="height:8px;background:${BG};margin-top:-18px"></div><div style="margin-top:25px">${noteHead(true)}</div><div id="nBody">${notes}</div>
        <div class="row" style="margin:44px 11px 28px 17px;gap:10px"><button class="btn" data-go="balIntro" style="background:#ccc;color:#888;font-weight:500">밸런스 진단 다시하기</button><button class="btn" data-go="resv1" style="font-weight:600">전문가 상담 신청하기</button></div></div>`;
    },
    acts: { notes: toggleNotes, mode(t) { brSt.mode = t.dataset.v; App.rerender(); } },
  });

  /* ---------- 자산진단 맞춤정보 입력 ---------- */
  const DG = S.diag = { income: '150만원 미만', spend: 0, life: '사회초년기' };
  const opt = (v, cur, act, w = 158) => `<button data-act="${act}" data-v="${v}" class="row" style="width:${w}px;height:52px;border-radius:4px;justify-content:center;gap:5px;font-size:16px;--hr:4px;${v === cur ? 'border:2px solid #0066b3;color:#0066b3;font-weight:600' : 'border:1px solid #d0d0d0;color:#999'}">${v === cur ? `<span style="width:15px;display:flex">${I.check('#0066b3')}</span>` : ''}${v}</button>`;
  def('diagForm', {
    title: '자산진단 맞춤정보',
    html: () => `<header class="hd" style="height:59px"><div class="t" style="font-weight:500;line-height:59px">자산진단 맞춤정조</div><button class="xbtn" data-go="asset" data-reset-off style="right:12px;top:9px">${I.x(18, '#111', 2.2)}</button></header>
      <div class="bd" style="background:${BG}"><h1 style="margin:40px 16px 0;font-size:22px;line-height:37px;font-weight:500">나의 자산진단을 위해<br>맞춤정보를 입력해주세요.</h1>
      <div class="card" style="margin:17px 16px 0 17px;border-radius:8px;padding:35px 19px 36px 20px;border-color:#d9d9d9">
        <div style="font-size:16px;line-height:24px;font-weight:600">매월 얼마나 소비하고 있나요?</div><div style="margin-top:3px;font-size:12.5px;color:#777">소득 정보를 입력하시면 정확한 자산진단이 가능합니다.</div>
        <div style="display:grid;grid-template-columns:158px 158px;gap:9px 10px;margin-top:11px">${['150만원 미만', '150~300만원', '300~500만', '500~800만원', '800~1000만원', '1000만원 이상'].map((v) => opt(v, DG.income, 'income')).join('')}</div>
        <i style="display:block;height:1px;background:#d9d9d9;margin-top:24px"></i>
        <div class="row" style="margin-top:29px;font-size:16px;line-height:24px;font-weight:600;gap:2px">매월 얼마나 소비하고 있나요?<span data-act="help" style="display:flex">${I.q(16)}</span></div>
        <label class="row" style="margin:16px 2px 0 3px;height:51px;border:1px solid #0066b3;border-radius:4px;padding:0 13px;font-size:16px"><input id="dSp" inputmode="numeric" value="${DG.spend || ''}" placeholder="0000" style="flex:1;min-width:0;text-align:right;border:0;outline:0;height:100%"><span style="margin:0 12px 0 6px">만원</span><span data-act="clr" style="display:flex;padding:3px;margin:-3px">${I.clr}</span></label>
        <div class="row" style="margin:13px 0 0 3px;gap:6px">${[['+10만', 10, 70], ['+50만', 50, 72], ['+100만', 100, 79], ['+300만', 300, 81]].map((c) => `<button data-act="add" data-v="${c[1]}" class="pchip" style="width:${c[2]}px;justify-content:center;height:26px;font-size:13.5px">${c[0]}</button>`).join('')}</div>
        <i style="display:block;height:1px;background:#d9d9d9;margin-top:25px"></i>
        <div class="row" style="margin-top:23px;font-size:16px;line-height:24px;font-weight:600;gap:2px">라이프사이클을 선택하세요.<span data-act="help2" style="display:flex">${I.q(16)}</span></div>
        <div style="display:grid;grid-template-columns:158px 158px;gap:9px 10px;margin-top:10px">${['사회초년기', '가족형성기', '자녀성장기', '은퇴기', '가족성숙기'].map((v) => opt(v, DG.life, 'life')).join('')}</div></div>
      <div style="margin:50px 16px 40px 17px"><button class="btn" data-act="ok">확인</button></div></div>`,
    init(el) { const a = $('#dSp', el); a.addEventListener('input', () => { a.value = a.value.replace(/\D/g, '').slice(0, 5); DG.spend = Number(a.value); }); },
    acts: {
      income(t) { DG.income = t.dataset.v; App.rerender(); }, life(t) { DG.life = t.dataset.v; App.rerender(); },
      clr(t, el) { DG.spend = 0; $('#dSp', el).value = ''; }, add(t, el) { DG.spend = Math.min(DG.spend + Number(t.dataset.v), 99999); $('#dSp', el).value = DG.spend; },
      help() { App.toast('한 달 평균 소비 금액(카드+현금)을 만원 단위로 입력합니다.'); }, help2() { App.toast('현재 생애 단계와 가장 가까운 항목을 선택합니다.'); },
      ok() { if (!DG.spend) return App.toast('매월 소비 금액을 입력해 주세요.'); App.go('invest'); }, /* Figma: 확인 → 투자자성향 진단 결과 */
    },
  });

  /* ---------- 자산진단결과 ---------- */
  const tag = (t, bg = '#eef1f8') => `<span style="display:inline-block;height:27px;line-height:27px;padding:0 15px;border-radius:6px;background:${bg};font-size:15px;color:#888;margin:0 8px 9px 0">${t}</span>`;
  def('diagResult', {
    title: '자산진단결과',
    html: () => `${hd('자산진단결과', { right: App.rBellGrid })}<div class="bd" style="background:${BG}">${timeRow('05.31 16:52', 20)}
      <div class="card" style="margin:9px 16px 0 17px;border-radius:8px;padding:19px 13px 22px;min-height:154px;border-color:#d9d9d9"><div style="font-size:21px;line-height:30px;font-weight:500;margin-bottom:8px">${S.user}님의 맞춤정보</div>
        ${tag('#20대')}${tag('#월소득 ' + DG.income)}${tag('#월소득 ' + (DG.spend || 30) + '만원', '#f1eee6')}</div>
      <div class="card" style="position:relative;margin:27px 16px 0 17px;border-radius:8px;padding:29px 14px 45px;border-color:#d9d9d9"><div style="font-size:16px;line-height:22px;font-weight:600">나의 자산 분석</div>
        <div style="display:grid;grid-template-columns:163px 163px;gap:7px 10px;margin-top:17px">
          ${[['또래비교', '또래부자 평균보다<br><b style="color:#0066b3;font-weight:600">00,000원</b><br>많아요', '#dfe8fb', 'd_bars', 35, 50, 171, ''], ['자산 편중 상태', '<span style="color:#0066b3">안전자산</span> 비중이<br><b style="color:#0066b3;font-weight:600">100%</b>예요', '#ebebeb', 'd_pie', 44, 42, 171, ''],
            ['투자수익률', '고수와의 비교를<br>위해 자산을 연결해<br>보세요', '#ebebeb', 'd_crown', 50, 39, 197, '자산연결 &gt;'], ['여유자금', '여유자금이<br>최대권장보다<br><b style="color:#0066b3;font-weight:600">000%</b> 많아요', '#dfe8fb', 'd_coins', 43, 31, 197, '']].map((c) =>
            `<button data-act="${c[7] ? 'link' : 'tile'}" data-v="${c[0]}" style="position:relative;height:${c[6]}px;border-radius:6px;background:${c[2]};text-align:left;--hr:6px"><b style="position:absolute;left:11px;top:24px;font-size:17px;line-height:22px;font-weight:500">${c[0]}</b>
              <span style="position:absolute;left:11px;top:52px;font-size:13.5px;line-height:21px;color:#555">${c[1]}</span>${c[7] ? `<span style="position:absolute;left:11px;bottom:22px;font-size:13.5px;color:#555">${c[7]}</span>` : ''}${img(c[3], c[4], c[5], 'position:absolute;right:13px;bottom:15px')}</button>`).join('')}</div>
        <button data-act="tile" data-v="금융·부채 비율" style="display:block;position:relative;margin-top:7px;width:331px;height:148px;border-radius:6px;background:#dfe8fb;text-align:left;--hr:6px"><b style="position:absolute;left:11px;top:24px;font-size:17px;line-height:22px;font-weight:500">금융·부채 비율</b>
          <span style="position:absolute;left:11px;top:52px;font-size:13.5px;line-height:21px;color:#555">금융자산은 총자산 중 <b style="color:#0066b3;font-weight:600">0.0%</b>이고<br>부채비율은 총자산 대비 <b style="color:#f03e3e;font-weight:600">0.0%</b>예요</span>${img('d_donut', 73, 67, 'position:absolute;right:22px;top:53px')}</button>
        <i style="position:absolute;left:122px;bottom:-21px;width:0;height:0;border:50px solid transparent;border-top:21px solid #fff;border-bottom:0"></i>
        <button data-act="link" class="row" style="position:absolute;right:-1px;bottom:-21px;height:38px;padding:0 14px 0 16px;border-radius:19px;background:#0066b3;color:#fff;font-size:16px;font-weight:500;gap:4px;z-index:2;--hr:19px">${I.plus('#fff', 13)}자산연결</button></div>
      <div style="position:relative;margin:40px 16px 0 18px;height:112px;border-radius:8px 8px 0 0;background:#0066b3;color:#fff"><b style="position:absolute;left:21px;top:18px;font-size:19px;line-height:26px;font-weight:500">솔루션 제안</b>
        <span style="position:absolute;left:21px;top:54px;font-size:13px;line-height:21px">AI 전문가가 분석한<br>내 투자스타일을 알려드려요!</span>${img('d_crownb', 76, 59, 'position:absolute;right:17px;top:27px')}</div>
      <div class="c" style="margin:-3px 16px 0 18px;border-radius:8px;background:#fff;padding:22px 14px 22px;position:relative"><b style="font-size:21px;line-height:30px;color:#0066b3;font-weight:600">예능인</b><div style="margin-top:6px;font-size:15.5px">다방면으로 투자할 가능성이 높은 Style</div>
        <div style="text-align:left;margin-top:17px;margin-bottom:-9px">${['#새로운 경험을 추구하는', '#조화로운', '#수익을 끝없이 갈망하는', '#다이나믹'].map((t) => tag(t).replace('font-size:15px', 'font-size:15.5px;color:#999')).join('')}</div></div>
      <div style="position:relative;margin:29px 17px 0;height:180px;border-radius:8px;background:#dfe8fb"><div style="position:absolute;left:17px;top:15px;font-size:17px;line-height:21px"><span style="color:#0066b3">${S.user} 님</span>에게는<br>아래 상품을 추천해요</div>${img('d_coins2', 43, 31, 'position:absolute;right:23px;top:21px')}
        <div style="position:absolute;left:16px;right:16px;top:71px;height:87px;border-radius:6px;background:#fff;padding:5px 8px 0">${App.prodRow('hanaro_etf', 'HANARO 주식')}</div></div>
      <div style="margin:35px 17px 28px"><button class="btn" data-go="aiProd">추천상품 더보기</button></div></div>`,
    acts: { link() { if (S.mydata) App.toast('추가 자산 연결은 실제 마이데이터 서버 연동이 필요합니다.', '테스트 동작'); else App.mdPopup(); },
      tile(t) { App.toast(`‘${t.dataset.v}’ 상세 분석 화면은 디자인에 없습니다.`, '프로토타입 안내'); } },
  });

  /* ---------- 소비모아보기 ---------- */
  const wcard = (inner, st = '') => `<div style="margin:0 16px 22px 17px;border-radius:8px;background:#fff;position:relative;${st}">${inner}</div>`;
  const recRow = (n, d, a, ic = 'ic_wy') => `<div class="row" style="height:96px;align-items:flex-start;padding-top:23px">${img(ic, 35, 34, 'margin-top:5px')}<span style="margin-left:9px"><b style="display:block;font-size:16px;line-height:22px;font-weight:600">${n}</b><span style="display:block;margin-top:5px;font-size:13.5px;color:#888">${d} &nbsp;<span style="color:#ccc">|</span> MG새마을금고</span></span><span class="sp"></span><b style="font-size:16px;line-height:22px;font-weight:600">${a}</b></div>`;
  const spSt = { hide: false, day: 6 };
  def('spend', {
    title: '소비모아보기',
    html() { const m = (v) => (spSt.hide ? '***' : v);
      return `${hd('소비모아보기', { right: App.rBellGrid })}<div class="bd" style="background:${BG}">${timeRow('05.31 16:52', 20)}
      <div class="row" style="margin:20px 16px 27px 17px;height:52px;border-radius:8px;background:#fff;font-size:15px"><button data-act="hide" class="row" style="flex:1;height:52px;justify-content:center;gap:8px"><svg width="18" height="15" viewBox="0 0 18 15" fill="none" stroke="#555" stroke-width="1.2"><rect x="1" y="3" width="13" height="10" rx="1.5"/><path d="M4 6h7M4 9h4M2 14 16 1"/></svg>${spSt.hide ? '자산 보이기' : '자산 가리기'}</button><i style="width:1px;height:10px;background:#ccc"></i>
        <button data-go="diagForm" data-u class="row" style="flex:1;height:52px;justify-content:center;gap:7px">${I.gear('#888', 17)}나의 한달 설정하기</button></div>
      ${wcard(`<div class="row" style="padding:27px 20px 0 22px;height:53px;font-size:16px;gap:5px">이번 달 총 소비 ${I.gear('#ccc', 16)}<span class="sp"></span><button data-act="month" class="row" style="font-size:15px;gap:6px;border-bottom:1px solid #333;line-height:19px">0월 <span style="color:#555">(00.00~00.00)</span></button><span style="margin-left:5px;display:flex">${I.down('#333', 11)}</span></div>
        <div style="padding:17px 22px 28px;font-size:28px;line-height:40px;font-weight:700;letter-spacing:.01em">${m('00,000')} <small style="font-size:15px">원</small></div>`)}
      ${wcard(`<div class="row" style="padding:20px 20px 0 22px;height:44px"><b style="font-size:17px;font-weight:600">한눈에 보는 한달 가계부</b><span class="sp"></span><button data-act="month" class="row" style="font-size:13px;color:#888;gap:4px;margin-top:22px">2020.00 ${I.down('#aaa', 10, 1.2)}</button></div>
        <div style="padding:6px 22px 0;font-size:15px;line-height:22px;font-weight:500">예산 <span style="color:#0066b3">000만원</span> 보다<br><span style="font-size:13.5px"><span style="color:#0066b3">${m('00,000')}원</span> 적게 섰어요</span></div>
        <div class="row" style="padding:15px 0 12px 22px;align-items:flex-start"><div>${donut([[23, '#9db3d8'], [16, '#5b7fe0'], [26, '#aedcec'], [14, '#f8f37c'], [21, '#4688dc']], { size: 152, r: 54, w: 44, anim: 1, rot: -70 })}</div>
          <div style="margin:29px 0 0 30px">${[['식비', '#aedcec'], ['쇼핑', '#5b7fe0'], ['교통', '#f8f37c'], ['문화/여가', '#4688dc'], ['기타', '#9db3d8']].map((l) => `<div class="row" style="height:22px;font-size:12px;font-weight:500;gap:14px"><i style="width:6px;height:6px;border-radius:50%;background:${l[1]}"></i><span style="min-width:${l[0].length > 3 ? 47 : 21}px">${l[0]}</span><span style="font-weight:400;color:#777">${m('00,000')}원</span></div>`).join('')}</div></div>`)}
      <button data-todo="카드 분석 화면은 디자인에 없습니다." style="display:block;position:relative;margin:9px 16px 21px 17px;width:367px;height:109px;border-radius:8px;background:#d9e8ff;text-align:left;--hr:8px"><b style="position:absolute;left:20px;top:22px;font-size:16px;line-height:22px;font-weight:500">내 카드 분석</b>
        <span style="position:absolute;left:20px;top:51px;font-size:13.5px;line-height:19px;color:#777">나는 얼마나 쓰고 내 또래는 얼마나 쓰고<br>있을까?</span>${img('ill_cardhand', 74, 71, 'position:absolute;left:270px;top:15px')}</button>
      ${wcard(`<button data-act="where" class="row" style="width:100%;padding:28px 20px 0 22px;height:52px;font-size:17px;font-weight:600;text-align:left">어디에 많이 썼을까?<span class="sp"></span>${I.chev('#111', 16, 2)}</button>
        <div style="padding:13px 22px 0;font-size:15px;font-weight:500"><span style="color:#0066b3">주거/통신</span>에 가장 많이 소비하고 있어요</div>
        <div class="c" style="margin-top:29px"><span style="position:relative;display:inline-block;width:38px;height:26px;border-radius:3px;background:#0066b3;color:#fff;font-size:15px;font-weight:700;line-height:26px">1위<i style="position:absolute;left:14px;bottom:-6px;border:5px solid transparent;border-top:6px solid #0066b3;border-bottom:0"></i></span></div>
        <div style="height:118px;position:relative">${img('ill_rank_home', 115, 102, 'position:absolute;left:126px;top:16px;mix-blend-mode:multiply')}</div><div class="c" style="padding-bottom:17px;font-size:18px">주거/통신 ${m('00,000')}원</div>`, 'margin-bottom:29px')}
      ${wcard(`<b style="display:block;padding:28px 0 0 20px;font-size:17px;line-height:24px;font-weight:600">언제 썼을까?</b>${img('ic_note', 38, 44, 'position:absolute;right:17px;top:25px')}
        <div style="padding:14px 20px 0;font-size:15px;font-weight:600">오늘은 절약을 잘 실천하고 계시네요!</div>
        <div class="row" style="padding:17px 21px 0 21px;justify-content:space-between">${['월', '화', '수', '목', '금', '토', '일'].map((d, i) => `<button data-act="day" data-v="${i}" style="width:42px;height:72px;border-radius:21px;--hr:21px;${i === spSt.day ? 'background:#0066b3;color:#fff' : ''}"><span style="display:block;font-size:14px;${i === spSt.day ? '' : 'color:#777'}">${d}</span><b style="display:block;margin-top:4px;font-size:16px;font-weight:500">00</b></button>`).join('')}</div>
        <div style="padding:40px 20px 0;font-size:11.5px">5월 ${25 + spSt.day}일 ${['월', '화', '수', '목', '금', '토', '일'][spSt.day]}요일</div>
        <button data-go="history" data-u class="row" style="width:100%;padding:0 20px;height:84px;text-align:left">${img('ic_payee', 34, 34)}<span style="margin-left:9px"><span style="display:block;font-size:16px;line-height:22px">이농부</span><span style="display:block;margin-top:5px;font-size:13px;color:#888">12:49 &nbsp;<span style="color:#ccc">|</span>&nbsp; 자립예탁금</span></span><span class="sp"></span><span style="font-size:16px;color:#888;margin-top:-24px">-10원</span></button>
        <button data-go="history" data-u class="row" style="margin:14px auto 0;height:30px;font-size:14px;color:#666;gap:9px;padding:0 10px">이번 달 전체내역 보기 ${I.chev('#666', 10, 1.4)}</button><div style="height:22px"></div>`, 'margin-bottom:21px')}
      ${wcard(`<button data-go="recur" class="row" style="width:100%;padding:27px 20px 0 21px;height:54px;font-size:17px;font-weight:600;text-align:left">매달 나가는 나의 정기지출은?<span class="sp"></span>${I.chev('#111', 16, 2)}</button>
        <div style="padding:14px 21px 0;font-size:14.5px;font-weight:500">총 <span style="color:#0066b3;font-weight:600">${m('000,000')}</span> 원 예상해요</div>
        <div style="padding:10px 19px 10px 20px">${[['○○○점', '14일 예상', '0,000원'], ['○○○점', '20일 예상', '0,000원'], ['○○○점', '21일 예상', '0,000원']].map((r, i) => `<div style="${i < 2 ? 'border-bottom:1px solid #555' : ''}">${recRow(r[0], r[1], m(r[2]))}</div>`).join('')}</div>`, 'margin-bottom:19px')}
      ${wcard(`<button data-todo="카드 결제예정금액 화면은 디자인에 없습니다." class="row" style="width:100%;height:104px;padding:0 20px 0 23px;text-align:left;--hr:8px">${img('ic_cardpay', 26, 29)}<span style="margin-left:21px"><b style="display:block;font-size:17px;line-height:24px;font-weight:600">다가오는 카드 결제예정금액은?</b><b style="display:block;margin-top:3px;font-size:17px;color:#0066b3;font-weight:600">0원</b></span><span class="sp"></span><span style="margin-top:-26px">${I.chev('#111', 16, 2)}</span></button>`)}
      <div style="height:8px"></div></div>`; },
    acts: { hide() { spSt.hide = !spSt.hide; App.rerender(); }, day(t) { spSt.day = Number(t.dataset.v); App.rerender(); },
      month() { App.toast('조회 월 변경은 실제 거래 데이터(서버)가 필요합니다.', '테스트 동작'); }, where() { App.toast('카테고리별 소비 상세 화면은 디자인에 없습니다.', '프로토타입 안내'); } },
  });

  /* ---------- 정기지출관리 ---------- */
  const rcSt = { all: false, hidden: false };
  def('recur', {
    title: '정기지출관리',
    html() { const n = rcSt.all ? 9 : 3;
      return `${hd('정기지출관리', { right: `<button data-go="menu" aria-label="전체메뉴">${I.grid}</button>` })}<div class="bd" style="background:${BG}">
      <div style="position:relative;margin:16px 16px 0 17px;height:125px;border-radius:8px;background:#fff;box-shadow:0 1px 5px rgba(0,0,0,.1)"><span style="position:absolute;left:23px;top:27px;font-size:17px;line-height:24px;font-weight:500">매달 나가는 나의 정기지출은?</span>
        <b style="position:absolute;left:21px;top:63px;font-size:27px;line-height:38px;font-weight:700"><small style="font-size:16px;margin-right:6px">총</small>000,000 <small style="font-size:16px">원</small></b>${img('ill_wallet', 60, 60, 'position:absolute;left:283px;top:32px')}</div>
      <div style="position:relative;margin:18px 16px 0 17px;border-radius:8px;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.14);z-index:1;padding:0 19px 6px 20px">
        <div class="row" style="height:62px;padding-top:21px;font-size:17px;font-weight:500">생활지출 <span style="color:#777;margin-left:5px">9</span>건<span class="sp"></span><span style="color:#0066b3">000,000</span>&nbsp;원</div>
        ${Array.from({ length: n }, (_, i) => `<div style="${i < n - 1 ? 'border-bottom:1px solid #555' : ''};margin-top:${i ? 0 : -18}px">${recRow('□□□점', '14일 예상', '19,800원')}</div>`).join('')}</div>
      <button data-act="all" class="row" style="margin:-6px 16px 0 17px;width:367px;height:58px;padding-top:6px;border-radius:0 0 8px 8px;background:#d8dbe2;justify-content:center;gap:10px;font-size:15px;--hr:0 0 8px 8px">${rcSt.all ? '접기' : '전체보기'} <span style="display:flex;${rcSt.all ? 'transform:rotate(180deg)' : ''}">${I.down('#333', 11)}</span></button>
      <p class="c" style="margin-top:23px;font-size:15.5px;color:#888">혹시 보이지 않는 정기지출이 있나요?</p>
      <div class="row" style="margin:21px 16px 0 17px;height:52px;border-radius:8px;background:#fff;font-size:15px"><button data-act="hidden" class="row" style="flex:1;height:52px;justify-content:center;gap:9px"><svg width="16" height="13" viewBox="0 0 16 13" fill="none" stroke="#888" stroke-width="1.1"><path d="m1 7 7-5 7 5-7 5-7-5ZM5 4.8l7 5"/></svg>숨긴 내역 보기</button><i style="width:1px;height:10px;background:#555"></i>
        <button data-act="load" class="row" style="flex:1;height:52px;justify-content:center;gap:9px"><svg width="14" height="15" viewBox="0 0 14 15" fill="none" stroke="#888" stroke-width="1.1"><rect x="1" y="1" width="12" height="13" rx="1.5"/><path d="M4 5h6M4 8h6M4 11h3"/></svg>정기지출 불러오기</button></div>
      ${rcSt.hidden ? `<div style="margin:10px 16px 0 17px;padding:0 20px;border-radius:8px;background:#fff">${recRow('△△△ 구독', '25일 예상', '9,900원')}</div>` : ''}
      <div style="margin:21px 16px 0 17px;border-radius:8px;background:#fff;padding:28px 0 26px"><div style="padding:0 22px;font-size:16.5px;line-height:22px">나의 정기지출 유형별 비중은?</div>
        <div style="padding:13px 21px 0;font-size:23px;line-height:33px;font-weight:700">보험료 유형이<br><span style="color:#0066b3">00.00%</span> 로 가장 높아요</div>
        <div class="row" style="margin-top:33px;font-size:17px;text-align:center"><span style="width:187px">나</span><button data-act="peer" class="row" style="margin-left:39px;gap:8px;border-bottom:1px solid #333;line-height:22px;font-size:17px">20대여성</button><span style="margin-left:8px;display:flex">${I.down('#333', 11)}</span></div>
        <div class="row" style="margin-top:26px"><div style="margin-left:55px">${donut([[100, '#9db3d8']], { size: 78, r: 26.5, w: 25, anim: 1 })}</div><div style="margin-left:100px">${donut([[14, '#f8f37c'], [16, '#4688dc'], [20, '#aedcec'], [20, '#5b7fe0'], [16, '#6f9bd6'], [14, '#9db3d8']], { size: 78, r: 26.5, w: 25, anim: 1 })}</div></div>
        <div style="display:grid;grid-template-columns:101px 124px 1fr;margin:47px 0 0 33px;row-gap:9px;font-size:14.5px">${[['보험료', '#9db3d8'], ['공과금', '#f8f37c'], ['통신요금', '#4688dc'], ['교통비', '#6f9bd6'], ['구독서비스', '#aedcec'], ['그외', '#5b7fe0']].map((l) => `<span class="row" style="gap:8px"><i style="width:8px;height:8px;border-radius:50%;background:${l[1]}"></i>${l[0]}</span>`).join('')}</div></div>
      <div style="margin:21px 16px 0 17px;border-radius:8px;background:#fff;padding:29px 22px 35px;position:relative"><div style="font-size:17px;line-height:36px"><button data-act="peer" style="border-bottom:1px solid #333;line-height:22px;font-size:17px">20대 여성</button> <span style="display:inline-flex;margin:0 0 0 6px">${I.down('#333', 11)}</span>에게<br>가장 인기 있는 구독서비스는?</div>
        <div class="c" style="margin-top:17px"><span style="position:relative;display:inline-block;width:35px;height:26px;border-radius:3px;background:#0066b3;color:#fff;font-size:14px;font-weight:700;line-height:26px">1위<i style="position:absolute;left:12px;bottom:-6px;border:5px solid transparent;border-top:6px solid #0066b3;border-bottom:0"></i></span>
          <div style="margin:22px auto 0;width:34px">${img('ic_netflix', 34, 39)}</div><b style="display:inline-block;margin-top:16px;padding:0 6px;font-size:17px;font-weight:500;box-shadow:inset 0 -9px 0 #c9f1dc">넷플릭스</b></div>
        <div class="row" style="margin-top:20px;gap:65px">${[2, 3].map((r) => `<span class="row" style="gap:9px;font-size:15.5px;align-items:flex-start">${img('ic_netflix', 34, 39)}<span><i style="display:block;width:37px;height:20px;border:1px solid #0066b3;border-radius:3px;font-style:normal;font-size:12.5px;line-height:18px;text-align:center;color:#0066b3">${r}위</i><span style="display:block;margin-top:8px">넷플릭스</span></span></span>`).join('')}</div></div>
      <div style="margin:22px 16px 0 17px;border-radius:8px;background:#fff;padding:26px 20px 30px 22px"><div style="font-size:17px;line-height:24px;font-weight:500">구독서비스 혜택 받는 카드가 궁금하다면?</div><i style="display:block;height:1px;background:#d9d9d9;margin-top:22px"></i>
        <button data-todo="카드 상세 화면은 디자인에 없습니다." class="row" style="width:100%;margin-top:23px;text-align:left;align-items:flex-start"><span style="font-size:17px;line-height:27px;font-weight:500">구독서비스 5% 할인부터<br>별별 혜택을 다 주는 카드!</span><span class="sp"></span>${img('card_ein', 60, 38, 'margin-top:6px;margin-right:8px')}</button>
        <div style="margin-top:12px">${['#해시태그01', '#해시태그02'].map((t) => `<span style="display:inline-block;height:26px;line-height:26px;padding:0 9px;border-radius:5px;background:#f3f4f8;font-size:14.5px;margin-right:10px">${t}</span>`).join('')}</div>
        <p style="margin-top:14px;font-size:13px">준법감시인심의필 <span style="color:#444">2025-6205(2025.12.23~2026.12.31.)</span></p>${pdots(4, 25, 1)}</div>
      <div style="height:30px"></div></div>`; },
    acts: { all() { rcSt.all = !rcSt.all; App.rerender(); }, hidden() { rcSt.hidden = !rcSt.hidden; App.rerender(); },
      load() { App.toast('정기지출 불러오기는 실제 마이데이터 서버 연동이 필요합니다.', '테스트 동작'); }, peer() { App.toast('비교 대상 변경은 실제 통계 데이터(서버)가 필요합니다.', '테스트 동작'); } },
  });

  /* ---------- 상담봇 ---------- */
  const SV = [['조회', 'cb_1'], ['상품', 'cb_2'], ['환율', 'cb_3'], ['FAQ', 'cb_4'], ['변경/발급', 'cb_5'], ['관심사테스트', 'cb_6']];
  const IT = [['내집마련', 'ci_1'], ['결혼준비', 'ci_2'], ['여행', 'ci_3'], ['자동차', 'ci_4'], ['건강관리', 'ci_5'], ['투자/증권', 'ci_6']];
  const bot = `<div style="margin:18px 0 0 16px">${img('bot', 45, 45)}</div>`;
  const bb = (t, mt = 19) => `<div style="margin:${mt}px 0 0 16px"><span style="display:inline-block;max-width:340px;padding:12px 15px 13px;border-radius:19px;background:#fff;font-size:15px;line-height:20px">${t}</span></div>`;
  const ub = (t) => `<div class="row" style="justify-content:flex-end;align-items:flex-end;margin:19px 16px 0 0;gap:6px"><span style="font-size:10px;color:#777">오전 00:00</span><span style="display:inline-block;padding:12px 26px 13px;border-radius:19px 4px 19px 19px;background:#0066b3;color:#fff;font-size:15px;line-height:20px">${t}</span></div>`;
  const grid = (list, act, sel) => `<div style="margin:19px 59px 0 16px;border-radius:16px;background:#fff;padding:20px 12px 6px;display:grid;grid-template-columns:repeat(3,1fr)">${list.map((s) => `<button data-act="${act}" data-v="${s[0]}" style="height:105px;display:flex;flex-direction:column;align-items:center;font-size:14px;border-radius:12px;--hr:12px;${sel && sel.includes(s[0]) ? 'box-shadow:inset 0 0 0 2px #0066b3;background:#e8f3fc' : ''}"><span style="height:58px;display:flex;align-items:center">${img(s[1], null, 37)}</span><span style="margin-top:8px">${s[0]}</span></button>`).join('')}</div>`;
  const chat = { log: [], sel: [], phase: 0 };
  function chatReset() { chat.log = [bot, bb('안녕하세요. ' + S.user + '님!', 17), bb('아래 중 원하시는 서비스가 있으신가요?'), '%SV%']; chat.sel = []; chat.phase = 0; }
  const linkBtn = (t, go) => `<div style="margin:10px 0 0 16px"><button data-go="${go}" class="row" style="height:38px;padding:0 16px;border-radius:19px;background:#fff;border:1px solid #0066b3;color:#0066b3;font-size:14px;font-weight:500;gap:8px;--hr:19px">${t} ${I.chev('#0066b3', 10)}</button></div>`;
  def('chat', {
    title: '상담봇',
    html() { if (!chat.log.length) chatReset();
      return `<header class="hd" style="height:59px"><button class="abs" data-act="help" style="left:20px;top:14px;width:30px;height:30px;display:flex;align-items:center;justify-content:center">${I.q(24)}</button><div class="t" style="font-size:17px;font-weight:600;line-height:57px">상담봇</div><button class="xbtn" data-home style="right:15px;top:10px">${I.x(18, '#777', 2)}</button></header>
      <div class="bd" id="cb" style="background:#f1f1f1"><div class="c" style="padding-top:25px"><span style="display:inline-block;height:24px;line-height:24px;padding:0 18px;border-radius:12px;background:#8f8f8f;color:#fff;font-size:12px">2000년 00월 00일 월요일</span></div>
        <div id="cl">${chat.log.map((h) => h === '%SV%' ? grid(SV, 'svc') : h === '%IT%' ? `<div id="itBox">${grid(IT, 'it', chat.sel)}${chat.phase === 1 ? `<div style="margin:10px 0 0 16px"><button data-act="itOk" class="btn" style="width:325px;height:44px;font-size:15px;border-radius:12px">선택 완료</button></div>` : ''}</div>` : h).join('')}</div><div style="height:96px"></div></div>
      <form id="cf" class="row" style="position:absolute;left:14px;right:14px;bottom:17px;height:42px;border-radius:21px;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.2);padding:0 14px 0 19px;z-index:5">
        <button type="button" data-act="attach" style="display:flex;padding:5px;margin-left:-5px">${I.plus('#444', 15)}</button><input id="ci" placeholder="메세지를 입력해주세요." autocomplete="off" style="flex:1;min-width:0;margin-left:9px;border:0;outline:0;font-size:15px;height:100%;background:none">
        <button type="button" data-act="mic" style="display:flex;padding:5px">${I.mic}</button></form>`; },
    init(el) { const b = $('#cb', el); if (el._keep != null || chat.log.length > 4) b.scrollTop = b.scrollHeight;
      $('#cf', el).addEventListener('submit', (e) => { e.preventDefault(); const i = $('#ci', el), v = i.value.trim(); if (!v) return; say(ub(v.replace(/</g, '&lt;')));
        reply(/이체|송금/.test(v) ? [bb('계좌이체 화면으로 안내해 드릴게요.', 17), linkBtn('계좌이체 바로가기', 'tx1')] : /예금|적금|상품/.test(v) ? [bb('금융상품몰에서 상품을 확인해 보세요.', 17), linkBtn('금융상품몰 바로가기', 'mall')] : /예약|상담/.test(v) ? [bb('영업점 방문 상담을 예약할 수 있어요.', 17), linkBtn('방문 상담 예약', 'resv1')]
          : [bb('문의하신 내용은 상담원 연결이 필요합니다.<br>실시간 상담은 실제 서버 연동 후 제공됩니다. (테스트 응답)', 17)]); }); },
    acts: {
      help() { App.toast('상담봇에게 궁금한 점을 입력하거나 아이콘을 선택해 주세요.'); }, attach() { App.toast('파일 첨부는 실제 기기·서버 연동이 필요합니다.', '테스트 동작'); }, mic() { App.toast('음성 입력은 실제 기기 마이크 권한이 필요합니다.', '테스트 동작'); },
      svc(t) { const v = t.dataset.v;
        if (v === '관심사테스트') { say(ub('관심사 테스트 진행')); chat.phase = 1; chat.sel = []; chat.log = chat.log.filter((h) => h !== '%IT%'); reply([bb('현재 관심사를 체크해주세요.(중복선택 가능)', 17), '%IT%']); return; }
        say(ub(v)); reply({ '조회': [bb('거래내역 조회 화면으로 안내해 드릴게요.', 17), linkBtn('거래내역 바로가기', 'history')], '상품': [bb(S.user + '님께 맞는 상품을 확인해 보세요.', 17), linkBtn('AI 맞춤상품 바로가기', 'aiProd')],
          '환율': [bb('오늘의 환율(예시)<br>USD 1,380.50원 · JPY(100) 905.20원 · EUR 1,495.10원<br><small style="color:#999">실시간 환율은 서버 연동이 필요합니다.</small>', 17)], 'FAQ': [bb('자주 묻는 질문<br>· 이체 한도는 어떻게 변경하나요?<br>· 인증서를 재발급하려면?<br>· 비밀번호 오류 해제 방법', 17)],
          '변경/발급': [bb('증명서 발급·정보 변경은 영업점 또는 실제 서비스에서 가능합니다.', 17), linkBtn('방문 상담 예약', 'resv1')] }[v]); },
      it(t) { if (chat.phase !== 1) return; const v = t.dataset.v; chat.sel = chat.sel.includes(v) ? chat.sel.filter((x) => x !== v) : [...chat.sel, v]; keep(); },
      itOk() { if (!chat.sel.length) return App.toast('관심사를 1개 이상 선택해 주세요.'); chat.phase = 2; say(ub(chat.sel.join(', ')));
        reply([bb(S.user + '님의 관심사를 확인하였습니다.', 17), bb(S.user + '님을 위한 상품을 아래와 같이 추천드립니다.'), `<div class="hs" style="margin-top:19px;padding:0 0 4px 16px;gap:10px">${App.bigCard(1)}${App.bigCard(1)}${App.bigCard(0)}<i style="flex:none;width:6px"></i></div>`]); },
    },
  });
  App.resetChat = () => { chat.log = []; chat.sel = []; chat.phase = 0; };
  function keep() { App.el._keep = 1; const b = App.el.querySelector('#cb'), y = b.scrollTop; App.rerender(); App.el.querySelector('#cb').scrollTop = y; }
  function say(h) { chat.log.push(h); refresh(); }
  function reply(arr) { chat.log.push(bot + '<div class="typing" style="margin:10px 0 0 16px"><span style="display:inline-block;padding:10px 16px;border-radius:19px;background:#fff;color:#999">···</span></div>'); refresh();
    setTimeout(() => { chat.log.pop(); chat.log.push(bot, ...arr); if (App.cur === 'chat') refresh(); }, 650); }
  function refresh() { if (App.cur !== 'chat') return; App.rerender(); const b = App.el.querySelector('#cb'); b.scrollTop = b.scrollHeight; }

  /* ---------- (보완 화면) 거래내역 — 디자인에 없어 기존 스타일로 추가 ---------- */
  const hSt = { f: '전체', q: '' };
  def('history', {
    title: '거래내역(보완)',
    html() { const list = App.data.history.filter((h) => (hSt.f === '전체' || (hSt.f === '입금' ? h.a > 0 : h.a < 0)) && (!hSt.q || h.n.includes(hSt.q)));
      return `${hd('거래내역', { right: App.rHome })}<div class="bd" style="background:${BG}">
      <div style="position:relative;margin:16px 16px 0 17px;height:150px;border-radius:14px;background:#fff;border:1px solid #d9d9d9">${img('ic_nh40', 39, 39, 'position:absolute;left:18px;top:19px')}
        <div class="abs" style="left:63px;top:18px;font-size:17px;line-height:22px;font-weight:500">자립예탁금</div><div class="abs" style="left:63px;top:41px;font-size:14px">농협은행 000-0000-0000-00</div>
        <div class="abs c" style="left:0;right:0;top:86px;font-size:28px;line-height:40px;font-weight:700">${won(S.balance)}원</div></div>
      <label class="row" style="margin:16px 16px 0 17px;height:34px;border-radius:17px;border:1px solid #d9d9d9;background:#fff;padding-left:23px"><input id="hq" value="${hSt.q}" placeholder="거래 내용 검색" autocomplete="off" style="flex:1;min-width:0;border:0;outline:0;font-size:13.5px;height:100%;background:none"><i style="width:1px;height:22px;background:#ccc"></i>
        <span data-act="search" style="width:56px;height:32px;display:flex;align-items:center;justify-content:center;--hr:0 17px 17px 0">${I.search('#555', 18)}</span></label>
      <div class="chips" style="margin:16px 17px 0">${['전체', '입금', '출금'].map((c) => `<button class="chip ${c === hSt.f ? 'on' : ''}" data-act="f" data-v="${c}">${c}</button>`).join('')}</div>
      <div style="margin:16px 16px 0 17px;border-radius:8px;background:#fff;padding:6px 20px 10px">${list.map((h, i) => `<div style="${i ? 'border-top:1px solid #eee' : ''}"><div style="padding-top:14px;font-size:11.5px;color:#555">${h.d}</div>
        <div class="row" style="height:64px">${img('ic_payee', 34, 34)}<span style="margin-left:9px"><span style="display:block;font-size:16px;line-height:22px">${h.n}</span><span style="display:block;margin-top:3px;font-size:13px;color:#888">${h.t} &nbsp;<span style="color:#ccc">|</span>&nbsp; ${h.m}</span></span><span class="sp"></span>
        <b style="font-size:16px;font-weight:500;color:${h.a > 0 ? '#0066b3' : '#555'}">${h.a > 0 ? '+' : ''}${won(h.a)}원</b></div></div>`).join('') || '<p class="c" style="padding:40px 0;color:#999;font-size:14px">조건에 맞는 거래내역이 없습니다.</p>'}</div>
      <p class="c" style="margin:14px 0 24px;font-size:11.5px;color:#999">디자인에 없는 화면을 기존 스타일로 보완했습니다. (테스트 데이터)</p></div>
      <div class="ft"><button class="btn" data-go="tx1">이체하기</button></div>`; },
    init(el) { const q = $('#hq', el); q.addEventListener('keydown', (e) => { if (e.key === 'Enter') { hSt.q = q.value.trim(); App.rerender(); } }); },
    acts: { f(t) { hSt.f = t.dataset.v; App.rerender(); }, search(t, el) { hSt.q = $('#hq', el).value.trim(); App.rerender(); } },
  });

  /* ---------- (보완 화면) 알림 ---------- */
  const NT = [['새소식', '여신거래약정서 2종 개정 알림', '여신거래기본약관 및 약정서 2종이 개정되어 안내드립니다.', '05.31'], ['이벤트', '피싱 · 스미싱 방지서비스 가입 이벤트', '서비스에 가입하고 경품 응모 기회를 받아보세요.', '05.30'], ['자동이체', '이번달 자동이체 예정', '9월 25일 100,000원이 출금될 예정입니다.', '05.29'], ['마이데이터', '이번 달 카드 사용금액이 12% 줄었어요', '소비모아보기에서 자세한 내용을 확인하세요.', '05.28']];
  const read = new Set();
  def('notice', {
    title: '알림(보완)',
    html: () => `${hd('알림', { right: App.rHome })}<div class="bd" style="background:${BG}"><div style="margin:16px 16px 0 17px;border-radius:8px;background:#fff;padding:2px 20px">${NT.map((n, i) => `<button data-act="open" data-v="${i}" style="display:block;width:100%;padding:16px 0;text-align:left;${i ? 'border-top:1px solid #eee' : ''}">
        <span class="row" style="gap:8px"><span style="height:22px;line-height:22px;padding:0 9px;border-radius:11px;background:${read.has(i) ? '#eee' : '#e2f1fe'};color:${read.has(i) ? '#888' : '#0066b3'};font-size:11.5px">${n[0]}</span><span class="sp"></span><span style="font-size:11.5px;color:#999">${n[3]}</span></span>
        <b style="display:block;margin-top:8px;font-size:15px;line-height:21px;font-weight:${read.has(i) ? 400 : 600}">${n[1]}</b><span id="nb${i}" style="display:${read.has(i) ? 'block' : 'none'};margin-top:4px;font-size:13px;line-height:19px;color:#777">${n[2]}</span></button>`).join('')}</div>
      <p class="c" style="margin:14px 0 24px;font-size:11.5px;color:#999">디자인에 없는 화면을 기존 스타일로 보완했습니다. (테스트 데이터)</p></div>`,
    acts: { open(t) { const i = Number(t.dataset.v); read.has(i) ? read.delete(i) : read.add(i); App.rerender(); } },
  });
})();
