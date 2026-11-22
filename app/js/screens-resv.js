/* 영업점 방문 상담 예약: 영업점 선택 → 일시 선택 → 내용 확인 → 완료 */
(function () {
  const { def, img, I, hd } = App;
  const S = App.state;
  const $ = (s, el) => el.querySelector(s);
  const BR = App.data.branches = [
    { n: 'NH농협은행 서울중앙지점', s: '서울중앙지점', a: '서울특별시 중구 통일로 120 (충정로 1가)', w: '1호선 시청역 4번 출구 도보 5분', near: 1, open: 1, area: '서울' },
    { n: 'NH농협은행 강남중앙지점', s: '강남중앙지점', a: '서울특별시 강남구 테헤란로 152 (역삼동)', w: '2호선 역삼역 3번 출구 도보 3분', near: 1, open: 1, area: '서울' },
    { n: 'NH농협은행 광화문지점', s: '광화문지점', a: '서울특별시 종로구 새문안로 16 (신문로 1가)', w: '5호선 광화문역 7번 출구 도보 4분', near: 1, open: 0, area: '서울' },
    { n: 'NH농협은행 청주분평지점', s: '청주분평지점', a: '충청북도 청주시 서원구 분평로 20', w: '분평사거리 정류장 도보 2분', near: 0, open: 1, area: '충북' },
  ];
  const R = S.resv = { br: 0, tab: '내 주변', q: '', y: 2026, m: 11, d: 4, time: '11:00' };
  const WD = ['일', '월', '화', '수', '목', '금', '토'];
  const pin = '<svg width="9" height="11" viewBox="0 0 9 11"><path d="M4.5 0A4.3 4.3 0 0 0 .2 4.3C.2 7.4 4.5 11 4.5 11s4.3-3.6 4.3-6.7A4.3 4.3 0 0 0 4.5 0Zm0 6a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4Z" fill="#333"/></svg>';
  const sub = '<svg width="10" height="11" viewBox="0 0 10 11" fill="none" stroke="#333" stroke-width="1.1"><rect x="1" y="1" width="8" height="7.2" rx="1.6"/><path d="M1 4.6h8M3 10l1-1.6M7 10 6 8.4"/><circle cx="3.2" cy="6.4" r=".5" fill="#333"/><circle cx="6.8" cy="6.4" r=".5" fill="#333"/></svg>';
  const kvCard = (title, rows, st = '') => `<div class="card" style="position:relative;height:${70 + rows.length * 40 + 8}px;border-radius:4px;border-color:#d0d0d0;${st}"><b style="position:absolute;left:18px;top:17px;font-size:18px;line-height:24px;font-weight:600">${title}</b>
      <i style="position:absolute;left:18px;right:17px;top:58px;height:1px;background:#d9d9d9"></i>${App.kvRows(rows, 70)}</div>`;
  const ampm = (t) => { const h = Number(t.slice(0, 2)); return (h < 12 ? '오전 ' : '오후 ') + (h > 12 ? String(h - 12).padStart(2, '0') : t.slice(0, 2)) + t.slice(2); };
  const wd = () => WD[new Date(R.y, R.m - 1, R.d).getDay()];

  def('resv1', {
    title: '방문 상담 예약 STEP 1',
    html() {
      const list = BR.map((b, i) => ({ ...b, i })).filter((b) => (R.q ? (b.n + b.a).includes(R.q) : R.tab === '내 주변' ? b.near : R.tab === '방문 가능 지점' ? b.open : true));
      return `${App.stepHd('영업점 선택', 1, '방문 상담 예약')}<div class="bd">
        <label class="row" style="margin:-2px 16px 0 17px;height:34px;border-radius:17px;border:1px solid #d9d9d9;padding-left:23px"><input id="rq" value="${R.q}" placeholder="지역명 또는 영업점명 검색" autocomplete="off" style="flex:1;min-width:0;border:0;outline:0;font-size:13.5px;height:100%">
          <i style="width:1px;height:22px;background:#ccc"></i><span data-act="search" style="width:56px;height:32px;display:flex;align-items:center;justify-content:center;--hr:0 17px 17px 0">${I.search('#555', 18)}</span></label>
        <div class="chips" style="margin:27px 17px 0;gap:9px">${['내 주변', '방문 가능 지점', '지역 선택'].map((c) => `<button class="chip ol ${c === R.tab && !R.q ? 'on' : ''}" data-act="tab" data-v="${c}" style="height:38px;border-radius:19px;font-size:15px;padding:0 16px;--hr:19px">${c}</button>`).join('')}</div>
        <div style="position:relative;margin:13px 17px 0;width:366px;height:208px;overflow:hidden">${img('map', 366, 208)}
          ${[[143, 66, 0], [224, 12, 1], [5, 162, 2]].map((p) => `<button data-act="pick" data-v="${p[2]}" title="${BR[p[2]].s}" style="position:absolute;left:${p[0]}px;top:${p[1]}px;width:44px;height:44px;border-radius:50%;--hr:50%"></button>`).join('')}</div>
        <div style="margin:22px 17px 0;font-size:19px;line-height:26px;font-weight:600">영업점 목록</div>
        <div style="margin-top:4px">${list.map((b) => { const on = b.i === R.br; return `<div style="position:relative;margin:0 16px 10px 17px;height:94px;border-radius:4px;border:1px solid ${on ? '#0066b3' : '#d9d9d9'};background:${on ? '#e8f3fc' : '#fff'}">
          <b style="position:absolute;left:18px;top:12px;font-size:18px;line-height:24px;font-weight:600">${b.n}</b>
          <span class="row" style="position:absolute;left:21px;top:50px;font-size:9.5px;gap:7px">${pin}${b.a}</span><span class="row" style="position:absolute;left:21px;top:68px;font-size:9.5px;gap:6px">${sub}${b.w}</span>
          <button data-act="pick" data-v="${b.i}" style="position:absolute;right:21px;top:30px;width:60px;height:28px;border-radius:3px;font-size:11px;font-weight:500;--hr:3px;${on ? 'background:#0066b3;color:#fff' : 'background:#fff;border:1px solid #ccc;color:#555'}">${on ? '변경하기' : '선택하기'}</button></div>`; }).join('')
          || '<p class="c" style="padding:40px 0;color:#999;font-size:14px">조건에 맞는 영업점이 없습니다.</p>'}</div><div style="height:10px"></div></div>
        <div class="ft"><button class="btn" data-go="resv2">다음</button></div>`;
    },
    init(el) { const q = $('#rq', el); q.addEventListener('keydown', (e) => { if (e.key === 'Enter') { R.q = q.value.trim(); App.rerender(); } }); },
    acts: {
      tab(t) { R.q = ''; if (t.dataset.v === '지역 선택') { App.sheet(`<div class="sheet" style="padding:28px 20px 20px"><b style="font-size:20px">지역 선택</b><button class="x" data-close style="right:14px;top:20px">${I.x(15)}</button>
          <div style="margin-top:14px">${['서울', '충북'].map((a) => `<button data-act="area" data-v="${a}" class="row" style="width:100%;height:54px;border-bottom:1px solid #eee;font-size:16px;text-align:left">${a}<span class="sp"></span>${I.chev('#999', 11)}</button>`).join('')}</div></div>`); return; }
        R.tab = t.dataset.v; App.rerender(); },
      area(t) { App.closeSheets(); R.tab = '지역 선택'; R.q = ''; R.areaQ = t.dataset.v; R.q = BR.find((b) => b.area === t.dataset.v).a.slice(0, 2); App.rerender(); },
      search(t, el) { R.q = $('#rq', el).value.trim(); App.rerender(); },
      pick(t) { const i = Number(t.dataset.v); if (R.br === i && t.textContent === '변경하기') { App.toast('다른 영업점의 ‘선택하기’를 눌러 변경할 수 있습니다.'); return; } R.br = i; App.rerender(); },
    },
  });

  const SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '15:00', '15:30'];
  const CLOSED = ['13:00', '13:30'];
  def('resv2', {
    title: '방문 상담 예약 STEP 2',
    html() {
      const first = new Date(R.y, R.m - 1, 1).getDay(), days = new Date(R.y, R.m, 0).getDate(), prevDays = new Date(R.y, R.m - 1, 0).getDate();
      const cells = [];
      for (let i = 0; i < first; i++) cells.push({ d: prevDays - first + 1 + i, o: 1 });
      for (let d = 1; d <= days; d++) cells.push({ d });
      let nx = 1; while (cells.length % 7) cells.push({ d: nx++, o: 1 });
      return `${App.stepHd('방문 일시 선택', 2, '방문 상담 예약')}<div class="bd">
        <div style="position:relative;margin:0 16px 0 17px;height:88px;border-radius:12px;background:#e2f1fe"><b style="position:absolute;left:20px;top:21px;font-size:19px;line-height:26px;font-weight:600">${BR[R.br].n}</b>
          <span style="position:absolute;left:20px;top:58px;font-size:11.5px;color:#666">예금·적금 상담 예약</span><button data-back style="position:absolute;right:20px;top:30px;width:60px;height:28px;border-radius:3px;background:#0066b3;color:#fff;font-size:11px;font-weight:500;--hr:3px">변경하기</button></div>
        <div class="card" style="margin:30px 16px 0 17px;border-radius:8px;padding:11px 14px 10px;border-color:#d9d9d9">
          <div class="row" style="justify-content:center;gap:4px;height:24px;font-size:13.5px"><button data-act="mon" data-v="-1" style="width:22px;height:22px">‹</button>${R.y}년 ${String(R.m).padStart(2, '0')}월<button data-act="mon" data-v="1" style="width:22px;height:22px">›</button></div>
          <div style="display:grid;grid-template-columns:repeat(7,1fr);margin-top:12px;text-align:center">${WD.map((w, i) => `<span style="font-size:8px;height:14px;color:${i === 0 ? '#e03131' : i === 6 ? '#1c7ed6' : '#333'}">${w}</span>`).join('')}
            ${cells.map((c, i) => { const sun = i % 7 === 0, sat = i % 7 === 6, on = !c.o && c.d === R.d; return c.o ? `<span style="height:${i < 7 ? 34 : 39}px;line-height:${i < 7 ? 34 : 39}px;font-size:11.5px;color:#ccc">${c.d}</span>`
              : `<button data-act="day" data-v="${c.d}" ${sun || sat ? 'data-off' : ''} style="height:${i < 7 ? 34 : 39}px;font-size:11.5px;display:flex;align-items:center;justify-content:center;--hr:50%;${sun || sat ? 'color:#bbb' : ''}"><i style="width:23px;height:23px;line-height:23px;border-radius:50%;font-style:normal;${on ? 'background:#0066b3;color:#fff;font-weight:700' : ''}">${c.d}</i></button>`; }).join('')}</div></div>
        <div style="margin:27px 17px 0;font-size:18px;line-height:26px;font-weight:600">상담 시간 선택</div>
        <div style="display:grid;grid-template-columns:repeat(4,80px);gap:10px 15px;margin:10px 17px 0">${SLOTS.map((t) => { const off = CLOSED.includes(t), on = t === R.time; return `<button ${off ? 'disabled' : `data-act="time" data-v="${t}"`} style="height:34px;border-radius:3px;font-size:14px;--hr:3px;
          ${off ? 'background:#eee;border:1px solid #ddd;color:#888;cursor:default' : on ? 'background:#e8f3fc;border:1.5px solid #0066b3;color:#0066b3;font-weight:600' : 'border:1px solid #ccc;color:#444'}">${t}</button>`; }).join('')}</div>
        <div style="height:30px"></div></div><div class="ft"><button class="btn" data-act="next">예약하기</button></div>`;
    },
    acts: {
      mon(t) { let m = R.m + Number(t.dataset.v), y = R.y; if (m < 1) { m = 12; y--; } if (m > 12) { m = 1; y++; } R.m = m; R.y = y; R.d = 0; App.rerender(); },
      day(t) { if (t.hasAttribute('data-off')) return App.toast('주말은 방문 상담을 예약할 수 없습니다.'); R.d = Number(t.dataset.v); App.rerender(); },
      time(t) { R.time = t.dataset.v; App.rerender(); },
      next() { if (!R.d) return App.toast('방문 날짜를 선택해 주세요.'); if (!R.time) return App.toast('상담 시간을 선택해 주세요.'); App.go('resv3'); },
    },
  });

  const agree = [true, true];
  def('resv3', {
    title: '방문 상담 예약 STEP 3',
    html: () => `${App.stepHd('예약 내용 확인', 3, '방문 상담 예약')}<div class="bd">${App.h2('예약 내용을 확인해 주세요', '선택한 상담 정보가 맞는지 확인해 주세요')}
      ${kvCard('방문 상담 정보', [['방문 영업점', BR[R.br].s], ['방문 날짜', `${R.y}.${String(R.m).padStart(2, '0')}.${String(R.d).padStart(2, '0')} (${wd()})`], ['예약 시간', ampm(R.time)], ['상담 분', '예금 · 적금'], ['예상 상담 시간', '약 30분']], 'margin:14px 16px 0 17px')}
      <div style="margin:9px 17px 0;font-size:19px;line-height:26px;font-weight:600">예약자 정보</div>
      <div style="margin:9px 17px 0;padding:10px 18px;border-radius:4px;background:#f8f9fb;font-size:14.5px;line-height:22px"><div class="row"><span style="color:#555">이름</span><span class="sp"></span><b style="font-weight:500">${S.user}</b></div><div class="row"><span style="color:#555">연락처</span><span class="sp"></span><b style="font-weight:500">010-1***-1***</b></div></div>
      <div style="margin:23px 17px 0">${['[필수] 예약 안내를 위한 개인정보 수집·이용 동의', '[필수] 영업점 방문 예약 유의사항 확인'].map((t, i) => `<button data-act="ag" data-v="${i}" class="row" style="width:100%;height:36px;gap:8px;font-size:14.5px;text-align:left">${App.ck(agree[i], 24)}${t}</button>`).join('')}</div>
      <div style="height:20px"></div></div><div class="ft"><button class="btn" data-act="next">예약 내역보기</button></div>`,
    acts: {
      ag(t) { const i = Number(t.dataset.v); agree[i] = !agree[i]; App.rerender(); },
      next() { if (!agree.every(Boolean)) return App.toast('필수 항목에 모두 동의해 주세요.');
        App.loading('load_resv', 3000, () => App.go('resvDone', { replace: true, anim: false })); },
    },
  });

  def('resvDone', {
    title: '방문 상담 예약 완료',
    html: () => `${hd('예약 완료', { right: App.rHome, cls: 'pg', prog: 100 })}<div class="step"><span>방문 상담 예약</span><span><b>STEP 4</b> <i>/4</i></span></div><div class="fix">
      ${img('ill_resvdone', 158, 158, 'position:absolute;left:120px;top:3px')}
      <h1 class="abs c" style="left:0;right:0;top:171px;font-size:20px;line-height:26px;font-weight:600">방문 상담 예약이 완료되었습니다</h1>
      <p class="abs c" style="left:0;right:0;top:204px;font-size:14px;line-height:16.5px;color:#444">예약한 날짜와 시간에 맞춰<br>선택한 영업점을 방문해 주세요.</p>
      ${kvCard('예약 정보', [['방문 영업점', BR[R.br].s], ['방문 일시', `${R.m}월 ${R.d}일 (${wd()}) ${ampm(R.time)}`], ['상담 분야', '예금 · 적금'], ['상담 번호', `NH-${R.y}${String(R.m).padStart(2, '0')}${String(R.d).padStart(2, '0')}-001`]], 'position:absolute;left:15px;right:18px;top:258px')}
      <div class="abs row" style="left:15px;right:17px;top:511px;height:43px;border-radius:6px;background:#e2f1fe;padding-left:21px;font-size:12px;gap:11px"><b style="color:#0066b3;font-weight:600">안내</b>방문 전 위치와 준비 서류를 확인해 주세요.</div>
      <div class="cta"><button class="btn" data-home>홈으로 돌아가기</button></div></div>`,
  });
})();
