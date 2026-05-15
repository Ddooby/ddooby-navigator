# SHA-1 Fingerprint 설정 가이드

> Android 앱 + Google Maps API 키 보안 설정용 노트
> 작성일: 2026-05-15

---

## 📌 SHA-1 이란?

**SHA-1 fingerprint** = 앱을 빌드할 때 사용한 **서명 인증서(keystore)** 에서 추출되는 고유 식별자(20바이트 해시).

### 왜 필요한가?
Google Cloud는 API 요청이 들어올 때 "이 요청이 정말 내 앱에서 온 건가?"를 검증합니다. 그 검증 기준이 **패키지명 + SHA-1 fingerprint** 묶음입니다.

- API 키만 있다고 누구나 사용 가능 → ❌ 보안 사고
- API 키 + 등록된 SHA-1 + 등록된 패키지명 일치 → ✅ 통과

→ 키가 유출돼도 다른 앱/PC에서는 못 쓰게 만드는 장치.

### 핵심 주의사항

| 상황 | SHA-1 동일 여부 | 등록 필요성 |
|------|-----------------|-------------|
| 같은 PC, 같은 keystore | 동일 | 1개 등록 |
| Windows + Mac (각자 keystore 생성) | **다름** | 둘 다 등록 |
| Windows + Mac (keystore 파일 복사) | 동일 | 1개 등록 |
| Debug 빌드 vs Release 빌드 | **다름** | 각각 등록 |

---

## 💻 Windows 설정 방법

### 1. JDK / keytool 확인

```cmd
java -version
keytool -help
```

**한글 깨짐(`?`) 출력 시**: 영어 강제 옵션 사용
```cmd
keytool -J-Duser.language=en -J-Duser.country=US -help
```

**"인식되지 않는 명령" 에러 시**: JDK PATH 미등록 상태. 전체 경로로 실행하거나 PATH 추가.
```cmd
dir "C:\Program Files\Java"
```

### 2. `.android` 폴더 만들기

위치: `C:\Users\<사용자명>\.android\` (PC 전역, 프로젝트 폴더와 무관)

```cmd
mkdir "%USERPROFILE%\.android"
```

### 3. debug.keystore 생성

```cmd
keytool -genkeypair -v ^
  -keystore "%USERPROFILE%\.android\debug.keystore" ^
  -alias androiddebugkey ^
  -storepass android ^
  -keypass android ^
  -keyalg RSA ^
  -keysize 2048 ^
  -validity 10950 ^
  -dname "CN=Android Debug,O=Android,C=US"
```

**고정값(절대 변경 금지)**:
- `alias androiddebugkey`
- `storepass android`
- `keypass android`

→ Android 빌드 시스템이 이 값들로 자동 인식.

### 4. SHA-1 추출

```cmd
keytool -list -v ^
  -keystore "%USERPROFILE%\.android\debug.keystore" ^
  -alias androiddebugkey ^
  -storepass android ^
  -keypass android
```

**출력에서 찾을 부분**:
```
Certificate fingerprints:
         SHA1: AA:BB:CC:DD:EE:FF:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE
```

→ `SHA1:` 뒤 콜론 포함 전체를 복사.

---

## 🍎 macOS 설정 방법

### 1. JDK / keytool 확인

```bash
java -version
keytool -help
```

**없으면 Homebrew로 설치**:
```bash
# Homebrew 자체가 없으면 먼저 설치
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# JDK 17 설치 (React Native / Expo 권장)
brew install openjdk@17

# 시스템 등록
sudo ln -sfn $(brew --prefix)/opt/openjdk@17/libexec/openjdk.jdk \
  /Library/Java/JavaVirtualMachines/openjdk-17.jdk
```

### 2. `.android` 폴더 만들기

위치: `~/.android/` (= `/Users/<사용자명>/.android/`)

```bash
mkdir -p ~/.android
```

`-p` 옵션은 이미 있으면 에러 없이 통과.

### 3. debug.keystore 생성

```bash
keytool -genkeypair -v \
  -keystore ~/.android/debug.keystore \
  -alias androiddebugkey \
  -storepass android \
  -keypass android \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10950 \
  -dname "CN=Android Debug,O=Android,C=US"
```

### 4. SHA-1 추출

```bash
keytool -list -v \
  -keystore ~/.android/debug.keystore \
  -alias androiddebugkey \
  -storepass android \
  -keypass android
```

출력 중 `SHA1:` 라인 복사.

---

## 🔄 Windows ↔ macOS 비교표

| 항목 | Windows | macOS |
|------|---------|-------|
| 홈 폴더 변수 | `%USERPROFILE%` | `~` 또는 `$HOME` |
| 경로 구분자 | `\` | `/` |
| 줄바꿈 문자 | `^` (CMD) | `\` (bash/zsh) |
| keystore 위치 | `C:\Users\<유저>\.android\debug.keystore` | `/Users/<유저>/.android/debug.keystore` |
| 한글 인코딩 | CP949 → `?` 깨짐 발생 | UTF-8 기본, 문제 없음 |
| JDK 설치 | adoptium.net 직접 다운로드 | `brew install openjdk@17` |
| 폴더 생성 옵션 | `mkdir` | `mkdir -p` |

---

## ☁️ Google Cloud Console 등록

[console.cloud.google.com](https://console.cloud.google.com) →
**APIs & Services** → **Credentials** → 해당 API 키 클릭

### Application restrictions
1. **Android apps** 선택
2. **ADD AN ITEM** 클릭
3. 입력:
   - Package name: `com.ddooby.navigator`
   - SHA-1: 위에서 복사한 값
4. PC가 여러 대면 **ADD AN ITEM** 반복

### API restrictions (필수 권장)
**Restrict key** 선택 → 다음 3개만 활성화:
- Maps SDK for Android
- Directions API
- Places API

### 저장 후 주의
- 변경사항 반영까지 **최대 5분** 소요
- 바로 안 된다고 당황하지 말 것

---

## 🔀 두 PC SHA-1 관리 전략

### 전략 A: 각자 생성 (독립)
- Windows에서 debug.keystore 생성 → SHA-1 #1
- 맥에서 debug.keystore 생성 → SHA-1 #2
- Google Cloud Console에 둘 다 등록

| 장점 | 단점 |
|------|------|
| PC 분실/오염 시 다른 PC 영향 없음 | 새 PC 추가할 때마다 등록 작업 반복 |

### 전략 B: keystore 파일 복사 (공유)
- Windows에서 만든 `debug.keystore` 를 USB/iCloud로 맥에 복사
- 양쪽 PC가 같은 SHA-1 공유
- Google Cloud Console에 SHA-1 1개만 등록

```bash
# 맥에서 복사 받기
mkdir -p ~/.android
cp /Volumes/USB/debug.keystore ~/.android/debug.keystore
chmod 600 ~/.android/debug.keystore
```

| 장점 | 단점 |
|------|------|
| Console 등록 1번으로 끝, 신규 PC 추가 편함 | 파일 유출 시 두 PC 모두 영향 |

> 💡 **1인 토이 프로젝트는 전략 B 추천**. debug 용도라 비밀번호도 공개된 `android` 값이라 보안 부담이 크지 않음.

---

## 🚨 자주 막히는 부분

### "keytool: command not found"
JDK가 PATH에 없음. 전체 경로로 실행:
- Windows: `"C:\Program Files\Java\jdk-XX\bin\keytool.exe"`
- macOS: `$(brew --prefix)/opt/openjdk@17/bin/keytool`

### Windows 터미널 한글 깨짐 (`?`)
keytool 명령에 `-J-Duser.language=en -J-Duser.country=US` 추가 → 영어 출력.
SHA-1 값 자체는 ASCII라 어차피 안 깨지지만 메뉴가 보기 편해짐.

### "Keystore was tampered with, or password was incorrect"
비밀번호 잘못 입력한 경우. debug.keystore의 표준 비밀번호는 둘 다 `android`.

### Console 등록했는데도 "API key not authorized" 에러
체크 순서:
1. 패키지명 정확 (`com.ddooby.navigator`) — 오타 한 글자도 거부
2. SHA-1 콜론 포함 전체 복사했는지
3. API restrictions에서 Maps SDK / Directions / Places 활성화 여부
4. 변경 후 5분 대기 (캐시 반영 시간)

### debug.keystore 없는데 빌드는 됨
Android Studio를 한 번이라도 띄우면 자동 생성됨. 또는 `expo run:android` 첫 실행 시 자동 생성 시도. 그러나 SHA-1 직접 확보가 필요하면 본 가이드대로 수동 생성이 빠름.

---

## 📚 참고 사항

- **debug.keystore vs release keystore**: 본 가이드는 **debug** 용. Play Store 배포 시에는 **release** keystore 따로 만들고, 그 SHA-1도 별도 등록해야 함.
- **EAS Build 사용 시**: EAS가 release keystore를 자체 관리. SHA-1 조회는 `eas credentials` 명령으로.
- **인증서 유효기간**: 본 가이드는 `-validity 10950` (30년)으로 설정. 만료되면 빌드 깨짐.

---

## ✅ 체크리스트

- [ ] JDK 설치 확인 (`java -version`)
- [ ] `.android` 폴더 존재 확인
- [ ] debug.keystore 생성
- [ ] SHA-1 추출 및 복사
- [ ] Google Cloud Console에 패키지명 + SHA-1 등록
- [ ] API restrictions에서 사용할 API만 활성화
- [ ] 5분 대기 후 실제 앱에서 API 호출 테스트
