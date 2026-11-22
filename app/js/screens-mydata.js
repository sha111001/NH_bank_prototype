/* 마이데이터 메인 · 목표(빈/등록) · 목표등록 · 자산모아보기 · 진단하기 시트 */
(function () {
  const { def, img, I, hd, won } = App;
  const S = App.state;
  const $ = (s, el) => el.querySelector(s);
  const BG = '#f3f4f8';
  const timeRow = (t, mt = 20) => `<div class="row" style="margin:${mt}px 16px 0;height:24px;font-size:14px;color:#555;gap:7px">${t} <span data-act="reload" style="display:flex;padding:4px;margin:-4px">${I.refresh('#555', 11)}</span><span class="sp"></span>
      <button data-go="notice" data-u style="padding:4px;margin-right:-1px;display:flex">${I.horn}</button></div>`;
  App.timeRow = timeRow;
  App.acts.reload = (t) => { t.firstElementChild.style.transition = 'transform .5s'; t.firstElementChild.style.transform = 'rotate(360deg)'; setTimeout(() => (t.firstElementChild.style.cssText = ''), 520); App.toast('최신 정보 조회는 실제 서버가 필요합니다.', '테스트 동작'); };
  /* 도넛 차트 */
  App.donut = (segs, o) => { const R = o.r, w = o.w, C = 2 * Math.PI * R; let acc = 0;
    return `<svg width="${o.size}" height="${o.size}" viewBox="0 0 ${o.size} ${o.size}" style="display:block;transform:rotate(${o.rot || -90}deg)">${segs.map((s) => { const len = C * s[0] / 100, off = -C * acc / 100; acc += s[0];
      return `<circle cx="${o.size / 2}" cy="${o.size / 2}" r="${R}" fill="none" stroke="${s[1]}" stroke-width="${w}" stroke-dasharray="${len} ${C - len}" stroke-dashoffset="${off}" ${o.anim ? `class="dnA" style="--len:${len};--c:${C}"` : ''}/>`; }).join('')}</svg>`; };
  const chev = (c = '#111') => I.chev(c, 12);
  const pdots = (n, mt, pause) => `<div class="row pdots" style="justify-content:center;gap:6px;margin-top:${mt}px;height:8px">${Array.from({ length: n }, (_, i) => `<i style="height:6px;border-radius:3px;${i ? 'width:6px;background:#cfcfcf' : 'width:17px;background:#0066b3'}"></i>`).join('')}${pause ? '<b style="font-size:8px;color:#888;letter-spacing:1px;margin-left:3px">❙❙</b>' : ''}</div>`;
  App.pdots = pdots;

  /* ---------- NH마이데이터 메인 ---------- */
  def('mydata', {
    title: 'NH마이데이터',
    html() {
      const g = S.goals[0];
      return `<header class="hd" style="height:62px"><div class="abs" style="left:25px;top:24px;font-size:17px;line-height:24px;font-weight:600">NH마이데이터</div>
          <div class="rt" style="top:19px;right:20px;gap:3px"><button data-go="history" data-u aria-label="내역"><svg width="21" height="17" viewBox="0 0 21 17" fill="none" stroke="#111" stroke-width="1.4"><rect x="1" y="1.5" width="19" height="14" rx="2"/><path d="M1 5.5h19M4.5 9h12M4.5 12h8"/></svg></button>
          <button data-go="notice" data-u aria-label="알림">${I.bell}</button><button data-home aria-label="홈">${I.home}</button><button data-go="menu" aria-label="전체메뉴">${I.grid}</button></div></header>
        <div class="bd" style="background:#f8f9fb">
        <div class="hs" style="padding:1px 16px 0;gap:21px">${[['', '메뉴추가', 'menu', 1], ['sc_asset', '자산<br>모아보기', 'asset'], ['sc_spend', '소비<br>모아보기', 'spend'], ['sc_card', '카드이용<br>내역', 'recur'], ['sc_bal', '밸런스<br>진단', 'balIntro'], ['dg_asset', '자산<br>진단', 'diagForm', 1], ['g_100m', '목표', 'goals', 1]].map((s) =>
          `<button data-go="${s[2]}" ${s[3] ? 'data-u' : ''} style="flex:none;width:54px;font-size:12.5px;line-height:13.5px;text-align:center;--hr:10px"><span style="width:54px;height:54px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 1px #eef0f3">${s[0] ? img(s[0], null, 31) : I.plus('#0066b3', 26).replace('stroke-width="1.8"', 'stroke-width="1.3"')}</span><span style="display:block;margin-top:8px;white-space:nowrap">${s[1]}</span></button>`).join('')}</div>
        <div id="loanBn" class="row" style="margin:21px 14px 0 25px;height:60px"><button data-go="aiProd" data-u class="row" style="flex:1;height:60px;text-align:left;gap:2px;font-size:16px;line-height:26px;font-weight:600">${img('bn_loan', 90, 60, 'mix-blend-mode:multiply')}<span>대출이자 다이어트가 필요하다면?<br>AI대출금리케어를 만나보세요!</span></button>
          <button data-act="hideBn" style="width:24px;height:24px;margin-top:-28px;display:flex;align-items:center;justify-content:center">${I.x(10, '#555', 1.3)}</button></div>
        <div style="position:relative;margin:38px 17px 0;height:216px;border-radius:16px;background:linear-gradient(90deg,#2c82c2,#0066b3 70%);color:#fff">
          <span style="position:absolute;left:21px;top:27px;font-size:16px">순자산</span><span style="position:absolute;right:20px;top:28px;font-size:13.5px">00.00.00 기준</span>
          <b style="position:absolute;left:20px;top:64px;font-size:27px;line-height:38px;font-weight:700">0,000,000원</b><span style="position:absolute;left:20px;top:106px;font-size:13.5px">00.00 보다 000,000원 줄었어요.</span>
          <button data-go="asset" style="position:absolute;left:20px;top:149px;width:159px;height:42px;border-radius:6px;background:rgba(255,255,255,.24);color:#fff;font-size:15px;--hr:6px">자산 추가하기</button>
          <button data-go="asset" style="position:absolute;left:187px;top:149px;width:159px;height:42px;border-radius:6px;background:rgba(255,255,255,.24);color:#fff;font-size:15px;--hr:6px">전체 보기</button></div>
        <button data-go="goals" data-u class="row" style="margin:32px 17px 0 22px;width:361px;height:26px;font-size:16px;font-weight:600;text-align:left">내 목표 확인하기<span class="sp"></span><span style="margin-right:8px;display:flex">${chev()}</span></button>
        <button data-go="goals" class="card" style="display:block;position:relative;margin:11px 17px 0;width:366px;height:137px;border-radius:8px;text-align:left;--hr:8px;border-color:#d9d9d9">${img('g_100m', 26, 32, 'position:absolute;left:23px;top:21px')}
          <b style="position:absolute;left:64px;top:28px;font-size:18px;line-height:24px;font-weight:500">${g ? g.name : '1억 모으기'}</b><span style="position:absolute;left:21px;top:60px;font-size:14.5px">목표일까지 ${g ? g.days : '0000'}일 남음</span>
          <span style="position:absolute;right:16px;top:64px;font-size:12px;color:#888">${g ? '0' : '00'}% 완료</span><i style="position:absolute;left:21px;right:16px;top:91px;height:24px;border-radius:3px;background:#f1f3f6"><i style="display:block;width:${g ? 2 : 43}%;height:100%;border-radius:3px;background:#0066b3"></i></i></button>
        <button data-go="spend" class="card" style="display:block;position:relative;margin:31px 16px 0 17px;width:367px;height:310px;border-radius:16px;text-align:left;--hr:16px;border-color:#d9d9d9">
          <span style="position:absolute;left:21px;top:26px;font-size:16px">이번달 총소비</span><span style="position:absolute;right:21px;top:28px;font-size:14px;color:#777">26.05.31 기준</span>
          <b style="position:absolute;left:21px;top:63px;font-size:30px;line-height:40px;font-weight:700">00,000원</b><span style="position:absolute;left:21px;top:105px;font-size:13.5px">지난달보다 <span style="color:#0066b3">일회성 소비</span>가 <span style="color:#0066b3">00,000</span>원 늘었어요.</span>
          <span style="position:absolute;left:13px;top:134px">${App.areaChart(340, 162)}</span></button>
        <button data-go="aiProd" data-u class="row" style="margin:45px 17px 0 22px;width:361px;height:26px;font-size:16px;font-weight:600;text-align:left">나에게 맞는 상품 확인하기<span class="sp"></span><span style="margin-right:6px;display:flex">${chev()}</span></button>
        <div class="hs" id="trip" style="margin-top:15px;padding:0 16px;gap:10px">${[0, 1, 2, 3].map(() => `<button data-go="aiProd" data-u style="flex:none;width:366px;height:217px;border-radius:14px;overflow:hidden;scroll-snap-align:center;--hr:14px" aria-label="해외로 향하는 발걸음, 결제 데이터로 파헤치기">${img('bn_trip', 366, 217)}</button>`).join('')}</div>
        ${pdots(4, 22)}
        <div style="margin-top:55px">${[['spend', 0, '예산으로 한달 살기 도전'], ['diagForm', 0, '내 자산은 어느정도일까?'], ['balIntro', 0, '밸런스 진단'], ['goals', 0, '자산 목표를 설정하고 차곡차곡 목돈을 마련해 보세요!']].map((c, i) =>
          `<button data-go="${c[0]}" ${c[1] ? 'data-u' : ''} aria-label="${c[2]}" style="display:block;margin:0 16px 16px;width:366px;height:176px;border-radius:14px;overflow:hidden;--hr:14px">${img('pc_' + (i + 1), 366, 176)}</button>`).join('')}</div>
        <div style="height:40px"></div></div>`;
    },
    init(el) { const hs = $('#trip', el); hs.addEventListener('scroll', () => { const i = Math.round(hs.scrollLeft / 376); el.querySelectorAll('.pdots i').forEach((d, k) => { d.style.width = k === i ? '17px' : '6px'; d.style.background = k === i ? '#0066b3' : '#cfcfcf'; }); }); },
    acts: { hideBn(t, el) { $('#loanBn', el).style.display = 'none'; } },
  });

  /* ---------- 목표 ---------- */
  const ribbon = '<i style="position:absolute;right:16px;top:0;width:29px;height:29px;background:#65aedb;color:#fff;font-style:normal;font-size:10.5px;line-height:25px;text-align:center;clip-path:polygon(0 0,100% 0,100% 100%,50% 82%,0 100%)">추천</i>';
  const recCard = (ic, t) => `<button data-act="preset" data-v="${t}" style="display:block;position:relative;margin:21px 20px 0;width:326px;height:122px;border-radius:8px;background:#f3f3f3;text-align:left;--hr:8px">${ribbon}
      <span style="position:absolute;left:21px;top:28px;width:34px;height:34px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center">${img(ic, 34, 34, 'mix-blend-mode:multiply')}</span>
      <b style="position:absolute;left:65px;top:34px;font-size:15px;line-height:22px;font-weight:500">${t}</b><span style="position:absolute;left:23px;top:69px;font-size:12.5px">지금부터 계획 세우기</span>
      <span class="row" style="position:absolute;right:23px;top:65px;font-size:13px;color:#999;gap:4px"><i style="width:21px;height:21px;border:1px dashed #999;border-radius:50%;font-style:normal;font-size:12px;line-height:19px;text-align:center">?</i>일 남음</span></button>`;
  const goalCard = (g, i) => `<button data-act="goal" data-v="${i}" style="display:block;position:relative;margin:${i ? 14 : 0}px 20px 0;width:326px;height:123px;border-radius:8px;background:#fff;box-shadow:0 1px 6px rgba(0,0,0,.13);text-align:left;--hr:8px">
      ${img(g.ic || 'g_home', null, 29, 'position:absolute;left:21px;top:21px')}<b style="position:absolute;left:58px;top:24px;font-size:16px;line-height:24px;font-weight:500">${g.name}</b>
      <span style="position:absolute;left:20px;top:53px;font-size:13px">목표일까지 ${g.days}일 남음</span><span style="position:absolute;right:16px;top:56px;font-size:10px;color:#888">${g.pct}% 완료</span>
      <i style="position:absolute;left:20px;right:15px;top:82px;height:21px;border-radius:3px;background:#f1f3f6"><i style="display:block;width:${Math.max(g.pct, 2)}%;height:100%;border-radius:3px;background:linear-gradient(90deg,#207abd,#0267b3)"></i></i></button>`;
  const pill = (t, act) => `<div class="r" style="margin:0 17px 0 0;height:26px"><button data-act="${act}" style="height:26px;padding:0 11px;border:1px solid #c9c9c9;border-radius:13px;font-size:12.5px;color:#aaa;background:#fff;--hr:13px">${t}</button></div>`;
  def('goals', {
    title: '목표',
    html() {
      const has = S.goals.length > 0, top = has ? S.goals[0] : null;
      const chs = has ? [['ch_save', '#d2f1ff', '소비 줄이기<br>챌린지', '이번 달 불필요한<br>지출을 줄여봐요!'], ['ch_coin', '#c1cbf0', '목돈 만들기<br>챌린지', '6개월 후 목표<br>금액을 모아봐요!'], ['ch_0', '#c9f1dc', '저축 습관<br>챌린지', '매일 조금씩<br>저축해봐요!']]
        : [['ch_0', '#d2f1ff', '챌린지', '매일매일 챌린지'], ['ch_0', '#d2f1ff', '챌린지', '매일매일 챌린지'], ['ch_0', '#d2f1ff', '챌린지', '매일매일 챌린지']];
      return `${hd('목표', { right: App.rBellGrid })}<div class="bd" style="background:${BG}">${timeRow('05.31 17:21')}
        <div style="position:relative;height:${has ? 106 : 100}px;margin-top:${has ? 4 : 12}px">${has
          ? `<div style="position:absolute;left:22px;top:6px;font-size:20px;line-height:30px;font-weight:500">${S.user}님<br><span style="color:#0066b3">${top.name.replace(/하기$| 모으기$/, '')}</span>까지<br><span style="color:#0066b3">${won(top.amount * 10000)}원</span> 남았습니다</div>${img('ill_house', 89, 78, 'position:absolute;left:282px;top:0')}`
          : `<div style="position:absolute;left:22px;top:10px;font-size:22px;line-height:33px">하나부터 천천히!<br><b style="font-weight:600">목표를 달성해 보세요</b></div>${img('ill_goal0', 78, 59, 'position:absolute;left:290px;top:4px')}`}</div>
        ${pill('순서설정', 'order')}
        <div style="margin:22px 17px 0;padding:${has ? 22 : 32}px 0 30px;border-radius:12px;background:#fff;box-shadow:0 1px 5px rgba(0,0,0,.12)">
          ${has ? `<div class="r" style="margin:0 20px 16px 0;height:22px"><button data-act="all" class="row" style="display:inline-flex;font-size:13px;gap:14px;padding:3px">전체보기 ${I.chev('#333', 10, 1.4)}</button></div>${S.goals.map(goalCard).join('')}${recCard('g_cap', '등록금, 얼마나 들까').replace('margin:21px', 'margin:16px')}`
            : `<button data-go="goalForm" style="display:block;position:relative;margin:0 20px;width:326px;height:119px;border-radius:8px;background:#fff;box-shadow:0 1px 6px rgba(0,0,0,.13);text-align:left;--hr:8px">
              <i style="position:absolute;left:20px;top:17px;width:29px;height:29px;border:1px dashed #666;border-radius:50%;font-style:normal;font-size:15px;line-height:27px;text-align:center;color:#555">?</i>
              <b style="position:absolute;left:58px;top:21px;font-size:15px;line-height:24px;font-weight:500">목표등록하기</b><span style="position:absolute;right:16px;top:19px">${I.plus('#ccc', 16).replace('stroke-width="1.8"', 'stroke-width="1.2"')}</span>
              <span style="position:absolute;left:20px;top:51px;font-size:12px;color:#777">목표일까지 0000일 남음</span><span style="position:absolute;right:15px;top:53px;font-size:10px;color:#888">00% 완료</span>
              <i style="position:absolute;left:20px;right:15px;top:78px;height:20px;border-radius:3px;background:#f1f3f6"></i></button>
              ${recCard('g_ring', '결혼, 얼마나 들까')}${recCard('g_cap', '등록금, 얼마나 들까')}${recCard('g_car', '내차 뽑기, 얼마나 들까')}`}</div>
        <div style="position:relative;height:96px;margin-top:${has ? 52 : 42}px"><div style="position:absolute;left:${has ? 20 : 21}px;top:6px;font-size:20px;line-height:30px;font-weight:500">${has ? `<span style="color:#0066b3">${S.user}</span>님을 위한 6개월<br>챌린지!` : '내 관심사에 맞는 6개월<br>챌린지!'}</div>${img('ill_shoes', 68, 66, 'position:absolute;left:310px;top:4px')}</div>
        ${pill('관심사 설정', 'interest')}
        <div class="hs" id="chs" style="margin-top:21px;padding:0 16px 6px;gap:10px">${chs.map((c) => `<button data-act="challenge" data-v="${c[2].replace('<br>', ' ')}" style="flex:none;position:relative;width:166px;height:143px;border-radius:8px;background:${c[1]};text-align:left;box-shadow:0 2px 3px rgba(0,0,0,.1);--hr:8px">
          <span style="position:absolute;left:23px;top:${has ? 33 : 24}px;width:34px;height:34px;border-radius:50%;background:#fff;overflow:hidden">${img(c[0], 36, 36, 'margin:-1px')}</span>
          <b style="position:absolute;left:65px;top:${has ? 30 : 31}px;font-size:15px;line-height:19px;font-weight:500">${c[2]}</b><span style="position:absolute;left:23px;top:${has ? 89 : 71}px;font-size:13px;line-height:16.5px;color:#666">${c[3]}</span></button>`).join('')}</div>
        ${pdots(3, 20)}
        <div style="position:relative;margin:34px 16px 0;height:212px;border-radius:8px;background:#e2e6f5;box-shadow:0 2px 3px rgba(0,0,0,.08)">
          <b style="position:absolute;left:23px;top:36px;font-size:18px;line-height:24px;font-weight:500">${has ? `${S.user}님께 딱 맞는 추천상품` : '목표 달성을 위한 추천상품'}</b><span style="position:absolute;left:23px;top:69px;font-size:12px;color:#555">${has ? '최근 소비패턴과 목표를 분석해 추천드려요' : '상품가입 시 실제 금리와 다를 수 있습니다.'}</span>
          ${img('ill_rec', 84, 92, 'position:absolute;left:266px;top:10px')}
          <button data-go="aiProd" data-u class="row" style="position:absolute;left:17px;top:106px;width:334px;height:76px;border-radius:8px;background:#fff;padding:0 22px 0 ${has ? 16 : 21}px;text-align:left;--hr:8px">${img(has ? 'ic_sav' : 'ic_rec', null, has ? 37 : 33)}
            <span style="margin-left:${has ? 11 : 13}px;font-size:15px;line-height:19px;font-weight:600">${has ? '내 목돈 만들기에 맞는 적금 상품<br><small style="font-size:11px;font-weight:400">매달 꾸준히 모을 수 있는 상품을 추천드려요.</small>' : '나만 알고 싶은 추천상품'}</span><span class="sp"></span>${I.chev('#111', 11)}</button></div>
        <div style="height:66px"></div></div>
        <button data-go="goalForm" data-u class="row" style="position:absolute;right:17px;bottom:18px;height:37px;padding:0 15px 0 16px;border-radius:19px;background:#0066b3;color:#fff;font-size:16px;font-weight:500;gap:5px;box-shadow:0 2px 6px rgba(0,60,120,.35);z-index:5;--hr:19px">${I.plus('#fff', 13)}목표등록</button>`;
    },
    acts: {
      preset(t) { GF.name = t.dataset.v.replace(', 얼마나 들까', ''); GF.desc = t.dataset.v; App.go('goalForm'); },
      goal(t) { const g = S.goals[Number(t.dataset.v)];
        App.sheet(`<div class="sheet" style="padding:28px 20px 16px"><b style="font-size:20px">${g.name}</b><button class="x" data-close style="right:14px;top:20px">${I.x(15)}</button>
          <div style="margin-top:16px;font-size:14.5px;line-height:30px"><div class="kv" style="line-height:30px"><span>목표 금액</span><b>${won(g.amount * 10000)}원</b></div><div class="kv" style="line-height:30px"><span>목표 기간</span><b>${g.months}개월 (${g.days}일 남음)</b></div><div class="kv" style="line-height:30px"><span>월 필요 저축액</span><b style="color:#0066b3">${won(Math.ceil(g.amount * 10000 / Math.max(g.months, 1)))}원</b></div></div>
          <div class="row" style="gap:10px;margin-top:16px"><button class="btn o" data-act="goalDel" data-v="${t.dataset.v}">삭제</button><button class="btn" data-close>확인</button></div></div>`); },
      goalDel(t) { S.goals.splice(Number(t.dataset.v), 1); App.closeSheets(); App.rerender(); },
      order() { if (S.goals.length < 2) return App.toast('목표가 2개 이상일 때 순서를 바꿀 수 있습니다.'); S.goals.reverse(); App.rerender(); App.toast('목표 순서를 변경했습니다.'); },
      all() { App.toast(`등록된 목표 ${S.goals.length}개를 모두 표시하고 있습니다.`); },
      interest() { App.go('chat'); },
      challenge(t) { App.toast(`‘${t.dataset.v}’ 상세 화면은 디자인에 없습니다.`, '프로토타입 안내'); },
    },
  });

  /* ---------- 목표등록 ---------- */
  const GF = { name: '', desc: '', amt: 0, mon: 0, day: 0, fix: true };
  const fInput = (id, val, ph, right) => `<label class="row" style="margin:11px 21px 0 22px;height:50px;border:1px solid #d9d9d9;border-radius:4px;padding:0 13px;font-size:16px;background:#fff">${right}</label>`;
  def('goalForm', {
    title: '목표등록',
    html: () => `${hd('목표등록', { right: `<button data-back>취소</button>` })}<div class="bd" style="background:${BG}">
      <div class="card" style="margin:26px 16px 0 17px;border-radius:8px;padding-bottom:26px;border-color:#d9d9d9">
        <label class="row" style="height:89px;padding:0 20px 0 18px;border-bottom:1px solid #d9d9d9">${img('ic_pen', 33, 37)}<input id="gName" value="${GF.name}" placeholder="목표이름 작성" maxlength="14" style="flex:1;min-width:0;margin-left:13px;border:0;outline:0;font-size:17px;height:40px"></label>
        <div style="margin:30px 22px 0;font-size:16px;line-height:22px;font-weight:500">목표설명</div>
        <label class="row" style="margin:10px 20px 0 22px;height:50px;border:1px solid #d9d9d9;border-radius:4px;padding:0 13px 0 12px;font-size:16px"><input id="gDesc" value="${GF.desc}" placeholder="목표에 대한 소개 작성" maxlength="24" style="flex:1;min-width:0;border:0;outline:0;height:100%"><span data-act="clr" data-v="gDesc" style="display:flex;padding:3px;margin:-3px">${I.clr}</span></label>
        <i style="display:block;margin:26px 20px 0 22px;height:1px;background:#e3e3e3"></i>
        <div class="row" style="margin:29px 20px 0 22px;height:22px;font-size:16px;font-weight:500">목표 금액<span class="sp"></span><span id="gAmtL" style="font-weight:400;color:#999">(${GF.amt ? won(GF.amt * 10000) : '00'}원)</span></div>
        <label class="row" style="margin:16px 20px 0 22px;height:50px;border:1px solid #d9d9d9;border-radius:4px;padding:0 13px;font-size:16px"><input id="gAmt" inputmode="numeric" value="${GF.amt || ''}" placeholder="0000" style="flex:1;min-width:0;text-align:right;border:0;outline:0;height:100%"><span style="margin:0 12px 0 6px">만원</span><span data-act="clr" data-v="gAmt" style="display:flex;padding:3px;margin:-3px">${I.clr}</span></label>
        <div class="row" style="margin:13px 0 0 25px;gap:6px">${[['+1만', 1], ['+10만', 10], ['+100만', 100], ['+1,000만', 1000], ['+1억', 10000]].map((c) => `<button data-act="amt" data-v="${c[1]}" class="pchip" style="height:28px;border-radius:14px;font-size:13.5px;padding:0 9px">${c[0]}</button>`).join('')}</div>
        <i style="display:block;margin:26px 20px 0 22px;height:1px;background:#e3e3e3"></i>
        <div class="row" style="margin:28px 20px 0 22px;height:22px;font-size:16px;font-weight:500;gap:4px">목표 기간 <span data-act="help" style="display:flex">${I.q(16)}</span></div>
        <div class="row" style="margin:11px 20px 0 22px;height:50px;border:1px solid #d9d9d9;border-radius:4px;padding:0 13px;font-size:16px"><span class="sp"></span><input id="gMon" inputmode="numeric" value="${GF.mon || ''}" placeholder="0000" style="width:60px;text-align:right;border:0;outline:0;height:100%"><span style="margin-left:5px">개월</span>
          <input id="gDay" inputmode="numeric" value="${GF.day || ''}" placeholder="0" style="width:38px;text-align:right;border:0;outline:0;height:100%"><span style="margin:0 12px 0 5px">일</span><span data-act="clr" data-v="gMon" style="display:flex;padding:3px;margin:-3px">${I.clr}</span></div>
        <div class="row" style="margin:6px 0 0 25px;gap:6px">${[['+1개월', 1], ['+3개월', 3], ['+6개월', 6], ['+1년', 12], ['+3년', 36]].map((c) => `<button data-act="mon" data-v="${c[1]}" class="pchip" style="height:28px;border-radius:14px;font-size:13.5px;padding:0 9px">${c[0]}</button>`).join('')}</div>
        <div class="r" style="margin:25px 20px 0 0"><button data-act="fix" class="row" style="display:inline-flex;gap:13px;font-size:15.5px;height:26px"><i id="gFix" style="width:22px;height:22px;border-radius:3px;display:flex;align-items:center;justify-content:center;${GF.fix ? 'background:#0066b3' : 'background:#fff;box-shadow:inset 0 0 0 1.5px #bbb'}"><span style="width:12px;display:flex">${I.check()}</span></i>목표달성일 지정하기</button></div>
        <div class="c" id="gSum" style="margin:23px 20px 0 22px;height:99px;border-radius:4px;background:#f8f9fb;padding-top:30px"></div></div>
      <div style="height:26px"></div></div><div class="ft" style="background:${BG}"><button class="btn" data-act="save">확인</button></div>`,
    init(el) {
      const sum = () => { const months = GF.mon + GF.day / 30; const d = new Date(2026, 4, 31); d.setMonth(d.getMonth() + GF.mon); d.setDate(d.getDate() + GF.day);
        const per = months > 0 && GF.amt ? Math.ceil(GF.amt * 10000 / months) : 0;
        $('#gSum', el).innerHTML = `<div style="font-size:14px;color:#888">${GF.fix && months ? `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}까지` : '2036.05.31까지'}</div><div style="margin-top:4px;font-size:17px;font-weight:600"><span style="color:#0066b3">월 ${per ? won(per) : '000,000'}원</span> 저축이 필요합니다.</div>`;
        $('#gAmtL', el).textContent = `(${GF.amt ? won(GF.amt * 10000) : '00'}원)`; };
      el._sum = sum; sum();
      el.addEventListener('input', (e) => { const id = e.target.id;
        if (id === 'gName') GF.name = e.target.value; if (id === 'gDesc') GF.desc = e.target.value;
        if (['gAmt', 'gMon', 'gDay'].includes(id)) { e.target.value = e.target.value.replace(/\D/g, '').slice(0, id === 'gAmt' ? 7 : id === 'gMon' ? 3 : 2); GF[{ gAmt: 'amt', gMon: 'mon', gDay: 'day' }[id]] = Number(e.target.value); sum(); } });
    },
    acts: {
      clr(t, el) { const id = t.dataset.v; $('#' + id, el).value = ''; if (id === 'gDesc') GF.desc = ''; if (id === 'gAmt') GF.amt = 0; if (id === 'gMon') { GF.mon = 0; GF.day = 0; $('#gDay', el).value = ''; } el._sum(); },
      amt(t, el) { GF.amt = Math.min(GF.amt + Number(t.dataset.v), 9999999); $('#gAmt', el).value = GF.amt; el._sum(); },
      mon(t, el) { GF.mon = Math.min(GF.mon + Number(t.dataset.v), 600); $('#gMon', el).value = GF.mon; el._sum(); },
      fix(t, el) { GF.fix = !GF.fix; const b = $('#gFix', el); b.style.background = GF.fix ? '#0066b3' : '#fff'; b.style.boxShadow = GF.fix ? '' : 'inset 0 0 0 1.5px #bbb'; el._sum(); },
      help() { App.toast('목표 달성까지 걸리는 기간을 개월·일 단위로 입력합니다.'); },
      save() {
        if (!GF.name.trim()) return App.toast('목표 이름을 입력해 주세요.'); if (!GF.amt) return App.toast('목표 금액을 입력해 주세요.'); if (!GF.mon && !GF.day) return App.toast('목표 기간을 입력해 주세요.');
        const ic = /집/.test(GF.name) ? 'g_home' : /여행/.test(GF.name) ? 'g_trip' : /결혼/.test(GF.name) ? 'g_ring' : /등록금|학/.test(GF.name) ? 'g_cap' : /차/.test(GF.name) ? 'g_car' : 'g_100m';
        S.goals.push({ name: GF.name.trim(), desc: GF.desc, amount: GF.amt, months: GF.mon + (GF.day ? 1 : 0), days: GF.mon * 30 + GF.day, pct: 0, ic });
        Object.assign(GF, { name: '', desc: '', amt: 0, mon: 0, day: 0 });
        App.toast('목표가 등록되었습니다. (새로고침 시 초기화)', '테스트 동작'); App.back();
      },
    },
  });

  /* ---------- 자산모아보기 ---------- */
  const aSt = { cat: '계좌' };
  const SECS = [['대출', '주택담보대출 1건 · 남은 금액 84,500,000원', 1], ['투자', '총 투자자산 12,430,000원 · 수익률 +4.2%', 1], ['연금', '연금자산 18,200,000원 · 예상 연금 확인', 1], ['보험', '보험을 연결해보세요!'], ['선불카드 · 페이', '선불카드·페이를 연결해보세요!'], ['부동산', '부동산을 추가해보세요!'], ['기타', '다양한 자산을 추가해보세요!', 0, 1], ['내가 몰랐던 숨은자산', '숨은 자산을 찾아보세요!']];
  def('asset', {
    title: '자산모아보기',
    html: () => `${hd('자산모아보기', { right: App.rBellGrid })}<div class="bd">
      <div style="background:${BG};height:208px;margin-top:4px;position:relative">${timeRow('05.31 17:21', 0).replace('margin:0px 16px 0', 'position:absolute;left:0;right:0;top:28px;margin:0 16px')}
        <b style="position:absolute;left:16px;top:71px;font-size:17px;line-height:24px;font-weight:600">순자산</b><b style="position:absolute;left:16px;top:110px;font-size:28px;line-height:40px;font-weight:700">0,000,000원</b>
        <span style="position:absolute;left:16px;top:152px;font-size:13px">00.00 보다 000,000원 <span style="color:#0066b3">줄었어요</span></span>
        <button data-act="diag" style="position:absolute;right:17px;top:107px;width:74px;height:37px;border:1px solid #d0d0d0;border-radius:6px;background:#fff;font-size:14px;--hr:6px">진단하기</button></div>
      <div class="hs chips" id="aChips" style="margin-top:13px;padding:0 17px;gap:9px">${['계좌', '대출', '투자', '연금', '보험', '선불', '부동산', '기타'].map((c) => `<button class="chip ${c === aSt.cat ? 'on' : ''}" data-act="cat" data-v="${c}" style="height:36px;border-radius:18px;font-size:14.5px;padding:0 16px;font-weight:${c === aSt.cat ? 500 : 400};--hr:18px">${c}</button>`).join('')}</div>
      <div id="sec-계좌" class="row" style="margin:28px 16px 0 17px;height:26px"><span style="font-size:17px">계좌</span><span class="sp"></span><button data-go="menu" data-u class="row" style="font-size:13.5px;gap:3px;padding:3px">${I.gear('#333', 14)}즐겨찾기</button></div>
      <div style="margin:9px 17px 0;font-size:24px;line-height:32px">0,000,000</div>
      <div style="margin:36px 17px 0;font-size:14px;line-height:20px">입출금</div>
      ${[['온라인자립예탁금', '0,000,000원'], ['자립예탁금', '000원']].map((a, i) => `<button data-go="history" data-u class="row" style="margin:${i ? 21 : 20}px 17px 0;width:366px;height:56px;text-align:left">${img('ic_nh36', 34, 33)}<span style="margin-left:13px"><span style="display:block;font-size:15px;color:#555;line-height:20px">${a[0]}</span><b style="display:block;font-size:19px;line-height:28px;font-weight:500">${a[1]}</b></span></button>`).join('')}
      <i style="display:block;margin:2px 16px 0 17px;height:1px;background:#d0d0d0"></i>
      <button data-act="link" class="row" style="margin:14px 17px 0 20px;width:300px;height:46px;gap:12px;font-size:15px;color:#555;text-align:left">${I.plus('#0066b3', 22).replace('stroke-width="1.8"', 'stroke-width="1.3"')}다른 은행 계좌 불러오기</button>
      <button data-go="recur" class="row" style="margin:14px 16px 0 17px;width:367px;height:53px;border-radius:8px;background:#f4f5f9;padding:0 24px 0 17px;gap:9px;font-size:13.5px;font-weight:500;text-align:left"><svg width="21" height="15" viewBox="0 0 21 15"><path d="M2 8.2 7.4 13 19 2" stroke="#f8c22c" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>입출금 통장의 정기지출을 확인해보세요<span class="sp"></span>${I.chev('#555', 11, 1.4)}</button>
      <div style="height:35px"></div>
      ${SECS.map((s) => `<div style="height:8px;background:#f6f6f6"></div><button id="sec-${s[0].slice(0, 2)}" data-act="sec" data-v="${s[0]}" class="row" style="width:100%;height:126px;padding:0 21px 0 17px;text-align:left;--hr:0"><span><span class="row" style="font-size:17px;font-weight:600;color:#333;gap:${s[3] ? 6 : 9}px;line-height:24px">${s[0]}${s[2] ? '<i style="width:10px;height:10px;border-radius:50%;background:#0066b3"></i>' : ''}${s[3] ? I.q(17) : ''}</span>
        <span style="display:block;margin-top:5px;font-size:16.5px;color:#888">${s[1]}</span></span><span class="sp"></span>${I.chev('#111', 11)}</button>`).join('')}
      <div style="height:8px;background:#f6f6f6"></div>
      <button data-todo="DSR 계산기 화면은 디자인에 없습니다." aria-label="내 DSR은 얼마?" style="display:block;margin:27px 17px 0;width:366px;height:88px;border-radius:12px;overflow:hidden;--hr:12px">${img('bn_dsr', 366, 88)}</button>${pdots(3, 21, 1)}
      ${[['즐겨찾기 · 숨기기', I.star(true), 'menu'], ['순자산 설정하기', I.gear('#888', 20), '']].map((r) => `<button ${r[2] ? `data-go="${r[2]}" data-u` : 'data-todo="순자산 설정 화면은 디자인에 없습니다."'} class="row" style="margin:${r[2] ? 23 : 0}px 17px 0;width:366px;height:56px;gap:13px;font-size:15px;font-weight:500;text-align:left">${r[1]}${r[0]}<span class="sp"></span><span style="margin-right:6px;display:flex">${I.chev('#111', 11)}</span></button>`).join('')}
      <div style="margin:20px 17px 40px"><button class="btn" data-act="link">자산 추가하기</button></div></div>`,
    acts: {
      diag() { diagSheet(); },
      cat(t, el) { aSt.cat = t.dataset.v; el.querySelectorAll('#aChips .chip').forEach((c) => c.classList.toggle('on', c.dataset.v === aSt.cat));
        const target = el.querySelector('#sec-' + aSt.cat.slice(0, 2)); const bd = $('.bd', el); if (target) bd.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' }); },
      sec(t) { App.toast(`‘${t.dataset.v}’ 상세 화면은 디자인에 없습니다.`, '프로토타입 안내'); },
      link() { if (S.mydata) App.toast('다른 금융기관 자산 불러오기는 실제 마이데이터 서버 연동이 필요합니다.', '테스트 동작'); else App.mdPopup(); },
    },
  });
  function diagSheet() {
    App.sheet(`<div class="sheet" style="height:318px"><b style="position:absolute;left:19px;top:19px;font-size:22px;line-height:30px;font-weight:600">진단하기</b><button class="x" data-close style="right:16px;top:17px">${I.x(15)}</button>
      ${[['dg_asset', 29, 33, '자산진단', '나의 자산건강을 위해 진단을 받아보세요.', 'diagForm', 68], ['dg_bal', 33, 31, '밸런스 진단', '성향에 맞는 투자 밸런스를 확인하세요.', 'balIntro', 171]].map((r) => `<button data-go="${r[5]}" class="row" style="position:absolute;left:8px;top:${r[6]}px;width:384px;height:76px;padding-left:16px;text-align:left">
        <span style="width:36px;display:flex;justify-content:center">${img(r[0], r[1], r[2])}</span><span style="margin-left:16px"><b style="display:block;font-size:17px;line-height:24px;font-weight:500;color:#444">${r[3]}</b><span style="font-size:15px;color:#999">${r[4]}</span></span></button>`).join('')}</div>`);
  }
  App.diagSheet = diagSheet;
})();
