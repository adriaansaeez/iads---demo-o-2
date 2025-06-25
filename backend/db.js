const { PrismaClient } = require('./generated/prisma');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Función para conectar a la base de datos
async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos PostgreSQL');
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
    process.exit(1);
  }
}

// Función para desconectar de la base de datos
async function disconnectDatabase() {
  await prisma.$disconnect();
  console.log('🔌 Desconectado de la base de datos');
}

module.exports = {
  prisma,
  connectDatabase,
  disconnectDatabase
}; 