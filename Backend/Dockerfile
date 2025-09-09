FROM openjdk:21-jdk-slim AS builder
WORKDIR /app
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY src src
RUN chmod +x ./gradlew
# --no-daemon 옵션을 추가하면 GitHub Actions 환경에서 빌드 속도가 더 안정적일 수 있습니다.
RUN ./gradlew build --no-daemon -x test

FROM openjdk:21-slim
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]