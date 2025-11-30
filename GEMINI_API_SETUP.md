# Gemini API 설정 가이드

## 1. Gemini API 키 발급 받기

1. Google AI Studio 방문: https://makersuite.google.com/app/apikey
2. Google 계정으로 로그인
3. "Create API Key" 버튼 클릭
4. API 키 복사

## 2. API 키 설정하기

### 방법 1: 직접 코드에 입력 (개발/테스트용)

`app/src/main/java/com/Ebiz/risk/data/GeminiClient.kt` 파일을 열고:

```kotlin
const val API_KEY = "YOUR_GEMINI_API_KEY_HERE"
```

위 부분을 발급받은 API 키로 변경:

```kotlin
const val API_KEY = "AIzaSyD_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### 방법 2: local.properties 사용 (권장)

1. 프로젝트 루트의 `local.properties` 파일 열기
2. 다음 줄 추가:
   ```
   GEMINI_API_KEY=AIzaSyD_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. `app/build.gradle.kts` 파일에 다음 추가:
   ```kotlin
   android {
       ...
       defaultConfig {
           ...
           val properties = Properties()
           properties.load(project.rootProject.file("local.properties").inputStream())
           buildConfigField("String", "GEMINI_API_KEY", "\"${properties.getProperty("GEMINI_API_KEY")}\"")
       }
       
       buildFeatures {
           buildConfig = true
       }
   }
   ```

4. `GeminiClient.kt`에서 사용:
   ```kotlin
   const val API_KEY = BuildConfig.GEMINI_API_KEY
   ```

## 3. 무료 사용량

- Gemini API 무료 티어: 분당 60회 요청
- 월 1,500회 무료 사용 가능
- 충분히 개발/테스트 가능

## 4. 테스트

1. 앱 실행
2. "새 프로젝트 분석하기" 클릭
3. 프로젝트 정보 입력
4. 리스크 점수 입력
5. AI 조언 화면에서 자동으로 Gemini API 호출
6. 로딩 후 AI가 생성한 실행 조치 표시

## 5. 문제 해결

### API 키 오류
- API 키가 올바른지 확인
- Google AI Studio에서 API 키 활성화 상태 확인

### 네트워크 오류
- 인터넷 연결 확인
- 방화벽/프록시 설정 확인

### 타임아웃 오류
- 네트워크 속도 확인
- GeminiClient.kt의 timeout 값 증가

## 6. 배포 시 주의사항

⚠️ **절대 API 키를 Git에 커밋하지 마세요!**

- `.gitignore`에 `local.properties` 포함 확인
- 프로덕션 환경에서는 서버에서 API 호출 권장
- 클라이언트에서 직접 호출 시 API 키 노출 위험

## 7. 대안: 서버 구현

더 안전한 방법:
1. 백엔드 서버 구축
2. 서버에서 Gemini API 호출
3. 앱은 자체 서버 API만 호출
4. API 키는 서버에서만 관리

