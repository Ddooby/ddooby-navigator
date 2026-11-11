# Ddooby Navigator — Claude 개발팀 지침

> 상태: 문서 초안 (2026-11-11). Tracker 실기기 테스트 미실시. 실제 저장소 반영 전 기존 지침/코드와 충돌 확인 필요.

## 1. 역할과 책임

- 사용자: 제품 목표·범위·단계 전환의 최종 승인.
- Claude 메인(상시 PL): 요구사항 접수, `SPEC.md`·`docs/PLAN.md`·`docs/TASKS.md` 관리, 기술 설계/작업 배분, 통합 검증, 완료 보고.
- claude-1/claude-2: 지정 파일과 기준에 따라 구현·테스트·화면 확인, 커밋과 검증 결과 보고.
- Codex: 요청 시 테스트 전략/트리아지/독립 리뷰/디자인 중 **한 요청에 한 역할**; 기본적으로 제품 코드/테스트 코드 수정 금지.
- 역할은 Orca 탭 제목(`claude-main`, `claude-1`, `claude-2`, `codex-main`, `codex-design`)으로 구분한다. 탭 ID는 PC마다 다르므로 묻거나 적지 않고 `docs/WORKFLOW.md` 7절의 명령으로 조회한다.
- 세션 포트, 실제 파일 소유권은 **현재 세션에서 확인**하고 임의로 채우지 않는다.

## 2. 문서 우선순위와 운영

1. `SPEC.md`: 무엇/왜, 기능 범위와 수용 기준. 제품 결정은 사용자.
2. `docs/PLAN.md`: 어떻게, 데이터 흐름·기술·검증 및 태스크 설계.
3. `docs/TASKS.md`: 의존 순서, 담당, 상태·완료 근거.
4. `docs/WORKFLOW.md`: worktree, 위임 요청서, 검증/리뷰 절차.
5. `AGENTS.md`: Codex 권한·산출물 기준. 관련 소스·검증·Git 규칙 변경 시 두 에이전트 지침을 동기화한다.

문서 충돌 시 **SPEC > PLAN > TASKS**. 변경되는 제품 규칙은 사용자 결정 후 SPEC → PLAN → TASKS 순으로 반영한다.

## 3. 기본 작업 흐름

1. 사용자의 요청을 Claude 메인이 요구사항/수용 기준으로 정리한다. 아직 승인되지 않은 내용은 `확인 필요`로 남긴다.
2. 실제 저장소 구조와 기존 설정/테스트 명령을 확인해 PLAN에 파일 단위 변경과 검증 방법을 정리한다.
3. 복잡한 경계 조건은 구현 전 Codex 테스트 전략, 핵심 경로 변경은 main 반영 전 Codex 독립 리뷰를 필요에 따라 요청한다.
4. claude-1·2는 서로 같은 파일을 동시에 수정하지 않고, 각 worktree의 태스크 브랜치에서 작업·테스트·커밋 뒤 메인에 보고한다.
5. 메인이 diff/요구사항/실기기 증거를 검증하고 리뷰 지적을 조치한다. 재리뷰는 최대 2회.
6. 검증된 것만 TASKS에 `[x]` 기록하고 사용자에게 변경·검증·미확인 사항 보고. 실기기 증거가 없으면 미검증으로 유지.

## 4. 프로젝트 기술 규칙

- 기존 React Native + Expo 지도·위치 구조를 우선 확인한다. Tracker 검증 커밋에서 재사용 범위를 결정한다.
- 첫 MVP는 한 출발지의 현장 확인된 15분/30분 평지 **순환 코스**. 임의 경로 자동 생성은 별도 승인 전 구현하지 않는다.
- UI와 GPS/시간/진행도/도착 도메인 로직은 분리한다. 출발지 반경 하나로 완료 판정 금지.
- 개인화 평가 회차를 학습에 포함하지 않는다. 기본속도 fallback과 GPS 오류 상태를 제공한다.
- API 키와 원시 개인 GPS 경로를 공개 코드·로그에 넣지 않는다. 기존 마스코트 에셋의 출처 관리 지침은 유지한다.

## 5. 명령과 Git

- 실행 명령은 최신 `package.json` 및 기존 README에서 **직접 확인**한다. lint, typecheck, test, build 스크립트가 없으면 임의 명령을 가정하지 않는다.
- 브랜치: `feat/<태스크ID>-<요약>`; 커밋: `[feat] <태스크ID> 설명` (수정 시 `[fix]` 등).
- main 직접 커밋 금지. 구현 탭은 독립 worktree에서 작업하고 메인 검증 후 지시에 따라 rebase/반영한다.

## 6. 검증과 보고

- 회차별 실기기 검증 결과와 코드 테스트 결과를 구분한다.
- TASKS 완료는 기대한 수용 기준과 실제 증거가 모두 일치할 때만 허용한다.
- 보고: 태스크 ID, 변경 파일·커밋, 실행 명령·결과, 현장 증거, Codex 지적·처리, 사용자 결정 필요 사항.
- 상세한 요청서와 Codex 산출물 규칙은 `docs/WORKFLOW.md`에 따른다.

---

> 아래는 초안 반영 이전의 기존 프로젝트 기술 규칙이다 (보존).

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
