

FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

COPY build.gradle settings.gradle gradlew /app/
COPY gradle /app/gradle


RUN ./gradlew dependencies --no-daemon


COPY src /app/src


RUN ./gradlew clean build -x test --no-daemon

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=builder /app/build/libs/traveljournalai-0.0.1-SNAPSHOT.jar app.jar

ARG SERVER_PORT=8080
EXPOSE ${SERVER_PORT}

# Set default environment variables
ENV SERVER_PORT=${SERVER_PORT}
ENV LOG_LEVEL=INFO

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${SERVER_PORT}/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]