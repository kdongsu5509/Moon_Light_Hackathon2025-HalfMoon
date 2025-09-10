# 사용자 컴퓨터에서 실행하기

- 해당 문서는 `반월`의 서버 코드를 사용자 컴퓨터에서 실행하는 방법에 대해 설명하고 있습니다.

---

### 사전 준비

- 해당 프로젝트는 `Java` 로 작성되었으며, `Gradle` 로 외부 도구들을 관리하고 있습니다.
- 이러한 이유로 인해, 사용자 컴퓨터에서 실행하기 위해서는 일부 사전에 설치하여 준비해야 하는 것들이 존재합니다.
  - Java 21
  - Gradle 8.5 이상

# Windows

---

### 외부 라이브러리 설치

- `Gradle` 을 통해 외부 라이브러리를 프로젝트 폴더 내부에 준비해야합니다.

**Windows에서 프로젝트 Build**

```bash
.\gradlew.bat build
```

### **프로젝트 실행**

```bash
.\gradlew.bat bootRun
```

**또는 JAR 파일 생성 후 실행**

```bash
.\gradlew.bat bootJar
java -jar build\libs\[생성된_JAR_파일명].jar
```

**참고**

- 해당 프로젝트는 인메모리 데이터베이스을 사용하고 있습니다. 때문에 최소 2Gib 이상의 메모리 여유가 필요합니다.

---

# Mac

---

### 외부 라이브러리 설치

- `Gradle`을 통해 외부 라이브러리를 프로젝트 폴더 내부에 준비해야합니다.

**Mac에서 프로젝트 Build**

```bash
./gradlew build
```

### **프로젝트 실행**

```bash
./gradlew bootRun
```

**또는 JAR 파일 생성 후 실행**

```bash
./gradlew bootJar
java -jar build/libs/[생성된_JAR_파일명].jar
```

**참고**

- 해당 프로젝트는 인메모리 데이터베이스을 사용하고 있습니다. 때문에 최소 2Gib 이상의 메모리 여유가 필요합니다.

---
