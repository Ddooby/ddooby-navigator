# 뚜비 (Ddooby Navigator) 🐸

> 뚜벅이 전용 도보 네비게이션 앱
> 청개구리 마스코트 캐릭터로 즐거운 걷기 경험 제공

---

## 🛠️ 기술 스펙

| 분류 | 사용 기술 |
|------|-----------|
| Framework | React Native + Expo (managed workflow) |
| 언어 | JavaScript |
| 플랫폼 | Android (초기) |
| 지도 | react-native-maps (Google Maps Provider) |
| 위치 추적 | expo-location |
| 경로 계산 | Google Directions API (`mode=walking` 고정) |
| 장소 검색 | Google Places API (`language=ko` 고정) |
| 화면 전환 | @react-navigation/native + native-stack |
| 애니메이션 | lottie-react-native (Phase 2) |
| 환경변수 | dotenv + babel-plugin-transform-inline-environment-variables |

### 핵심 임계값
- **경로 이탈 감지**: 30m 초과
- **다음 안내 전환**: 다음 step까지 20m 이내
- **도착 감지**: 목적지 15m 이내

---

## ✅ 사전 준비물

빌드 환경 구성에 필요한 것들:

1. **Node.js** (LTS 권장, v18+)
   - 설치: https://nodejs.org
2. **JDK 17 이상** (React Native / Expo 권장)
   - 설치: https://adoptium.net (Eclipse Temurin)
3. **Android Studio** (에뮬레이터 또는 실제 기기 빌드용)
   - 또는 실제 Android 기기 + USB 디버깅 활성화
4. **Google Cloud Platform 계정** (Maps API 키 발급용)
5. **Git**

---

## 🚀 프로젝트 내려받고 실행하기까지

### 1단계: 저장소 클론

```bash
git clone <repository-url>
cd ddooby-navigator
```

### 2단계: 의존성 설치

```bash
npm install
```

> 첫 설치 시 react-native-maps, expo-location 등 네이티브 모듈 포함 패키지를 받아 시간이 좀 걸립니다(2~5분).

### 3단계: Google Maps API 키 발급

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 프로젝트 생성 또는 선택
3. **APIs & Services** → **Library** 에서 다음 3개 API 활성화:
   - Maps SDK for Android
   - Directions API
   - Places API
4. **APIs & Services** → **Credentials** → **+ CREATE CREDENTIALS** → **API key**
5. 발급된 키 문자열 복사 (예: `AIzaSyXXXX...`)

### 4단계: 환경변수 설정

프로젝트 루트에 `.env` 파일 생성 (`.env.example` 참고):

```bash
# Windows
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

`.env` 파일을 열고 발급받은 API 키 입력:

```env
GOOGLE_MAPS_API_KEY=AIzaSyXXXX_여기에_본인_키_입력
```

> ⚠️ `.env` 파일은 `.gitignore` 에 등록되어 있어 git에 올라가지 않습니다. 키를 코드에 직접 적지 마세요.

### 5단계: SHA-1 fingerprint 발급 및 등록

API 키 보안을 위해 SHA-1 등록이 필요합니다.

**상세 가이드**: [`docs/SHA-1_setup_guide.md`](./docs/SHA-1_setup_guide.md) 참고

요약하면:

```bash
# Windows
keytool -list -v -keystore "%USERPROFILE%\.android\debug.keystore" ^
  -alias androiddebugkey -storepass android -keypass android

# macOS / Linux
keytool -list -v -keystore ~/.android/debug.keystore \
  -alias androiddebugkey -storepass android -keypass android
```

출력의 `SHA1:` 값을 복사 → Google Cloud Console → 해당 API 키 → **Application restrictions** → **Android apps** 에 등록:
- Package name: `com.ddooby.navigator`
- SHA-1: (복사한 값)

### 6단계: 앱 실행

#### 옵션 A — Expo Go (간편, 단 react-native-maps 제약 있음)

```bash
npx expo start
```

QR 코드 스캔 후 Expo Go 앱에서 열기. (Expo Go 환경에서는 일부 네이티브 기능 제한됨)

#### 옵션 B — 개발 빌드 (권장)

react-native-maps는 네이티브 모듈이라 development build가 권장됩니다.

```bash
# 네이티브 코드 prebuild
npx expo prebuild --platform android

# Android 기기/에뮬레이터로 실행
npx expo run:android
```

> 첫 빌드는 Gradle이 의존성을 받느라 5~10분 소요될 수 있습니다.

### 7단계: 동작 확인

앱 실행 후:
1. 위치 권한 허용
2. 상단 검색바에 목적지 입력 (예: "강남역")
3. 결과 선택 → 경로 표시 + 턴바이턴 안내 시작
4. 도착 시 청개구리 세레모니 화면 이동

---

## 📁 폴더 구조

```
ddooby-navigator/
├── App.js                       # 네비게이션 루트
├── app.config.js                # Expo 설정 (process.env 주입)
├── babel.config.js              # process.env inline 변환
├── package.json
├── .env / .env.example
├── .gitignore
├── assets/
│   └── lottie/                  # Phase 2 Lottie JSON
├── screens/
│   ├── MapScreen.js             # 메인 (지도 + 검색)
│   ├── NavigationScreen.js      # 턴바이턴 안내
│   └── ArrivalScreen.js         # 도착 세레모니
├── components/
│   ├── SearchBar.js
│   ├── RoutePolyline.js
│   ├── FrogMarker.js
│   ├── TurnByTurnCard.js
│   └── FrogAnimation.js
├── hooks/
│   ├── useLocation.js           # GPS 추적 (Ddooby-tracker 재사용)
│   └── useNavigation.js         # 턴바이턴 + 경로 이탈 감지
├── services/
│   ├── directionsApi.js         # mode=walking 고정
│   └── placesApi.js             # language=ko 고정
├── utils/
│   ├── distance.js              # Haversine + 폴리라인 거리
│   └── routeParser.js           # html_instructions 태그 제거
└── docs/
    └── SHA-1_setup_guide.md
```

---

## 📜 자주 쓰는 명령어

| 목적 | 명령어 |
|------|--------|
| 의존성 설치 | `npm install` |
| Expo 개발 서버 시작 | `npx expo start` |
| Android 기기 실행 | `npx expo run:android` |
| 네이티브 코드 재생성 | `npx expo prebuild --clean` |
| 캐시 클리어 후 시작 | `npx expo start -c` |
| 의존성 호환성 점검 | `npx expo-doctor` |

---

## 🔧 트러블슈팅

### "GOOGLE_MAPS_API_KEY 가 .env 에 설정되지 않았어요" 에러
- `.env` 파일이 프로젝트 루트에 있는지 확인
- 키 입력 후 `npx expo start -c` 로 캐시 클리어하고 재시작

### 지도가 빈 화면으로만 표시됨
- API 키의 Maps SDK for Android 활성화 여부 확인
- SHA-1 + 패키지명 등록 확인
- 변경 후 5분 정도 캐시 반영 시간 필요

### "Build failed" — Gradle 에러
- JDK 17 이상 설치 확인 (`java -version`)
- `npx expo prebuild --clean` 으로 네이티브 코드 재생성

### 위치 권한 받았는데도 currentLocation 이 null
- 에뮬레이터의 경우: Extended Controls → Location 에서 좌표 수동 설정 필요
- 실기기: GPS가 켜져 있는지, 실내라면 창가로 이동

### 검색 결과 안 나옴
- Places API 활성화 여부 확인
- API restrictions에 Places API 포함되어 있는지 확인

---

## 🚫 절대 금지 (CLAUDE.md 참조)

- `.env` 파일 git commit 금지
- API 키 코드 내 직접 작성 금지 — `process.env.GOOGLE_MAPS_API_KEY` 만 사용
- Directions API `mode=walking` 이외 호출 금지
- `utils/distance.js` Haversine 로직 외부 라이브러리로 교체 금지
- Lottie 에셋 외부 URL 런타임 fetch 금지
- `html_instructions` HTML 태그 UI 노출 금지

---

## 📚 관련 문서

- [`CLAUDE.md`](./CLAUDE.md) — 프로젝트 규칙 및 구현 가이드
- [`docs/SHA-1_setup_guide.md`](./docs/SHA-1_setup_guide.md) — Windows/macOS SHA-1 설정 상세
- [Expo 문서](https://docs.expo.dev/)
- [react-native-maps](https://github.com/react-native-maps/react-native-maps)

---

## 🐸 마스코트 청개구리 에셋

Phase 2 진입 시 [LottieFiles](https://lottiefiles.com/free-animations/frog) 에서 다음 3개 JSON 다운로드:
- `frog_jump.json` — 위치 마커 / 달성 리액션
- `frog_loading.json` — 경로 계산 중
- `frog_arrive.json` — 도착 세레모니

→ `assets/lottie/` 폴더에 저장.
