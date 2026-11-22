/* 전체메뉴: 카테고리 / 마이데이터(농축협·농협은행) 아코디언 / 즐겨찾기 / 최근검색 / 검색 */
(function () {
  const { def, img, I } = App;
  const S = App.state;
  /* 메뉴 → 연결 화면(디자인에 있는 화면만 연결, 나머지는 '연결 화면 없음') */
  const GO = { '전계좌조회': 'history', '계좌이체': 'tx1', '즉시이체': 'tx1', '이체내역조회': 'history', '마이데이터 메인': 'mydata', '메인': 'mydata', '자산 모아보기': 'asset', '자산관리': 'asset', '자산': 'asset',
    '소비 모아보기': 'spend', '소비관리': 'spend', '지출': 'spend', '정기지출관리': 'recur', '목표/계획': 'goals', '목표': 'goals', '도전 목표 챌린지': 'goals', '밸런스 진단': 'balIntro', '자산진단': 'diagForm', '추천': 'aiProd',
    '금융상품몰 메인': 'mall', 'AI 맞춤상품': 'aiProd', '상품비교': 'cmpSel', '예금': 'product', '영업점 방문 상담 예약': 'resv1', '상담톡': 'chat' };
  const M = {
    '조회': ['전계좌조회', '다른금융', '계좌통합조회(어카운트인포)', '숨은자산찾기', '거래중지계좌 조회', '해지계좌조회', '수표조회'],
    '이체/출금': ['계좌이체', '이체내역조회', '자동이체', '예약이체', '연락처송금', 'ATM출금'],
    '금융상품몰': ['금융상품몰 메인', 'AI 맞춤상품', '상품비교', '예금', '적금', '대출', '펀드'],
    '상품관리': ['가입상품 조회', '만기/해지', '영업점 방문 상담 예약'],
    '퇴직연금': ['퇴직연금 조회', '운용상품 변경', '부담금 입금'],
    '마이데이터': {
      '농축협': ['마이데이터 메인', ['자산', ['자산 모아보기', '자산진단', '밸런스 진단']], ['지출', ['소비 모아보기', '정기지출관리']], ['연금/절세', ['연금 조회', '절세 가이드']], '추천', '금융지식', '도전 목표 챌린지', '나의 신용점수 올리기',
        ['NH지역정보', ['우리동네 소식', '지역 혜택']], 'NH콕마이카', 'NH콕부동산', ['이벤트/혜택', ['진행중 이벤트', '당첨자 발표']], ['이용안내', ['서비스 안내', '연결기관 관리']]],
      '농협은행': [['메인', ['마이데이터 메인']], ['자산관리', ['자산 모아보기', '자산진단', '밸런스 진단']], ['소비관리', ['소비 모아보기', '정기지출관리']], ['대출/신용관리', ['대출 조회', '신용점수']],
        ['목표/계획', ['목표', '도전 목표 챌린지']], ['세금/절세', ['연말정산', '절세 가이드']], ['라이프', ['NH콕마이카', 'NH콕부동산']], ['관리센터', ['연결기관 관리', '서비스 해지']]],
    },
    '공과금/채권': ['공과금 납부', '지방세', '국세', '채권 조회'],
    '외환': ['환전', '해외송금', '환율조회'],
    '금융편의': ['증명서 발급', '영업점 방문 상담 예약', '상담톡', '보안센터'],
    '올원뱅트 혜택': ['이벤트', '포인트', '쿠폰'],
    '콕뱅크 혜택': ['콕뱅크 이벤트', '콕팜', '콕푸드'],
  };
  const CATS = Object.keys(M);
  const st = { cat: '조회', sub: '농축협', mode: 'cat', open: {}, q: '', recent: ['계좌이체', '환전'] };
  const link = (name) => GO[name] ? `data-act="open" data-n="${name}" data-goto="${GO[name]}"` : `data-act="open" data-n="${name}"`;
  const item = (name) => `<div class="row" style="height:42px;padding:0 16px 0 23px;font-size:15px"><button ${link(name)} class="row" style="flex:1;height:38px;text-align:left">${name}</button>
      <button data-act="fav" data-n="${name}" style="width:26px;height:26px;display:${S.favMenus.includes(name) ? 'flex' : 'none'};align-items:center;justify-content:center">${img('ic_star', 21, 20)}</button></div>`;
  function flat() { const out = []; const walk = (a) => a.forEach((x) => Array.isArray(x) ? (out.push(x[0]), walk(x[1])) : out.push(x));
    CATS.forEach((c) => Array.isArray(M[c]) ? walk(M[c]) : Object.values(M[c]).forEach(walk)); return [...new Set(out)]; }

  function right() {
    if (st.q) { const r = flat().filter((n) => n.includes(st.q));
      return `<div style="padding-top:8px">${r.map(item).join('') || `<p class="c" style="padding:60px 0;color:#999;font-size:14px">‘${st.q}’ 검색 결과가 없습니다.</p>`}</div>`; }
    if (st.mode === 'fav') return `<div style="padding-top:11px">${S.favMenus.map((n) => `<div class="row" style="height:41px;padding:0 15px 0 24px;font-size:15px;font-weight:500"><button ${link(n)} style="flex:1;height:36px;text-align:left">${n}</button>
        <button data-act="fav" data-n="${n}" style="width:26px;height:26px;display:flex;align-items:center;justify-content:center">${img('ic_star', 21, 20)}</button></div>
        ${n === '이체내역조회' ? ['즉시이체', '예약이체', '지연이체', '연락처송금'].map((s) => `<button ${link(s)} class="row" style="width:200px;height:30px;margin-left:30px;padding-left:9px;gap:9px;font-size:13.5px;color:#666;text-align:left"><i style="width:4px;height:4px;border-radius:50%;background:#ccc"></i>${s}</button>`).join('') + '<div style="height:7px"></div>' : ''}`).join('')
        || '<p class="c" style="padding:60px 0;color:#999;font-size:14px">즐겨찾는 메뉴가 없습니다.</p>'}</div>`;
    if (st.mode === 'recent') return `<div style="padding-top:11px">${st.recent.map(item).join('') || '<p class="c" style="padding:60px 0;color:#999;font-size:14px">최근 검색 내역이 없습니다.</p>'}</div>`;
    const data = M[st.cat], md = !Array.isArray(data), list = md ? data[st.sub] : data;
    return `<div class="row" style="align-items:stretch;min-height:518px">
      <div style="width:131px;flex:none;background:#f0f0f0">${CATS.map((c) => `<button data-act="cat" data-v="${c}" style="display:block;width:131px;height:41.8px;padding-left:16px;text-align:left;font-size:15px;--hr:0;${c === st.cat ? 'background:#0066b3;color:#fff' : 'color:#444'}">${c}</button>`).join('')}</div>
      <div style="flex:1;padding-top:${md ? 6 : 0}px">
        ${md ? `<div class="row" style="gap:21px;padding-left:33px;height:30px;margin-bottom:5px">${['농축협', '농협은행'].map((t) => `<button data-act="sub" data-v="${t}" style="width:${t === '농축협' ? 85 : 98}px;height:30px;border-radius:5px;font-size:14.5px;--hr:5px;${t === st.sub ? 'background:#0066b3;color:#fff;font-weight:500' : 'background:#f3f3f3;color:#aaa'}">${t}</button>`).join('')}</div>` : ''}
        ${list.map((x) => Array.isArray(x) ? `<button data-act="acc" data-v="${x[0]}" class="row" style="width:100%;height:42px;padding:0 16px 0 23px;font-size:15px;text-align:left;--hr:0">${x[0]}<span class="sp"></span><span style="transition:.2s;display:flex;${st.open[x[0]] ? 'transform:rotate(180deg)' : ''}">${I.down('#111', 17, 1.7)}</span></button>
            ${st.open[x[0]] ? `<div style="background:#f8f9fb;padding:4px 0">${x[1].map((s) => `<button ${link(s)} class="row" style="width:100%;height:36px;padding-left:36px;font-size:14px;color:#444;text-align:left;--hr:0">· ${s}</button>`).join('')}</div>` : ''}`
          : item(x)).join('')}</div></div>`;
  }

  def('menu', {
    title: '전체메뉴',
    html: () => `<div style="height:193px;flex:none;position:relative;background:#fff">
        <button class="abs" data-home style="left:11px;top:2px;width:40px;height:32px;display:flex;align-items:center;justify-content:center" aria-label="홈"><svg width="30" height="26" viewBox="0 0 30 26"><path d="M15 1 1 13.2h4V25h7.4v-7.6h5.2V25H25V13.2h4L15 1Z" fill="#333"/></svg></button>
        <button class="abs" data-todo="언어 설정 화면은 디자인에 없습니다." style="left:296px;top:3px;width:28px;height:28px;display:flex;align-items:center;justify-content:center">${I.globe.replace('width="20" height="20"', 'width="23" height="23"')}</button>
        <button class="abs" data-todo="환경설정 화면은 디자인에 없습니다." style="left:328px;top:3px;width:28px;height:28px;display:flex;align-items:center;justify-content:center">${I.gear('#333', 24)}</button>
        <button class="abs" data-home style="left:360px;top:3px;width:28px;height:28px;display:flex;align-items:center;justify-content:center" aria-label="닫기">${I.x(18, '#333', 1.5)}</button>
        ${img('menu_avatar', 46, 42, 'position:absolute;left:23px;top:42px')}
        <div class="abs" style="left:82px;top:43px;font-size:17px;line-height:22px;font-weight:500">${S.user}님</div>
        <div class="abs row" style="left:82px;top:70px;font-size:12px;color:#777;gap:8px">최근 접속일 2000.00.00 00:00:00 <button data-act="logout" style="height:16px;padding:0 6px;border:1px solid #bbb;border-radius:8px;font-size:9px;color:#777">로그아웃</button></div>
        <div class="abs row" style="left:40px;top:98px;height:28px;font-size:14.5px;font-weight:500">
          <button data-todo="인증/보안 화면은 디자인에 없습니다." class="row" style="gap:10px;height:28px;padding:0 8px"><svg width="13" height="15" viewBox="0 0 13 15"><rect x="1" y="6" width="11" height="8.5" rx="1.5" fill="#222"/><path d="M3.6 6V4.2a2.9 2.9 0 0 1 5.8 0V6" stroke="#222" stroke-width="1.6" fill="none"/><circle cx="6.5" cy="10" r="1.2" fill="#fff"/></svg>인증/보안</button>
          <i style="width:1px;height:14px;background:#ccc;margin:0 9px 0 11px"></i>
          <button data-go="chat" data-u class="row" style="gap:9px;height:28px;padding:0 8px">${I.info('#333', 17)}고객센터</button>
          <i style="width:1px;height:14px;background:#ccc;margin:0 9px 0 11px"></i>
          <button data-go="notice" data-u class="row" style="gap:9px;height:28px;padding:0 8px"><svg width="18" height="18" viewBox="0 0 20 20"><path d="M10 2.2l2.4 5 5.4.8-3.9 3.8.9 5.4L10 14.6l-4.8 2.6.9-5.4L2.2 8l5.4-.8L10 2.2Z" fill="none" stroke="#222" stroke-width="1.5" stroke-linejoin="round"/></svg>이벤트</button></div>
        <label class="abs row" style="left:16px;top:141px;width:367px;height:34px;border-radius:17px;background:#f0f0f0;padding:0 0 0 24px">
          <input id="mq" placeholder="검색어를 입력해주세요" value="${st.q}" autocomplete="off" style="flex:1;border:0;outline:0;background:none;font-size:13px;height:100%">
          <i style="width:1px;height:22px;background:#ccc"></i><span data-act="search" style="width:56px;height:34px;display:flex;align-items:center;justify-content:center;--hr:0 17px 17px 0">${I.search('#555', 18)}</span></label>
      </div>
      <div style="height:16px;flex:none;background:#f3f4f8;border-top:1px solid #e3e5ea"></div>
      <div class="row" style="height:53px;flex:none;padding:0 16px;gap:6px">
        ${[['fav', '즐겨찾기', '<svg width="15" height="15" viewBox="0 0 20 20"><path d="M10 1.6l2.5 5.3 5.8.8-4.2 4 1 5.7L10 14.7l-5.1 2.7 1-5.7-4.2-4 5.8-.8L10 1.6Z" fill="currentColor"/></svg>'], ['recent', '최근검색', I.search('currentColor', 14)]].map((c) =>
          `<button data-act="mode" data-v="${c[0]}" class="row" style="height:31px;padding:0 13px 0 12px;border-radius:16px;gap:6px;font-size:14px;--hr:16px;${st.mode === c[0] && !st.q ? 'background:#0066b3;color:#fff' : 'background:#f3f3f3;color:#888'}">${c[2]}${c[1]}</button>`).join('')}</div>
      <div class="bd" id="mr">${right()}</div>`,
    init(el) {
      const q = el.querySelector('#mq');
      q.addEventListener('input', () => { st.q = q.value.trim(); el.querySelector('#mr').innerHTML = right(); });
      q.addEventListener('keydown', (e) => { if (e.key === 'Enter') commit(); });
      if (st.focus) { st.focus = false; q.focus(); }
    },
    acts: {
      cat(t) { st.cat = t.dataset.v; st.mode = 'cat'; st.q = ''; App.rerender(); },
      sub(t) { st.sub = t.dataset.v; App.rerender(); },
      acc(t) { st.open[t.dataset.v] = !st.open[t.dataset.v]; App.rerender(); },
      mode(t) { st.mode = st.mode === t.dataset.v ? 'cat' : t.dataset.v; st.q = ''; App.rerender(); },
      fav(t) { const n = t.dataset.n; S.favMenus = S.favMenus.includes(n) ? S.favMenus.filter((x) => x !== n) : [...S.favMenus, n]; App.rerender(); },
      search() { commit(); },
      open(t) { const n = t.dataset.n; if (st.q) remember(n);
        if (t.dataset.goto) App.go(t.dataset.goto); else App.toast(`‘${n}’ 화면은 디자인에 없습니다.`, '프로토타입 안내'); },
      logout() { S.loggedIn = false; S.mydataPopupSeen = false; App.go('login', { reset: true, anim: 'fade' }); },
    },
  });
  function remember(n) { st.recent = [n, ...st.recent.filter((x) => x !== n)].slice(0, 8); }
  function commit() { if (st.q) { const r = flat().filter((n) => n.includes(st.q)); if (r[0]) remember(r[0]); } }
})();
