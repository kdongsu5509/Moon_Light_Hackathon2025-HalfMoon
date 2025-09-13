# Frontend

* 이 디렉토리는 `반월`의 **클라이언트 코드**입니다.
* 이 문서와 하위 문서에서는 **프론트엔드 실행 방법, 기술 스택, 배포 환경, 협업 규칙** 등에 대해 설명합니다.

---

# 사용 기술

### 코어 기술

* **프로그래밍 언어**: TypeScript
* **프레임워크/라이브러리**: React 18, Vite 6

### UI & UX

* 스타일링: **TailwindCSS**, **shadcn/ui**
* 애니메이션: **Framer Motion**
* 아이콘: **Lucide-react**

### 상태 관리 및 API 통신

* 상태 관리: React Hooks
* API 통신: **Axios (v1.12.1)**
* 라우팅: **React Router**

### 개발 도구

* 패키지 관리: npm
* 빌드: Vite

---

# 시작하기

### A. 설치하기

* **Git을 통한 다운로드**

```bash
git clone https://github.com/kdongsu5509/Moon_Light_Hackathon2025-HalfMoon.git
cd Moon_Light_Hackathon2025-HalfMoon/Frontend
```

* **Git이 없는 경우 → ZIP 다운로드**

  * [메인페이지](https://github.com/kdongsu5509/Moon_Light_Hackathon2025-HalfMoon) 접속
  * 초록색 `Code` 버튼 클릭 후 `Download ZIP`
  * 압축 해제 후 `Frontend` 폴더로 이동

---

### B. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 아래 내용을 작성하세요.

```env
VITE_API_URL=http://localhost:8080/api
```

> 실제 서버 주소를 입력해야 정상 동작합니다.
> 개발 단계에서는 로컬 백엔드 서버(`8080`)와 연결하세요.

---

### C. 실행하기

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:5173](http://localhost:5173) 접속하면 됩니다.

---

# 디렉토리 구조

```plaintext
src/
 ┣ api/            
 ┣ components/   
 ┣ guidelines/          
 ┣ services/          
 ┣ styles/         
 ┣ App.tsx        
 ┗ main.tsx        

---

# 협업 규칙

### 브랜치 전략

* `main`: 배포용 브랜치 (직접 push 금지)
* `develop`: 통합 개발 브랜치
* `feature/*`: 기능 단위 브랜치 (예: `feature/login`, `feature/community`)

### 커밋 컨벤션

```

feat:    새로운 기능 추가
fix:     버그 수정
docs:    문서 수정 (README 등)
style:   코드 스타일 변경 (기능 변화 없음)
refactor: 코드 리팩토링
chore:   환경설정, 빌드 설정 변경

```

예시

```

feat: 로그인 페이지 UI 구현
fix: axios baseURL 오류 수정

```

### Pull Request 규칙

* 최소 1명 이상 코드 리뷰 후 머지
* PR 템플릿에 제목, 설명, 관련 이슈 번호 기재

---

# 주요 기능

* 로그인 / 회원가입
* 한국어 학습 모듈 (상황별 대화, 발음 연습)
* 음성 인식 기반 발음 평가
* 포인트 시스템 (달 채우기 UI)
* 커뮤니티 게시판
