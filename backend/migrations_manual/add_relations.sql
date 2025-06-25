-- Migración manual para añadir relaciones
-- Ejecutar este script paso a paso

-- 1. Añadir columna userId a products (opcional por ahora)
ALTER TABLE products ADD COLUMN "userId" TEXT;
ALTER TABLE products ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE products ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- 2. Obtener el ID del usuario admin para asignar productos existentes
-- (Ejecutar esta query para obtener el ID del admin)
-- SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1;

-- 3. Asignar productos existentes al admin (reemplazar 'ADMIN_USER_ID' con el ID real)
-- UPDATE products SET "userId" = 'ADMIN_USER_ID' WHERE "userId" IS NULL;

-- 4. Añadir nuevos campos a prompts
ALTER TABLE prompts ADD COLUMN "title" TEXT;
ALTER TABLE prompts ADD COLUMN "description" TEXT;
ALTER TABLE prompts ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE prompts ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- 5. Crear tabla pivote product_prompts
CREATE TABLE "product_prompts" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "promptId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_prompts_pkey" PRIMARY KEY ("id")
);

-- 6. Crear índices únicos
CREATE UNIQUE INDEX "product_prompts_productId_promptId_key" ON "product_prompts"("productId", "promptId");

-- 7. Añadir foreign keys
ALTER TABLE "product_prompts" ADD CONSTRAINT "product_prompts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "product_prompts" ADD CONSTRAINT "product_prompts_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "prompts"("id") ON DELETE CASCADE ON UPDATE CASCADE; 