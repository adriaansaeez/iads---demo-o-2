const { prisma } = require('../db');
const bcrypt = require('bcrypt');

async function fixPasswords() {
  try {
    console.log('🔐 Verificando y corrigiendo contraseñas...');

    // Obtener todos los usuarios
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        password: true
      }
    });

    console.log(`📊 Encontrados ${users.length} usuarios`);

    // Contraseña de prueba para verificar
    const testPassword = '123456';
    
    for (const user of users) {
      console.log(`\n👤 Verificando usuario: ${user.username} (${user.email})`);
      
      try {
        // Intentar verificar la contraseña actual
        const isCurrentValid = await bcrypt.compare(testPassword, user.password);
        
        if (isCurrentValid) {
          console.log('✅ La contraseña ya está correctamente hasheada');
        } else {
          console.log('❌ La contraseña no es válida, regenerando...');
          
          // Hashear nueva contraseña
          const saltRounds = 12;
          const newHashedPassword = await bcrypt.hash(testPassword, saltRounds);
          
          // Actualizar en la base de datos
          await prisma.user.update({
            where: { id: user.id },
            data: { password: newHashedPassword }
          });
          
          // Verificar que funciona
          const isNewValid = await bcrypt.compare(testPassword, newHashedPassword);
          
          if (isNewValid) {
            console.log('✅ Contraseña actualizada correctamente');
          } else {
            console.log('❌ Error al actualizar la contraseña');
          }
        }
        
      } catch (error) {
        console.error(`❌ Error procesando usuario ${user.username}:`, error.message);
        
        // Intentar regenerar la contraseña
        console.log('🔧 Intentando regenerar contraseña...');
        const saltRounds = 12;
        const newHashedPassword = await bcrypt.hash(testPassword, saltRounds);
        
        await prisma.user.update({
          where: { id: user.id },
          data: { password: newHashedPassword }
        });
        
        console.log('✅ Contraseña regenerada');
      }
    }

    console.log('\n🎉 Proceso completado. Probando credenciales...');
    
    // Probar login con cada usuario
    for (const user of users) {
      const updatedUser = await prisma.user.findUnique({
        where: { id: user.id }
      });
      
      const isValid = await bcrypt.compare(testPassword, updatedUser.password);
      
      console.log(`${isValid ? '✅' : '❌'} ${user.email} / 123456 - ${isValid ? 'VÁLIDO' : 'INVÁLIDO'}`);
    }

    console.log('\n📋 Credenciales finales:');
    console.log('  - admin@speedAD.com / 123456');
    console.log('  - manager@speedAD.com / 123456');
    console.log('  - usuario1@test.com / 123456');

  } catch (error) {
    console.error('❌ Error general:', error);
    throw error;
  }
}

async function main() {
  try {
    await fixPasswords();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

module.exports = { fixPasswords }; 