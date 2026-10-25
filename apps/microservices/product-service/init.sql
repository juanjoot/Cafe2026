CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT
);

CREATE TABLE subcategories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  categoria_id UUID NOT NULL,
  CONSTRAINT fk_categoria
    FOREIGN KEY (categoria_id)
    REFERENCES categories(id)
    ON DELETE CASCADE
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  precio NUMERIC(10, 2) NOT NULL,
  stock INTEGER NOT NULL,
  destacado BOOLEAN DEFAULT FALSE,
  sku VARCHAR(100) UNIQUE NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  imagen1 TEXT,
  imagen2 TEXT,
  imagen3 TEXT,
  imagen4 TEXT,
  tags TEXT[],
  vendidos INTEGER DEFAULT 0,
  calificacion_promedio FLOAT DEFAULT 0,
  numero_resenas INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  categoria_id UUID NOT NULL,
  CONSTRAINT fk_categoria_producto
    FOREIGN KEY (categoria_id)
    REFERENCES categories(id)
    ON DELETE SET NULL
);
