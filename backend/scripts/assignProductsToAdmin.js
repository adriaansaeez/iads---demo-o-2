const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

async function assignProductsToAdmin() {
  try {
    console.log('🔄 Asignando productos existentes al usuario admin...');

    // Buscar el usuario admin
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!adminUser) {
      console.log('❌ No se encontró usuario admin');
      return;
    }

    console.log(`✅ Usuario admin encontrado: ${adminUser.username} (${adminUser.id})`);

    // Buscar productos sin usuario asignado
    const unassignedProducts = await prisma.product.findMany({
      where: { userId: null }
    });

    console.log(`📦 Productos sin asignar encontrados: ${unassignedProducts.length}`);

    if (unassignedProducts.length > 0) {
      // Asignar todos los productos al admin
      const result = await prisma.product.updateMany({
        where: { userId: null },
        data: { userId: adminUser.id }
      });

      console.log(`✅ ${result.count} productos asignados al admin`);
    }

    console.log('🎉 Proceso completado exitosamente');

  } catch (error) {
    console.error('❌ Error asignando productos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

assignProductsToAdmin(); 