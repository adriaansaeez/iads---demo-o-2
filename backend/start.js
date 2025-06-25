const fs = require('fs');
const path = require('path');

// Verificar que existe el archivo .env
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  No se encontró archivo .env');
  console.log('📝 Creando archivo .env de ejemplo...');
  
  const envExample = `OPENAI_API_KEY=tu-clave-openai-aqui
PORT=3005
NODE_ENV=development`;
  
  fs.writeFileSync(envPath, envExample);
  
  console.log('✅ Archivo .env creado');
  console.log('🔑 Por favor, agrega tu clave de OpenAI en el archivo .env');
  console.log('💡 Obtén tu clave en: https://platform.openai.com/api-keys');
  process.exit(0);
}

// Cargar variables de entorno
require('dotenv').config();

// Verificar clave de OpenAI
if (!process.env.OPENAI_API_KEY) {
  console.log('❌ OPENAI_API_KEY no está configurada en .env');
  console.log('🔑 Agrega tu clave de OpenAI en el archivo .env');
  console.log('💡 Obtén tu clave en: https://platform.openai.com/api-keys');
  process.exit(1);
}

if (!process.env.OPENAI_API_KEY.startsWith('sk-')) {
  console.log('❌ OPENAI_API_KEY no tiene el formato correcto');
  console.log('🔑 La clave debe comenzar con "sk-"');
  process.exit(1);
}

console.log('✅ Configuración validada');
console.log('🚀 Iniciando servidor...');

// Iniciar el servidor
require('./server'); 