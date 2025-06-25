const { prisma } = require('../db');
const bcrypt = require('bcrypt');

async function debugPasswords() {
  try {
    console.log('🔍 Diagnosticando contraseñas específicamente...\n');

    // Obtener usuarios problemáticos
    const users = await prisma.user.findMany({
      where: {
        email: {
          in: ['admin@speedAD.com', 'manager@speedAD.com', 'usuario1@test.com']
        }
      },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        isActive: true,
        role: true
      }
    });

    for (const user of users) {
      console.log(`\n👤 Usuario: ${user.username} (${user.email})`);
      console.log(`   Rol: ${user.role}`);
      console.log(`   Activo: ${user.isActive}`);
      console.log(`   Hash almacenado: ${user.password.substring(0, 20)}...`);
      console.log(`   Longitud del hash: ${user.password.length}`);
      
      // Verificar si es un hash válido de bcrypt
      const isBcryptHash = user.password.startsWith('$2b$') || user.password.startsWith('$2a$');
      console.log(`   Es hash bcrypt válido: ${isBcryptHash}`);
      
      if (isBcryptHash) {
        // Extraer el salt rounds
        const saltRounds = user.password.split('$')[2];
        console.log(`   Salt rounds: ${saltRounds}`);
      }
      
      // Probar con la contraseña de prueba
      try {
        const isValid = await bcrypt.compare('123456', user.password);
        console.log(`   ✅ Verificación con '123456': ${isValid ? 'VÁLIDA' : 'INVÁLIDA'}`);
        
        if (!isValid) {
          console.log('   🔧 Regenerando contraseña...');
          
          // Regenerar hash
          const newHash = await bcrypt.hash('123456', 12);
          
          await prisma.user.update({
            where: { id: user.id },
            data: { password: newHash }
          });
          
          // Verificar nueva contraseña
          const newCheck = await bcrypt.compare('123456', newHash);
          console.log(`   ✅ Nueva verificación: ${newCheck ? 'VÁLIDA' : 'INVÁLIDA'}`);
        }
        
      } catch (error) {
        console.log(`   ❌ Error verificando contraseña: ${error.message}`);
        
        // Forzar regeneración
        console.log('   🔧 Forzando regeneración...');
        const newHash = await bcrypt.hash('123456', 12);
        
        await prisma.user.update({
          where: { id: user.id },
          data: { password: newHash }
        });
        
        console.log('   ✅ Contraseña regenerada');
      }
    }

    console.log('\n🧪 Verificación final...');
    
    // Verificación final de todos los usuarios
    const updatedUsers = await prisma.user.findMany({
      where: {
        email: {
          in: ['admin@speedAD.com', 'manager@speedAD.com', 'usuario1@test.com']
        }
      }
    });

    for (const user of updatedUsers) {
      const isValid = await bcrypt.compare('123456', user.password);
      console.log(`${isValid ? '✅' : '❌'} ${user.email} → ${isValid ? 'VÁLIDA' : 'INVÁLIDA'}`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

async function main() {
  try {
    await debugPasswords();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

module.exports = { debugPasswords }; 