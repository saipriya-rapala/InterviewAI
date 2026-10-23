# Multi-stage Dockerfile for Spring Boot Backend (Java 21)
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy Maven files first for dependency caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build production jar
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal JRE Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create non-root user and prepare directories with write permissions
RUN addgroup -S appgroup && adduser -S appuser -G appgroup -h /home/appuser -s /bin/sh -D && \
    mkdir -p /app/data /app/private-resumes /home/appuser/.interviewai/resumes && \
    chown -R appuser:appgroup /app /home/appuser

COPY --from=build --chown=appuser:appgroup /app/target/*.jar app.jar

USER appuser

EXPOSE 8081

ENV PORT=8081
ENV SERVER_PORT=8081

ENTRYPOINT ["java", "-jar", "app.jar"]
