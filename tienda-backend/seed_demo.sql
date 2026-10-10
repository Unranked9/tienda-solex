-- =========================================================
-- Datos demo para la presentacion: tienda_virtual3
--
-- Se ejecuta DESPUES de tienda_virtual3.sql. Es OPCIONAL: solo
-- agrega datos para la demo (4 clientes adicionales, 12 ventas de
-- los ultimos 3 meses y stock bajo en Gorra clasica y Mochila
-- urbana 20L para mostrar la alerta del dashboard).
--
-- Ejecutarlo una sola vez sobre una base recien creada con
-- tienda_virtual3.sql (si se ejecuta dos veces falla por correos y
-- numeros de venta duplicados).
-- =========================================================

USE tienda_virtual3;

-- Usuarios CLIENTE adicionales (misma contrasena Cliente123, mismo hash
-- BCrypt que cliente@tienda.com)
INSERT INTO usuarios (correo, contrasena, habilitado, rol_id) VALUES
    ('maria.torres@gmail.com',   '$2b$10$75KKefdRW5aDb2.vAijQwOYcNNGmqY1anaQWRPcDEJLUhieOo4FVe', TRUE, (SELECT id FROM roles WHERE nombre = 'CLIENTE')),
    ('carlos.ramirez@gmail.com', '$2b$10$75KKefdRW5aDb2.vAijQwOYcNNGmqY1anaQWRPcDEJLUhieOo4FVe', TRUE, (SELECT id FROM roles WHERE nombre = 'CLIENTE')),
    ('lucia.mendoza@gmail.com',  '$2b$10$75KKefdRW5aDb2.vAijQwOYcNNGmqY1anaQWRPcDEJLUhieOo4FVe', TRUE, (SELECT id FROM roles WHERE nombre = 'CLIENTE')),
    ('jorge.castillo@gmail.com', '$2b$10$75KKefdRW5aDb2.vAijQwOYcNNGmqY1anaQWRPcDEJLUhieOo4FVe', TRUE, (SELECT id FROM roles WHERE nombre = 'CLIENTE'));

INSERT INTO clientes (nombre_completo, correo, telefono, direccion) VALUES
    ('Maria Fernanda Torres Quispe',  'maria.torres@gmail.com',   '987654321', 'Av. Arequipa 1234, Lima'),
    ('Carlos Alberto Ramirez Soto',   'carlos.ramirez@gmail.com', '976543210', 'Jr. Union 567, Lima'),
    ('Lucia Beatriz Mendoza Vargas',  'lucia.mendoza@gmail.com',  '965432109', 'Av. Brasil 890, Lima'),
    ('Jorge Luis Castillo Paredes',   'jorge.castillo@gmail.com', '954321098', 'Calle Las Flores 321, Lima');

-- 12 ventas repartidas en los ultimos 3 meses, con distintos metodos de pago
INSERT INTO ventas (numero_venta, cliente_id, total, metodo_pago, estado, fecha) VALUES
    ('V-20260710-1001', (SELECT id FROM clientes WHERE correo = 'cliente@tienda.com'),   239.20,  'YAPE',          'PAGADA', '2026-07-10 10:15:00'),
    ('V-20260722-1002', (SELECT id FROM clientes WHERE correo = 'maria.torres@gmail.com'),   299.10,  'PLIN',          'PAGADA', '2026-07-22 14:30:00'),
    ('V-20260802-1003', (SELECT id FROM clientes WHERE correo = 'carlos.ramirez@gmail.com'), 449.50,  'TARJETA',       'PAGADA', '2026-08-02 09:45:00'),
    ('V-20260810-1004', (SELECT id FROM clientes WHERE correo = 'lucia.mendoza@gmail.com'),  434.80,  'EFECTIVO',      'PAGADA', '2026-08-10 16:20:00'),
    ('V-20260818-1005', (SELECT id FROM clientes WHERE correo = 'jorge.castillo@gmail.com'), 299.00,  'TRANSFERENCIA', 'PAGADA', '2026-08-18 11:05:00'),
    ('V-20260827-1006', (SELECT id FROM clientes WHERE correo = 'cliente@tienda.com'),   519.20,  'YAPE',          'PAGADA', '2026-08-27 13:40:00'),
    ('V-20260903-1007', (SELECT id FROM clientes WHERE correo = 'maria.torres@gmail.com'),   360.00,  'PLIN',          'PAGADA', '2026-09-03 15:55:00'),
    ('V-20260912-1008', (SELECT id FROM clientes WHERE correo = 'carlos.ramirez@gmail.com'), 509.10,  'TARJETA',       'PAGADA', '2026-09-12 10:10:00'),
    ('V-20260920-1009', (SELECT id FROM clientes WHERE correo = 'lucia.mendoza@gmail.com'),  539.40,  'EFECTIVO',      'PAGADA', '2026-09-20 12:25:00'),
    ('V-20260928-1010', (SELECT id FROM clientes WHERE correo = 'jorge.castillo@gmail.com'), 379.50,  'TRANSFERENCIA', 'PAGADA', '2026-09-28 17:00:00'),
    ('V-20261003-1011', (SELECT id FROM clientes WHERE correo = 'maria.torres@gmail.com'),   179.40,  'YAPE',          'PAGADA', '2026-10-03 09:30:00'),
    ('V-20261007-1012', (SELECT id FROM clientes WHERE correo = 'carlos.ramirez@gmail.com'), 1288.90, 'TARJETA',       'PAGADA', '2026-10-07 18:45:00');

-- Detalles de cada venta (1 o 2 productos por venta, precio tomado del
-- catalogo de productos de tienda_virtual3.sql)
INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
    -- V-20260710-1001: Gorra x8
    ((SELECT id FROM ventas WHERE numero_venta = 'V-20260710-1001'), (SELECT id FROM productos WHERE nombre = 'Gorra clasica'), 8, 29.90, 239.20),
    -- V-20260722-1002: Polo x3 + Gorra x6
    ((SELECT id FROM ventas WHERE numero_venta = 'V-20260722-1002'), (SELECT id FROM productos WHERE nombre = 'Polo basico algodon'), 3, 39.90, 119.70),
    ((SELECT id FROM ventas WHERE numero_venta = 'V-20260722-1002'), (SELECT id FROM productos WHERE nombre = 'Gorra clasica'), 6, 29.90, 179.40),
    -- V-20260802-1003: Mochila x5
    ((SELECT id FROM ventas WHERE numero_venta = 'V-20260802-1003'), (SELECT id FROM productos WHERE nombre = 'Mochila urbana 20L'), 5, 89.90, 449.50),
    -- V-20260810-1004: Zapatillas x2 + Billetera x3
    ((SELECT id FROM ventas WHERE numero_venta = 'V-20260810-1004'), (SELECT id FROM productos WHERE nombre = 'Zapatillas urbanas'), 2, 149.90, 299.80),
    ((SELECT id FROM ventas WHERE numero_venta = 'V-20260810-1004'), (SELECT id FROM productos WHERE nombre = 'Billetera de cuero'), 3, 45.00, 135.00),
    -- V-20260818-1005: Gorra x10
    ((SELECT id FROM ventas WHERE numero_venta = 'V-20260818-1005'), (SELECT id FROM productos WHERE nombre = 'Gorra clasica'), 10, 29.90, 299.00),
    -- V-20260827-1006: Polo x4 + Mochila x4
    ((SELECT id FROM ventas WHERE numero_venta = 'V-20260827-1006'), (SELECT id FROM productos WHERE nombre = 'Polo basico algodon'), 4, 39.90, 159.60),
    ((SELECT id FROM ventas WHERE numero_venta = 'V-20260827-1006'), (SELECT id FROM productos WHERE nombre = 'Mochila urbana 20L'), 4, 89.90, 359.60),
    -- V-20260903-1007: Billetera x8
    ((SELECT id FROM ventas WHERE numero_venta = 'V-20260903-1007'), (SELECT id FROM productos WHERE nombre = 'Billetera de cuero'), 8, 45.00, 360.00),
    -- V-20260912-1008: Gorra x7 + Zapatillas x2
    ((SELECT id FROM ventas WHERE numero_venta = 'V-20260912-1008'), (SELECT id FROM productos WHERE nombre = 'Gorra clasica'), 7, 29.90, 209.30),
    ((SELECT id FROM ventas WHERE numero_venta = 'V-20260912-1008'), (SELECT id FROM productos WHERE nombre = 'Zapatillas urbanas'), 2, 149.90, 299.80),
    -- V-20260920-1009: Mochila x6
    ((SELECT id FROM ventas WHERE numero_venta = 'V-20260920-1009'), (SELECT id FROM productos WHERE nombre = 'Mochila urbana 20L'), 6, 89.90, 539.40),
    -- V-20260928-1010: Polo x5 + Billetera x4
    ((SELECT id FROM ventas WHERE numero_venta = 'V-20260928-1010'), (SELECT id FROM productos WHERE nombre = 'Polo basico algodon'), 5, 39.90, 199.50),
    ((SELECT id FROM ventas WHERE numero_venta = 'V-20260928-1010'), (SELECT id FROM productos WHERE nombre = 'Billetera de cuero'), 4, 45.00, 180.00),
    -- V-20261003-1011: Gorra x6
    ((SELECT id FROM ventas WHERE numero_venta = 'V-20261003-1011'), (SELECT id FROM productos WHERE nombre = 'Gorra clasica'), 6, 29.90, 179.40),
    -- V-20261007-1012: Mochila x6 + Zapatillas x5
    ((SELECT id FROM ventas WHERE numero_venta = 'V-20261007-1012'), (SELECT id FROM productos WHERE nombre = 'Mochila urbana 20L'), 6, 89.90, 539.40),
    ((SELECT id FROM ventas WHERE numero_venta = 'V-20261007-1012'), (SELECT id FROM productos WHERE nombre = 'Zapatillas urbanas'), 5, 149.90, 749.50);

-- Ajuste de stock: refleja el descuento de las ventas de arriba
-- (stock original - unidades vendidas). Gorra clasica y Mochila
-- urbana 20L quedan con stock bajo (<= 5).
UPDATE productos SET stock = 38 WHERE nombre = 'Polo basico algodon';
UPDATE productos SET stock = 21 WHERE nombre = 'Zapatillas urbanas';
UPDATE productos SET stock = 3  WHERE nombre = 'Gorra clasica';
UPDATE productos SET stock = 4  WHERE nombre = 'Mochila urbana 20L';
UPDATE productos SET stock = 45 WHERE nombre = 'Billetera de cuero';
