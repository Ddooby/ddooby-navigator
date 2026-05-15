# CLAUDE.md — 뚜비 (Ddooby Navigation)

> 뚜벅이 전용 도보 네비게이션 앱 | React Native + Expo | Android | 1인 토이 프로젝트
> 청개구리 마스코트 🐸 | Google Maps 기반

---

## ⚡ 핵심 규칙 한눈에 보기

| 항목 | 값 / 규칙 |
|------|-----------|
| 이동 모드 | Directions API `mode=walking` **고정** (그 외 금지) |
| 검색 언어 | Places API `language=ko` **필수** |
| API 키 참조 | `process.env.GOOGLE_MAPS_API_KEY` **만 사용** (하드코딩 금지) |
| 경로 이탈 임계값 | **30m 초과** → 경로 재계산 |
| 다음 안내 전환 | 다음 step까지 **20m 이내** 진입 시 |
| 도착 감지 거리 | 목적지 **15m 이내** |
| 거리 계산 | `utils/distance.js` Haversine **자체 구현** (외부 라이브러리 금지) |
| GPS 훅 | `hooks/useLocation.js` Ddooby-tracker에서 **그대로 재사용** |
| Lottie 에셋 | `assets/lottie/` **로컬 파일만** (런타임 URL fetch 금지) |
| `html_instructions` | UI 렌더 전 **태그 제거 필수** |

---

## 🎯 프로젝트 목적

도보 이동에 특화된 네비게이션 앱.
- **Phase 1**: 일반 도보 네비 (목적지 검색 → 경로 표시 → 턴바이턴)
- **Phase 2**: 청개구리 캐릭터 기반 차별화 (마커·도착 세레모니·달성 리액션)

---

## 🛠️ 기술 스택

- **Framework**: React Native + Expo (managed workflow)
- **플랫폼**: Android only (초기)
- **지도**: react-native-maps (Google Maps)
- **위치**: expo-location
- **경로 계산**: Google Directions API
- **장소 검색**: Google Places API
- **애니메이션**: lottie-react-native (청개구리 캐릭터)
- **네비게이션**: @react-navigation/native + stack

---

## 📁 폴더 구조

```
ddooby-navigation/
├── App.js
├── app.json
├── CLAUDE.md
├── .env                            # API 키 보관 (git 제외 필수)
├── .env.example                    # 키 없는 템플릿 (git 포함)
├── .gitignore
├── assets/
│   └── lottie/
│       ├── frog_jump.json          # 위치 마커 / 달성 리액션
│       ├── frog_loading.json       # 경로 계산 중 로딩
│       └── frog_arrive.json        # 도착 세레모니
├── screens/
│   ├── MapScreen.js                # 메인: 지도 전체화면 + 상단 검색바
│   ├── NavigationScreen.js         # 턴바이턴 안내 화면
│   └── ArrivalScreen.js            # 도착 세레모니 화면
├── components/
│   ├── SearchBar.js                # 목적지 검색 (Places API)
│   ├── RoutePolyline.js            # 경로 선 컴포넌트
│   ├── FrogMarker.js               # 청개구리 현재 위치 마커
│   ├── TurnByTurnCard.js           # 다음 안내 카드 (하단 고정)
│   └── FrogAnimation.js            # Lottie 애니메이션 래퍼
├── hooks/
│   ├── useLocation.js              # GPS 추적 (Ddooby-tracker 재사용)
│   └── useNavigation.js            # 경로 이탈 감지 + 턴바이턴 로직
├── services/
│   ├── directionsApi.js            # Google Directions API 호출
│   └── placesApi.js                # Google Places API 호출
└── utils/
    ├── distance.js                 # Haversine 거리 계산 (Ddooby-tracker 재사용)
    └── routeParser.js              # Directions API 응답 파싱
```

---

## 🔐 환경변수 & 보안

### `.env` (git 제외)
```
GOOGLE_MAPS_API_KEY=your_api_key_here
```

### `.env.example` (git 포함)
```
GOOGLE_MAPS_API_KEY=
```

### `.gitignore` 필수 항목
```
# 환경변수
.env
.env.local
.env.*.local

# Expo
.expo/
dist/
web-build/

# Node
node_modules/
npm-debug.log*

# OS
.DS_Store
*.pem
```

### API 키 참조 방식 (이 두 곳에서만)
```javascript
// app.json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": { "apiKey": process.env.GOOGLE_MAPS_API_KEY }
      }
    }
  }
}

// services/directionsApi.js, services/placesApi.js
const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
```

> ⚠️ 코드 어디에도 `"AIza..."` 같은 실제 키 문자열을 직접 쓰지 말 것.

---

## 🗺️ 메인 화면 UX 구조

```
┌─────────────────────────┐
│  [🔍 어디로 갈까요?   ] │  ← 상단 검색바 (고정)
├─────────────────────────┤
│                         │
│        지 도            │  ← MapView 전체 화면
│                         │
│   🐸 (현재 위치 마커)  │
│                         │
├─────────────────────────┤
│  ↰ 50m 앞 좌회전       │  ← 턴바이턴 카드 (안내 중에만 표시)
└─────────────────────────┘
```

---

## 🔑 구현 규칙 상세

### Google API
- API 키 하드코딩 금지 → `process.env.GOOGLE_MAPS_API_KEY` 만 참조
- Directions: `mode=walking` 고정 — 도보 외 이동수단 호출 금지
- Places: `language=ko` 파라미터 포함 — 한국어 결과 보장

### GPS 추적
- `hooks/useLocation.js` — Ddooby-tracker 코드 그대로 사용
- `utils/distance.js` Haversine — 자체 구현 유지 (외부 라이브러리로 교체 금지)

### 경로 이탈 감지
- 현재 위치 → 경로 위 가장 가까운 점 거리 **> 30m** 이면 이탈
- 이탈 즉시 Directions API 재호출 → 새 경로로 교체

### 턴바이턴
- Directions API 응답의 `steps[]` 순회
- 각 step의 `html_instructions` 는 **태그 제거 후** 텍스트로 사용
- 다음 step까지 거리 **≤ 20m** 진입 시 안내 전환

### 청개구리 캐릭터 (Phase 2)
- `FrogMarker.js`: 현재 위치 마커에 Lottie 애니메이션
- 도착 감지: 목적지 **≤ 15m** → `ArrivalScreen.js` 이동 + `frog_arrive.json` 재생
- 모든 Lottie JSON은 `assets/lottie/` 로컬에서 require (외부 URL 런타임 fetch 금지)

---

## 📋 개발 단계 체크리스트

### 초기 세팅
- [ ] 패키지 설치
- [ ] `.env` + `.env.example` + `.gitignore` 생성
- [ ] `app.json` Google Maps API 키 + 위치 권한 설정

### Phase 1 — 도보 네비
- [ ] `MapScreen.js` — 지도 + 상단 검색바 레이아웃
- [ ] `placesApi.js` — 장소 검색 (`language=ko`)
- [ ] `SearchBar.js` — 검색 결과 드롭다운 UI
- [ ] `directionsApi.js` — 도보 경로 요청 (`mode=walking`)
- [ ] `routeParser.js` — steps 파싱 + html_instructions 태그 제거
- [ ] `RoutePolyline.js` — 지도에 경로 선
- [ ] `useNavigation.js` — 턴바이턴 + 경로 이탈(30m) 감지
- [ ] `TurnByTurnCard.js` — 하단 안내 카드 UI
- [ ] `NavigationScreen.js` — 안내 중 화면 통합
- [ ] 도착(15m) 감지 → `ArrivalScreen.js` 이동

### Phase 2 — 청개구리 차별화
- [ ] lottie-react-native 설치/설정
- [ ] `FrogMarker.js` — 청개구리 위치 마커
- [ ] `frog_arrive.json` — 도착 세레모니
- [ ] `frog_loading.json` — 경로 계산 중 로딩
- [ ] 걸음 달성 리액션 (100m / 500m / 1km)
- [ ] 청개구리 말투 안내 멘트 적용

---

## 🐸 청개구리 에셋 출처

**LottieFiles** (무료 JSON)

| 용도 | URL |
|------|-----|
| 점프 (마커/리액션) | https://lottiefiles.com/free-animations/frog-jumping |
| 로딩 (경로 계산 중) | https://lottiefiles.com/free-animation/frog-loading-animation-Vb3Xnjei1f |
| 전체 프로그 컬렉션 | https://lottiefiles.com/free-animations/frog |

> 다운로드한 JSON은 `assets/lottie/` 폴더에 저장 후 `require()` 로 import.

---

## 🚫 절대 금지 (Do NOT)

- `.env` 파일 git commit
- API 키 코드 내 직접 작성
- `mode=walking` 이외 이동 수단 호출
- Haversine 로직을 외부 라이브러리로 교체
- Lottie 에셋 외부 URL 런타임 fetch
- `html_instructions` HTML 태그를 UI에 그대로 노출

---

## ♻️ Ddooby-tracker 재사용 자산

- `hooks/useLocation.js` — GPS 추적 로직 동일
- `utils/distance.js` — Haversine 거리 + 포맷 함수 동일

---

## 💡 향후 개선 (백로그)

- OpenWeather API 연동 — 비 오면 청개구리 신남 리액션
- iOS 지원 확장
- 경사도 회피 경로 옵션
- Ddooby-tracker 데이터 기반 "내가 걸었던 길" 추천

---
