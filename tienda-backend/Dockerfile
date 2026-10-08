# ===== Etapa 1: build =====
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copiamos primero el pom.xml para aprovechar la cache de capas de Docker
COPY pom.xml .
RUN mvn -B dependency:go-offline

# Copiamos el resto del código y compilamos
COPY src ./src
RUN mvn -B clean package -DskipTests

# ===== Etapa 2: runtime =====
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

# Carpeta donde se guardan las imágenes subidas de productos.
# Se copian las imágenes de demo que ya vienen en el repo; nota que en
# Render/Railway (free tier) el filesystem es efímero, así que las imágenes
# que el ADMIN suba después de desplegar se perderán al reiniciar el
# contenedor a menos que agregues un volumen persistente.
RUN mkdir -p /app/uploads/productos
COPY uploads/productos ./uploads/productos

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
