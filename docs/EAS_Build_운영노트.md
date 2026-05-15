# EAS Build 실행 절차

> 작성일: 2026-05-15

ddooby-navigator를 Android APK/AAB로 빌드하는 운영 노트. Expo 관리형 워크플로우 기준이며, react-native-maps가 네이티브 모듈이라 Expo Go 만으로는 한계가 있어 EAS Build가 필요하다.

---

## 결론 요약

| 작업 | 명령 |
|------|------|
| 최초 1회 세팅 | `npm install -g eas-cli` → `eas login` → `eas build:configure` |
| API 키 등록 | `eas secret:create --scope project --name GOOGLE_MAPS_API_KEY --value <키> --type string` |
| 개발 빌드 | `eas build --platform android --profile development` |
| 내부 배포 빌드 (APK) | `eas build --platform android --profile preview` |
| 스토어 빌드 (AAB) | `eas build --platform android --profile production` |
| Play Store 제출 | `eas submit -p android` |

---

## 사전 준비물

- **Expo 계정** (없으면 [expo.dev](https://expo.dev) 에서 가입)
- **Node.js v18+**
- **프로젝트가 git 저장소** (EAS Build 가 git 상태를 기준으로 빌드)
- **Google Maps API 키** 발급 완료 (`.env` 에 보관 중)

---

## 1단계: 최초 1회 세팅

### 1.1 EAS CLI 설치

```bash
npm install -g eas-cli
```

### 1.2 로그인

```bash
eas login
```

Expo 계정 이메일/비밀번호 입력. 이미 로그인되어 있다면 `eas whoami` 로 확인.

### 1.3 프로젝트 설정

프로젝트 폴더에서:

```bash
cd C:\Users\cheol_hi\Desktop\Ddooby\90.Etc\ddooby-navigator
eas build:configure
```

플랫폼 선택 시 **Android** 선택. 명령 종료 후 프로젝트 루트에 `eas.json` 이 자동 생성된다.

### 1.4 eas.json 권장 구성

생성된 `eas.json` 을 다음과 같이 보강:

```json
{
  "cli": {
    "version": ">= 7.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

---

## 2단계: API 키를 EAS Secret 으로 등록

`.env` 는 로컬 빌드용이고 EAS Build 는 클라우드에서 빌드되므로, **API 키를 EAS 서버에 따로 등록**해야 한다.

```bash
eas secret:create \
  --scope project \
  --name GOOGLE_MAPS_API_KEY \
  --value AIzaSyDVCFNx5s5DG2xgXtzkCJucyE61zyAsj04 \
  --type string
```

등록 확인:

```bash
eas secret:list
```

> ⚠️ `.env` 파일을 git에 커밋해서 EAS에 전달하는 방식은 절대 금지. EAS Secret 만 사용.

### 시크릿이 빌드 시 어떻게 주입되는지

EAS Build 가 빌드 환경을 만들 때 `eas secret:list` 의 모든 시크릿을 `process.env.*` 로 주입한다. 따라서 `babel.config.js` 의 `transform-inline-environment-variables` 플러그인이 그 값을 빌드 결과물에 inline 한다.

---

## 3단계: Android Keystore 관리

EAS Build 는 첫 production 빌드 시 release용 keystore 를 자동 생성한다. 이 keystore 의 SHA-1 은 로컬 debug.keystore 와 **다르다**.

### 3.1 EAS 관리 keystore SHA-1 확인

```bash
eas credentials
```

대화형 메뉴에서:
1. **Android** 선택
2. **production** 프로파일 선택
3. **Keystore: Manage everything needed to build your project** → **View**

출력 중 `SHA1 Fingerprint:` 라인 복사.

### 3.2 Google Cloud Console 에 등록

[console.cloud.google.com](https://console.cloud.google.com) → 해당 API 키 → Application restrictions → ADD AN ITEM:
- Package name: `com.ddooby.navigator`
- SHA-1: 위에서 복사한 값

→ 기존 debug용 SHA-1 옆에 production SHA-1 이 추가된다.

상세 SHA-1 가이드는 [`SHA-1_setup_guide.md`](./SHA-1_setup_guide.md) 참조.

---

## 4단계: 빌드 실행

### 4.1 프로파일별 차이

| 프로파일 | 용도 | 결과물 | dev client | 배포 |
|----------|------|--------|-----------|------|
| **development** | 로컬 개발 (디버그 메뉴 포함) | APK | 필요 | 내부만 |
| **preview** | 베타/내부 테스트 배포 | APK | 불필요 | 내부 링크 |
| **production** | Play Store 출시용 | AAB | 불필요 | 스토어 |

### 4.2 빌드 명령

개발용:
```bash
eas build --platform android --profile development
```

내부 테스트용:
```bash
eas build --platform android --profile preview
```

스토어 출시용:
```bash
eas build --platform android --profile production
```

### 4.3 빌드 진행 상황 확인

빌드는 EAS 서버 큐에서 진행된다. 명령 실행 시 빌드 URL 이 출력되며, 브라우저에서 실시간 로그 확인 가능. 또는:

```bash
eas build:list
```

---

## 5단계: 결과물 다운로드 및 설치

### 5.1 다운로드

빌드 완료 후 EAS 대시보드 또는 명령 실행 시 출력된 URL 에서 APK/AAB 다운로드.

### 5.2 실기기 설치 (APK)

USB 로 Android 기기 연결 후:

```bash
adb install path/to/build.apk
```

또는 다운로드 URL 을 기기 브라우저에서 열어 직접 설치 (출처를 알 수 없는 앱 설치 허용 필요).

### 5.3 Play Store 제출 (AAB)

```bash
eas submit -p android --latest
```

또는 빌드 ID 명시:

```bash
eas submit -p android --id <build-id>
```

최초 제출 시 Google Play Console 에서 서비스 계정 키 (JSON) 발급 후 EAS 에 등록 필요.

---

## 자주 쓰는 명령어

| 목적 | 명령 |
|------|------|
| 로그인 상태 확인 | `eas whoami` |
| 빌드 목록 조회 | `eas build:list` |
| 빌드 취소 | `eas build:cancel <build-id>` |
| 시크릿 조회 | `eas secret:list` |
| 시크릿 삭제 | `eas secret:delete --name <NAME>` |
| 자격증명 조회 | `eas credentials` |
| 프로젝트 정보 | `eas project:info` |
| 로컬 빌드 (큐 우회) | `eas build --local --platform android --profile preview` |

> `--local` 옵션은 본인 PC 에서 빌드하므로 큐 대기가 없는 대신 Android SDK 가 PC 에 설치되어 있어야 한다.

---

## 트러블슈팅

### 증상: 빌드 로그에 `process.env.GOOGLE_MAPS_API_KEY` 가 undefined

**원인**
- EAS Secret 으로 등록되지 않았거나, 다른 scope (account vs project) 로 등록되어 빌드가 못 찾음
- babel plugin `include` 목록에 `GOOGLE_MAPS_API_KEY` 가 빠져 있음

**조치**
```bash
# 등록 상태 확인
eas secret:list

# 누락된 경우 재등록
eas secret:create --scope project --name GOOGLE_MAPS_API_KEY --value <키> --type string
```

`babel.config.js` 의 `include: ['GOOGLE_MAPS_API_KEY']` 도 확인.

---

### 증상: 빌드는 성공했는데 앱 설치 후 지도 화면이 회색으로만 표시됨

**원인**
- EAS 가 자체 생성한 release keystore 의 SHA-1 이 Google Cloud Console 에 등록되지 않음
- 로컬 debug SHA-1 만 등록된 상태

**조치**
```bash
eas credentials
```
→ production keystore 의 SHA-1 확인 → Google Cloud Console 에 ADD AN ITEM 으로 추가 → 5분 대기 후 재테스트.

---

### 증상: `eas build` 명령 실행 시 "EAS project not configured" 에러

**원인**
- `app.config.js` 또는 `app.json` 에 `extra.eas.projectId` 가 없거나, EAS 계정과 매핑이 안 됨

**조치**
```bash
eas build:configure
```
실행하면 자동으로 `extra.eas.projectId` 가 채워지고 매핑이 완료된다. 매핑 후 git commit.

---

### 증상: 빌드 큐 대기 시간이 1시간 이상

**원인**
- Free tier 의 우선순위 큐가 후순위로 밀려 있음

**조치 (선택지)**
1. **무료 유지**: 그대로 대기 (보통 30분~2시간)
2. **유료 Plan**: Production plan 으로 업그레이드 → 우선순위 큐 사용
3. **로컬 빌드**: `--local` 플래그로 본인 PC 에서 빌드 (Android SDK 필요)

```bash
eas build --local --platform android --profile preview
```

---

### 증상: 첫 production 빌드 후 Play Store 업로드 시 "Package name already exists" 거부

**원인**
- 다른 누군가 이미 같은 패키지명 (`com.ddooby.navigator`) 으로 앱을 등록함
- 또는 본인 다른 Google 계정에 이미 등록되어 있음

**조치**
- `app.config.js` 의 `android.package` 를 고유 값으로 변경 (예: `com.ddooby.navi2026`)
- 변경 후 EAS keystore 재생성 및 SHA-1 재등록 필요

---

### 증상: 의존성 충돌로 빌드 실패 ("Could not resolve dependency...")

**원인**
- `package.json` 과 `package-lock.json` 이 git 상태에서 불일치
- 로컬에서 `npm install` 후 lock 파일을 commit 안 한 상태로 EAS 에 푸시됨

**조치**
```bash
npm install
git add package-lock.json
git commit -m "chore: sync lockfile"
```
이후 다시 빌드.

---

## 비용 / 한도 참고

EAS Build 무료 한도 (변경될 수 있음):
- 월 30회 빌드
- 빌드당 최대 35분
- 우선순위 큐 사용 불가 (대기 시간 길 수 있음)

자세한 최신 정책은 [EAS Pricing](https://expo.dev/pricing) 참조.

---

## 다음 단계 체크리스트

- [ ] eas-cli 설치
- [ ] eas login
- [ ] eas build:configure → eas.json 생성/검토
- [ ] EAS Secret 등록 (`GOOGLE_MAPS_API_KEY`)
- [ ] development 프로파일로 첫 빌드 실행
- [ ] 자동 생성된 production keystore 의 SHA-1 추출
- [ ] Google Cloud Console 에 SHA-1 등록
- [ ] preview 빌드 후 실기기 동작 확인
- [ ] (Phase 2) production 빌드 및 Play Store 제출
