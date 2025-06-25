const { PrismaClient } = require('../generated/prisma');

async function checkUsers() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Verificando usuarios en la base de datos...');
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        created_at: true
      }
    });
    
    console.log(`\nTotal usuarios encontrados: ${users.length}`);
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. Usuario:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Creado: ${user.created_at}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers(); 

async function checkUsers() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Verificando usuarios en la base de datos...');
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        created_at: true
      }
    });
    
    console.log(`\nTotal usuarios encontrados: ${users.length}`);
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. Usuario:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Creado: ${user.created_at}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers(); 