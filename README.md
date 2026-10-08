# 👕 Solex — Tienda de Ropa Virtual

Sistema web full-stack para la gestión y venta en línea de ropa, desarrollado como
proyecto del curso **Desarrollo de Aplicaciones Web I**.

\---

## 🎓 Datos académicos

|||
|-|-|
|**Tema**|Desarrollo de un sistema web - Tienda de Ropa Solex|
|**Curso**|Desarrollo de Aplicaciones Web I|
|**Profesor**|Mauro David García Salirrosas|



---

## 🛠️ Cómo levantar el proyecto en local

### Requisitos

| Herramienta | Versión |
|---|---|
| JDK | 21 (ej. Eclipse Temurin 21) |
| Maven | no es necesario instalarlo: el proyecto incluye Maven Wrapper (`mvnw.cmd` / `mvnw`) |
| Node.js | 20.19+, 22.12+ o 24+ (Angular 21) |
| MySQL Server | 8.0 o superior (probado con 8.4 / 26.x) |

### 1. Base de datos

Ejecutar `tienda-backend/tienda_virtual3.sql` en MySQL Workbench (ejecutar el script completo).

> ⚠️ El script hace `DROP DATABASE IF EXISTS tienda_virtual3`: **borra los datos** si ya existía la base. Úsalo solo para instalar o reiniciar.

### 2. Backend (Spring Boot) — puerto 8080

**Opción A — línea de comandos (Maven Wrapper):**

```bash
cd tienda-backend
.\mvnw.cmd spring-boot:run
```

**Opción B — IntelliJ:**

1. IntelliJ → **File → Open** → `tienda-backend/pom.xml` → *Open as Project*.
2. **Project Structure → SDK = 21**.
3. **Settings → Build, Execution, Deployment → Compiler → Annotation Processors → Enable annotation processing** (necesario para Lombok y MapStruct).
4. Si tu usuario `root` de MySQL **no** tiene la contraseña `root`:
   **Run → Edit Configurations → TiendaBackendApplication → Environment variables** →
   `DB_PASSWORD=tu_contraseña`
   *(Si no ves el campo: Modify options → Environment variables.)*
5. Ejecutar `TiendaBackendApplication`. Verificar en http://localhost:8080/api/v1/productos

> 🔒 **Nunca escribas tu contraseña en `application.properties`.** La configuración de ejecución de IntelliJ se guarda en `.idea/`, que está en `.gitignore`, así que no se sube al repositorio.

Variables de entorno disponibles (todas opcionales en local):

| Variable | Valor por defecto | Para qué |
|---|---|---|
| `DB_URL` | `jdbc:mysql://localhost:3306/tienda_virtual3?...` | Cambiar host, puerto o nombre de la BD |
| `DB_USERNAME` | `root` | Usuario de MySQL |
| `DB_PASSWORD` | `root` | Contraseña de MySQL |
| `PORT` | `8080` | Puerto del backend (si lo cambias, actualiza `proxy.conf.json`) |
| `JWT_SECRET` | clave de desarrollo | Obligatorio cambiarla en producción |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:4200` | URL del frontend en producción |

### 3. Frontend (Angular) — puerto 4200

```bash
cd tienda-frontend
npm install
npm start
```

Abrir http://localhost:4200. El archivo `proxy.conf.json` redirige `/api` y `/uploads` al backend en el puerto 8080.

### Usuarios de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Admin | admin@tienda.com | Admin123 |
| Empleado | empleado@tienda.com | Empleado123 |
| Cliente | cliente@tienda.com | Cliente123 |

### Problemas frecuentes

| Error | Solución |
|---|---|
| `Public Key Retrieval is not allowed` | Ya está resuelto en `application.properties` (`allowPublicKeyRetrieval=true`). Si usas `DB_URL` propia, agrégale ese parámetro. |
| `Access denied for user 'root'@'localhost'` | Configura `DB_PASSWORD` (paso 2, variables de entorno). |
| `Communications link failure` | El servicio de MySQL está apagado: `services.msc` → MySQL → Iniciar. |
| `Schema-validation: missing table` | No se ejecutó `tienda_virtual3.sql`, o se ejecutó en otra BD. |
| `Port 8080 was already in use` | Otro backend está corriendo; detenlo. |
| `cannot find symbol` / `builder()` en rojo | Falta activar *annotation processing* (Opción B, paso 3). |
| `npm.ps1 cannot be loaded` (Windows) | Usa la terminal *Command Prompt* en VS Code, o ejecuta una vez `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`. |
