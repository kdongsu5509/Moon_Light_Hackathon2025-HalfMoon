# 🌙 반월

해당 레포지토리는 팀 `반월`의 레포지토리입니다.

<br>

## 🖥 1. 프로그램 소개

한국어를 배우는 학습자, 특히 **다문화 가정 학생**을 위해 만들어진 웹 서비스입니다.

AI 기반 학습 자료 생성, 발음 교정, 대화 연습 기능을 제공하여 학습자가 쉽고 재미있게 한국어를 익히고, 자신감을 가지고 또래와 소통할 수 있도록 돕습니다.

<br>

## 💡 2. 개발 동기

한국에 거주하는 다문화 가정의 학생들은 학교에서 **언어 장벽**으로 어려움을 겪는 경우가 많습니다.  
특히 초등학생은 또래와 의사소통이나 수업 참여에 제약이 생기곤 합니다.  

저희 팀은 이러한 학생들이 **쉽고 재미있게 한국어를 배우고, 자신감을 가지고 대화할 수 있도록** 본 서비스를 기획했습니다.  

AI를 활용한 발음 교정, 대화 연습, 맞춤형 학습 자료 제공을 통해 교실 안팎에서 **자연스럽게 한국어를 익히는 경험**을 목표로 합니다.

<br>
  
## 👥 3. 팀 구성원

| 이고은 | 임정민 | 고동수 | 이수민 |
|:----:|:----:|:----:|:----:|
|[<img src="https://github.com/KOEUN1122.png" width="100px">](https://github.com/KOEUN1122) | [<img src="https://github.com/ljungmin.png" width="100px">](https://github.com/ljungmin) |[<img src="https://github.com/kdongsu5509.png" width="100px">](https://github.com/kdongsu5509)  | [<img src="https://github.com/lssm-c.png" width="100px">](https://github.com/lssm-c) |
| 프론트엔드 | 프론트엔드 | 백엔드 | 백엔드 |

<br>

## 🛠 4. 기술 스택 및 개발 환경

 상세 내용은 [백엔드 상세 리드미 바로가기](./Backend/README.md) 와 [프론트엔드 상세 리드미 바로가기](./Frontend/README.md) 의 내용을 참고해주세요.

### ⚙️ 백엔드

- **개발 언어**: Java 21
- **IDE**: IntelliJ IDEA, Cursor
- **빌드 도구**: Gradle 8.5
- **프레임워크**: Spring Boot 3.5.5
- **데이터베이스**: H2 Database (개발용 인메모리)

### 🎨 프론트엔드

- **개발 도구**: Visual Studio Code
- **UI 디자인**: Figma
- **프로토타이핑**: Figma 활용한 화면 설계

### 📚 공통

- Git & GitHub  
- Notion (프로젝트 관리)  
- Swagger & Notion (API 문서화)  

### 🚀 배포 및 운영 환경

- **AI 통합**: Spring AI Framework, Chat Memory, Structured Output  
- **보안/인증**: Spring Security, JWT 기반 인증  
- **DB**: H2 DB, Spring Data JPA, QueryDSL  
- **배포 환경**: AWS EC2 · Docker · GitHub Actions · Amazon ECR

### 🤝 협업 방식

- 기능별 분업 (프론트/백)  
- 페어 프로그래밍 (AI 통합)  
- Pull Request 기반 코드 리뷰  

### 📂 프로젝트 구조

```
Moon_Light_Hackathon2025-HalfMoon/
├── .github/workflows/   # CI/CD 및 워크플로우 설정
├── Backend/             # 백엔드 소스코드
├── Frontend/            # 프론트엔드 소스코드
├── .gitignore           # Git 무시 규칙
├── README.md            # 프로젝트 전체 문서
└── package-lock.json    # 프론트엔드 의존성 잠금 파일
```

<br>

## 🚀 5. 기능 명세서

### 🌱 (1) 한국어 학습 자료 생성

AI가 학습자의 수준과 주제에 맞춰 문장을 자동 생성합니다.  

- 난이도: 초급 · 중급 · 고급  
- 주제: 자기소개 · 가족 · 학교 · 음식 · 날씨  
- 각 문장에 의미 설명 + 새로운 단어 표시  
- 생성 결과는 자동으로 DB에 저장  

> 🧠 사용 AI: **OpenAI GPT-4o-mini (Structured Output)**

---

### 💬 (2) 주제별 AI 대화 연습

선택한 주제로 AI와 실시간 대화를 나눌 수 있습니다.  

- 맞춤형 대화 시작  
- 대화 맥락 유지 (Chat Memory)  
- 음성 입력(STT) 지원  
- 대화 기록 저장 및 재조회 가능  

> 🧠 사용 AI: **GPT-4o-mini (대화)** · **Whisper-1 (STT)** · **Spring AI Chat Memory**

---

### 🔊 (3) 한국어 발음 학습

AI가 발음을 듣고 평가해줍니다.  

- 문장을 음성으로 변환(TTS)  
- 사용자 발음 녹음 후 평가 (10점 만점)  
- 부족한 부분 피드백 제공  

> 🧠 사용 AI: **OpenAI TTS-1** · **Google Gemini-2.5-Flash**

---

### 📊 (4) 학습 진도 관리

학습자가 얼마나 공부했는지 추적합니다.  

- 난이도/주제별 완료율 표시  
- 월별 학습 목표 설정 & 추적  
- 학습 포인트 시스템  
- 개인 통계 확인 가능  

---

### 🔐 (5) 사용자 인증 및 관리

안전한 학습 환경을 위한 회원 시스템을 제공합니다.

- JWT 기반 회원가입 & 로그인  
- 개인 학습 데이터 보안  
- 사용자별 학습 이력 저장  

---

### 📝 (6) API
>
> 전체 API 명세는 [반월 서버 API 문서](http://3.36.107.16/swagger-ui/index.html) 에서 확인 가능합니다.  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
**주요 카테고리**

1. 📄 게시글 관리: 학습 자료 CRUD  
2. 💭 댓글 기능: 학습 피드백  
3. 👤 사용자 정보: 프로필 & 인증 관리  
4. 🈴 한국어 학습: 자료 생성 & 조회  
5. 🎯 목표 관리: 학습 목표 설정 & 추적  
6. 📚 학습 기록: 진도 & 성취도 관리  

---
