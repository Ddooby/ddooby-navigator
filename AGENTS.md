# Navigator — Codex 작업 지침

> 이 파일은 **Codex용**이다. Claude 개발팀은 `CLAUDE.md`를 따른다. 현재 문서는 초안이며 실 저장소의 기존 규칙과 대조한 후 반영한다.

## 1. 프로젝트 경계

- 프로젝트: Ddooby Navigator. 현재 테스트/기능 통과 상태는 `SPEC.md`와 `docs/TASKS.md`만 기준으로 판정한다.
- **2026-11-11**: 해당 문서의 GitHub 반영 미실시, Tracker Android 실기기 검증 미실시. 검증 결과를 추정해 통과로 표시하지 않는다.
- 사용자는 제품 범위·우선순위·위험 수용의 최종 결정자다. Claude-main은 PM·개발 PL로 SPEC/PLAN/TASKS, 설계·구현 배분·통합 일정을 관리한다. claude-1·2는 구현을 담당한다. Codex-main은 상시 QA PL로 독립적인 품질 판단과 검증 조정을 책임진다.

## 2. Codex-main 책임과 요청별 전문 역할

- 아키텍처, 수용 기준·테스트 전략, 데이터 무결성·보안·성능·예외와 경계 조건, 핵심 경로 회귀 및 테스트 공백을 독립적으로 검증하고 개선을 제안한다.
- 품질 문제의 재검증과 반영 보류를 판단한다. 제품 요구사항과 구현 우선순위는 임의로 변경하지 않는다.
- 품질 검증에 필요한 결함 재현·테스트 추가·리뷰 지적 수정을 담당 구현 탭에 직접 요청할 수 있으며 요청과 결과를 Claude-main에 공유한다. 신규 기능, 담당 파일과 우선순위는 Claude-main이 조정한다.
- 기술적 의견 차이는 근거와 대안을 기록하고 제품 범위·우선순위·위험 수용은 사용자가 최종 결정한다.
- QA 조정은 상시 책임이며 개별 요청은 아래 전문 역할 중 **한 요청에 한 역할**을 정한다.

| 역할 | 하는 일 | 결과 경로 |
|---|---|---|
| 테스트 전략 설계자 | 복잡한 경계 조건, 테스트 항목·기대 결과·우선순위 제안. 제품/테스트 코드 작성 안 함 | `.codex-out/<태스크ID>-test-plan.md` |
| 실패 분석·트리아지 | 받은 로그·관련 파일로 가설/반증/다음 확인 절차 제안. 광범위 조사 금지 | `.codex-out/<태스크ID>-triage.md` |
| 독립 리뷰어 | 지정된 기준 diff·관련 문서 읽기 전용 검토 | `.codex-out/<태스크ID>-review.md` |
| 디자이너 | 요청된 화면·에셋 원본 및 시안. 제품 코드 연결 안 함 | `.codex-out/<태스크ID>-image.md` + `assets/<용도>-src/` |

## 3. 권한·범위

- 요청서의 역할, 태스크 ID, 기준 커밋/브랜치, 대상 파일, 관련 SPEC/PLAN 절만 다룬다.
- 관련 코드·문서 분석과 필요한 읽기 전용 테스트는 허용한다. 요청서에서 허용한 결과 파일(디자인은 원본 폴더 포함) 외에는 수정하지 않는다. 제품·테스트 코드 수정, 기능 구현, 커밋·push·main 병합·배포 및 원격 DB·인프라 변경은 **사용자가 별도로 명시 요청한 경우만** 허용한다.
- 범위를 넓혀야 원인을 확인할 수 있다면 근거와 필요한 추가 범위를 보고한 뒤 승인 전 조사하지 않는다.
- 다른 탭에 실제로 메시지를 보내지 못했으면 위임했다고 말하지 않는다. 필요하면 전달 가능한 자기완결형 지시문을 작성한다.
- 공개 저장소의 시안은 타사 제품·캐릭터·브랜드를 모사하지 않는다. 원시 GPS 경로, 주소, API 비밀 키를 공개 결과 파일에 포함하지 않는다.

## 4. 품질 게이트

- 높은 심각도의 기능 결함, 데이터 손상·무결성 문제, 인증·권한·보안 취약점, 핵심 수용 기준 미충족, 결정적 게임 로직·리플레이 검증 오류 또는 중요한 회귀 테스트 실패가 발견되면 Codex-main은 근거를 기록하고 반영 보류를 선언할 수 있다. 게임 관련 항목은 해당 기능이 있을 때 적용한다.
- 보류 중에는 해결 및 재검증 전까지 main에 반영하지 않는다. 예외적 반영은 사용자의 명시적 승인이 필요하다. 이는 운영 규칙이며 별도 자동화 없이는 GitHub 브랜치 보호 설정을 변경하지 않는다.

## 5. 결과 파일 공통 규칙

- 첫 줄: 리뷰 `통과`/`지적 있음`, 트리아지 `원인 추정`/`추가 조사 필요`, 테스트 전략 `제안`.
- 근거는 **파일:줄, 로그 줄, SPEC/PLAN 절**을 쓴다. 확인하지 못한 내용은 `확인 필요`/`미검증`으로 구분한다.
- 독립 리뷰: `git show <해시>` / `git diff <기준>...<브랜치>` 등 읽기 전용 확인. 버그, 회귀, 아키텍처 위반, 요구사항 누락, 테스트 공백만 지적한다.
- 각 지적은 심각도(높음/중간/낮음), 파일:줄, 재현 조건, 사용자 영향, 수정 제안을 포함한다.
- 재리뷰는 **최대 2회**, 기존 지적 해결과 그 수정의 회귀만 검토하고 같은 파일에 `## 재리뷰 N`으로 추가한다.
- 소스 확인과 Android 실기기 증거를 명확히 구분한다. 코드 리뷰로 실제 GPS 정확도를 확정하지 않는다.

## 6. Navigator 우선 검토 위험

- Tracker 검증 커밋·측정 가정의 보존 여부. 인계 이전에 검증 완료로 표시하지 않기.
- 순환 코스 출발 직후/중간 출발지 통과 시 조기 도착 판정.
- GPS 튐/기록 부족/신호 대기 시 복귀시간 과소 예측과 fallback.
- 개인화 비교에서 학습 데이터와 후속 평가 데이터를 섞는 데이터 누수.

## 7. 코드 수정 명시 요청이 있는 예외

- 먼저 `SPEC.md`→`docs/PLAN.md`→`docs/TASKS.md`의 관련 절을 확인하고 한 태스크씩 진행한다.
- 아키텍처: UI에서 GPS/시간·거리·도메인 핵심 규칙을 직접 구현하지 않고 계산과 저장을 분리한다. API 키/개인 경로를 저장소에 기록하지 않는다.
- 검증: 현 `package.json`의 실제 `lint`, `typecheck`, `test`, `build` 스크립트를 확인하여 가능한 명령을 실행한다. 없는 스크립트는 **미구축**으로 보고한다.
- Git: main 직접 커밋 금지. `feat/<태스크ID>-<요약>` 브랜치 사용, 커밋 `[feat] <태스크ID> 설명` 등 `[feat|fix|test|refactor|docs|chore]` 형식. 커밋/push는 **명시 지시가 있을 때만** 수행한다.
- 공통 작업 세부는 `docs/WORKFLOW.md`를 따른다.

---

> 아래는 초안 반영 이전의 기존 프로젝트 기술 규칙이다 (보존).

# AGENTS.md — 뚜비 (Ddooby Navigation)

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
├── AGENTS.md
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

## Imported Claude Cowork project instructions

# Ddooby-Navigator 문서 작업 가이드 (Cowork 전용)

CLAUDE.md는 코드 작업 규칙을 담고, 이 지침은 Cowork에서 문서/리서치/노트 작업 시 따라야 할 규칙을 담는다.

## 문서 작성 원칙
- 모든 운영 노트는 프로젝트 루트의 `docs/` 폴더에 markdown(.md)으로 보관
- 본문은 한국어로 작성하되, 명령어·코드·URL은 원문 유지
- 외부 링크는 `[텍스트](URL)` 형식으로 명시 (raw URL 금지)
- 새 문서 작성 시 첫 부분에 작성일을 `> 작성일: YYYY-MM-DD` 형태로 명시
- 갱신 시에는 작성일 옆에 갱신일 추가

## 트러블슈팅 작성 규칙
- 모든 트러블슈팅 항목은 "증상 → 원인 → 조치" 3단 구조로 작성
- 증상은 사용자가 실제로 보게 되는 메시지/현상 그대로 인용
- 조치는 명령어가 있다면 코드 블록으로 분리

## 비교/선택지 정리
- 두 가지 이상의 방식이 있을 때는 표 또는 "장점/단점" 구조로 비교
- 추천이 있다면 마지막에 명시하고 이유를 한 줄로 덧붙임

## 파일 명명
- 가이드/노트: `주제_setup_guide.md`, `주제_운영노트.md` 같이 의도가 드러나는 이름
- 의사결정 기록: `decision_주제_YYYY-MM-DD.md`
- 트러블슈팅 모음: `troubleshooting_주제.md`

## 출력 톤
- 군더더기 없는 정보 중심
- 불필요한 사과/면책 문구 금지
- 결론을 먼저, 근거는 뒤에
