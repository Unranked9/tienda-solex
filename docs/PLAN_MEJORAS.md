# Plan de mejoras — Solex

Cada mejora es un prompt para pegar en Claude Code (abierto en `C:\dev\tienda-solex`).
Hazlas **en orden, una por sesión**: pegar prompt → revisar plan → aprobar → probar → commit → `/clear`.

Estado: marca con `[x]` las que ya terminaste.

---

## FASE 0 — Preparar el terreno

### [x] 0. Maven Wrapper (para que Claude Code pueda compilar el backend)

```
Lee CLAUDE.md. El backend no tiene Maven Wrapper y Maven no está en mi PATH;
solo tengo el Maven que trae IntelliJ en:
"C:\Program Files\JetBrains\IntelliJ IDEA 2025.3.2\plugins\maven\lib\maven3\bin\mvn.cmd"

1. Usa ese mvn.cmd para generar el Maven Wrapper dentro de tienda-backend
   (mvn -N wrapper:wrapper).
2. Revisa tienda-backend/.gitignore: hoy ignora ".mvn/", lo que impediría subir
   .mvn/wrapper/maven-wrapper.properties. Corrígelo para que el wrapper sí se versione.
3. Verifica que "mvnw.cmd -q compile" funcione desde tienda-backend.
4. Actualiza CLAUDE.md y README.md para que el comando de compilación sea mvnw.cmd.
Muéstrame el plan antes de editar.
```

**Probar:** en CMD, `cd tienda-backend` y `mvnw.cmd -q compile` termina sin errores.
**Commit:** `chore: agregar Maven Wrapper`

---

## FASE 1 — Corregir errores

### [x] 1. Imágenes de productos rotas

```
Problema: tienda_virtual3.sql inserta productos con imagen_url como
/uploads/productos/polo-basico-algodon.jpg, pero esos archivos no existen.
En tienda-backend/uploads/productos/ hay 5 PNG con nombres UUID.

1. Mira cada PNG y dime a qué producto corresponde (polo, zapatillas, gorra,
   mochila, billetera).
2. Renómbralos con nombres descriptivos (ej. polo-basico-algodon.png) y
   actualiza las rutas en tienda_virtual3.sql para que coincidan.
3. tienda-backend/.gitignore ignora uploads/productos/*: agrega excepciones
   para que estas 5 imágenes demo SÍ se suban al repo (las que suba el admin
   después deben seguir ignoradas).
4. En el frontend, donde se muestran imágenes de productos (catálogo, detalle,
   carrito, home, lista del dashboard), agrega una imagen de respaldo
   (placeholder) cuando imagenUrl es null o la imagen falla al cargar (error).
Muéstrame el plan antes de editar.
```

**Probar:** vuelve a ejecutar `tienda_virtual3.sql` en Workbench (⚠️ borra los datos y los crea de nuevo) → reinicia el backend → el catálogo muestra las 5 imágenes.
**Commit:** `fix: imágenes demo de productos y placeholder en frontend`

### [x] 2. Mensajes claros al eliminar + limpieza de la consola

```
1. Hoy, eliminar una categoría con productos o un cliente con ventas responde
   500 "error interno" (violación de llave foránea). Quiero un 409 con mensaje
   claro en español, ej: "No se puede eliminar la categoría 'Ropa' porque tiene
   productos asociados". Valídalo en CategoriaServiceImpl y ClienteServiceImpl
   antes de borrar (agrega los métodos existsBy... que hagan falta en los
   repositorios) y maneja también DataIntegrityViolationException en
   GlobalExceptionHandler como respaldo (409, mensaje genérico, sin detalles
   internos).
2. En el frontend, las listas de categorías y clientes deben mostrar ese
   mensaje con NotificationService (toast) en vez de solo console.error.
   Haz lo mismo en producto-list.
3. Elimina el System.out.println de VentaController.
4. En application.properties: quita la propiedad hibernate.dialect (Hibernate
   avisa que sobra) y agrega spring.jpa.open-in-view=false. Pon
   spring.jpa.show-sql=false. Ojo: el archivo está en ISO-8859-1, no agregues
   tildes.
Muéstrame el plan antes de editar.
```

**Probar:** reinicia el backend → en el panel admin, intenta eliminar la categoría "Ropa" → aparece el toast con el mensaje claro. La consola ya no muestra los WARN de dialect ni de open-in-view.
**Commit:** `fix: 409 con mensaje claro al eliminar registros con dependencias`

### [ ] 3. Sesión vencida y compra sin login

```
1. auth-interceptor: si una respuesta llega con 401 (token vencido o inválido)
   y la petición llevaba token, cerrar sesión (Auth.logout), mostrar toast
   "Tu sesión expiró, vuelve a iniciar sesión" y llevar a /login. No debe
   aplicarse a la propia petición de login (credenciales incorrectas).
2. Carrito: si el usuario NO está autenticado y presiona comprar, no llamar a
   la API: mostrar toast y redirigir a /login?returnUrl=/carrito. Después de
   iniciar sesión, el login debe respetar returnUrl (solo rutas internas).
   El carrito no debe vaciarse en ese flujo.
3. Si el usuario está logueado como ADMIN o EMPLEADO, el backend no le permite
   comprar (solo CLIENTE). En el carrito, mostrar un aviso claro en lugar del
   botón de comprar.
Muéstrame el plan antes de editar.
```

**Probar:** cierra sesión → agrega un producto → "Comprar" → te manda al login → inicias como cliente → vuelves al carrito con el producto → compras. Luego, como admin, el carrito muestra el aviso.
**Commit:** `fix: manejo de sesión expirada y flujo de compra sin login`

### [ ] 4. Menú del panel según el rol

```
En el backend, productos y categorías solo los puede modificar ADMIN;
EMPLEADO solo gestiona clientes y ventas. Hoy el EMPLEADO ve Productos y
Categorías en el sidebar y recibe 403 al guardar.
1. Sidebar: mostrar Productos y Categorías solo a ADMIN.
2. Proteger esas rutas del dashboard con un guard que solo permita ADMIN
   (si entra un EMPLEADO, redirigir a /dashboard/inicio con un toast).
3. En el header del dashboard, mostrar el correo y el rol del usuario
   conectado (el correo está en el "sub" del JWT).
Muéstrame el plan antes de editar.
```

**Probar:** inicia como `empleado@tienda.com / Empleado123` → solo ve Inicio, Ventas y Clientes; escribir /dashboard/productos en la URL lo regresa al inicio.
**Commit:** `fix: menú y rutas del panel según rol`

### [ ] 5. Ver y reactivar productos eliminados

```
"Eliminar" un producto lo desactiva (activo=false), pero el panel admin usa
GET /api/v1/productos que solo devuelve activos, así que el producto
desaparece y no se puede recuperar.
1. Backend: agrega un endpoint solo para ADMIN que liste todos los productos
   (activos e inactivos) y otro para reactivar un producto (PATCH).
   CUIDADO con SecurityConfig: hoy GET /api/v1/productos/** es permitAll, así
   que el nuevo endpoint debe quedar protegido (orden de los matchers o ruta
   distinta). Verifícalo.
2. Frontend producto-list: usar el nuevo endpoint, mostrar etiqueta
   "Inactivo" y botón "Reactivar" en los inactivos, y un filtro
   Todos/Activos/Inactivos. Cambiar el texto de "Eliminar" a "Desactivar"
   con su confirmación.
Muéstrame el plan antes de editar.
```

**Probar:** desactiva un producto → desaparece del catálogo, pero sigue en el panel como "Inactivo" → Reactivar → vuelve al catálogo. Sin sesión, el nuevo endpoint debe dar 401.
**Commit:** `feat: listar y reactivar productos desactivados`

---

## FASE 2 — Funciones visibles para la presentación

### [ ] 6. Documentación de la API con Swagger

```
Agrega springdoc-openapi (versión compatible con Spring Boot 3.3.x, ej.
springdoc-openapi-starter-webmvc-ui 2.6.0). Requisitos:
- Swagger UI en /swagger-ui.html, accesible sin login (ajustar SecurityConfig
  para /swagger-ui/** y /v3/api-docs/**).
- Esquema de seguridad Bearer JWT para poder probar endpoints protegidos
  con el botón "Authorize".
- Título "API Tienda Solex", descripción y versión; agrupa por tags
  (Auth, Productos, Categorías, Clientes, Ventas) con descripciones en español.
Muéstrame el plan antes de editar.
```

**Probar:** http://localhost:8080/swagger-ui.html → hacer login en POST /auth/login → copiar el token → Authorize → probar GET /ventas.
**Commit:** `feat: documentación OpenAPI/Swagger`

### [x] 7. "Mis compras" para el cliente

```
El backend ya tiene GET /api/v1/ventas/mis-compras (rol CLIENTE) pero el
frontend no lo usa. Crea la página /mis-compras dentro del layout de la
tienda, protegida para clientes autenticados:
- Lista de compras (número, fecha, método de pago, estado, total) con
  detalle desplegable de productos.
- Estado vacío amigable con enlace al catálogo.
- Enlace "Mis compras" en el header (desktop y mobile) solo para CLIENTE.
- Después de una compra exitosa en el carrito, redirigir a /mis-compras
  en lugar de al inicio.
Sigue el estilo visual existente.
Muéstrame el plan antes de editar.
```

**Probar:** como cliente, compra algo → te lleva a Mis compras con el pedido nuevo arriba.
**Commit:** `feat: historial de compras del cliente`

### [x] 8. Anular venta (devuelve stock)

```
EstadoVenta ya tiene ANULADA pero nadie la usa.
1. Backend: PATCH /api/v1/ventas/{id}/anular (ADMIN y EMPLEADO). Debe
   devolver al stock las cantidades de cada detalle y cambiar el estado a
   ANULADA, en una transacción. Si ya está anulada → 400 con mensaje claro.
   Registrar la regla en SecurityConfig.
2. Frontend venta-list: botón "Anular" con confirmación en ventas PAGADAS,
   toast de éxito/error y refrescar la lista. Agregar un filtro por estado.
Muéstrame el plan antes de editar.
```

**Probar:** anota el stock de un producto → anula una venta que lo incluya → el stock sube → el estado aparece como ANULADA.
**Commit:** `feat: anular ventas con devolución de stock`

### [x] 9. Dashboard con indicadores

```
Mejora features/dashboard/dashboard:
- Tarjetas: ingresos totales (solo ventas PAGADAS), ticket promedio, ventas
  del mes actual, productos con stock bajo (<= 5).
- Gráfico de barras hecho con CSS (sin librerías) de ventas por método de
  pago (YAPE, PLIN, TARJETA, EFECTIVO, TRANSFERENCIA).
- Tabla "Stock bajo" con enlace a editar el producto.
- Mostrar montos en soles con 2 decimales (pipe currency 'PEN' o
  formato S/ 0.00).
Calcula en el frontend con los endpoints que ya existen. Sigue el estilo
visual actual del panel.
Muéstrame el plan antes de editar.
```

**Commit:** `feat: indicadores en el dashboard`

### [x] 10. Detalles que suman

```
1. venta-list: botón "Exportar CSV" que descargue las ventas filtradas
   (número, fecha, cliente, método, estado, total), con BOM UTF-8 para que
   Excel muestre bien las tildes.
2. Catálogo: ordenar por precio (menor/mayor) y nombre; etiqueta
   "¡Últimas unidades!" cuando stock <= 5; mostrar precios con 2 decimales
   en toda la tienda.
Muéstrame el plan antes de editar.
```

**Commit:** `feat: exportar ventas a CSV y mejoras de catálogo`

---

## FASE 3 — Calidad (opcional)

### [ ] 11. Pruebas unitarias del flujo de venta

```
Agrega pruebas unitarias con JUnit 5 + Mockito para VentaServiceImpl:
venta exitosa (descuenta stock y calcula total con el precio de la BD),
stock insuficiente, producto inactivo, producto inexistente y anulación
(devuelve stock). Ejecuta mvnw.cmd test y asegúrate de que pasen.
```

**Commit:** `test: pruebas unitarias de VentaService`
