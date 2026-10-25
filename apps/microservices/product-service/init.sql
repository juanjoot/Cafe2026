BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT
);

CREATE TABLE IF NOT EXISTS subcategories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  categoria_id UUID NOT NULL,
  CONSTRAINT fk_categoria
    FOREIGN KEY (categoria_id)
    REFERENCES categories(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  precio NUMERIC(10, 2) NOT NULL,
  stock INTEGER NOT NULL,
  destacado BOOLEAN NOT NULL DEFAULT FALSE,
  sku VARCHAR(100) UNIQUE NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  imagen1 TEXT,
  imagen2 TEXT,
  imagen3 TEXT,
  imagen4 TEXT,
  tags TEXT[],
  vendidos INTEGER NOT NULL DEFAULT 0,
  calificacion_promedio DOUBLE PRECISION NOT NULL DEFAULT 0,
  numero_resenas INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  categoria_id UUID NOT NULL,
  subcategoria_id UUID,
  CONSTRAINT fk_categoria_producto
    FOREIGN KEY (categoria_id)
    REFERENCES categories(id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_subcategoria_producto
    FOREIGN KEY (subcategoria_id)
    REFERENCES subcategories(id)
    ON DELETE SET NULL
);

ALTER TABLE products
  ALTER COLUMN categoria_id SET NOT NULL;

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS subcategoria_id UUID;

ALTER TABLE products
  DROP CONSTRAINT IF EXISTS fk_categoria_producto;

ALTER TABLE products
  ADD CONSTRAINT fk_categoria_producto
  FOREIGN KEY (categoria_id)
  REFERENCES categories(id)
  ON DELETE RESTRICT;

ALTER TABLE products
  DROP CONSTRAINT IF EXISTS fk_subcategoria_producto;

ALTER TABLE products
  ADD CONSTRAINT fk_subcategoria_producto
  FOREIGN KEY (subcategoria_id)
  REFERENCES subcategories(id)
  ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_subcategories_categoria_id
  ON subcategories (categoria_id);

CREATE INDEX IF NOT EXISTS idx_products_categoria_id
  ON products (categoria_id);

CREATE INDEX IF NOT EXISTS idx_products_subcategoria_id
  ON products (subcategoria_id);

INSERT INTO categories (id, nombre, descripcion)
VALUES
  ('11111111-1111-4111-8111-111111111111', 'Café', 'Cafés y bebidas para preparar en casa.'),
  ('22222222-2222-4222-8222-222222222222', 'Accesorios', 'Equipamiento para preparar y disfrutar café.')
ON CONFLICT (id) DO UPDATE
SET nombre = EXCLUDED.nombre,
    descripcion = EXCLUDED.descripcion;

INSERT INTO subcategories (id, nombre, descripcion, categoria_id)
VALUES
  ('33333333-3333-4333-8333-333333333333', 'Grano', 'Café en grano entero.', '11111111-1111-4111-8111-111111111111'),
  ('44444444-4444-4444-8444-444444444444', 'Molido', 'Café molido listo para preparar.', '11111111-1111-4111-8111-111111111111'),
  ('55555555-5555-4555-8555-555555555555', 'Tazas', 'Tazas y vasos para café.', '22222222-2222-4222-8222-222222222222'),
  ('66666666-6666-4666-8666-666666666666', 'Preparación', 'Herramientas para preparar café.', '22222222-2222-4222-8222-222222222222')
ON CONFLICT (id) DO UPDATE
SET nombre = EXCLUDED.nombre,
    descripcion = EXCLUDED.descripcion,
    categoria_id = EXCLUDED.categoria_id;

INSERT INTO products (
  id, nombre, descripcion, precio, stock, destacado, sku, activo, tags, categoria_id, subcategoria_id
)
VALUES
  ('77777777-7777-4777-8777-777777777771', 'Café de origen en grano', 'Café de tueste medio, 500 g.', 14.90, 35, TRUE, 'CAFE-GRANO-500', TRUE, ARRAY['cafe', 'grano', 'tueste-medio'], '11111111-1111-4111-8111-111111111111', '33333333-3333-4333-8333-333333333333'),
  ('77777777-7777-4777-8777-777777777772', 'Café espresso molido', 'Mezcla para espresso, 250 g.', 8.50, 42, FALSE, 'CAFE-ESPRESSO-250', TRUE, ARRAY['cafe', 'molido', 'espresso'], '11111111-1111-4111-8111-111111111111', '44444444-4444-4444-8444-444444444444'),
  ('77777777-7777-4777-8777-777777777773', 'Café descafeinado molido', 'Café descafeinado molido, 250 g.', 9.25, 20, FALSE, 'CAFE-DECAF-250', TRUE, ARRAY['cafe', 'molido', 'descafeinado'], '11111111-1111-4111-8111-111111111111', '44444444-4444-4444-8444-444444444444'),
  ('77777777-7777-4777-8777-777777777774', 'Taza cerámica', 'Taza de cerámica de 300 ml.', 12.00, 18, TRUE, 'TAZA-CERAMICA-300', TRUE, ARRAY['taza', 'ceramica'], '22222222-2222-4222-8222-222222222222', '55555555-5555-4555-8555-555555555555'),
  ('77777777-7777-4777-8777-777777777775', 'Prensa francesa', 'Prensa francesa de vidrio, 600 ml.', 24.90, 10, FALSE, 'PRENSA-FRANCESA-600', TRUE, ARRAY['preparacion', 'prensa-francesa'], '22222222-2222-4222-8222-222222222222', '66666666-6666-4666-8666-666666666666')
ON CONFLICT (id) DO UPDATE
SET nombre = EXCLUDED.nombre,
    descripcion = EXCLUDED.descripcion,
    precio = EXCLUDED.precio,
    stock = EXCLUDED.stock,
    destacado = EXCLUDED.destacado,
    sku = EXCLUDED.sku,
    activo = EXCLUDED.activo,
    tags = EXCLUDED.tags,
    categoria_id = EXCLUDED.categoria_id,
    subcategoria_id = EXCLUDED.subcategoria_id;

COMMIT;
