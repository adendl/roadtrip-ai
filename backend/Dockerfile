

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

ARG SERVER_PORT=9090
EXPOSE ${SERVER_PORT}


ENTRYPOINT ["java", "-jar", "app.jar"]