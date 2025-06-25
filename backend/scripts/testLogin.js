const axios = require('axios');

async function testLogin() {
  const API_URL = 'http://localhost:3005';
  
  const testCredentials = [
    { email: 'admin@speedAD.com', password: '123456' },
    { email: 'manager@speedAD.com', password: '123456' },
    { email: 'usuario1@test.com', password: '123456' }
  ];

  console.log('🧪 Probando login con las credenciales...\n');

  for (const credentials of testCredentials) {
    try {
      console.log(`📧 Probando: ${credentials.email} / ${credentials.password}`);
      
      const response = await axios.post(`${API_URL}/api/auth/login`, credentials, {
        headers: {
          'Content-Type': 'application/json'
        },
        validateStatus: function (status) {
          return status < 500; // Permite 400-499 para ver el error
        }
      });

      if (response.status === 200) {
        console.log(`✅ LOGIN EXITOSO:`);
        console.log(`   Usuario: ${response.data.data.user.username}`);
        console.log(`   Rol: ${response.data.data.user.role}`);
        console.log(`   Token recibido: ${response.data.data.token ? 'SÍ' : 'NO'}`);
      } else {
        console.log(`❌ LOGIN FALLIDO (${response.status}):`);
        console.log(`   Error: ${response.data.error || 'Error desconocido'}`);
      }
      
    } catch (error) {
      console.log(`💥 ERROR DE CONEXIÓN:`);
      if (error.code === 'ECONNREFUSED') {
        console.log(`   El servidor no está ejecutándose en ${API_URL}`);
      } else {
        console.log(`   ${error.message}`);
      }
    }
    
    console.log(''); // Línea en blanco
  }
}

async function main() {
  try {
    await testLogin();
  } catch (error) {
    console.error('Error general:', error);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

module.exports = { testLogin }; 