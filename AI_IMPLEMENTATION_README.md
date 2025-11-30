# Risk Manager - AI 기능 구현 완료

## ✅ 구현 완료 내용

### 1. Gemini API 연동
- ✅ Retrofit + OkHttp를 사용한 API 클라이언트 구현
- ✅ Gemini 1.5 Flash 모델 사용
- ✅ JSON 응답 파싱 및 에러 처리
- ✅ 타임아웃 설정 (30초)

### 2. AI Repository
- ✅ 프로젝트 정보 기반 프롬프트 생성
- ✅ 각 리스크별 3개씩 실행 조치 생성
- ✅ Impact(효과)와 Effort(노력) 평가
- ✅ JSON 파싱 실패 시 기본 조언 제공

### 3. UI 구성
- ✅ AIActionsFragment: AI 조언 표시 화면
- ✅ RecyclerView 어댑터: 리스크별 조치 목록
- ✅ 배지 디자인: Impact/Effort 시각화
- ✅ 로딩 상태 표시 (ProgressBar)
- ✅ 에러 메시지 Toast 표시

### 4. ViewModel 통합
- ✅ generateAIActions() 메서드 추가
- ✅ LiveData로 상태 관리
- ✅ 코루틴으로 비동기 처리

## 📁 생성된 파일 목록

### Kotlin 파일
```
app/src/main/java/com/Ebiz/risk/
├── data/
│   ├── GeminiService.kt          # Retrofit API 인터페이스
│   ├── GeminiClient.kt           # API 클라이언트 설정
│   └── model/
│       └── AIAction.kt           # AI 조언 데이터 모델
├── repository/
│   └── AIRepository.kt           # AI 비즈니스 로직
├── ui/
│   ├── AIActionsFragment.kt      # AI 조언 화면
│   └── AIActionsAdapter.kt       # RecyclerView 어댑터
└── viewmodel/
    └── RiskViewModel.kt          # (수정) AI 기능 추가
```

### Layout 파일
```
app/src/main/res/layout/
├── fragment_ai_actions.xml       # AI 조언 메인 레이아웃
├── item_risk_header.xml          # 리스크 헤더 아이템
└── item_action.xml               # 조치 아이템
```

### Drawable 리소스
```
app/src/main/res/drawable/
├── bg_badge_red.xml             # 빨강 배지 (효과 높음)
├── bg_badge_yellow.xml          # 노랑 배지 (효과 보통)
├── bg_badge_green.xml           # 초록 배지 (효과 낮음)
├── bg_badge_purple.xml          # 보라 배지 (노력 많음)
├── bg_badge_blue.xml            # 파랑 배지 (노력 보통)
├── bg_badge_teal.xml            # 청록 배지 (노력 적음)
└── circle_red.xml               # 리스크 번호 원형 배경
```

## 🔧 사용 방법

### 1. API 키 설정

**GeminiClient.kt** 파일을 열고 API 키를 입력하세요:

```kotlin
const val API_KEY = "YOUR_GEMINI_API_KEY_HERE"
```

API 키 발급: https://makersuite.google.com/app/apikey

자세한 내용은 `GEMINI_API_SETUP.md` 참고

### 2. 앱 실행 흐름

1. **홈 화면** → "새 프로젝트 분석하기" 클릭
2. **프로젝트 입력** → 제목, 설명, 예산 입력
3. **리스크 입력** → 3가지 리스크에 대해 O/S/D 점수 입력
4. **AI 조언 화면** ← 여기서 Gemini API 자동 호출!
   - 프로젝트 정보와 리스크를 분석
   - 각 리스크별 3개씩 실행 조치 제안
   - Impact/Effort 배지로 우선순위 표시
5. **최종 보고서** → RPN 계산 결과 및 PDF 저장

### 3. AI 응답 예시

```json
[
  {
    "riskId": 1,
    "riskName": "시장 수요 부족",
    "actions": [
      {
        "title": "MVP 사전 테스트",
        "description": "타겟 고객 100명 대상 베타 테스트 진행",
        "impact": "high",
        "effort": "medium"
      },
      ...
    ]
  }
]
```

## 🎨 디자인 특징

### 색상 시스템
- **Impact (효과)**
  - 높음: 빨강 (#FEE2E2)
  - 보통: 노랑 (#FEF3C7)
  - 낮음: 초록 (#D1FAE5)

- **Effort (노력)**
  - 많음: 보라 (#E9D5FF)
  - 보통: 파랑 (#DBEAFE)
  - 적음: 청록 (#CCFBF1)

### 레이아웃
- 웹 UI와 동일한 디자인 언어 사용
- Material Design 3 컴포넌트
- 카드 기반 리스트 레이아웃
- 둥근 모서리 (12dp)
- 부드러운 그림자 효과

## ⚡ 성능 최적화

- **코루틴**: 비동기 API 호출로 UI 블로킹 방지
- **RecyclerView**: 대량 데이터 효율적 표시
- **DiffUtil**: 리스트 업데이트 최적화
- **타임아웃**: 30초 설정으로 무한 대기 방지

## 🔒 보안 고려사항

⚠️ **현재 구현**: API 키가 앱에 포함됨 (개발/테스트용)

**프로덕션 권장사항**:
1. 백엔드 서버 구축
2. 서버에서 Gemini API 호출
3. 앱은 자체 서버 API만 호출
4. API 키를 서버에서만 관리

또는 **BuildConfig 사용**:
```kotlin
// local.properties에 저장
GEMINI_API_KEY=your_key_here

// BuildConfig로 참조
const val API_KEY = BuildConfig.GEMINI_API_KEY
```

## 📊 API 사용량

### Gemini API 무료 티어
- 분당 60회 요청
- 월 1,500회 무료
- 일반 사용에 충분

### 비용 절감 팁
- 불필요한 재호출 방지
- 결과 캐싱 (ViewModel에 저장됨)
- 에러 시 재시도 로직 제한

## 🐛 문제 해결

### API 키 오류
```
error: Invalid API key
```
→ GeminiClient.kt에서 API 키 확인

### 네트워크 오류
```
error: Unable to resolve host
```
→ 인터넷 연결 확인
→ AndroidManifest.xml에 INTERNET 권한 있는지 확인

### JSON 파싱 오류
```
error: Failed to parse response
```
→ 자동으로 기본 조언 제공됨
→ 프롬프트 개선 필요

### 타임아웃
```
error: Timeout
```
→ GeminiClient.kt에서 timeout 값 증가
→ 네트워크 속도 확인

## 🚀 다음 단계 (선택사항)

### 기능 개선
- [ ] AI 응답 스트리밍 (실시간 표시)
- [ ] 조언 북마크/즐겨찾기
- [ ] 조언 실행 체크리스트
- [ ] 사용자 피드백 수집

### UI/UX 개선
- [ ] 스켈레톤 로딩 화면
- [ ] 애니메이션 효과
- [ ] 다크 모드 지원
- [ ] 조언 공유 기능

### 성능 개선
- [ ] 응답 캐싱
- [ ] 이미지 첨부 지원
- [ ] 오프라인 모드

## 📝 변경 사항 요약

### build.gradle.kts
- Retrofit, OkHttp 의존성 추가

### AndroidManifest.xml
- INTERNET 권한 추가

### themes.xml
- NoActionBar로 변경 (상단바 제거)
- 색상 테마 업데이트

### colors.xml
- 배지용 색상 추가

## 🎉 완료!

이제 앱에서 Gemini AI를 활용한 리스크 대응 조언 기능을 사용할 수 있습니다.

질문이나 문제가 있으면 GEMINI_API_SETUP.md를 참고하세요.

