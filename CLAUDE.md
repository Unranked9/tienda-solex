# Solex — Tienda de Ropa Virtual (proyecto Cibertec, DAW I)

Monorepo con dos aplicaciones independientes:

- `tienda-backend/` — API REST. Spring Boot 3.3.4, Java 21, Maven, MySQL 8, Spring Security + JWT (jjwt 0.12.6), Lombok, MapStruct.
- `tienda-frontend/` — SPA. Angular 21 (standalone components, signals, control flow `@if/@for`), TypeScript 5.9, Vitest.

## Cómo levantar en local

1. Base de datos: ejecutar `tienda-backend/tienda_virtual3.sql` en MySQL (crea `tienda_virtual3` desde cero, con DROP previo).
   Hibernate está en `ddl-auto=validate`: **cualquier cambio de entidad requiere actualizar también el script SQL**.
2. Backend (puerto 8080): `cd tienda-backend && mvn spring-boot:run`
   Credenciales de BD por variables de entorno `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` (por defecto root/root).
3. Frontend (puerto 4200): `cd tienda-frontend && npm install && npm start`
   `proxy.conf.json` redirige `/api` y `/uploads` a `localhost:8080`; `environment.apiUrl` es `''` en desarrollo.

Usuarios de prueba: `admin@tienda.com / Admin123`, `empleado@tienda.com / Empleado123`, `cliente@tienda.com / Cliente123`.

## Arquitectura backend (`com.tienda`)

- `business/api/controller` → `business/domain/service` (interfaz + `impl/`) → `business/data/repository` → `business/data/entity`
- DTOs como `record` en `business/api/dto/<modulo>/` (`XxxRequestDto`, `XxxResponseDto`), mapeo con MapStruct en `domain/mapper`.
- Errores: lanzar `RecursoNoEncontradoException` (404), `RecursoDuplicadoException` (409) o `SolicitudInvalidaException` (400); `GlobalExceptionHandler` los convierte en `ApiErrorResponse`. No devolver mensajes internos al cliente.
- Seguridad: reglas por ruta/método en `security/config/SecurityConfig.java`. Roles: ADMIN, EMPLEADO, CLIENTE (authority `ROLE_X`). Todo endpoint nuevo debe registrarse ahí.
- Ventas: el cliente se obtiene del JWT (`authentication.getName()`), nunca del request; el precio se toma de la BD.
- Productos: eliminación lógica (`activo=false`).

## Arquitectura frontend (`src/app`)

- `core/services` (HTTP + estado con signals), `core/guards`, `core/interceptors`
- `features/tienda/*` (público) y `features/dashboard/*` (ADMIN/EMPLEADO), `layouts/`, `shared/`, `models/`
- Rutas lazy en `app.routes.ts`. Notificaciones con `NotificationService` (toasts), no `alert()`.
- Token JWT en `localStorage` (`authtoken`); carrito en `localStorage` (`carrito`).

## Convenciones

- Código, nombres y mensajes en **español** (siguiendo el estilo existente: `listar`, `crear`, `obtenerEntidad`...).
- Cambios pequeños y enfocados; un commit por mejora con mensaje descriptivo en español.
- Antes de dar algo por terminado: `mvn -q compile` en el backend y `npx ng build` en el frontend.
- No subir secretos ni modificar `environment.prod.ts` sin indicarlo.
