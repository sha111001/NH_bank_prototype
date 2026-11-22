/* 스플래시 · 온보딩 · 로그인(비밀번호/지문/패턴) · 인증서 비밀번호 */
(function () {
  const { def, img, I, keypad, dots, hd } = App;
  const $ = (s, el) => el.querySelector(s);

  /* 스플래시: GIF 2종을 순서대로 재생한 뒤 온보딩으로 자동 전환 (After delay · 추정) */
  def('splash', {
    title: '스플래시',
    html: () => `<img id="spl" src="assets/gif/splash1.gif?t=${Date.now()}" width="400" height="780" alt="NH농협은행">`,
    init(el) {
      const alive = () => App.cur === 'splash' && App.el === el;
      setTimeout(() => { if (alive()) App.go('onboard', { reset: true, anim: 'fade' }); }, 5000); /* Figma: After delay 5s */
    },
  });

  def('onboard', {
    title: '온보딩',
    html: () => `<div class="fix">
      <h1 class="abs" style="left:28px;top:77px;font-size:31px;line-height:49px;font-weight:700;letter-spacing:-.02em">일상에<br>든든한 금융이 되다</h1>
      <p class="abs" style="left:28px;top:184px;font-size:21px;line-height:29.5px;color:#8a8a8a">함께하는 NH농협은행,<br>더 편리한 금융생활을 경험하세요.</p>
      <div class="abs" style="left:58px;top:325px">${img('ill_onboard', 286, 285)}</div>
      <div class="cta"><button class="btn" data-go="login">시작하기</button></div></div>`,
  });

  /* 로그인 방법 선택 (NH 모바일 인증서) */
  def('login', {
    title: '로그인',
    html: () => `<div class="fix">
      <h1 class="abs c" style="left:0;right:0;top:90px;font-size:28px;line-height:40px;font-weight:700">NH 모바일 인증서</h1>
      <p class="abs c" style="left:0;right:0;top:139px;font-size:19px;line-height:26px;color:#8a8a8a">간편하게 발급해서 안전하게 보관하고<br>평생 쉽게 이용하는 NH스마트뱅킹</p>
      <div class="abs" style="left:99px;top:234px">${img('ill_cert', 182, 318)}</div>
      <button class="abs c" data-go="loginPw" data-u style="left:80px;width:240px;top:584px;height:36px;font-size:17px;color:#999">다른 방법으로 로그인하기 &nbsp;&nbsp;&gt;</button>
      <div class="abs row" style="left:14px;right:14px;top:640px;height:112px">
        <button data-go="loginPw" style="flex:1;height:100%;display:flex;flex-direction:column;align-items:center"><span style="height:66px;display:flex;align-items:center;margin-top:4px">${img('ic_lock', 33, 39)}</span><span style="font-size:14px">비밀번호</span></button>
        <i style="width:1px;height:96px;background:#ddd"></i>
        <button data-go="loginBio" style="flex:1;height:100%;display:flex;flex-direction:column;align-items:center"><span style="height:66px;display:flex;align-items:center;margin-top:4px">${img('ic_face', 43, 43)}</span><span style="font-size:14px">지문인식</span></button>
        <i style="width:1px;height:96px;background:#ddd"></i>
        <button data-go="loginPattern" style="flex:1;height:100%;display:flex;flex-direction:column;align-items:center"><span style="height:66px;display:flex;align-items:center;margin-top:4px">${img('ic_pattern', 32, 33)}</span><span style="font-size:14px">패턴인식</span></button>
      </div></div>`,
  });

  const PINKEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', 'del'];
  function loginDone() {
    App.loading('splash2', 2000, () => { App.state.loggedIn = true; App.go('home', { reset: true, anim: false }); }); /* Figma: splash2 → 2s → 홈 */
  }
  function pinScreen(o) {
    return {
      title: o.title,
      html: () => `${o.header ? hd(`<span style="font-size:15px">${o.header}</span>`) : ''}<div class="fix" style="${o.header ? 'margin-top:-56px' : ''}">
        ${o.head}
        ${dots(6, 0, { top: 287, gap: 13, d: 26 })}
        ${keypad(PINKEYS, { top: 407, rh: 84.3, fs: 26, tpl: '118px 158px 118px', del: 39 })}</div>`,
      init(el) { el._pin = ''; },
      key(k, el) {
        let p = el._pin;
        if (k === 'del') p = p.slice(0, -1); else p = (p + k).slice(0, 6);
        el._pin = p;
        el.querySelectorAll('.dots i').forEach((d, i) => d.classList.toggle('on', i < p.length));
        if (p.length === 6) setTimeout(o.done, o.delay || 800);
      },
    };
  }
  def('loginPw', pinScreen({
    title: '비밀번호로 로그인', header: '비밀번호로 로그인',
    head: `<h1 class="abs c" style="left:0;right:0;top:90px;font-size:28px;line-height:40px;font-weight:700">앱 실행 비밀번호를<br>입력해주세요</h1>`,
    done: loginDone,
  }));
  /* 가입 신청 시 인증서 비밀번호 확인 (헤더 없는 화면) */
  def('certPin', pinScreen({
    title: '인증서 비밀번호',
    head: `<h1 class="abs c" style="left:0;right:0;top:90px;font-size:28px;line-height:40px;font-weight:700">NH 모바일 인증서</h1>
      <p class="abs c" style="left:0;right:0;top:139px;font-size:19px;line-height:26px;color:#8a8a8a">간편하게 발급해서 안전하게 보관하고<br>평생 쉽게 이용하는 NH스마트뱅킹</p>`,
    delay: 1000, /* Figma: 입력 완료 1s → 로딩 GIF 3s → 가입완료 */
    done: () => App.loading('load_login', 3000, () => App.go('joinDone', { replace: true, anim: false })),
  }));

  /* 지문 로그인 */
  def('loginBio', {
    title: '지문으로 로그인',
    html: () => `${hd('<span style="font-size:15px">지문으로 로그인</span>')}<div class="fix" style="margin-top:-56px">
      <h1 class="abs c" style="left:0;right:0;top:90px;font-size:28px;line-height:40px;font-weight:700">NH 모바일 인증서</h1>
      <p class="abs c" style="left:0;right:0;top:147px;font-size:19px;line-height:26px;color:#8a8a8a">지문을 사용하거나 패턴을 입력해주세요</p>
      <div class="abs" style="inset:0;background:rgba(0,0,0,.7);z-index:5"></div>
      <div class="abs" style="left:18px;right:18px;top:209px;height:334px;background:#fff;border-radius:16px;z-index:6">
        <div class="abs" style="left:146px;top:41px" id="fp">${img('ic_finger', 72, 94)}</div>
        <div class="abs c" style="left:0;right:0;top:154px;font-size:22px;line-height:30px;font-weight:700">지문 인증</div>
        <div class="abs c" style="left:0;right:0;top:189px;font-size:16px;line-height:22px;color:#444" id="fpMsg">센서 위에 손가락을 살짝 올려주세요</div>
        <button class="abs" data-back style="left:15px;width:334px;top:246px;height:56px;border:1px solid #d8d8d8;border-radius:10px;font-size:17px;font-weight:600;--hr:10px">취소하기</button>
      </div>
      <button class="abs" data-act="scan" style="left:147px;top:622px;z-index:6;border-radius:50%;--hr:50%" aria-label="지문 센서">${img('ic_finger_btn', 106, 106)}</button></div>`,
    acts: {
      scan(t, el) {
        $('#fpMsg', el).textContent = '인증 중입니다…'; $('#fp', el).style.filter = 'hue-rotate(0) drop-shadow(0 0 6px #0a6cff)';
        setTimeout(loginDone, 300);
      },
    },
  });

  /* 패턴 로그인 */
  def('loginPattern', {
    title: '패턴으로 로그인',
    html: () => `${hd('<span style="font-size:15px">패턴으로 로그인</span>')}<div class="fix" style="margin-top:-56px">
      <h1 class="abs c" style="left:0;right:0;top:90px;font-size:28px;line-height:40px;font-weight:700">등록하신 패턴을<br>그려주세요</h1>
      <p class="abs c" style="left:0;right:0;top:188px;font-size:19px;line-height:26px;color:#8a8a8a" id="ptMsg">지문을 사용하거나 패턴을 입력해주세요</p>
      <svg id="pt" class="abs" style="left:72px;top:304px;touch-action:none;cursor:crosshair" width="256" height="260" viewBox="72 304 256 260">
        <polyline id="ptLine" fill="none" stroke="#0066b3" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" points=""/>
        ${[354, 432, 513].map((y) => [122, 200, 278].map((x) => `<circle class="pd" cx="${x}" cy="${y}" r="12" fill="#d9d9d9"/>`).join('')).join('')}
      </svg>
      <button class="abs c" data-go="login" data-u style="left:80px;width:240px;top:685px;height:36px;font-size:17px;color:#999">다른 방법으로 로그인하기 &nbsp;&nbsp;&gt;</button></div>`,
    init(el) {
      const svg = $('#pt', el), line = $('#ptLine', el), pds = Array.from(svg.querySelectorAll('.pd'));
      let seq = [], drawing = false;
      const pos = (e) => { const r = svg.getBoundingClientRect(); return { x: 72 + (e.clientX - r.left) * 256 / r.width, y: 304 + (e.clientY - r.top) * 260 / r.height }; };
      const paint = (p) => {
        pds.forEach((c, i) => { const on = seq.includes(i); c.setAttribute('fill', on ? '#0066b3' : '#d9d9d9'); c.setAttribute('r', on ? 14 : 12); });
        const pts = seq.map((i) => pds[i].getAttribute('cx') + ',' + pds[i].getAttribute('cy'));
        if (p && drawing) pts.push(p.x + ',' + p.y);
        line.setAttribute('points', pts.join(' '));
      };
      const hit = (p) => pds.forEach((c, i) => { if (!seq.includes(i) && Math.hypot(p.x - c.getAttribute('cx'), p.y - c.getAttribute('cy')) < 26) seq.push(i); });
      svg.addEventListener('pointerdown', (e) => { drawing = true; seq = []; svg.setPointerCapture(e.pointerId); const p = pos(e); hit(p); paint(p); });
      svg.addEventListener('pointermove', (e) => { if (!drawing) return; const p = pos(e); hit(p); paint(p); });
      svg.addEventListener('pointerup', () => {
        if (!drawing) return; drawing = false; paint();
        if (seq.length >= 4) setTimeout(loginDone, 800);
        else { $('#ptMsg', el).textContent = '4개 이상의 점을 연결해 주세요'; setTimeout(() => { seq = []; paint(); }, 500); }
      });
    },
  });
})();
