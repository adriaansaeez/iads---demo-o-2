const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

async function executeManualMigration() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log('✅ Conectado a la base de datos');

    // 1. Añadir columnas a products
    console.log('🔄 Añadiendo columnas a products...');
    try {
      await client.query('ALTER TABLE products ADD COLUMN "userId" TEXT');
      console.log('✅ Columna userId añadida');
    } catch (error) {
      if (error.code === '42701') {
        console.log('ℹ️ Columna userId ya existe');
      } else {
        throw error;
      }
    }

    try {
      await client.query('ALTER TABLE products ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP');
      console.log('✅ Columna created_at añadida');
    } catch (error) {
      if (error.code === '42701') {
        console.log('ℹ️ Columna created_at ya existe');
      } else {
        throw error;
      }
    }

    try {
      await client.query('ALTER TABLE products ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP');
      console.log('✅ Columna updated_at añadida');
    } catch (error) {
      if (error.code === '42701') {
        console.log('ℹ️ Columna updated_at ya existe');
      } else {
        throw error;
      }
    }

    // 2. Obtener cualquier usuario para asignar productos
    console.log('🔄 Buscando usuario...');
    const userResult = await client.query("SELECT id, username, role FROM users LIMIT 1");
    if (userResult.rows.length === 0) {
      console.log('⚠️ No hay usuarios en la base de datos, saltando asignación de productos');
    } else {
      const userId = userResult.rows[0].id;
      const username = userResult.rows[0].username;
      const role = userResult.rows[0].role;
      console.log(`✅ Usuario encontrado: ${username} (${role}) - ${userId}`);

      // 3. Asignar productos al usuario
      console.log('🔄 Asignando productos al usuario...');
      const updateResult = await client.query('UPDATE products SET "userId" = $1 WHERE "userId" IS NULL', [userId]);
      console.log(`✅ ${updateResult.rowCount} productos asignados al usuario ${username}`);
    }

    // 4. Añadir columnas a prompts
    console.log('🔄 Añadiendo columnas a prompts...');
    const promptColumns = [
      { name: 'title', type: 'TEXT' },
      { name: 'description', type: 'TEXT' },
      { name: 'created_at', type: 'TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP' }
    ];

    for (const column of promptColumns) {
      try {
        await client.query(`ALTER TABLE prompts ADD COLUMN "${column.name}" ${column.type}`);
        console.log(`✅ Columna ${column.name} añadida a prompts`);
      } catch (error) {
        if (error.code === '42701') {
          console.log(`ℹ️ Columna ${column.name} ya existe en prompts`);
        } else {
          throw error;
        }
      }
    }

    // 5. Crear tabla product_prompts
    console.log('🔄 Creando tabla product_prompts...');
    try {
      await client.query(`
        CREATE TABLE "product_prompts" (
          "id" TEXT NOT NULL,
          "productId" TEXT NOT NULL,
          "promptId" TEXT NOT NULL,
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "product_prompts_pkey" PRIMARY KEY ("id")
        )
      `);
      console.log('✅ Tabla product_prompts creada');
    } catch (error) {
      if (error.code === '42P07') {
        console.log('ℹ️ Tabla product_prompts ya existe');
      } else {
        throw error;
      }
    }

    // 6. Crear índice único
    try {
      await client.query('CREATE UNIQUE INDEX "product_prompts_productId_promptId_key" ON "product_prompts"("productId", "promptId")');
      console.log('✅ Índice único creado');
    } catch (error) {
      if (error.code === '42P07') {
        console.log('ℹ️ Índice único ya existe');
      } else {
        throw error;
      }
    }

    // 7. Añadir foreign keys
    try {
      await client.query('ALTER TABLE "product_prompts" ADD CONSTRAINT "product_prompts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE');
      console.log('✅ Foreign key productId añadida');
    } catch (error) {
      if (error.code === '42710') {
        console.log('ℹ️ Foreign key productId ya existe');
      } else {
        throw error;
      }
    }

    try {
      await client.query('ALTER TABLE "product_prompts" ADD CONSTRAINT "product_prompts_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "prompts"("id") ON DELETE CASCADE ON UPDATE CASCADE');
      console.log('✅ Foreign key promptId añadida');
    } catch (error) {
      if (error.code === '42710') {
        console.log('ℹ️ Foreign key promptId ya existe');
      } else {
        throw error;
      }
    }

    console.log('🎉 Migración manual completada exitosamente');

  } catch (error) {
    console.error('❌ Error en migración manual:', error);
  } finally {
    await client.end();
  }
}

executeManualMigration(); 