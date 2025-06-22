-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS ConfiguracionDB;
USE ConfiguracionDB;

-- Tabla CI (Elemento de Configuración)
DROP TABLE IF EXISTS CI_Cambios;
DROP TABLE IF EXISTS Relaciones;
DROP TABLE IF EXISTS CI;

CREATE TABLE CI (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_ci VARCHAR(255) NOT NULL,
    tipo_ci VARCHAR(100) NOT NULL,
    descripcion TEXT,
    numero_serie VARCHAR(255),
    version VARCHAR(100),
    Fecha_adquisicion DATE,
    Estado VARCHAR(100),
    propietario VARCHAR(255),
    Fecha_cambio DATE,
    descripcion_cambio TEXT,
    documentacion TEXT,
    enlaces_incidentes TEXT,
    niveles_seguridad VARCHAR(100),
    cumplimiento VARCHAR(100),
    numero_licencia VARCHAR(255),
    fecha_vencimiento DATE,
    ambiente ENUM('DEV', 'QA', 'PROD') NOT NULL
);

-- Tabla Cambios de CI
CREATE TABLE CI_Cambios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ci_id INT,
    fecha_cambio DATE,
    descripcion_cambio TEXT,
    FOREIGN KEY (ci_id) REFERENCES CI(id) ON DELETE CASCADE
);

-- Tabla Relaciones entre CIs
CREATE TABLE Relaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ci_id_origen INT,
    ci_id_destino INT,
    tipo_relacion VARCHAR(255),
    FOREIGN KEY (ci_id_origen) REFERENCES CI(id) ON DELETE CASCADE,
    FOREIGN KEY (ci_id_destino) REFERENCES CI(id) ON DELETE CASCADE
);

-- Insertar datos de ejemplo en CI
INSERT INTO CI (nombre_ci, tipo_ci, descripcion, numero_serie, version, Fecha_adquisicion, Estado, propietario, Fecha_cambio, descripcion_cambio, documentacion, enlaces_incidentes, niveles_seguridad, cumplimiento, numero_licencia, fecha_vencimiento, ambiente)
VALUES 
('Servidor Aplicaciones', 'servidor', 'Servidor principal de apps', 'SN123456', 'v1.0', '2022-01-15', 'Activo', 'Juan Pérez', NULL, NULL, 'docs.servidor.com', 'incidencia123', 'alto', 'ISO27001', 'LIC123', '2026-01-15', 'PROD'),
('Base de Datos QA', 'base de datos', 'Servidor de pruebas para QA', 'SN654321', 'v2.1', '2023-03-10', 'Mantenimiento', 'Ana Gómez', NULL, NULL, 'docs.dbqa.com', NULL, 'medio', 'N/A', 'LIC456', '2025-03-10', 'QA'),
('Servidor DevOps', 'servidor', 'Servidor de CI/CD', 'SN789012', 'v3.2', '2021-06-20', 'Activo', 'Carlos Ruiz', NULL, NULL, 'docs.devops.com', NULL, 'alto', 'DevOpsSec', 'LIC789', '2024-06-20', 'DEV');

-- Insertar cambios de ejemplo en CI_Cambios
INSERT INTO CI_Cambios (ci_id, fecha_cambio, descripcion_cambio)
VALUES 
(1, '2024-04-01', 'Actualización de sistema operativo'),
(2, '2024-05-15', 'Cambio de versión del motor de base de datos');

-- Insertar relaciones de ejemplo en Relaciones
INSERT INTO Relaciones (ci_id_origen, ci_id_destino, tipo_relacion)
VALUES 
(1, 2, 'Dependencia'),
(2, 3, 'Replica');
