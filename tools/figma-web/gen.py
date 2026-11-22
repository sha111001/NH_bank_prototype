"""Figma(웹) → HTML 변환 생성기
- 프레임/사각형/텍스트: CSS로 재현 (실제 텍스트)
- 아이콘/도형(VECTOR 등): Figma 벡터 경로 데이터로 인라인 SVG 생성
- 사진/일러스트(IMAGE 채우기): Figma 원본 이미지 → 표시 크기 2배 WebP
- 프로토타입 연결(ON_CLICK NAVIGATE/OVERLAY)을 data-go / data-act 로 부착
"""
import json, math, os, re, html as H
from PIL import Image

W = '/home/user/_work/web/'
OUT = '/home/user/nh-prototype/web/'
d = json.load(open(W + 'fullgeo.json'))
PG = d['document']['children'][0]
FRAMES = {f['id']: f for f in PG['children']}
NODES, PARENT = {}, {}
def idx(n, p=None):
    NODES[n['id']] = n; PARENT[n['id']] = p
    for c in n.get('children', []): idx(c, n['id'])
idx(PG)

def lin(n):
    rt = n.get('relativeTransform') or [[1, 0, 0], [0, 1, 0]]
    return (rt[0][0], rt[1][0], rt[0][1], rt[1][1])  # a,b,c,d (x' = a x + c y)
def mul(m, k):  # m ∘ k
    a, b, c, d = m; e, f, g, h = k
    return (a * e + c * f, b * e + d * f, a * g + c * h, b * g + d * h)
def abs_lin(nid):
    m = lin(NODES[nid]); p = PARENT[nid]
    while p and NODES[p]['type'] not in ('CANVAS',) and p not in FRAMES:
        if NODES[p]['type'] not in ('GROUP', 'BOOLEAN_OPERATION'): m = mul(lin(NODES[p]), m)
        p = PARENT[p]
    return m
VEC = {'VECTOR', 'REGULAR_POLYGON', 'STAR', 'BOOLEAN_OPERATION'}
def vis(n): return n.get('visible', True)

def col(c, op=1):
    a = c.get('a', 1) * op
    r, g, b = (round(c[k] * 255) for k in 'rgb')
    return f'rgb({r},{g},{b})' if a >= 0.999 else f'rgba({r},{g},{b},{a:.3f})'

# ---------------- 이미지 채우기 ----------------
IMG_MAX = {}
def scan_img(n):
    if not vis(n): return
    b = n.get('absoluteBoundingBox')
    for f in n.get('fills', []) or []:
        if f.get('type') == 'IMAGE' and f.get('visible', True) and b:
            r = f['imageRef']; m = IMG_MAX.get(r, (0, 0))
            sc = 1
            t = f.get('imageTransform')
            if f.get('scaleMode') in ('CROP', 'STRETCH') and t: sc = 1 / max(min(abs(t[0][0]), abs(t[1][1])), 0.05)
            IMG_MAX[r] = (max(m[0], b['width'] * sc), max(m[1], b['height'] * sc))
    for c in n.get('children', []): scan_img(c)
scan_img(PG)

IMG_FILE = {}
PLAN = json.load(open(W + 'plan.json'))
def ref_crop(node):
    """Figma 1x 렌더(ex/)에서 이 노드 영역을 잘라 보정 기준으로 사용"""
    nid = node['id']; top = nid
    while PARENT.get(top) and PARENT[top] != PG['id']: top = PARENT[top]
    b = node['absoluteBoundingBox']
    for part in PLAN.get(top, []):
        pb = NODES[part]['absoluteBoundingBox']
        if pb['x'] <= b['x'] and pb['y'] <= b['y'] and b['x'] + b['width'] <= pb['x'] + pb['width'] + 1 and b['y'] + b['height'] <= pb['y'] + pb['height'] + 1:
            im = Image.open(W + 'ex/' + part.replace(':', '_') + '.png').convert('RGB')
            x, y = round(b['x'] - pb['x']), round(b['y'] - pb['y'])
            return im.crop((x, y, x + round(b['width']), y + round(b['height'])))
    return None
def apply_filters(im, filters, node):
    import numpy as np
    if not filters: return im
    im = im.convert('RGBA'); a = np.asarray(im).astype(np.float64)
    if set(filters) == {'saturation'} and filters['saturation'] <= -0.99:
        g = a[..., 0] * 0.2126 + a[..., 1] * 0.7152 + a[..., 2] * 0.0722
        a[..., 0] = a[..., 1] = a[..., 2] = g
        return Image.fromarray(a.clip(0, 255).astype('uint8'), 'RGBA')
    ref = ref_crop(node)
    if ref is None: return im
    small = im.resize(ref.size, Image.LANCZOS); s = np.asarray(small).astype(np.float64); r = np.asarray(ref).astype(np.float64)
    m = s[..., 3] > 250
    for ch in range(3):
        x, y = s[..., ch][m], r[..., ch][m]
        A = np.vstack([x, np.ones_like(x)]).T
        k, c0 = np.linalg.lstsq(A, y, rcond=None)[0]
        a[..., ch] = a[..., ch] * k + c0
    return Image.fromarray(a.clip(0, 255).astype('uint8'), 'RGBA')

def img_file(ref, filters=None, node=None):
    key = ref + json.dumps(filters or {}, sort_keys=True)
    if key in IMG_FILE: return IMG_FILE[key]
    src = W + 'fills/' + ref
    name = ref[:16] + ('_' + __import__('hashlib').md5(json.dumps(filters, sort_keys=True).encode()).hexdigest()[:6] if filters else '') + '.webp'
    dst = OUT + 'assets/img/' + name
    if not os.path.exists(dst):
        im = Image.open(src); im.load()
        im = apply_filters(im, filters, node)
        mw, mh = IMG_MAX.get(ref, im.size)
        k = min(1, max(mw * 2 / im.size[0], mh * 2 / im.size[1]))
        if k < 1: im = im.resize((max(1, round(im.size[0] * k)), max(1, round(im.size[1] * k))), Image.LANCZOS)
        if im.mode not in ('RGB', 'RGBA'): im = im.convert('RGBA')
        im.save(dst, 'WEBP', quality=88, method=6)
    IMG_FILE[key] = name
    return name

def paint_css(p, box, node=None):
    op = p.get('opacity', 1)
    if p['type'] == 'SOLID':
        c = col(p['color'], op); return f'linear-gradient({c},{c})'
    if p['type'] == 'GRADIENT_LINEAR':
        h = p['gradientHandlePositions']; (x0, y0), (x1, y1) = (h[0]['x'], h[0]['y']), (h[1]['x'], h[1]['y'])
        dx, dy = (x1 - x0) * box['width'], (y1 - y0) * box['height']
        ang = math.degrees(math.atan2(dx, -dy))
        stops = ','.join(f"{col(s['color'], op)} {s['position']*100:.1f}%" for s in p['gradientStops'])
        return f'linear-gradient({ang:.1f}deg,{stops})'
    if p['type'] == 'IMAGE':
        url = f"url(assets/img/{img_file(p['imageRef'], p.get('filters'), node)})"
        m = p.get('scaleMode')
        if m == 'FIT': return f'{url} center/contain no-repeat'
        if m == 'TILE': return f'{url} 0 0/{p.get("scalingFactor",1)*100:g}% repeat'
        if m in ('CROP', 'STRETCH') and p.get('imageTransform'):
            t = p['imageTransform']; a, tx, dd, ty = t[0][0], t[0][2], t[1][1], t[1][2]
            W_, H_ = box['width'], box['height']
            iw, ih = W_ / a, H_ / dd                      # 화면에 그려지는 이미지 크기(px)
            return f'{url} {-tx * iw:.2f}px {-ty * ih:.2f}px/{iw:.2f}px {ih:.2f}px no-repeat'
        return f'{url} center/cover no-repeat'
    return None

# ---------------- 박스 스타일 ----------------
def invisible_paint(p):
    op = p.get('opacity', 1)
    if p['type'] == 'SOLID': return p['color'].get('a', 1) * op < 0.004
    if p['type'].startswith('GRADIENT'): return all(s['color'].get('a', 1) * op < 0.004 for s in p.get('gradientStops', []))
    return op < 0.004

def covered_by_image(n):
    b = n.get('absoluteBoundingBox')
    if not b or n['type'] == 'TEXT': return False
    for c in n.get('children', []) or []:
        if not vis(c) or c.get('opacity', 1) < 1: continue
        if not any(f.get('type') == 'IMAGE' and f.get('visible', True) and f.get('scaleMode') in ('FILL', 'CROP', 'STRETCH', None) for f in c.get('fills', []) or []): continue
        cb = c.get('absoluteBoundingBox')
        if cb and cb['x'] <= b['x'] + .5 and cb['y'] <= b['y'] + .5 and cb['x'] + cb['width'] >= b['x'] + b['width'] - .5 and cb['y'] + cb['height'] >= b['y'] + b['height'] - .5:
            return True
    return False

def box_css(n, b, with_fill=True):
    st = []
    fills = [f for f in n.get('fills', []) or [] if f.get('visible', True) and not invisible_paint(f)]
    if covered_by_image(n): fills = []  # 이미지가 틀을 다 덮으면 아래 채우기는 안 보임 → 둥근 모서리에 색이 새어 나오지 않게 제거
    if with_fill and fills:
        layers = [l for l in (paint_css(f, b, n) for f in reversed(fills)) if l]
        if layers: st.append('background:' + ','.join(layers))
    r = n.get('rectangleCornerRadii')
    if n['type'] == 'ELLIPSE': st.append('border-radius:50%')
    elif r and len(set(r)) > 1: st.append('border-radius:' + ' '.join(f'{x:g}px' for x in r))
    elif n.get('cornerRadius'): st.append(f"border-radius:{n['cornerRadius']:g}px")
    sh = []
    strokes = [s for s in n.get('strokes', []) or [] if s.get('visible', True) and s['type'] == 'SOLID']
    if strokes:
        c = col(strokes[0]['color'], strokes[0].get('opacity', 1)); w = n.get('strokeWeight', 1)
        isw = n.get('individualStrokeWeights')
        dash = bool(n.get('strokeDashes'))
        if (isw and len(set(isw.values())) > 1) or dash:
            isw = isw or {k: w for k in ('top', 'right', 'bottom', 'left')}
            for side in ('top', 'right', 'bottom', 'left'):
                if isw.get(side): st.append(f'border-{side}:{isw[side]:g}px {"dashed" if dash else "solid"} {c}')
            st.append('box-sizing:border-box')
        else:
            al = n.get('strokeAlign')
            if al == 'OUTSIDE': sh.append(f'0 0 0 {w:g}px {c}')
            elif al == 'CENTER': sh.append(f'inset 0 0 0 {w/2:g}px {c}'); sh.append(f'0 0 0 {w/2:g}px {c}')
            else: sh.append(f'inset 0 0 0 {w:g}px {c}')
    nofill = not fills and not strokes
    for e in n.get('effects', []) or []:
        if not e.get('visible', True): continue
        if e['type'] == 'DROP_SHADOW' and nofill and n['type'] != 'TEXT':
            o = e['offset']; st.append(f"filter:drop-shadow({o['x']:g}px {o['y']:g}px {e['radius']/2:g}px {col(e['color'])})"); continue
        if e['type'] in ('DROP_SHADOW', 'INNER_SHADOW'):
            o = e['offset']; sh.append(f"{'inset ' if e['type']=='INNER_SHADOW' else ''}{o['x']:g}px {o['y']:g}px {e['radius']:g}px {e.get('spread',0):g}px {col(e['color'])}")
        if e['type'] == 'BACKGROUND_BLUR': st.append(f"backdrop-filter:blur({e['radius']/2:g}px)")
        if e['type'] == 'LAYER_BLUR': st.append(f"filter:blur({e['radius']/2:g}px)")
    if sh: st.append('box-shadow:' + ','.join(sh))
    if n.get('opacity', 1) < 1: st.append(f"opacity:{n['opacity']:.3f}")
    if n.get('clipsContent') and needs_clip(n):
        # 자식이 오른쪽으로만 넘치는 줄(캐러셀) → 가로 스크롤로 가려진 카드도 볼 수 있게
        st.append('overflow-x:auto;overflow-y:hidden;scrollbar-width:none' if hscroll(n) else 'overflow:hidden')
    return st

def hscroll(n):
    b = n.get('absoluteBoundingBox')
    if not b or n['type'] not in ('FRAME', 'INSTANCE'): return False
    kids = [c for c in n.get('children', []) if vis(c) and c.get('absoluteBoundingBox')]
    if len(kids) < 2: return False
    boxes = [c for c in kids if c['type'] != 'TEXT' and c['absoluteBoundingBox']['width'] >= 60]
    if len(boxes) < 2: return False
    right = max(c['absoluteBoundingBox']['x'] + c['absoluteBoundingBox']['width'] for c in boxes)
    vert_ok = all(c['absoluteBoundingBox']['y'] >= b['y'] - 3 and c['absoluteBoundingBox']['y'] + c['absoluteBoundingBox']['height'] <= b['y'] + b['height'] + 3 for c in kids)
    left_ok = all(c['absoluteBoundingBox']['x'] >= b['x'] - 3 for c in kids)
    return vert_ok and left_ok and right > b['x'] + b['width'] + 20

def needs_clip(n):
    """Figma에서 실제로 틀 밖으로 나가는 자식이 있을 때만 잘라내기 유지 (캐러셀·이미지 크롭 등).
    내용이 틀 안에 있는데 잘라내기만 켜진 경우, 브라우저 글자 폭 차이로 글자가 잘리므로 끔"""
    b = n.get('absoluteBoundingBox')
    if not b: return True
    tol = 3
    def ink(c):
        """눈에 보이는 영역: 글자=잉크, 색/테두리/이미지 있는 요소=박스, 투명한 틀=자식들의 합"""
        if not vis(c): return None
        if c['type'] == 'TEXT': return None  # 글자는 잘라내기 판단에서 제외 → 글자가 잘리지 않음
        painted = any(f.get('visible', True) for f in (c.get('fills') or []) + (c.get('strokes') or [])) or c['type'] in VEC
        if painted or not c.get('children'): return c.get('absoluteBoundingBox')
        rs = [r for r in (ink(k) for k in c['children']) if r]
        if not rs: return None
        x0 = min(r['x'] for r in rs); y0 = min(r['y'] for r in rs)
        return {'x': x0, 'y': y0, 'width': max(r['x'] + r['width'] for r in rs) - x0, 'height': max(r['y'] + r['height'] for r in rs) - y0}
    def out(c):
        cb = ink(c)
        if not cb or not vis(c): return False
        return cb['x'] < b['x'] - tol or cb['y'] < b['y'] - tol or cb['x'] + cb['width'] > b['x'] + b['width'] + tol or cb['y'] + cb['height'] > b['y'] + b['height'] + tol
    def any_out(x):
        for c in x.get('children', []):
            if out(c): return True
            if c['type'] in ('GROUP', 'BOOLEAN_OPERATION') or not c.get('clipsContent'):
                if any_out(c): return True
        return False
    # 둥근 모서리 + 이미지/색 채운 자식이 있으면 모서리 다듬기용으로 유지
    rounded = n.get('cornerRadius') or n.get('rectangleCornerRadii')
    if rounded and any(c['type'] != 'TEXT' and vis(c) and (c.get('fills') or c.get('children')) for c in n.get('children', [])):
        cb_full = [c for c in n.get('children', []) if vis(c) and c.get('absoluteBoundingBox')]
        if any(abs(c['absoluteBoundingBox']['x'] - b['x']) < 2 or abs(c['absoluteBoundingBox']['y'] - b['y']) < 2 for c in cb_full if c['type'] != 'TEXT'):
            return True
    return any_out(n)

# ---------------- 벡터 → SVG ----------------
def svg_paint(p, gid, defs, w, h):
    if p['type'] == 'SOLID': return col(p['color'], p.get('opacity', 1))
    if p['type'] == 'GRADIENT_LINEAR':
        hp = p['gradientHandlePositions']
        defs.append(f'<linearGradient id="{gid}" gradientUnits="userSpaceOnUse" x1="{hp[0]["x"]*w:.2f}" y1="{hp[0]["y"]*h:.2f}" x2="{hp[1]["x"]*w:.2f}" y2="{hp[1]["y"]*h:.2f}">'
                    + ''.join(f'<stop offset="{s["position"]:.3f}" stop-color="{col(s["color"], p.get("opacity",1))}"/>' for s in p['gradientStops']) + '</linearGradient>')
        return f'url(#{gid})'
    if p['type'] == 'GRADIENT_RADIAL':
        hp = p['gradientHandlePositions']
        cx, cy = hp[0]['x'] * w, hp[0]['y'] * h; r = math.hypot((hp[1]['x'] - hp[0]['x']) * w, (hp[1]['y'] - hp[0]['y']) * h)
        defs.append(f'<radialGradient id="{gid}" gradientUnits="userSpaceOnUse" cx="{cx:.2f}" cy="{cy:.2f}" r="{r:.2f}">'
                    + ''.join(f'<stop offset="{s["position"]:.3f}" stop-color="{col(s["color"], p.get("opacity",1))}"/>' for s in p['gradientStops']) + '</radialGradient>')
        return f'url(#{gid})'
    return None

SVGN = [0]
def render_svg(n, x, y, b, la):
    w, h = max(b['width'], 0.01), max(b['height'], 0.01)
    defs, paths = [], []
    for f in [f for f in n.get('fills', []) or [] if f.get('visible', True)]:
        SVGN[0] += 1
        paint = svg_paint(f, f'g{SVGN[0]}', defs, w, h)
        if not paint: continue
        for g in n.get('fillGeometry', []) or []:
            rule = 'evenodd' if g.get('windingRule') == 'EVENODD' else 'nonzero'
            paths.append(f'<path d="{g["path"]}" fill="{paint}" fill-rule="{rule}"/>')
    for s in [s for s in n.get('strokes', []) or [] if s.get('visible', True)]:
        SVGN[0] += 1
        paint = svg_paint(s, f'g{SVGN[0]}', defs, w, h)
        if not paint: continue
        for g in n.get('strokeGeometry', []) or []:
            paths.append(f'<path d="{g["path"]}" fill="{paint}"/>')
    if not paths: return ''
    op = f';opacity:{n["opacity"]:.3f}' if n.get('opacity', 1) < 1 else ''
    # 반전/회전: 로컬 경로에 절대 선형변환 적용 후 bbox 원점으로 이동
    a, bb_, c, dd = abs_lin(n['id'])
    sz = n.get('size') or {'x': w, 'y': h}
    g = ''
    if (a, bb_, c, dd) != (1, 0, 0, 1):
        pts = [(0, 0), (sz['x'], 0), (0, sz['y']), (sz['x'], sz['y'])]
        xs = [a * px + c * py for px, py in pts]; ys = [bb_ * px + dd * py for px, py in pts]
        g = f'matrix({a:.4f} {bb_:.4f} {c:.4f} {dd:.4f} {-min(xs):.3f} {-min(ys):.3f})'
    body = ''.join(paths)
    if g: body = f'<g transform="{g}">{body}</g>'
    return (f'<svg class="v" data-n="{n["id"]}" {la} style="left:{x:g}px;top:{y:g}px{op}" width="{w:g}" height="{h:g}" viewBox="0 0 {w:g} {h:g}">'
            + (f'<defs>{"".join(defs)}</defs>' if defs else '') + body + '</svg>')

# ---------------- 텍스트 ----------------
def text_style(s, fills):
    st = []
    if s.get('fontSize'): st.append(f"font-size:{s['fontSize']:g}px")
    if s.get('fontWeight'): st.append(f"font-weight:{int(s['fontWeight'])}")
    if s.get('letterSpacing'): st.append(f"letter-spacing:{s['letterSpacing']:.2f}px")
    if s.get('textDecoration') == 'UNDERLINE': st.append('text-decoration:underline')
    if s.get('textDecoration') == 'STRIKETHROUGH': st.append('text-decoration:line-through')
    fl = [f for f in fills or [] if f.get('visible', True) and f['type'] == 'SOLID']
    if fl: st.append('color:' + col(fl[0]['color'], fl[0].get('opacity', 1)))
    return st

def render_text(n, b):
    s = n.get('style', {})
    chars = n.get('characters', '')
    ov = n.get('characterStyleOverrides') or []
    table = n.get('styleOverrideTable') or {}
    runs, cur, buf = [], None, ''
    for i, ch in enumerate(chars):
        k = ov[i] if i < len(ov) else 0
        if k != cur and buf: runs.append((cur, buf)); buf = ''
        cur = k; buf += ch
    if buf: runs.append((cur, buf))
    inner = ''
    for k, t in runs:
        esc = H.escape(t).replace('\n', '<br>')
        o = table.get(str(k)) if k else None
        sst = text_style(o, o.get('fills')) if o else []
        if o and o.get('lineHeightPx'): sst.append(f"line-height:{o['lineHeightPx']:.2f}px")
        inner += f'<span style="{";".join(sst)}">{esc}</span>' if sst else esc
    lh = s.get('lineHeightPx') or s.get('fontSize', 14) * 1.2
    one = '\n' not in chars.strip() and b['height'] <= lh * 1.6
    st = text_style(s, n.get('fills'))
    st.append(f'line-height:{lh:.2f}px')
    al = {'LEFT': 'left', 'CENTER': 'center', 'RIGHT': 'right', 'JUSTIFIED': 'justify'}.get(s.get('textAlignHorizontal'), 'left')
    va = {'TOP': 'flex-start', 'CENTER': 'center', 'BOTTOM': 'flex-end'}.get(s.get('textAlignVertical'), 'flex-start')
    ha = {'left': 'flex-start', 'center': 'center', 'right': 'flex-end', 'justify': 'stretch'}[al]
    st.append(f'text-align:{al};justify-content:{va};align-items:{ha}')
    cls = 't1' if one else 't'
    # Figma에서 직접 줄을 나눈 만큼만 줄이 있는 글자(자동 줄바꿈 없음) → 브라우저도 임의 줄바꿈 금지
    nlines = chars.strip().count('\n') + 1
    def est_w(line):  # 글자 폭 추정 (한글≈0.93em, 그 외≈0.56em)
        fs = s.get('fontSize', 14)
        return sum(fs * (0.93 if ord(ch) > 0x2E80 else 0.56) for ch in line)
    if not one and b['height'] <= lh * nlines + lh * 0.6 and max(est_w(l) for l in chars.strip().split('\n')) <= b['width'] * 1.02:
        st.append('white-space:nowrap')
    if n.get('opacity', 1) < 1: st.append(f"opacity:{n['opacity']:.3f}")
    return cls, st, f'<span>{inner}</span>'

# ---------------- 연결 ----------------
def link_attrs(n):
    for it in n.get('interactions', []) or []:
        if (it.get('trigger') or {}).get('type') != 'ON_CLICK': continue
        for a in it.get('actions', []) or []:
            if not a: continue
            dest = a.get('destinationId')
            if a.get('navigation') == 'NAVIGATE' and dest in FRAMES and dest != '1:7638': return f'data-go="{dest}"'
            if a.get('navigation') == 'OVERLAY' and dest == '1:7638': return 'data-act="gnb"'
    return ''

# ---------------- 보완 UI 판별 (입력칸/드롭다운/라디오/체크/칩/달력) ----------------
def hexc(n, kind='fills'):
    for f in n.get(kind, []) or []:
        if f.get('visible', True) and f['type'] == 'SOLID':
            c = f['color']; return '#%02x%02x%02x' % (round(c['r'] * 255), round(c['g'] * 255), round(c['b'] * 255))
def vtexts(n):
    o = []
    def w(x):
        if not vis(x): return
        if x['type'] == 'TEXT': o.append(x)
        for c in x.get('children', []): w(c)
    w(n); return o
def hasvec(n):
    return n['type'] in VEC or any(hasvec(c) for c in n.get('children', []) if vis(c))
def linked(n):
    return bool(link_attrs(n)) or any(linked(c) for c in n.get('children', []))
PH = re.compile(r'(입력|검색|주세요|선택해|^0+$|^0[0,.]+$)')
OPTS = {
    '관리': ['계좌 별명 변경', '계좌 숨기기', '이체한도 조회', '통장 사본 출력'],
    '010': ['010', '011', '016', '017', '019'],
    'naver.com': ['naver.com', 'gmail.com', 'daum.net', 'hanmail.net', '직접 입력'],
    '계좌를 선택해 주세요.': ['NH농협 333-3333-3333-33 (자립예탁금)', 'NH농협 302-1234-5678-19 (올원통장)'],
    '맞춤 비교하기': ['금리 높은 순', '기간 짧은 순', '최소 가입금액 순'],
    '계열사/관련사이트': ['NH농협금융지주', 'NH투자증권', 'NH농협생명', 'NH농협손해보험', 'NH농협카드'],
    '12개월': ['6개월', '12개월', '24개월', '36개월'],
}
UI = {}
def classify():
    for k, f in FRAMES.items():
        def w(n, parent):
            if not vis(n): return
            b = n.get('absoluteBoundingBox') or {}
            bw, bh = b.get('width', 0), b.get('height', 0)
            ts = vtexts(n); st = hexc(n, 'strokes'); fl = hexc(n)
            # 탭 묶음: 같은 높이 프레임 3개 이상이 각각 글자 하나
            kids = [c for c in n.get('children', []) if vis(c)]
            if len(kids) >= 3 and all(c['type'] in ('FRAME', 'INSTANCE') and len(vtexts(c)) == 1 and not hasvec(c) and not linked(c) for c in kids):
                hs = [c['absoluteBoundingBox']['height'] for c in kids]
                if max(hs) - min(hs) < 3 and max(hs) <= 70:
                    for c in kids: UI.setdefault(c['id'], 'data-ui="chip"')
            if n['id'] in UI and n['type'] != 'TEXT':
                for c in n.get('children', []): w(c, n)
                return
            # 달력
            if parent is not None and parent.get('name') == '오늘의 일정':
                if n['type'] == 'TEXT' and re.fullmatch(r'\d{1,2}', n.get('characters', '')): UI[n['id']] = 'data-ui="day"'
                if n['type'] == 'ELLIPSE' and 30 <= bw <= 44: UI[n['id']] = 'data-ui="dayhl"'
            if n['type'] in ('FRAME', 'RECTANGLE', 'INSTANCE', 'GROUP') and len(ts) == 1 and not linked(n):
                t = ts[0]; ch = t.get('characters', '').strip()
                boxy = bool(st or (fl and fl != '#ffffff'))
                isph = PH.search(ch) and '선택' not in ch and (hexc(t) in ('#666666', '#999999', '#aaaaaa', '#888888', '#767676', '#b3b3b3') or re.fullmatch(r'0[0,.]*', ch))
                if boxy and 24 <= bh <= 64 and bw >= 60 and hasvec(n) and n['type'] != 'GROUP' and not isph:
                    UI[n['id']] = f'data-ui="sel" data-opts="{H.escape(json.dumps(OPTS.get(ch, []), ensure_ascii=False))}"'
                    return
                if boxy and 24 <= bh <= 64 and bw >= 40 and isph:
                    UI[t['id']] = f'data-ui="in" data-bw="{bw:g}"'
                    return
                if boxy and 24 <= bh <= 64 and 28 <= bw <= 460 and n['type'] != 'GROUP':
                    UI[n['id']] = 'data-ui="chip"'
            if n['type'] == 'TEXT' and n['id'] not in UI and re.search(r'(검색해|입력해|키워드 검색|검색하세요|검색어)', n.get('characters', '')) and not re.search(r'(되었습니다|했습니다|건\))', n.get('characters', '')) and hexc(n) not in ('#ffffff', '#0066b3', '#121212', '#111111', '#000000'):
                a = PARENT.get(n['id']); boxw = None
                for _ in range(3):
                    if not a: break
                    an = NODES[a]; ab = an.get('absoluteBoundingBox') or {}
                    if (hexc(an, 'strokes') or hexc(an)) and 24 <= ab.get('height', 0) <= 90: boxw = ab['width'] - (b['x'] - ab['x']) - 50; break
                    a = PARENT.get(a)
                if boxw: UI[n['id']] = f'data-ui="in" data-bw="{boxw + (b["x"] - NODES[a]["absoluteBoundingBox"]["x"]):g}" data-search="1"'
            if 12 <= bw <= 26 and abs(bw - bh) < 1.5 and not ts and n['type'] in ('ELLIPSE', 'FRAME', 'INSTANCE', 'RECTANGLE'):
                r = n.get('cornerRadius', 0) or 0
                grp = PARENT.get(PARENT.get(n['id']) or '') or ''
                if (n['type'] == 'ELLIPSE' or r >= bw / 2 - 1) and (st in ('#d8d8d8', '#0066b3') or fl == '#0066b3'):
                    UI[n['id']] = f'data-ui="radio" data-grp="{grp}"' + (' data-on="1"' if (st == '#0066b3' or fl == '#0066b3') else '')
                    return
                if r <= 6 and (st == '#d8d8d8' or fl == '#0066b3'):
                    UI[n['id']] = 'data-ui="chk"' + (' data-on="1"' if fl == '#0066b3' else '')
                    return
            for c in n.get('children', []): w(c, n)
        w(f, None)
    clickable_pass()

# ---- 2차: 클릭할 수 있어 보이지만 Figma 연결이 없는 요소 → 호버 + '연결 화면 없음' 안내 ----
def small_vecs_only(n, lim=26):
    ok = [True]
    def w(x):
        if not vis(x): return
        if x['type'] in VEC or any(f.get('type') == 'IMAGE' for f in x.get('fills', []) or []):
            bb = x['absoluteBoundingBox']
            if max(bb['width'], bb['height']) > lim: ok[0] = False
        for c in x.get('children', []): w(c)
    w(n); return ok[0]
def in_ui_or_link(nid):
    a = nid
    while a and a not in FRAMES:
        if a in UI or link_attrs(NODES[a]): return True
        a = PARENT.get(a)
    return False
def item_like(c, tile=False):
    if not vis(c) or c['type'] not in ('FRAME', 'INSTANCE', 'GROUP'): return False
    ts = vtexts(c)
    if len(ts) != 1 or linked(c) or c['id'] in UI: return False
    b = c['absoluteBoundingBox']
    if b['height'] > (140 if tile else 50) or b['width'] > 600: return False
    if (ts[0].get('style') or {}).get('fontSize', 14) > 20: return False
    return small_vecs_only(c, 110 if tile else 26)
def clickable_pass():
    for k, f in FRAMES.items():
        head = [c['id'] for c in f['children'] if vis(c) and not c.get('overflowDirection')]
        def w(n, in_head):
            if not vis(n): return
            if in_ui_or_link(n['id']): return
            kids = [c for c in n.get('children', []) if vis(c)]
            # (1) 같은 모양 항목이 3개 이상 가로/세로로 나란한 메뉴·목록 (입력칸이 섞인 문장 줄은 제외)
            has_input = any(UI.get(c['id'], '').startswith('data-ui="in"') or any(UI.get(t['id'], '').startswith('data-ui="in"') for t in vtexts(c)) for c in kids)
            # 캐러셀 점·일시정지: 글자 없는 작은 원/막대가 3개 이상 가로로
            dots = [c for c in kids if vis(c) and c['type'] in ('FRAME', 'ELLIPSE', 'RECTANGLE', 'INSTANCE') and not vtexts(c) and c['absoluteBoundingBox']['width'] <= 30 and c['absoluteBoundingBox']['height'] <= 16 and not linked(c)]
            if len(dots) >= 3 and max(c['absoluteBoundingBox']['y'] for c in dots) - min(c['absoluteBoundingBox']['y'] for c in dots) < 6:
                for c in dots: UI.setdefault(c['id'], 'data-todo="다른 배너 화면은 디자인에 없습니다."')
            for tile in ((False, True) if not has_input else ()):
                items = [c for c in kids if item_like(c, tile)]
                if len(items) >= 3:
                    hs = [c['absoluteBoundingBox']['height'] for c in items]; ws = [c['absoluteBoundingBox']['width'] for c in items]
                    ys = [c['absoluteBoundingBox']['y'] for c in items]; xs = [c['absoluteBoundingBox']['x'] for c in items]
                    horiz = max(ys) - min(ys) < 4 and max(hs) - min(hs) < 4
                    vert = max(xs) - min(xs) < 4 and max(ws) - min(ws) < 4 and min(ws) >= 150
                    if horiz or vert:
                        for c in items: UI.setdefault(c['id'], 'data-ui="chip"')
                        break
            b = n.get('absoluteBoundingBox') or {}
            ts = vtexts(n)
            # (2) 글자 + 작은 화살표/아이콘 링크 (예: 전체보기 >, 장바구니, 결과보기)
            if n['id'] not in UI and n['type'] in ('FRAME', 'INSTANCE', 'GROUP') and len(ts) == 1 and hasvec(n) and b.get('height', 99) <= 50 and b.get('width', 999) <= 320 and small_vecs_only(n) and not linked(n):
                UI[n['id']] = 'data-ui="chip"'; return
            # (2-1) 배너 좌우 화살표: 글자 없는 둥근 아이콘 버튼
            if n['id'] not in UI and n['type'] in ('FRAME', 'INSTANCE') and not ts and hasvec(n) and 28 <= b.get('width', 0) <= 64 and abs(b.get('width', 0) - b.get('height', 0)) < 3 and ((n.get('cornerRadius') or 0) >= b['width'] / 2 - 1 or n['name'].upper() in ('PRE', 'NEXT', 'PREV')) and not linked(n):
                UI[n['id']] = 'data-todo="다른 배너 화면은 디자인에 없습니다."'; return
            # (3) 머리글의 아이콘 버튼 (검색·즐겨찾기·메뉴 등)
            if in_head and n['id'] not in UI and n['type'] in ('FRAME', 'INSTANCE', 'GROUP') and not ts and hasvec(n) and b.get('width', 99) <= 44 and b.get('height', 99) <= 44 and not linked(n):
                UI[n['id']] = 'data-todo=""'; return
            # (4) 머리글의 단독 글자 메뉴 (개인·기업·카드, 로그아웃 등)
            if in_head and n['type'] == 'TEXT' and n['id'] not in UI and not linked(n) and (n.get('style') or {}).get('fontSize', 14) <= 20:
                UI[n['id']] = 'data-todo=""'
            for c in kids: w(c, in_head)
        for c in f['children']: w(c, c['id'] in head)

def partial_ellipse(n):
    a = n.get('arcData')
    if not a: return False
    return a.get('innerRadius', 0) > 0 or abs((a['endingAngle'] - a['startingAngle']) - 2 * math.pi) > 0.01

def render(n, pb):
    if not vis(n): return ''
    b = n.get('absoluteBoundingBox')
    if not b: return ''
    x, y = b['x'] - pb['x'], b['y'] - pb['y']
    la = link_attrs(n) + (' ' + UI[n['id']] if n['id'] in UI else '')
    nid = n['id']
    if n['type'] in VEC or (n['type'] == 'ELLIPSE' and partial_ellipse(n)):
        return render_svg(n, x, y, b, la)
    base = f'left:{x:g}px;top:{y:g}px;width:{b["width"]:g}px;height:{b["height"]:g}px'
    if n['type'] == 'TEXT':
        cls, st, inner = render_text(n, b)
        return f'<div class="{cls}" data-n="{nid}" {la} style="{base};{";".join(st)}">{inner}</div>'
    if n['type'] == 'LINE':
        strokes = [s for s in n.get('strokes', []) or [] if s.get('visible', True) and s['type'] == 'SOLID']
        if not strokes: return ''
        c = col(strokes[0]['color'], strokes[0].get('opacity', 1)); w = n.get('strokeWeight', 1)
        ds = 'dashed' if n.get('strokeDashes') else 'solid'
        if b['height'] < 0.5: st = f'left:{x:g}px;top:{y - w/2:g}px;width:{b["width"]:g}px;height:0;border-top:{w:g}px {ds} {c}'
        else: st = f'left:{x - w/2:g}px;top:{y:g}px;width:0;height:{b["height"]:g}px;border-left:{w:g}px {ds} {c}'
        if n.get('opacity', 1) < 1: st += f";opacity:{n['opacity']:.3f}"
        return f'<i class="l" data-n="{nid}" style="{st}"></i>'
    st = [base] + box_css(n, b)
    kids = ''.join(render(c, b) for c in n.get('children', []))
    return f'<div class="b" data-n="{nid}" {la} style="{";".join(st)}">{kids}</div>'

def page_parts(f):
    head, body, fixed = [], None, []
    for c in f['children']:
        if not vis(c): continue
        if c.get('overflowDirection') == 'VERTICAL_SCROLLING' and c.get('children'): body = c
        elif c['name'] == 'Frame 1739333580': fixed.append(c)
        else: head.append(c)
    return head, body, fixed

def gen():
    classify()
    import collections
    print('UI', collections.Counter(v.split('"')[1] for v in UI.values()))
    os.makedirs(OUT + 'assets/img', exist_ok=True); os.makedirs(OUT + 'js/pages', exist_ok=True)
    meta = {}
    for k, f in FRAMES.items():
        fb = f['absoluteBoundingBox']
        head, body, fixed = page_parts(f)
        hh = ''.join(render(c, fb) for c in head)
        hb = max([c['absoluteBoundingBox']['y'] - fb['y'] + c['absoluteBoundingBox']['height'] for c in head] or [0])
        bodyhtml, bh, btop, bg = '', 0, 0, ''
        if body:
            bb = body['absoluteBoundingBox']; btop = bb['y'] - fb['y']
            for c in body['children']: bh = max(bh, c['absoluteBoundingBox']['y'] - bb['y'] + c['absoluteBoundingBox']['height'])
            bodyhtml = ''.join(render(c, bb) for c in body['children'])
            bg = ';'.join(s for s in box_css(body, bb) if s.startswith('background'))
        fx = ''.join(render(c, fb) for c in fixed)
        fbg = ';'.join(s for s in box_css(f, fb) if s.startswith('background'))
        page = {'id': k, 'head': hh, 'headH': hb, 'body': bodyhtml, 'bodyTop': btop, 'bodyH': bh, 'bodyBg': bg, 'fixed': fx, 'bg': fbg}
        js = json.dumps(page, ensure_ascii=False, separators=(',', ':'))
        fn = 'p' + k.replace(':', '_') + '.js'
        open(OUT + 'js/pages/' + fn, 'w').write(f'WEB.page({js});\n')
        meta[k] = {'file': fn, 'kb': len(js.encode()) // 1024}
    json.dump(meta, open(W + 'meta.json', 'w'), indent=1)
    print(meta)

if __name__ == '__main__':
    gen()
