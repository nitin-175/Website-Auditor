# ---------- Build Stage ----------
FROM eclipse-temurin:25-jdk AS builder

WORKDIR /app

COPY pom.xml .

COPY .mvn .mvn
COPY mvnw .
COPY mvnw.cmd .

RUN chmod +x mvnw

RUN ./mvnw dependency:go-offline -DskipTests

COPY src src

RUN ./mvnw clean package -DskipTests


# ---------- Runtime Stage ----------
FROM eclipse-temurin:25-jre

WORKDIR /app

RUN useradd --system --create-home --shell /usr/sbin/nologin auditor

COPY --from=builder /app/target/*.jar app.jar

RUN chown auditor:auditor app.jar

USER auditor

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]