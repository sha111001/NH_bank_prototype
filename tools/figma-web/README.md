# Figma → 웹 화면 변환 도구

`web/js/pages/*.js` 와 `web/assets/img/*.webp` 는 이 도구가 Figma 파일에서 자동으로 만든 결과입니다.
Figma를 수정한 뒤 아래 순서로 다시 만들면 바뀐 디자인이 그대로 반영됩니다.

## 필요한 것
- Python 3, Pillow, numpy
- Figma 개인 액세스 토큰 (권한: File content → Read only)

## 순서
1. 작업 폴더에 Figma 데이터 받기 (`FILE_KEY` = 웹 Figma 파일 키)
   - 파일 + 벡터 경로: `GET https://api.figma.com/v1/files/FILE_KEY?geometry=paths` → `fullgeo.json`
   - 원본 이미지 주소: `GET https://api.figma.com/v1/files/FILE_KEY/images` → `fills.json`, 각 주소의 파일을 `fills/<imageRef>` 로 저장
   - (색 필터 보정용) 각 화면의 헤더·본문 노드 1배 렌더: `GET /v1/images/FILE_KEY?ids=...&scale=1` → `ex/<노드ID>.png`, 화면별 노드 목록 `plan.json`
2. `gen.py` 상단의 `W`(작업 폴더)와 `OUT`(web 폴더) 경로를 맞춘 뒤 `python3 gen.py`

## 변환 규칙
| Figma | HTML |
|---|---|
| 프레임·사각형·원 | `div` + CSS (채우기, 그라디언트, 테두리, 모서리, 그림자, 잘라내기) |
| 텍스트 | 실제 텍스트 (글꼴·크기·굵기·행간·자간·정렬, 부분 스타일) |
| 벡터·다각형 | Figma 벡터 경로로 만든 인라인 SVG (반전·회전 반영) |
| 이미지 채우기 | 원본 이미지 → 표시 크기 2배 WebP (자르기·색 필터 반영) |
| 프로토타입 On click → Navigate | `data-go="화면ID"` |
| 프로토타입 On click → Open overlay | `data-act="gnb"` (금융상품몰 2단 메뉴) |
| 입력칸·드롭다운·라디오·체크·칩/탭·달력 | `data-ui="..."` → `web/js/enhance.js` 가 실제 컨트롤로 동작시킴 |
