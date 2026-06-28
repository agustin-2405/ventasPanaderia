CREATE TABLE IF NOT EXISTS productos (
    id VARCHAR(36) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS planillas (
    id VARCHAR(36) PRIMARY KEY,
    repartidorId VARCHAR(50) NOT NULL,
    fecha DATETIME NOT NULL,
    estado ENUM('ABIERTA', 'CERRADA') DEFAULT 'ABIERTA'
);

CREATE TABLE IF NOT EXISTS planilla_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    planillaId VARCHAR(36),
    productoId VARCHAR(36),
    cantidadLlevada INT NOT NULL,
    cantidadDevuelta INT NOT NULL,
    cantidadVendida INT NOT NULL,
    FOREIGN KEY (planillaId) REFERENCES planillas(id),
    FOREIGN KEY (productoId) REFERENCES productos(id)
);
