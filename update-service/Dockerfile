FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

RUN apk add --no-cache maven

COPY ./pom.xml /app/pom.xml

COPY ./src/ /app/src/

RUN mvn clean install -DskipTests


FROM eclipse-temurin:21-jre-alpine AS runtime

WORKDIR /update-service

COPY --from=builder ./app/target/update-service-0.0.1-SNAPSHOT.jar update-service.jar

CMD [ "java", "-jar", "./update-service.jar" ]