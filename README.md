# 반월

- 해당 레포지토리는 팀 `반월`의 레포지토리입니다.

### 개발한 서비스에 대한 간략한 설명이 추가되어야 합니다

- TODO
  
### **팀 구성원**

| 이고은 | 임정민 | 고동수 | 이수민 |
|:----:|:----:|:----:|:----:|
|[<img src="https://github.com/KOEUN1122.png" width="100px">](https://github.com/KOEUN1122) | [<img src="https://github.com/ljungmin.png" width="100px">](https://github.com/ljungmin) |[<img src="https://github.com/kdongsu5509.png" width="100px">](https://github.com/kdongsu5509)  | [<img src="https://github.com/lssm-c.png" width="100px">](https://github.com/lssm-c) |
| 프론트엔드 | 프론트엔드 | 백엔드 | 백엔드 |

### **기술 스택**

- 각 분야별 상세한 설명은 `/Backend` 와 `/Frontend` 의 `README.md` 를 참고해주세요.

#### 사용 기술

##### 백엔드

###### **AI 모델 통합**

- **Spring AI Framework** 활용으로 다양한 AI 모델 통합
- **Chat Memory**: In-Memory Repository를 통한 대화 맥락 유지
- **Structured Output**: 생성된 학습 자료의 구조화된 데이터베이스 저장
- **REST API**: Google Gemini를 통한 발음 평가 (Spring AI 미지원 기능)

###### **보안 및 인증**

- Spring Security를 통한 보안 구현
- JWT 토큰 기반 인증 시스템
- API 엔드포인트별 인증 요구사항 설정

###### **데이터베이스 설계**

- H2 인메모리 데이터베이스 사용
- 학습 자료, 대화 기록, 사용자 진도 등 체계적 데이터 관리
- Spring Data JPA와 QueryDSL를 통한 ORM 구현

###### **배포 환경**

- **AWS EC2**: 서버 호스팅
- **Docker**: 컨테이너화 배포
- **GitHub Actions**: CI/CD 파이프라인
- **Amazon ECR**: 도커 이미지 저장소

---

# 1. 개발 동기

- TODO

---

# 2. 개발 환경 및 방법

### **2-A. 개발 환경**

### **백엔드 개발 환경**

- **개발 언어**: Java 21
- **IDE**: IntelliJ IDEA, Cursor
- **빌드 도구**: Gradle 8.5
- **프레임워크**: Spring Boot 3.5.5
- **데이터베이스**: H2 Database (개발용 인메모리)

### **프론트엔드 개발 환경**

- **개발 도구**: Visual Studio Code
- **UI 디자인**: Figma
- **프로토타이핑**: Figma 활용한 화면 설계

### **공통 개발 도구**

- **버전 관리**: Git & GitHub
- **프로젝트 관리**: Notion
- **API 문서화**: Springdoc-openapi (Swagger) 및 Notion

### **2-B.개발 방법**

### **협업 방식**

- **기능별 분업**: 백엔드/프론트엔드 역할 분담
- **페어 프로그래밍**: 복잡한 AI 통합 부분 공동 개발
- **코드 리뷰**: Pull Request 기반 코드 품질 관리

### **2-C.  프로젝트 구조**

```
Moon_Light_Hackathon2025-HalfMoon/
├── Frontend/          # 프론트엔드 소스코드
├── Backend/           # 백엔드 소스코드
├── AI/               # AI 관련 코드 및 설정
├── docs/             # 문서화 파일들
└── [README.md](http://README.md)         # 프로젝트 전체 문서
```

---

# 3. 기능 명세서

## **핵심 기능**

### **3-A. 한국어 학습 자료 생성**

**기능 설명**: AI를 활용하여 사용자의 학습 수준과 주제에 맞는 한국어 학습 문장을 자동 생성

**세부 기능**:

- 난이도별 학습 자료 생성 (BEGINNER, INTERMEDIATE, ADVANCED)
- 주제별 학습 자료 제공 (INTRODUCTION, FAMILY, SCHOOL, FOOD, WEATHER)
- 각 문장에 대한 의미 설명 및 신규 단어 카운트 제공
- Structured Output을 통한 데이터베이스 자동 저장

**API 엔드포인트**: 학습 자료 생성 관련 API

**사용 AI**: OpenAI GPT-4o-mini with Structured Output

### **3-B. 주제별 AI 대화 연습**

**기능 설명**: 선택한 주제에 대해 AI와 실시간 대화를 통한 한국어 회화 연습

**세부 기능**:

- 주제별 맞춤형 대화 시작
- 대화 맥락 유지 (Chat Memory 활용)
- 음성 입력 지원 (STT)
- 대화 기록 저장 및 조회

**API 엔드포인트**:

- `/api/chat/start` - 대화 시작
- 대화 진행 관련 API들

**사용 AI**:

- OpenAI GPT-4o-mini (대화 생성)
- OpenAI Whisper-1 (음성을 텍스트로 변환)
- Spring AI Chat Memory (대화 맥락 유지)

### **3-C. 한국어 발음 학습**

**기능 설명**: 학습 문장의 정확한 한국어 발음을 듣고, 사용자의 발음을 평가하는 기능

**세부 기능**:

- 텍스트를 한국어 음성으로 변환 (TTS)
- 사용자 발음 녹음 및 정확도 평가
- 10점 만점 발음 점수 제공
- 발음 개선 피드백

**API 엔드포인트**: 발음 관련 API

**사용 AI**:

- OpenAI TTS-1 (텍스트를 음성으로 변환)
- Google Gemini-2.5-Flash (발음 정확도 평가)

### **3-D. 학습 진도 관리**

**기능 설명**: 사용자의 학습 진행 상황을 추적하고 목표 달성도를 관리

**세부 기능**:

- 난이도별 주제 완료율 조회
- 월별 학습 목표 설정 및 추적
- 학습 포인트 시스템
- 개인 학습 통계 제공

**API 엔드포인트**:

- `/api/subject/completion-rate/{studyLevel}` - 난이도별 이수율 조회
- `/api/my/goal` - 월별 목표 조회

### **3-E. 사용자 인증 및 관리**

**기능 설명**: 사용자 회원가입, 로그인 및 개인 정보 관리

**세부 기능**:

- JWT 기반 사용자 인증
- 회원가입 및 로그인
- 개인 학습 데이터 보안
- 사용자별 학습 이력 관리

### **3-F. API**
>
> - **API 문서**: [반월 서버 API 문서](http://3.36.107.16/swagger-ui/index.html)
>
**주요 카테고리**

1. **게시글 관리**: 학습 자료 CRUD
2. **댓글 기능**: 학습 피드백 시스템
3. **사용자 정보**: 프로필 및 인증 관리
4. **한국어 학습**: 학습 자료 생성 및 조회
5. **목표 관리**: 학습 목표 설정 및 추적
6. **학습 기록**: 진도 및 성취도 관리
