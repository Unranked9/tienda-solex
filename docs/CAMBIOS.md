# Registro de mejoras — Solex

Proyecto: **Tienda de Ropa Solex** — Desarrollo de Aplicaciones Web I (Cibertec)
Stack: Spring Boot 3.3 · Java 21 · MySQL · Angular 21

---

## Resumen

| # | Mejora | Tipo | Capa | Estado |
|---|---|---|---|---|
| — | Conexión compatible con MySQL 8.4+ y guía de instalación | Corrección | Backend · Docs | ✅ |
| 0 | Maven Wrapper | Infraestructura | Backend | ✅ |
| 1 | Imágenes demo de productos + imagen de respaldo | Corrección | Backend · BD · Frontend | ✅ |
| 2 | Mensajes claros al eliminar registros con dependencias | Corrección | Backend · Frontend | ✅ |
| 7 | "Mis compras" para el cliente | Nueva función | Frontend | ✅ |
| 8 | Anular venta con devolución de stock | Nueva función | Backend · Frontend | ✅ |
| 9 | Dashboard con indicadores | Nueva función | Frontend | ✅ |
| 10 | Exportar ventas a CSV y mejoras del catálogo | Nueva función | Frontend | ✅ |
| — | Datos demo para la presentación | Datos | BD | ✅ |

---

## Conexión compatible con MySQL 8.4+

**Problema:** con MySQL 8.4 o superior el backend no arrancaba (`Public Key Retrieval is not allowed`).
**Solución:** se agregó `allowPublicKeyRetrieval=true` a la URL de conexión en `application.properties`. Funciona igual con MySQL 8.0.
**Además:** README con guía de instalación local, variables de entorno y errores frecuentes. La contraseña de la BD se configura con la variable `DB_PASSWORD`, nunca en el código.

## 0. Maven Wrapper

**Problema:** compilar el backend requería tener Maven instalado.
**Solución:** se agregó Maven Wrapper (`mvnw`, `mvnw.cmd`, `.mvn/wrapper/`) y se corrigió `.gitignore` para versionarlo.
**Uso:** `mvnw.cmd -q compile` (Windows) o `./mvnw -q compile` (Bash).

## 1. Imágenes de productos

**Problema:** el script SQL apuntaba a imágenes `.jpg` inexistentes; los productos se veían sin imagen.
**Solución:**
- Imágenes demo renombradas (`polo-basico-algodon.png`, `zapatillas-urbanas.png`, `gorra-clasica.png`, `mochila-urbana.png`, `billetera-cuero.png`) y rutas actualizadas en `tienda_virtual3.sql`.
- `.gitignore` con excepciones para versionar estas 5 imágenes (las que suba el admin siguen ignoradas).
- Frontend: imagen de respaldo cuando un producto no tiene imagen o falla la carga.

## 2. Mensajes claros al eliminar

**Problema:** eliminar una categoría con productos o un cliente con ventas respondía error 500 "error interno".
**Solución:**
- Validación previa en `CategoriaServiceImpl` y `ClienteServiceImpl` → **409** con mensaje en español (ej. *"No se puede eliminar la categoría 'Ropa' porque tiene productos asociados"*).
- `GlobalExceptionHandler` maneja `DataIntegrityViolationException` como respaldo (409, sin detalles internos).
- Listas de categorías, clientes y productos muestran el error como notificación (toast).
- Limpieza: eliminado `System.out.println` de `VentaController`; `application.properties` sin `hibernate.dialect`, con `open-in-view=false` y `show-sql=false`.

## 7. Mis compras

**Objetivo:** que el cliente consulte su historial de pedidos.
**Solución:**
- Página `/mis-compras` que consume `GET /api/v1/ventas/mis-compras` (endpoint que ya existía pero no se usaba).
- Lista con número, fecha, método de pago, estado y total, con detalle de productos desplegable y estado vacío con enlace al catálogo.
- Enlace "Mis compras" en el header (desktop y móvil), visible solo para el rol CLIENTE.
- Tras una compra exitosa, redirige a Mis compras.

## 8. Anular venta

**Objetivo:** dar uso al estado `ANULADA`, que existía en el modelo pero no se usaba.
**Solución:**
- Backend: `PATCH /api/v1/ventas/{id}/anular` (ADMIN y EMPLEADO). En una transacción devuelve al stock las cantidades de cada detalle y cambia el estado a `ANULADA`; si ya estaba anulada responde 400 con mensaje claro. Regla registrada en `SecurityConfig`.
- Frontend: botón "Anular" en la lista de ventas, con confirmación y notificación del resultado.

## 9. Dashboard con indicadores

**Solución:**
- Tarjetas: ingresos totales (solo ventas PAGADAS), ticket promedio, ventas del mes y productos con stock bajo (≤ 5).
- Gráfico de barras en CSS (sin librerías) de ventas por método de pago.
- Tabla "Stock bajo" con enlace para editar el producto.
- Montos en soles con 2 decimales.

## 10. Exportar CSV y catálogo

**Solución:**
- Ventas: botón "Exportar CSV" (número, fecha, cliente, método, estado, total) con BOM UTF-8 para que Excel muestre bien las tildes.
- Catálogo: ordenar por nombre y precio (ascendente/descendente); etiquetas "¡Últimas unidades!" (stock ≤ 5) y "Sin stock"; precios con 2 decimales.

## Datos demo

Script `tienda-backend/seed_demo.sql` con 4 clientes adicionales (contraseña `Cliente123`) y 12 ventas de los últimos 3 meses con distintos métodos de pago, más 2 productos con stock bajo (Gorra clásica y Mochila urbana 20L), para que el dashboard y los reportes se vean con datos realistas en la presentación.
**Uso:** es opcional y se ejecuta **después** de `tienda_virtual3.sql`, que queda solo con los datos base. Los stocks se ajustan con `UPDATE` para reflejar las ventas demo.

---

## Guion sugerido para la demo (5 min)

1. **Catálogo** (sin sesión): imágenes, ordenar por precio, etiquetas de stock.
2. **Cliente** (`cliente@tienda.com / Cliente123`): agregar al carrito → comprar con Yape → **Mis compras**.
3. **Admin** (`admin@tienda.com / Admin123`): Panel → **Dashboard** (indicadores, gráfico por método de pago, stock bajo).
4. **Ventas**: **Anular** una venta → mostrar que el stock volvió → **Exportar CSV** y abrirlo en Excel.
5. **Categorías**: intentar eliminar "Ropa" → mensaje claro en vez de error.

> Inicia sesión como cliente **antes** de comprar (la compra sin sesión aún no redirige al login).

## Pendiente (siguientes iteraciones)

| # | Mejora |
|---|---|
| 3 | Cierre de sesión automático al vencer el token y flujo de compra sin login |
| 4 | Menú y rutas del panel según rol (EMPLEADO) |
| 5 | Listar y reactivar productos desactivados |
| 6 | Documentación de la API con Swagger |
| 11 | Pruebas unitarias del flujo de venta |
