/* 금융상품몰 · AI 맞춤상품 · 상품 상세 · 상품가입(4단계) · 상품비교 */
(function () {
  const { def, img, I, hd, won } = App;
  const S = App.state;
  const $ = (s, el) => el.querySelector(s);
  const rCart = `<button data-go="cmpSel" aria-label="담은 상품">${I.cart}</button><button data-go="menu" aria-label="전체메뉴">${I.menu}</button>`;
  const P = App.data.products = [
    { n: 'NH올원e예금', d: '복잡한 우대조건 없이 목돈을 굴릴 수 있는 정기예금', base: '3.65', max: '3.65', term: '1개월 ~ 36개월', termC: '1개월 ~<br>36개월', amt: '100만원 ~<br>제한없음', cond: '간편가입,<br>자동이체 등', kind: '예금' },
    { n: 'NH올원e적금', d: '비대면 전용 고금리 적금 상품', base: '3.65', max: '3.65', cBase: '3.00', cMax: '3.00', pMax: '4.05', term: '12개월', termC: '6개월 ~<br>24개월', amt: '10만원 ~<br>1,000만원', cond: '가족거래,<br>급여이체 등', kind: '적금' },
    { n: 'NH올원e 미니적금', d: '매일 자동이체로 짧은기간에 목표 달성', base: '3.65', max: '3.65', cBase: '3.00', cMax: '3.00', term: '1개월 ~ 6개월', termC: '6개월 ~<br>24개월', amt: '10만원 ~<br>1,000만원', cond: '가족거래,<br>급여이체 등', kind: '적금' },
  ];
  const searchBar = (ph, id) => `<label class="row" style="margin:0 17px;height:34px;border-radius:17px;background:#fff;border:1px solid #d9d9d9;padding-left:23px">
      <input id="${id}" placeholder="${ph}" autocomplete="off" style="flex:1;min-width:0;border:0;outline:0;background:none;font-size:13.5px;height:100%"><i style="width:1px;height:22px;background:#ccc"></i>
      <span data-act="search" style="width:56px;height:32px;display:flex;align-items:center;justify-content:center;--hr:0 17px 17px 0">${I.search('#555', 18)}</span></label>`;
  const miniCards = (w, h, fs) => [['혜택이 가득한<br><span style="color:#0066b3">NH농협은행<br>추천 카드!</span>', 'ic_cards', 54, 41], ['한눈에 보고 바로<br>고르는 쉬운<br><span style="color:#0066b3">투자 이지 초이스!</span>', 'ic_target', 49, 52]];

  /* ---------- 금융상품몰 메인 ---------- */
  const CATS = ['계좌', '대출', '투자', '연금', '보험', '선불', '카드', '외환'];
  const ICONS = { '계좌': [['입출금', 1], ['예금', 2, 'product'], ['적금', 3], ['대출', 4], ['펀드', 5], ['퇴직연금', 6], ['외환', 7], ['청약', 8], ['신탁', 9], ['ISA', 10], ['보험', 11], ['골드바', 12]] };
  const mallSt = { cat: '계좌', q: '' };
  def('mall', {
    title: '금융상품몰',
    html() {
      const icons = (ICONS[mallSt.cat] || ICONS['계좌'].filter((x, i) => (i + CATS.indexOf(mallSt.cat)) % 3 === 0)).filter((x) => !mallSt.q || x[0].includes(mallSt.q));
      return `${hd('금융상품', { right: rCart })}<div class="bd" style="background:#f8f9fb">
        <button data-go="aiProd" class="row" style="margin:16px 26px 0 27px;width:347px;height:43px;border:1px solid #0a6fd6;border-radius:6px;background:#fff;padding:0 16px;gap:13px;font-size:15px;font-weight:500;--hr:6px">${img('ic_ai', 25, 25)}${S.user}님을 위한 맞춤 AI 상품을 알려드려요</button>
        <div style="height:26px"></div>${searchBar('검색어를 입력해주세요', 'mq2')}
        <div class="hs chips" style="margin-top:26px;padding:0 17px;gap:9px">${CATS.map((c) => `<button class="chip ol ${c === mallSt.cat ? 'on' : ''}" data-act="cat" data-v="${c}" style="height:38px;border-radius:19px;font-size:15px;padding:0 16px;--hr:19px">${c}</button>`).join('')}</div>
        <div class="card" style="margin:33px 18px 0;border-radius:12px;padding:19px 17px 3px;display:grid;grid-template-columns:repeat(4,1fr);min-height:120px;border-color:#d9d9d9">
          ${icons.map((c) => `<button ${c[2] ? `data-go="${c[2]}"` : `data-go="aiProd" data-u`} style="height:111px;display:flex;flex-direction:column;align-items:center;font-size:12.5px;--hr:10px"><span style="height:50px;display:flex;align-items:center">${img('cat_' + c[1], null, 31)}</span><span style="margin-top:15px">${c[0]}</span></button>`).join('')
            || '<p class="c" style="grid-column:1/5;padding:36px 0 50px;color:#999;font-size:14px">검색 결과가 없습니다.</p>'}</div>
        <button data-go="cmpSel" style="display:block;position:relative;margin:30px 15px 0 17px;width:368px;height:120px;border-radius:12px;background:#e2f1fe;text-align:left;--hr:12px">
          <b style="position:absolute;left:35px;top:15px;font-size:12.5px;line-height:24px;font-weight:600">여러 금융상품을 비교해 드려요<br>최저금리, 최대한도를 한 번에!</b>
          <span style="position:absolute;left:35px;top:76px;font-size:9px;color:#666">상품 비교하러 가기 &nbsp;&nbsp;&gt;</span>${img('ill_compare', 61, 89, 'position:absolute;left:265px;top:14px')}</button>
        <div class="card" style="margin:34px 16px 0;border-radius:12px;border-color:#c5d9ee;padding:27px 15px 22px 16px">
          <div style="font-size:15px;line-height:20px;padding-left:5px">🔥 고객들이 많이 맞는 금융상품이에요</div>
          <div style="margin-top:15px">${P.map((p, i) => `<button data-go="product" ${i ? 'data-u' : ''} class="row" style="width:100%;height:89px;text-align:left;--hr:8px;${i ? 'border-top:1px solid #e6e6e6' : ''}">
            <span style="width:60px;padding-left:10px;font-size:21px;color:#666">${i + 1}</span><span><b style="display:block;font-size:20px;line-height:26px;font-weight:600">${p.n}</b>
            <span style="display:block;margin-top:5px;font-size:16px"><b style="color:#0066b3;font-weight:600">최고 ${p.pMax || p.max}%</b>&nbsp; <span style="color:#555">기본 ${p.base}%</span></span></span></button>`).join('')}</div></div>
        <div class="row" style="margin:37px 16px 0 17px;gap:15px">${miniCards().reverse().map((c) => `<button data-go="aiProd" data-u class="card" style="position:relative;width:176px;height:202px;border-radius:14px;text-align:left;--hr:14px;border-color:#d9d9d9">
            <b style="position:absolute;left:16px;top:22px;font-size:17.5px;line-height:27px;font-weight:600">${c[0]}</b>${img(c[1], c[2], c[3], 'position:absolute;right:14px;bottom:18px')}</button>`).join('')}</div>
        <div style="height:60px"></div></div>`;
    },
    init(el) { const q = $('#mq2', el); q.value = mallSt.q; q.addEventListener('keydown', (e) => { if (e.key === 'Enter') { mallSt.q = q.value.trim(); App.rerender(); } }); },
    acts: { cat(t) { mallSt.cat = t.dataset.v; mallSt.q = ''; App.rerender(); }, search(t, el) { mallSt.q = $('#mq2', el).value.trim(); App.rerender(); } },
  });

  /* ---------- AI 맞춤상품 ---------- */
  const aiSt = { cat: '예금' };
  const bigCard = (i) => `<div class="card" style="flex:none;position:relative;width:300px;height:262px;border-radius:22px;scroll-snap-align:start;border-color:#d9d9d9">
      <b style="position:absolute;left:16px;top:15px;font-size:12px;line-height:18px;color:#0066b3;font-weight:600">20대 여성이 가장 많이 가입한 상품</b>
      <b style="position:absolute;left:16px;top:36px;font-size:16.5px;line-height:24px;font-weight:600">${i ? '청년도약지원적금' : 'NH올원e예금'}</b>
      <span style="position:absolute;left:16px;top:63px;font-size:12px;color:#777">이율 00.00%~ 00.00%까지</span>
      <span style="position:absolute;left:16px;top:89px;width:250px;font-size:14px;line-height:17px">${i ? '청년들의 경제활동 및 목돈 마련을 위한 국가지원 적금 서비스' : '복잡한 우대조건 없이 목돈을 굴릴 수 있는 정기예금'}</span>
      <div class="row" style="position:absolute;left:16px;top:174px;gap:5px">${['#청년지원', '#목돈마련', '#최대 이율 보상', '#비과세'].map((t) => `<span style="height:18px;line-height:18px;padding:0 7px;border-radius:9px;background:#f1f1f1;font-size:9.5px;color:#666">${t}</span>`).join('')}</div>
      <button class="btn" data-go="product" ${i ? 'data-u' : ''} style="position:absolute;left:16px;top:205px;width:268px;height:40px;border-radius:8px;font-size:16px">자세히 보기</button></div>`;
  App.bigCard = bigCard;
  def('aiProd', {
    title: 'AI 맞춤상품',
    html() {
      const list = P.filter((p) => aiSt.cat === '예금' || p.kind === aiSt.cat);
      return `${hd('AI 맞춤상품', { right: rCart })}<div class="bd">
        <div style="position:relative;height:124px"><b style="position:absolute;left:28px;top:28px;font-size:22px;line-height:29px;font-weight:600">${S.user}님을 위한<br>AI 맞춤 상품입니다</b>
          <span style="position:absolute;left:28px;top:94px;font-size:14.5px;color:#666">투자자성향 진단일 2026.09.20</span>${img('ill_ai', 117, 81, 'position:absolute;left:259px;top:27px')}</div>
        <div class="chips" style="margin:16px 17px 0;gap:9px">${['예금', '적금', '대출', '연금', '보험'].map((c) => `<button class="chip ol ${c === aiSt.cat ? 'on' : ''}" data-act="cat" data-v="${c}" style="height:36px;border-radius:18px;font-size:15px;padding:0 15px;--hr:18px">${c}</button>`).join('')}</div>
        <div class="row" style="margin:22px 16px 0 17px;height:66px;border-radius:4px;background:#e2f1fe;padding-left:19px">${img('ic_hash', 29, 41)}
          <span style="margin-left:18px;font-size:14px;line-height:23px;font-weight:500">${S.user}님이 많이 찾은 해시태그에요!<br><span style="font-size:12px;color:#0066b3">#비대면 &nbsp; #목돈마련 &nbsp; #고금리</span></span></div>
        <div style="margin-top:31px">${list.map((p, i) => `<button data-go="product" ${i ? 'data-u' : ''} style="display:block;position:relative;margin:0 16px ${i === 0 ? 20 : 22}px 17px;width:367px;height:${i ? 116 : 120}px;border-radius:6px;text-align:left;--hr:6px;
            ${i ? 'border:1px solid #ccc;background:#fff' : 'border:2px solid #1a7fe0;background:linear-gradient(100deg,#fff 40%,#e2f1fe)'}">
            ${i ? '' : '<i style="position:absolute;left:3px;top:-14px;width:66px;height:22px;border-radius:4px 4px 4px 0;background:#0066b3;color:#fff;font-style:normal;font-size:14px;line-height:22px;text-align:center">BEST</i>'}
            <b style="position:absolute;left:11px;top:${i ? 18 : 20}px;font-size:16.5px;line-height:22px;font-weight:600">${p.n}</b>
            <span style="position:absolute;left:11px;top:${i ? 41 : 43}px;font-size:14px;color:#888">${p.d}</span>
            <span style="position:absolute;left:11px;top:${i ? 68 : 70}px;font-size:14.5px;color:#555">기본 ${p.base}% / <b style="color:#0066b3;font-weight:600">최고 ${p.max}%</b></span>
            <span style="position:absolute;left:11px;top:${i ? 89 : 91}px;font-size:11px;color:#888">${p.term}</span>
            <span style="position:absolute;right:${i ? 12 : 8}px;top:${i ? 89 : 91}px;font-size:11px">상품 보기 &gt;</span></button>`).join('')
          || `<p class="c" style="padding:50px 0 60px;color:#999;font-size:14px">‘${aiSt.cat}’ 맞춤 상품이 아직 없습니다.<br>(테스트 데이터)</p>`}</div>
        <div class="row" style="margin:12px 22px 0 24px;height:28px"><b style="font-size:17px;font-weight:600">🔥고객들이 많이 맞는 금융상품이에요</b><span class="sp"></span><button data-go="mall" style="font-size:11px;color:#999;padding:4px 0">전체 상품 보기 &gt;</button></div>
        <div class="hs" style="margin-top:16px;padding:0 16px;gap:10px">${bigCard(0)}${bigCard(1)}${bigCard(1)}</div><div style="height:22px"></div></div>`;
    },
    acts: { cat(t) { aiSt.cat = t.dataset.v; App.rerender(); } },
  });

  /* ---------- 상품 상세(예금) ---------- */
  const pdSt = { like: false, calc: false, amt: 500, mon: 24, tab: 0, terms: true };
  const fmtAmt = (v) => (v >= 10000 ? (v / 10000) + '억원' : won(v) + '만원');
  const calcBox = () => { const interest = Math.round(pdSt.amt * 10000 * 0.0365 * pdSt.mon / 12), tax = Math.round(interest * 0.154);
    return `<div style="padding:4px 20px 20px;font-size:14px">
      <div class="row" style="height:30px"><span style="color:#777">가입금액</span><span class="sp"></span><b id="cA">${fmtAmt(pdSt.amt)}</b></div><input type="range" class="rg" data-r="amt" min="10" max="10000" step="10" value="${pdSt.amt}">
      <div class="row" style="height:30px;margin-top:8px"><span style="color:#777">가입기간</span><span class="sp"></span><b id="cM">${pdSt.mon}개월</b></div><input type="range" class="rg" data-r="mon" min="1" max="36" value="${pdSt.mon}">
      <div style="margin-top:16px;padding:14px 16px;border-radius:10px;background:#fff;border:1px solid #e3e6ea">
        <div class="kv"><span>세전 이자 (연 3.65%)</span><b id="cI">${won(interest)}원</b></div><div class="kv" style="margin-top:4px"><span>이자과세 (15.4%)</span><b id="cT">-${won(tax)}원</b></div>
        <div class="kv" style="margin-top:8px;padding-top:9px;border-top:1px solid #eee;font-size:15px"><span style="color:#111">만기 예상 수령액</span><b id="cS" style="color:#0066b3;font-weight:700">${won(pdSt.amt * 10000 + interest - tax)}원</b></div></div>
      <p style="margin-top:8px;font-size:11px;color:#999">※ 단순 계산 예시이며 실제 금리·세금은 가입 시점에 확정됩니다. (테스트 계산)</p></div>`; };
  const TABS = ['상품안내', '금리안내', '유의사항', '기타사항'];
  const tabBody = () => {
    const rows = [[['가입대상', '금리안내'], ['가입기간', '1개월 이상 36개월 이내 (월 단위)<br>※ 계약기간 변경 불가'], ['상품안내', '10만원 이상 최대 10억원 이하로<br>가입 가능'], ['상품안내', '정기예금(큰만족실세예금)']],
      [['기본금리', '연 3.65% (세전, 12개월 기준)'], ['우대금리', '없음 (우대조건 없이 동일 금리)'], ['최고금리', '연 3.65% (세전)']],
      [['중도해지', '중도해지 시 약정금리보다 낮은<br>중도해지금리가 적용됩니다.'], ['만기 후', '만기 후에는 만기후금리가<br>적용됩니다.']],
      [['가입방법', '올원뱅크, 영업점'], ['예금자보호', '보호 대상 (1인당 1억원까지)']]][pdSt.tab];
    return `<div style="margin:28px 22px 0 16px;border-top:1px solid #d9d9d9">${rows.map((r) => `<div class="row" style="align-items:stretch;border-bottom:1px solid #d9d9d9;min-height:49px">
      <div style="width:142px;flex:none;background:#f8f9fb;display:flex;align-items:center;justify-content:center;font-size:15.5px">${r[0]}</div><div style="flex:1;padding:14px 8px;font-size:13.5px;line-height:16px;color:#555;display:flex;align-items:center">${r[1]}</div></div>`).join('')}</div>`; };
  def('product', {
    title: '상품 상세(예금)',
    html: () => `<header class="hd"><div class="t" style="font-weight:500">예금</div><button class="xbtn" data-back style="right:12px;top:10px">${I.x(19, '#777', 2)}</button></header>
      <div class="bd" id="pdB">
        <div class="row" style="justify-content:flex-end;height:36px;margin:11px 20px 0 0;gap:12px"><button data-act="like" style="width:28px;height:28px;display:flex;align-items:center;justify-content:center">${I.heart(pdSt.like)}</button>
          <button data-act="share" style="width:28px;height:28px;display:flex;align-items:center;justify-content:center">${I.share}</button></div>
        <div style="margin:21px 28px 0;font-size:16px;line-height:20px;color:#777">NH올원e예금</div>
        <h1 style="margin:12px 28px 0;font-size:23px;line-height:31px;font-weight:600">복잡한 우대조건 없이 목돈을<br>굴릴 수 있는 예금</h1>
        <div class="row" style="margin:28px 28px 0;align-items:flex-start"><div style="width:113px"><div style="font-size:13px;color:#555">최고</div><div style="margin-top:12px;font-size:29px;line-height:36px;font-weight:600;color:#0066b3;letter-spacing:-.03em">3.65%</div></div>
          <div><div style="font-size:13px;color:#555">기본</div><div style="margin-top:12px;font-size:29px;line-height:36px;font-weight:600;letter-spacing:-.03em">3.65%</div></div></div>
        <div style="margin:12px 28px 0;font-size:13.5px;color:#888">연/세전, 2026.11.03 기준</div>
        <div class="row" style="margin:28px 28px 0 29px;height:24px;font-size:14px">${img('ic_cal', 21, 23)}<span style="margin-left:14px;width:77px;color:#888">가입기간</span><b style="font-weight:500">1개월 이상 36개월 이내</b></div>
        <div class="row" style="margin:14px 28px 0 29px;height:24px;font-size:14px">${img('ic_coin', 21, 21)}<span style="margin-left:14px;width:79px;color:#888">가입금액</span><b style="font-weight:500">10만원 ~ 10억원</b></div>
        <div style="margin:23px 18px 0;border-radius:12px;background:#f8f9fb"><button data-act="calc" class="row" style="width:100%;height:79px;padding:0 24px 0 27px;font-size:15.5px;font-weight:500;--hr:12px">${img('ic_calc', 26, 30)}<span style="margin-left:11px">3초만에 만기금액 알아보기</span><span class="sp"></span>
          <span style="display:flex;transition:.2s;${pdSt.calc ? 'transform:rotate(180deg)' : ''}">${I.down('#555', 16)}</span></button><div id="calc">${pdSt.calc ? calcBox() : ''}</div></div>
        <div style="height:250px;position:relative">${img('ill_piggy', 171, 142, 'position:absolute;left:112px;top:69px')}</div>
        <div style="background:#f8f9fb;height:533px;position:relative"><h2 class="c" style="padding-top:48px;font-size:24px;line-height:40px;font-weight:600">가입할 때 금리가<br>만기 때까지 동일하게!</h2>
          <p class="c" style="margin-top:22px;font-size:16px;line-height:21px;color:#888">우대조건을 채우느라 신경쓰지 마세요.<br>조건없이 가입시점의 약정이율을<br>만기까지 확정 지급해드려요.</p>${img('ill_coinhand', 212, 161, 'position:absolute;left:92px;top:300px')}</div>
        <h2 class="c" style="padding-top:51px;font-size:24px;line-height:40px;font-weight:600">소액으로 단기간<br>가입도 가능한 예금</h2>
        <p class="c" style="margin-top:14px;font-size:16px;line-height:22px;color:#444">1개월부터 36개월까지,<br>10만원부터 10억원까지 자유롭게 가입하세요.</p>
        <div style="margin:66px auto 0;width:240px;height:260px;overflow:hidden"><div style="height:330px;border:7px solid #e4e6ea;border-radius:40px 40px 0 0;background:#fff;box-shadow:inset 0 0 0 1px #cfd3d9, 0 0 0 1px #d6d9de;position:relative">
          <i style="position:absolute;left:68px;top:8px;width:84px;height:16px;border-radius:0 0 12px 12px;background:#e4e6ea"></i><i style="position:absolute;left:96px;top:11px;width:30px;height:4px;border-radius:2px;background:#666"></i><i style="position:absolute;left:84px;top:10px;width:6px;height:6px;border-radius:50%;background:#666"></i>
          <div style="padding:58px 18px 0"><b id="pA" style="font-size:16px;font-weight:500">${fmtAmt(pdSt.amt)}</b><input type="range" class="rg" data-r="amt" min="10" max="10000" step="10" value="${pdSt.amt}" style="margin-top:14px">
            <div class="row" style="font-size:8px;color:#888;margin-top:7px">10만원<span class="sp"></span>10억원</div>
            <b id="pM" style="display:block;margin-top:26px;font-size:16px;font-weight:500">${pdSt.mon}개월</b><input type="range" class="rg" data-r="mon" min="1" max="36" value="${pdSt.mon}" style="margin-top:14px">
            <div class="row" style="font-size:8px;color:#888;margin-top:7px">1개월<span class="sp"></span>36개월</div></div></div></div>
        <div class="row" id="pdTabs" style="margin:28px 16px 0;height:57px;border-bottom:1px solid #d9d9d9;font-size:16px;gap:0">${TABS.map((t, i) => `<button data-act="tab" data-v="${i}" style="height:57px;padding:0 13px;--hr:0;${i === pdSt.tab ? 'font-weight:600;box-shadow:inset 0 -2px 0 #111' : 'color:#777'}">${t}</button>`).join('')}</div>
        <div id="tb">${tabBody()}</div>
        <h3 style="margin:28px 16px 0;font-size:17px;font-weight:600">세제혜택안내</h3><p style="margin:12px 16px 0;font-size:15px;color:#555">비과세종합저축 가능(전 금융기관 통합한도 범위 내)</p>
        <h3 style="margin:30px 16px 0;font-size:17px;font-weight:600">이자지급 방법</h3><p style="margin:12px 14px 0 16px;font-size:15px;line-height:22px;color:#555">만기일시지급식 : 계약기간 동안 약정이율로 계산하여 만기에 일시지급<br>월이자지급식: 계약기간 동안 약정이율로 계산한 총 이자를 월수로 나눠 매월지급<br>(월이자지급식의 경우 만기일시지급식 대비 0.10%p 차감한 금리 적용)</p>
        <button data-act="terms" class="row" style="margin:28px 16px 0;width:368px;height:36px;font-size:17px;font-weight:600;text-align:left">상품설명서 및 약관<span class="sp"></span><span style="margin-right:6px;display:flex;transition:.2s;${pdSt.terms ? '' : 'transform:rotate(180deg)'}">${I.up('#333', 15)}</span></button>
        <div style="margin-top:12px;display:${pdSt.terms ? 'block' : 'none'}">${['기본약관', '상품설명서', '상품특약'].map((t) => `<button data-act="doc" data-v="${t}" class="card row" style="margin:0 17px 14px;width:366px;height:67px;border-radius:16px;padding:0 19px;font-size:18px;font-weight:600;text-align:left;--hr:16px;border-color:#d9d9d9">${t}<span class="sp"></span>${I.chev('#333', 14)}</button>`).join('')}</div>
        <div style="margin:44px 20px 0">${img('ic_protect', 72, 46)}</div>
        <p style="margin:30px 16px 0;font-size:13.5px;line-height:19px;color:#555">이 예금은 예금자보호법에 따라 원금과 소정의 이자를 합하여 1인당 "1억원까지"(본 은행의 여타 보호상품과 합산) 보호됩니다.</p>
        <p style="margin:26px 16px 30px;font-size:13.5px;line-height:18px;color:#555">2026-4908 (심의일 : 2026.08.31.)<br>유효기간 : 2026.09.01.~2027.08.31.</p></div>
      <div class="ft"><button class="btn o" data-go="resv1">상담하기</button><button class="btn" data-go="join1">가입하기</button></div>`,
    init(el) {
      el.addEventListener('input', (e) => {
        const r = e.target.dataset.r; if (!r) return; pdSt[r] = Number(e.target.value);
        el.querySelectorAll(`.rg[data-r="${r}"]`).forEach((x) => { x.value = pdSt[r]; paintRange(x); });
        $('#pA', el).textContent = fmtAmt(pdSt.amt); $('#pM', el).textContent = pdSt.mon + '개월';
        if (pdSt.calc) { const y = $('#calc', el); const active = document.activeElement; if (!(active && y.contains(active))) y.innerHTML = calcBox(); else {
          const it = Math.round(pdSt.amt * 10000 * 0.0365 * pdSt.mon / 12), tx = Math.round(it * 0.154);
          $('#cA', el).textContent = fmtAmt(pdSt.amt); $('#cM', el).textContent = pdSt.mon + '개월'; $('#cI', el).textContent = won(it) + '원'; $('#cT', el).textContent = '-' + won(tx) + '원'; $('#cS', el).textContent = won(pdSt.amt * 10000 + it - tx) + '원'; } }
        el.querySelectorAll('.rg').forEach(paintRange);
      });
      el.querySelectorAll('.rg').forEach(paintRange);
    },
    acts: {
      like(t) { pdSt.like = !pdSt.like; t.innerHTML = I.heart(pdSt.like); App.toast(pdSt.like ? '관심상품에 담았습니다.' : '관심상품에서 삭제했습니다.'); },
      share() { App.toast('공유하기는 실제 기기의 공유 기능이 필요합니다.', '테스트 동작'); },
      calc() { pdSt.calc = !pdSt.calc; App.rerender(); },
      tab(t, el) { pdSt.tab = Number(t.dataset.v); $('#tb', el).innerHTML = tabBody(); el.querySelectorAll('#pdTabs button').forEach((b, i) => { const on = i === pdSt.tab; b.style.fontWeight = on ? 600 : 400; b.style.color = on ? '#111' : '#777'; b.style.boxShadow = on ? 'inset 0 -2px 0 #111' : 'none'; }); },
      terms() { pdSt.terms = !pdSt.terms; App.rerender(); },
      doc(t) { docSheet(t.dataset.v); },
    },
  });
  function paintRange(x) { const p = ((x.value - x.min) / (x.max - x.min)) * 100; x.style.background = `linear-gradient(90deg,#3d5bf0 ${p}%,#e6e8ec ${p}%)`; }
  function docSheet(title) {
    App.sheet(`<div class="sheet" style="height:560px;display:flex;flex-direction:column"><div style="height:74px;flex:none;position:relative"><b style="position:absolute;left:21px;top:28px;font-size:20px">${title}</b><button class="x" data-close style="right:14px;top:22px">${I.x(15)}</button></div>
      <div class="bd" style="padding:0 21px 20px;font-size:13.5px;line-height:21px;color:#555"><p style="padding:10px 12px;border-radius:8px;background:#f8f9fb;color:#777;font-size:12px;margin-bottom:14px">실제 약관 문서(PDF)는 서버 연동이 필요합니다. 아래는 화면 확인용 예시 문구입니다.</p>
      ${['제1조 (목적)', '제2조 (적용범위)', '제3조 (이자 및 지급)', '제4조 (중도해지)', '제5조 (만기 후 처리)'].map((h) => `<b style="display:block;color:#111;margin-top:10px">${h}</b>이 약관은 NH올원e예금 거래에 필요한 사항을 정함을 목적으로 하며, 세부 내용은 가입 시점의 상품설명서를 따릅니다.`).join('')}</div>
      <div class="ft"><button class="btn" data-close>확인</button></div></div>`);
  }
  App.docSheet = docSheet;

  /* ---------- 상품가입 4단계 ---------- */
  const J = S.join = { amt: 0, mon: 12, pay: '만기일시지급', acct: 0, agree: [true, true, true, true, true] };
  const rMall = `<button data-go="mall" aria-label="금융상품몰">${I.home}</button>`; /* Figma: 가입 흐름의 집 아이콘 → 금융상품몰 */
  const stepHd = (title, n, label, rt) => `${hd(title, { right: rt || App.rHome, cls: 'pg', prog: n * 25 })}<div class="step"><span>${label}</span><span><b>STEP ${n}</b> <i>/4</i></span></div>`;
  App.stepHd = stepHd;
  const h2 = (t, s) => `<h2 style="margin:9px 17px 0;font-size:19px;line-height:26px;font-weight:600">${t}</h2><p style="margin:5px 17px 0;font-size:13.5px;line-height:18px;color:#777">${s}</p>`;
  App.h2 = h2;

  def('join1', {
    title: '상품가입 STEP 1',
    html: () => `${stepHd('상품가입', 1, '상품가입', rMall)}<div class="bd">
      <div style="position:relative;margin:10px 16px 0;height:120px;border-radius:14px;background:#e2f1fe">${img('ic_bag', 53, 62, 'position:absolute;left:26px;top:31px')}
        <b style="position:absolute;left:101px;top:34px;font-size:18px;line-height:22px;font-weight:600">NH올원e예금</b><span style="position:absolute;left:101px;top:63px;font-size:11.5px;line-height:14px;color:#555">비대면으로 간편하게 가입하는<br>NH 대표 예금 상품입니다</span>
        <span style="position:absolute;left:259px;top:29px;font-size:11px">최고</span><b style="position:absolute;left:259px;top:42px;font-size:27px;line-height:36px;font-weight:600;color:#0066b3;letter-spacing:-.03em">3.65%</b><span style="position:absolute;left:260px;top:84px;font-size:7px;color:#777">연/세전, 2026.11.03 기준</span></div>
      <div class="row" style="margin:34px 38px 0 39px;height:22px;font-size:16px;font-weight:600">가입 금액<span class="sp"></span><span style="font-size:15px;font-weight:400;color:#999">최소 (10만원)</span></div>
      <label class="row" style="margin:17px 38px 0 39px;height:41px;border:1px solid #d9d9d9;border-radius:4px;padding:0 13px 0 14px;font-size:17px"><input id="jAmt" inputmode="numeric" value="${J.amt || ''}" placeholder="0000" style="flex:1;min-width:0;text-align:right;border:0;outline:0;height:100%"><span style="margin:0 12px 0 6px">만원</span>
        <span data-act="clr" style="display:flex;padding:3px;margin:-3px">${I.clr}</span></label>
      <div class="row" style="margin:8px 0 0 42px;gap:7px">${[['+100만', 100], ['+500만', 500], ['+1,000만', 1000]].map((c) => `<button data-act="add" data-v="${c[1]}" style="height:28px;padding:0 10px;border-radius:14px;background:#f5f5f5;color:#999;font-size:13.5px;--hr:14px">${c[0]}</button>`).join('')}</div>
      <i style="display:block;margin:14px 38px 0 39px;height:1px;background:#e6e6e6"></i>
      <div class="row" style="margin:14px 38px 0 39px;height:22px;font-size:16px;font-weight:600">가입 기간<span class="sp"></span><span id="jMon" style="font-size:15px;font-weight:${J.mon ? 600 : 400};color:${J.mon ? '#0066b3' : '#999'}">${J.mon ? J.mon + '개월' : '최소 (n개월)'}</span></div>
      <div class="row" style="margin:21px 0 0 39px;gap:7px">${[['+3개월', 3], ['+6개월', 6], ['+1년', 12], ['+2년', 24]].map((c) => `<button data-act="mon" data-v="${c[1]}" style="height:28px;padding:0 10px;border-radius:14px;background:#f5f5f5;color:#999;font-size:13.5px;--hr:14px">${c[0]}</button>`).join('')}
        <button data-act="monR" style="height:28px;padding:0 10px;border-radius:14px;color:#bbb;font-size:12px">초기화</button></div>
      <i style="display:block;margin:22px 38px 0 39px;height:1px;background:#e6e6e6"></i>
      <div style="margin:14px 38px 0 39px;font-size:16px;line-height:22px;font-weight:600">이자지급방식</div>
      <button data-act="pay" class="row" style="margin:17px 38px 0 39px;width:323px;height:41px;border:1px solid #d9d9d9;border-radius:4px;padding:0 12px;font-size:16px;color:#555;text-align:left;--hr:4px"><span id="jPay">${J.pay}</span><span class="sp"></span>${I.down('#333', 18, 1.8)}</button>
      <div style="height:30px"></div></div><div class="ft"><button class="btn" data-act="next">다음</button></div>`,
    init(el) { const a = $('#jAmt', el); a.addEventListener('input', () => { a.value = a.value.replace(/\D/g, '').slice(0, 6); J.amt = Number(a.value); }); },
    acts: {
      clr(t, el) { J.amt = 0; $('#jAmt', el).value = ''; },
      add(t, el) { J.amt = Math.min((J.amt || 0) + Number(t.dataset.v), 100000); $('#jAmt', el).value = J.amt; },
      mon(t, el) { J.mon = Math.min((J.mon || 0) + Number(t.dataset.v), 36); const m = $('#jMon', el); m.textContent = J.mon + '개월'; m.style.color = '#0066b3'; m.style.fontWeight = 600; },
      monR(t, el) { J.mon = 0; const m = $('#jMon', el); m.textContent = '최소 (n개월)'; m.style.color = '#999'; m.style.fontWeight = 400; },
      pay(t, el) {
        App.sheet(`<div class="sheet" style="padding:28px 20px 20px"><b style="font-size:20px">이자지급방식</b><button class="x" data-close style="right:14px;top:20px">${I.x(15)}</button>
          <div style="margin-top:14px">${['만기일시지급', '월이자지급'].map((p) => `<button data-act="paySel" data-v="${p}" class="row" style="width:100%;height:54px;border-bottom:1px solid #eee;font-size:16px;text-align:left;${p === J.pay ? 'color:#0066b3;font-weight:600' : ''}">${p}<span class="sp"></span>${p === J.pay ? `<i class="chk on">${I.check()}</i>` : ''}</button>`).join('')}</div></div>`);
      },
      paySel(t) { J.pay = t.dataset.v; App.closeSheets(); $('#jPay', App.el).textContent = J.pay; },
      next() { if (J.amt < 10) return App.toast('가입 금액을 10만원 이상 입력해 주세요.'); if (!J.mon) return App.toast('가입 기간을 선택해 주세요.'); App.go('join2'); },
    },
  });

  def('join2', {
    title: '상품가입 STEP 2',
    html: () => `${stepHd('출금계좌 선택', 2, '방문 상담 예약', rMall)}<div class="bd">${h2('예약 내용을 확인해 주세요', '선택한 상담 정보가 맞는지 확인해 주세요').replace('0 17px 0', '0 21px 0').replace('5px 17px 0', '5px 21px 0')}
      <div style="position:relative;margin:21px 16px 0 21px;height:77px;border-radius:8px;background:#f8f9fb"><b style="position:absolute;left:15px;top:13px;font-size:18px;line-height:22px;font-weight:600">NH올원e예금</b><span style="position:absolute;left:15px;top:43px;font-size:11.5px;color:#777">가입기간 ${J.mon}개월</span>
        <span style="position:absolute;right:17px;top:15px;font-size:11px">최고 연</span><b style="position:absolute;right:18px;top:29px;font-size:27px;line-height:36px;font-weight:600;color:#0066b3;letter-spacing:-.03em">3.65%</b></div>
      <div style="margin:28px 21px 0;font-size:16px;line-height:22px;font-weight:600">출금계좌</div>
      ${[0, 1].map((i) => `<button data-act="acct" data-v="${i}" style="display:block;position:relative;margin:${i ? 12 : 9}px 16px 0 17px;width:367px;height:94px;border-radius:4px;text-align:left;--hr:4px;border:1px solid ${J.acct === i ? '#0066b3' : '#d9d9d9'};background:${J.acct === i ? '#e8f3fc' : '#fff'}">
        <b style="position:absolute;left:18px;top:11px;font-size:17px;line-height:22px;font-weight:500">NH농협은행</b><span style="position:absolute;left:18px;top:39px;font-size:11.5px;color:#555">${i ? '302-****-****-27' : '302-****-****-19'}</span>
        <i style="position:absolute;left:18px;right:17px;top:58px;height:1px;background:${J.acct === i ? '#0066b3' : '#d9d9d9'}"></i>
        <span style="position:absolute;left:18px;top:68px;font-size:11.5px;color:#777">출금 가능 잔액</span><b style="position:absolute;right:18px;top:66px;font-size:15px;font-weight:500">${won(i ? 3200000 : S.balance)}원</b></button>`).join('')}
      <div class="c" style="margin:51px 17px 0;padding:22px 0;border-radius:4px;background:#f8f9fb;font-size:16px;line-height:19.5px">출금 예정 금액 <span style="color:#0066b3">${won(J.amt * 10000)}원</span><br>가입 시 선택한 계좌에서 출금됩니다.</div>
      <div style="height:24px"></div></div><div class="ft"><button class="btn" data-go="join3">다음</button></div>`,
    acts: { acct(t) { J.acct = Number(t.dataset.v); App.rerender(); } },
  });

  const TERMS = [['[필수] 예금거래기본약관', '예금 거래 관련 기본 사항'], ['[필수] NH올원e예금 상품설명서', '상품의 주요 조건 및 유의사항'], ['[필수] 개인정보 수집 및 이용', '가입·거래에 필요한 개인정보 처리'], ['[필수] 금융거래 확인 및 안내', '전자금융거래 관련 안내'], ['[선택] 금융상품 정보 수신 동의', '상품 및 이벤트 정보 안내']];
  const ck = (on, d = 20) => `<i class="chk ${on ? 'on' : ''}" style="width:${d}px;height:${d}px">${I.check()}</i>`;
  App.ck = ck;
  def('join3', {
    title: '상품가입 STEP 3',
    html: () => `${stepHd('출금계좌 선택', 3, '방문 상담 예약', rMall)}<div class="bd">${h2('가입 약관을 확인해 주세요', '필수 약관 동의 후 다음 단계로 진행합니다.')}
      <button data-act="all" class="row" style="margin:15px 17px 0 16px;width:367px;height:79px;border-radius:8px;background:#e2f1fe;padding-left:16px;text-align:left;--hr:8px">${ck(J.agree.every(Boolean), 26)}
        <span style="margin-left:9px;font-size:14.5px;line-height:20px;font-weight:600">전체 동의<br><small style="font-size:12px;font-weight:400;color:#555">필수·선택 약관을 모두 선택합니다.</small></span></button>
      <div style="margin:11px 17px 0 19px">${TERMS.map((t, i) => `<div class="row" style="height:50px;${i < 4 ? 'border-bottom:1px solid #e3e3e3' : ''}"><button data-act="one" data-v="${i}" class="row" style="flex:1;height:46px;text-align:left;gap:9px">${ck(J.agree[i])}
        <span style="font-size:12.5px;line-height:18px;font-weight:600">${t[0]}<br><small style="font-size:10px;font-weight:400;color:#777">${t[1]}</small></span></button>
        <button data-act="doc" data-v="${t[0].slice(5)}" style="width:34px;height:40px;display:flex;align-items:center;justify-content:center">${I.chev('#444', 15)}</button></div>`).join('')}</div>
      <div class="row" style="margin:22px 17px 0;height:84px;border-radius:4px;background:#f8f9fb;padding-left:19px">${I.info('#0066b3', 32)}<span style="margin-left:14px;font-size:14.5px;line-height:17px;color:#777">선택 약관은 동의하지 않아도 상품 가입을<br>진행할 수 있습니다.</span></div>
      <div style="height:24px"></div></div><div class="ft"><button class="btn" data-act="next">동의하고 다음</button></div>`,
    acts: {
      all() { const v = !J.agree.every(Boolean); J.agree = J.agree.map(() => v); App.rerender(); },
      one(t) { const i = Number(t.dataset.v); J.agree[i] = !J.agree[i]; App.rerender(); },
      doc(t) { docSheet(t.dataset.v); },
      next() { if (!J.agree.slice(0, 4).every(Boolean)) return App.toast('필수 약관에 모두 동의해 주세요.'); App.go('join4'); },
    },
  });

  const kvRows = (rows, top, pitch = 40) => rows.map((r, i) => `<span style="position:absolute;left:18px;top:${top + i * pitch}px;font-size:14px;color:#555">${r[0]}</span><b style="position:absolute;right:17px;top:${top + i * pitch}px;font-size:14.5px;font-weight:500">${r[1]}</b>`).join('');
  App.kvRows = kvRows;
  def('join4', {
    title: '상품가입 STEP 4',
    html: () => `${stepHd('약관동의', 4, '방문 상담 예약', rMall)}<div class="bd">${h2('가입 내용을 확인해 주세요', '신청 전 입력한 내용을 최종 확인합니다.')}
      <div class="card" style="position:relative;margin:14px 16px 0 17px;height:320px;border-radius:4px;border-color:#d0d0d0"><b style="position:absolute;left:18px;top:17px;font-size:18px;line-height:24px;font-weight:600">NH올원e예금</b><span style="position:absolute;right:17px;top:26px;font-size:13.5px;color:#444">비대면 정기예금</span>
        <i style="position:absolute;left:18px;right:17px;top:58px;height:1px;background:#d9d9d9"></i>
        ${kvRows([['가입금액', won(J.amt * 10000) + '원'], ['가입기간', J.mon + '개월'], ['적용금리', '가입 시 안내 금리'], ['이자지급', J.pay], ['출금계좌', J.acct ? '302-****-****-27' : '302-****-****-19'], ['만기 처리', '출금계좌로 입금']], 70)}</div>
      <div class="c" style="margin:19px 16px 0 17px;height:138px;border-radius:4px;background:#f8f9fb;padding-top:12px"><span style="display:inline-flex">${I.info('#0066b3', 38)}</span>
        <b style="display:block;margin-top:5px;font-size:16px;font-weight:600">신청 전 확인사항</b><p style="margin-top:6px;font-size:14px;line-height:17px;color:#888">금리 및 약정 조건은 가입 시점에 확정됩니다.<br>신청 내용을 확인하고 가입을 진행해 주세요.</p></div>
      <div style="height:24px"></div></div><div class="ft"><button class="btn" data-go="certPin">가입 신청하기</button></div>`,
  });

  def('joinDone', {
    title: '가입완료',
    html: () => `${hd('가입완료', { right: rMall })}<div class="fix">${img('ill_joindone', 272, 178, 'position:absolute;left:66px;top:38px')}
      <h1 class="abs c" style="left:0;right:0;top:240px;font-size:26px;line-height:31px;font-weight:600">방문 상담 예약이<br>완료되었습니다</h1>
      <p class="abs c" style="left:0;right:0;top:307px;font-size:14px;line-height:16.5px;color:#444">예약한 날짜와 시간에 맞춰<br>선택한 영업점을 방문해 주세요.</p>
      <div class="card abs" style="left:15px;right:18px;top:368px;height:240px;border-radius:4px;border-color:#d0d0d0"><b style="position:absolute;left:18px;top:17px;font-size:18px;line-height:24px;font-weight:600">예약 정보</b>
        <i style="position:absolute;left:18px;right:17px;top:58px;height:1px;background:#d9d9d9"></i>${kvRows([['방문 영업점', '강남중앙지점'], ['방문 일시', '11월 4일 (수) 오전 11:00'], ['상담 분야', '예금 · 적금'], ['상담 번호', 'NH-20261104-001']], 70)}</div>
      <div class="cta"><button class="btn" data-go="asset">가입 계좌 확인하기</button></div></div>`,
  });

  /* ---------- 상품비교 ---------- */
  def('cmpSel', {
    title: '상품비교 · 선택',
    html() {
      const sel = S.cmp, rest = P.filter((p) => !sel.includes(p.n));
      return `${hd('상품비교')}<div class="bd"><div style="position:relative;height:208px;margin-top:3px;background:#f8f9fb"><b style="position:absolute;left:16px;top:38px;font-size:24px;line-height:31px;font-weight:600">선택한 상품을<br>비교해보세요.</b>
          <span style="position:absolute;left:16px;top:108px;font-size:15px;color:#888">최대 3개까지 비교할 수 있어요.</span>${img('ill_cmp', 131, 100, 'position:absolute;left:244px;top:79px')}</div>
        <div class="row" style="margin:26px 16px 0;height:24px"><b style="font-size:17px;font-weight:600">선택한 상품 <span style="color:#0066b3">${sel.length}</span>개</b><span class="sp"></span><button data-act="clear" style="font-size:11px;color:#888;padding:5px 0 0 6px">전체 삭제</button></div>
        <div style="margin-top:19px">${sel.map((n) => { const p = P.find((x) => x.n === n); return `<div class="card row" style="margin:0 17px 14px;height:80px;border-radius:16px;padding:0 13px 0 17px;border-color:#d9d9d9">${img('ic_nhround', 43, 41)}
          <span style="margin-left:12px"><b style="display:block;font-size:18px;line-height:24px;font-weight:600">${p.n}</b><span style="font-size:13.5px"><b style="color:#0066b3;font-weight:600">최고 ${p.max}%</b>&nbsp; <span style="color:#777">기본 ${p.base}%</span></span></span><span class="sp"></span>
          <button data-act="rm" data-v="${n}" style="width:30px;height:30px;display:flex;align-items:center;justify-content:center">${I.x(15, '#555', 1.3)}</button></div>`; }).join('')}
          ${rest.map((p) => `<button data-act="add" data-v="${p.n}" class="row" style="margin:0 17px 14px;width:366px;height:60px;border-radius:16px;border:1px dashed #b9c4d0;justify-content:center;gap:8px;font-size:15px;color:#777;--hr:16px">${I.plus('#777', 12)} ${p.n} 추가</button>`).join('')}</div>
        </div><div class="ft"><button class="btn ${sel.length < 2 ? 'dis' : ''}" data-go="cmpTable">선택상품 비교하기</button></div>`;
    },
    acts: {
      rm(t) { S.cmp = S.cmp.filter((n) => n !== t.dataset.v); App.rerender(); },
      add(t) { S.cmp = P.map((p) => p.n).filter((n) => S.cmp.includes(n) || n === t.dataset.v); App.rerender(); },
      clear() { S.cmp = []; App.rerender(); },
    },
  });
  def('cmpTable', {
    title: '상품비교 · 결과',
    html() {
      const sel = S.cmp.map((n) => P.find((p) => p.n === n)), n = sel.length, cw = 90;
      const cell = (i, html, st = '') => `<div style="width:${cw}px;display:flex;align-items:center;justify-content:center;text-align:center;${i ? 'border-left:1px solid #d9d9d9;' : ''}${st}">${html}</div>`;
      const row = (label, f, h = 56) => `<div class="row" style="height:${h}px;align-items:stretch;border-top:1px solid #d9d9d9"><div style="width:90px;background:#f8f9fb;display:flex;align-items:center;justify-content:center;font-size:12px">${label}</div>${sel.map((p, i) => cell(i, f(p, i))).join('')}</div>`;
      return `${hd('상품비교')}<div class="bd"><div style="position:relative;margin:26px 0 0 24px;width:${90 + n * cw}px">
          <i style="position:absolute;left:90px;top:0;width:${cw}px;height:382px;border-radius:10px;background:#e8f3fc"></i>
          <i style="position:absolute;left:107px;top:-11px;width:55px;height:20px;border-radius:10px;background:#0066b3;color:#fff;font-style:normal;font-size:11.5px;line-height:20px;text-align:center">BEST</i>
          <div class="row" style="position:relative;height:84px;align-items:flex-start;padding-left:90px">${sel.map((p, i) => `<button data-go="product" ${i ? 'data-u' : ''} style="width:${cw}px;padding-top:14px;display:flex;flex-direction:column;align-items:center;font-size:12.5px;line-height:14px;font-weight:500;--hr:10px">${img('ic_nhround', 31, 30)}<span style="margin-top:8px;width:80px;word-break:keep-all">${p.n.replace('e 미니', 'e 미니')}</span></button>`).join('')}</div>
          <div style="position:relative;border-bottom:1px solid #d9d9d9">${row('최고금리', (p, i) => `<span style="font-size:19px;${i ? 'color:#555' : 'color:#0066b3;font-weight:500'}">${p.cMax || p.max}%</span>`)}
            ${row('기본금리', (p, i) => `<span style="font-size:13px;${i ? 'color:#777' : ''}">${p.cBase || p.base}%</span>`)}${row('가입기간', (p, i) => `<span style="font-size:12px;line-height:14px;${i ? 'color:#777' : ''}">${p.termC}</span>`)}
            ${row('가입금액', (p, i) => `<span style="font-size:12px;line-height:14px;${i ? 'color:#777' : ''}">${p.amt}</span>`)}${row('우대조건', (p, i) => `<span style="font-size:12px;line-height:14px;${i ? 'color:#777' : ''}">${p.cond}</span>`)}</div></div>
        <div class="row" style="margin:48px 0 0 21px;gap:7px;font-size:18px;font-weight:600">${img('ic_chk2', 21, 23)}이런 상품도 있어요</div>
        <div class="hs" style="margin-top:9px;padding:0 19px 6px;gap:10px">${[0, 1, 0, 1].map((k) => { const c = miniCards()[k]; return `<button data-go="aiProd" data-u class="card" style="flex:none;position:relative;width:128px;height:152px;border-radius:14px;text-align:left;--hr:14px;border-color:#d9d9d9">
          <b style="position:absolute;left:8px;top:18px;font-size:14px;line-height:21px;font-weight:600">${c[0]}</b>${img(c[1], c[2] * 0.72, c[3] * 0.72, 'position:absolute;right:13px;bottom:14px')}</button>`; }).join('')}</div>
        <div style="height:14px"></div></div><div class="ft"><button class="btn g" data-back>다시 선택하기</button></div>`;
    },
  });
})();
