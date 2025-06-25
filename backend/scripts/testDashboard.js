const { PrismaClient } = require('../generated/prisma');

async function testDashboard() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Probando consultas del dashboard...');
    
    // Simular un usuario (usar uno de los usuarios de seed)
    const userId = 'cmccg24ng0000zj0k2ilj1l6g'; // ID del admin del seed
    
    const now = new Date();
    const startOfWeek = new Date(now);
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    console.log(`Usuario ID: ${userId}`);
    console.log(`Semana: ${startOfWeek.toISOString()} - ${endOfWeek.toISOString()}`);

    // Probar cada consulta individualmente
    console.log('\n1. Probando total de productos...');
    const totalProducts = await prisma.product.count({
      where: { userId }
    });
    console.log(`Total productos: ${totalProducts}`);

    console.log('\n2. Probando productos esta semana...');
    const productsThisWeek = await prisma.product.count({
      where: {
        userId,
        created_at: {
          gte: startOfWeek,
          lte: endOfWeek
        }
      }
    });
    console.log(`Productos esta semana: ${productsThisWeek}`);

    console.log('\n3. Probando total de prompts...');
    const totalPrompts = await prisma.productPrompt.count({
      where: {
        product: { userId }
      }
    });
    console.log(`Total prompts: ${totalPrompts}`);

    console.log('\n4. Probando prompts esta semana...');
    const promptsThisWeek = await prisma.productPrompt.count({
      where: {
        product: { userId },
        created_at: {
          gte: startOfWeek,
          lte: endOfWeek
        }
      }
    });
    console.log(`Prompts esta semana: ${promptsThisWeek}`);

    console.log('\n5. Probando productos recientes...');
    const recentProducts = await prisma.product.findMany({
      where: { userId },
      include: {
        productPrompts: {
          include: {
                         prompt: {
               select: {
                 id: true,
                 title: true,
                 finalPrompt: true,
                 created_at: true
               }
             }
          },
          orderBy: { created_at: 'desc' }
        }
      },
      orderBy: { created_at: 'desc' },
      take: 10
    });
    console.log(`Productos recientes: ${recentProducts.length}`);

    console.log('\n6. Probando actividad reciente...');
    const recentActivity = await prisma.productPrompt.findMany({
      where: {
        product: { userId }
      },
      include: {
        product: {
          select: {
            id: true,
            name: true
          }
        },
                 prompt: {
           select: {
             id: true,
             title: true,
             finalPrompt: true
           }
         }
      },
      orderBy: { created_at: 'desc' },
      take: 5
    });
    console.log(`Actividad reciente: ${recentActivity.length}`);

    console.log('\n✅ Todas las consultas funcionaron correctamente');

  } catch (error) {
    console.error('\n❌ Error en consulta:', error);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testDashboard(); 

async function testDashboard() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Probando consultas del dashboard...');
    
    // Simular un usuario (usar uno de los usuarios de seed)
    const userId = 'cmccg24ng0000zj0k2ilj1l6g'; // ID del admin del seed
    
    const now = new Date();
    const startOfWeek = new Date(now);
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    console.log(`Usuario ID: ${userId}`);
    console.log(`Semana: ${startOfWeek.toISOString()} - ${endOfWeek.toISOString()}`);

    // Probar cada consulta individualmente
    console.log('\n1. Probando total de productos...');
    const totalProducts = await prisma.product.count({
      where: { userId }
    });
    console.log(`Total productos: ${totalProducts}`);

    console.log('\n2. Probando productos esta semana...');
    const productsThisWeek = await prisma.product.count({
      where: {
        userId,
        created_at: {
          gte: startOfWeek,
          lte: endOfWeek
        }
      }
    });
    console.log(`Productos esta semana: ${productsThisWeek}`);

    console.log('\n3. Probando total de prompts...');
    const totalPrompts = await prisma.productPrompt.count({
      where: {
        product: { userId }
      }
    });
    console.log(`Total prompts: ${totalPrompts}`);

    console.log('\n4. Probando prompts esta semana...');
    const promptsThisWeek = await prisma.productPrompt.count({
      where: {
        product: { userId },
        created_at: {
          gte: startOfWeek,
          lte: endOfWeek
        }
      }
    });
    console.log(`Prompts esta semana: ${promptsThisWeek}`);

    console.log('\n5. Probando productos recientes...');
    const recentProducts = await prisma.product.findMany({
      where: { userId },
      include: {
        productPrompts: {
          include: {
                         prompt: {
               select: {
                 id: true,
                 title: true,
                 finalPrompt: true,
                 created_at: true
               }
             }
          },
          orderBy: { created_at: 'desc' }
        }
      },
      orderBy: { created_at: 'desc' },
      take: 10
    });
    console.log(`Productos recientes: ${recentProducts.length}`);

    console.log('\n6. Probando actividad reciente...');
    const recentActivity = await prisma.productPrompt.findMany({
      where: {
        product: { userId }
      },
      include: {
        product: {
          select: {
            id: true,
            name: true
          }
        },
                 prompt: {
           select: {
             id: true,
             title: true,
             finalPrompt: true
           }
         }
      },
      orderBy: { created_at: 'desc' },
      take: 5
    });
    console.log(`Actividad reciente: ${recentActivity.length}`);

    console.log('\n✅ Todas las consultas funcionaron correctamente');

  } catch (error) {
    console.error('\n❌ Error en consulta:', error);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testDashboard(); 