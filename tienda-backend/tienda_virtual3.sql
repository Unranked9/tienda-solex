-- =========================================================
-- Script de creacion de base de datos: tienda_virtual3
-- Proyecto: Tienda Virtual (Spring Boot + Angular)
--
-- Este script es OBLIGATORIO: la aplicacion usa
-- spring.jpa.hibernate.ddl-auto=validate, por lo que Spring Boot
-- NO crea ni modifica el esquema, solo valida que coincida con las
-- entidades. Hay que ejecutar este script manualmente antes de
-- levantar el backend.
--
-- ADVERTENCIA: hace DROP DATABASE IF EXISTS tienda_virtual3 antes de
-- recrearla, lo que BORRA todos los datos existentes en esa base.
-- =========================================================

DROP DATABASE IF EXISTS tienda_virtual3;
CREATE DATABASE tienda_virtual3
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE tienda_virtual3;

-- =========================================================
-- SEGURIDAD: roles y usuarios
-- =========================================================

CREATE TABLE roles (
    id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE usuarios (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    correo     VARCHAR(120) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    habilitado BOOLEAN NOT NULL DEFAULT TRUE,
    rol_id     BIGINT NOT NULL,
    CONSTRAINT fk_usuario_rol FOREIGN KEY (rol_id) REFERENCES roles (id)
);

-- =========================================================
-- NEGOCIO: categorias, productos, clientes, ventas
-- =========================================================

CREATE TABLE categorias (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(80) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
);

CREATE TABLE productos (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(120) NOT NULL,
    descripcion VARCHAR(500),
    precio      DECIMAL(10,2) NOT NULL,
    stock       INT NOT NULL,
    imagen_url  VARCHAR(255),
    activo      BOOLEAN NOT NULL DEFAULT TRUE,
    categoria_id BIGINT NOT NULL,
    CONSTRAINT fk_producto_categoria FOREIGN KEY (categoria_id) REFERENCES categorias (id)
);

CREATE TABLE clientes (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(120) NOT NULL,
    correo         VARCHAR(120) NOT NULL UNIQUE,
    telefono       VARCHAR(20),
    direccion      VARCHAR(255)
);

CREATE TABLE ventas (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    numero_venta VARCHAR(20) NOT NULL UNIQUE,
    cliente_id   BIGINT NOT NULL,
    total        DECIMAL(10,2) NOT NULL,
    metodo_pago  VARCHAR(20) NOT NULL,
    estado       VARCHAR(20) NOT NULL DEFAULT 'PAGADA',
    fecha        DATETIME NOT NULL,
    CONSTRAINT fk_venta_cliente FOREIGN KEY (cliente_id) REFERENCES clientes (id)
);

CREATE TABLE detalle_ventas (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    venta_id        BIGINT NOT NULL,
    producto_id     BIGINT NOT NULL,
    cantidad        INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal        DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_detalle_venta FOREIGN KEY (venta_id) REFERENCES ventas (id),
    CONSTRAINT fk_detalle_producto FOREIGN KEY (producto_id) REFERENCES productos (id)
);

-- =========================================================
-- DATOS INICIALES (equivalentes a los que crea DataInitializer.java)
-- =========================================================

INSERT INTO roles (nombre) VALUES ('ADMIN'), ('EMPLEADO'), ('CLIENTE');

-- Contraseñas encriptadas con BCrypt (misma libreria que usa Spring Security):
--   admin@tienda.com    -> Admin123
--   empleado@tienda.com -> Empleado123
--   cliente@tienda.com  -> Cliente123
INSERT INTO usuarios (correo, contrasena, habilitado, rol_id) VALUES
    ('admin@tienda.com',    '$2b$10$/U9ohP3fjBBqldmpW0JxRutspirXcYTjl7JTThl9GDmAe431s40x.', TRUE, (SELECT id FROM roles WHERE nombre = 'ADMIN')),
    ('empleado@tienda.com', '$2b$10$6rNe0KYZ3wF4a1IK03.3AuvoOceA4jNpO7ByHkkHHwrlROBYWbuMa', TRUE, (SELECT id FROM roles WHERE nombre = 'EMPLEADO')),
    ('cliente@tienda.com',  '$2b$10$75KKefdRW5aDb2.vAijQwOYcNNGmqY1anaQWRPcDEJLUhieOo4FVe', TRUE, (SELECT id FROM roles WHERE nombre = 'CLIENTE'));

-- El usuario cliente@tienda.com tambien necesita su registro en "clientes"
-- para poder generar ventas (mismo criterio que AuthServiceImpl.registrar).
INSERT INTO clientes (nombre_completo, correo, telefono, direccion) VALUES
    ('Cliente de Prueba', 'cliente@tienda.com', NULL, NULL);

INSERT INTO categorias (nombre, descripcion) VALUES
    ('Ropa',        'Polos, pantalones, casacas, poleras y otras prendas'),
    ('Zapatillas',  'Zapatillas deportivas y casuales'),
    ('Gorras',      'Gorras y accesorios para la cabeza'),
    ('Mochilas',    'Mochilas y bolsos para uso diario'),
    ('Accesorios',  'Relojes, billeteras, cinturones y otros accesorios');

-- Las imagenes demo ya estan incluidas en tienda-backend/uploads/productos/
-- con estos nombres (formato PNG).
INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url, activo, categoria_id) VALUES
    ('Polo basico algodon',  'Polo 100% algodon, corte regular', 39.90, 50, '/uploads/productos/polo-basico-algodon.png', TRUE, (SELECT id FROM categorias WHERE nombre = 'Ropa')),
    ('Zapatillas urbanas',   'Zapatillas casuales para uso diario', 149.90, 30, '/uploads/productos/zapatillas-urbanas.png', TRUE, (SELECT id FROM categorias WHERE nombre = 'Zapatillas')),
    ('Gorra clasica',        'Gorra ajustable con visera curva', 29.90, 40, '/uploads/productos/gorra-clasica.png', TRUE, (SELECT id FROM categorias WHERE nombre = 'Gorras')),
    ('Mochila urbana 20L',   'Mochila resistente al agua con compartimento para laptop', 89.90, 25, '/uploads/productos/mochila-urbana.png', TRUE, (SELECT id FROM categorias WHERE nombre = 'Mochilas')),
    ('Billetera de cuero',   'Billetera de cuero sintetico con varios compartimentos', 45.00, 60, '/uploads/productos/billetera-cuero.png', TRUE, (SELECT id FROM categorias WHERE nombre = 'Accesorios'));
