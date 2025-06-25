const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes en orden correcto
  await prisma.productPrompt.deleteMany();
  await prisma.prompt.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Datos existentes limpiados');

  // Crear usuarios de prueba
  const hashedPassword = await bcrypt.hash('123456', 12);
  
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@speedAD.com',
      password: hashedPassword,
      role: 'ADMIN',
    }
  });

  const manager = await prisma.user.create({
    data: {
      username: 'manager',
      email: 'manager@speedAD.com',
      password: hashedPassword,
      role: 'MANAGER',
    }
  });

  const usuario1 = await prisma.user.create({
    data: {
      username: 'usuario1',
      email: 'usuario1@test.com',
      password: hashedPassword,
      role: 'USER',
    }
  });

  console.log('👥 Usuarios creados:', { admin: admin.id, manager: manager.id, usuario1: usuario1.id });

  // Crear productos de prueba asociados a usuarios
  const producto1 = await prisma.product.create({
    data: {
      name: 'iPhone 15 Pro',
      desc: 'El smartphone más avanzado de Apple con chip A17 Pro, cámara profesional y diseño titanio',
      website: 'https://apple.com',
      producto_study: 'Estudio de mercado realizado en Q4 2023',
      userId: admin.id
    }
  });

  const producto2 = await prisma.product.create({
    data: {
      name: 'Tesla Model 3',
      desc: 'Vehículo eléctrico premium con autonomía extendida y tecnología autopilot',
      website: 'https://tesla.com',
      producto_study: 'Análisis de competencia en mercado EV',
      userId: manager.id
    }
  });

  const producto3 = await prisma.product.create({
    data: {
      name: 'Nike Air Jordan',
      desc: 'Zapatillas deportivas icónicas para basketball con tecnología Air y diseño retro',
      website: 'https://nike.com',
      producto_study: 'Investigación de tendencias deportivas 2024',
      userId: usuario1.id
    }
  });

  const producto4 = await prisma.product.create({
    data: {
      name: 'MacBook Pro M3',
      desc: 'Laptop profesional con chip M3, pantalla Liquid Retina XDR y hasta 22h de batería',
      website: 'https://apple.com/macbook-pro',
      producto_study: 'Análisis de mercado de laptops profesionales',
      userId: usuario1.id
    }
  });

  console.log('📦 Productos creados:', [producto1.id, producto2.id, producto3.id, producto4.id]);

  // Crear prompts de prueba con nuevo schema
  const prompt1 = await prisma.prompt.create({
    data: {
      title: 'Anuncio iPhone 15 Pro - Campaña de Lanzamiento',
      description: 'Campaña publicitaria para el lanzamiento del iPhone 15 Pro dirigida a profesionales creativos',
      finalPrompt: 'Crea un anuncio persuasivo para redes sociales que destaque la cámara profesional del iPhone 15 Pro y su diseño en titanio',
      targetAudience: 'Profesionales creativos, fotógrafos, content creators',
      adStyle: 'Moderno y premium',
      colorScheme: 'Azul titanio y blanco',
      typography: 'Minimalista',
      imageSize: '1024x1024',
      generationStatus: 'completed',
      processingTime: 15420,
      brandAnalysis: {
        brand: 'Apple',
        values: ['Innovación', 'Calidad premium', 'Diseño'],
        target: 'Profesionales y entusiastas de tecnología',
        positioning: 'Líder en innovación tecnológica'
      },
      creativePrompts: {
        concepts: ['Profesionalidad', 'Innovación', 'Calidad premium'],
        emotions: ['Aspiración', 'Confianza', 'Exclusividad'],
        visualStyle: 'Clean, moderno, premium'
      },
      originalFormData: {
        productName: 'iPhone 15 Pro',
        website: 'https://apple.com',
        description: 'El smartphone más avanzado de Apple',
        targetAudience: 'Profesionales creativos',
        adStyle: 'Moderno y premium'
      }
    }
  });

  const prompt2 = await prisma.prompt.create({
    data: {
      title: 'Anuncio Tesla Model 3 - Sostenibilidad',
      description: 'Campaña enfocada en la sostenibilidad y tecnología del Tesla Model 3',
      finalPrompt: 'Genera un copy publicitario que conecte emocionalmente con conductores conscientes del medio ambiente destacando la tecnología Tesla',
      targetAudience: 'Conductores eco-conscientes, tech enthusiasts',
      adStyle: 'Futurista y sostenible',
      colorScheme: 'Blanco y azul eléctrico',
      typography: 'Moderna',
      imageSize: '1024x1024',
      generationStatus: 'completed',
      processingTime: 18750,
      brandAnalysis: {
        brand: 'Tesla',
        values: ['Sostenibilidad', 'Innovación', 'Futuro'],
        target: 'Conductores conscientes del medio ambiente',
        positioning: 'Líder en movilidad eléctrica'
      },
      creativePrompts: {
        concepts: ['Sostenibilidad', 'Tecnología', 'Futuro'],
        emotions: ['Responsabilidad', 'Progreso', 'Innovación'],
        visualStyle: 'Futurista, limpio, tecnológico'
      }
    }
  });

  const prompt3 = await prisma.prompt.create({
    data: {
      title: 'Anuncio Nike Air Jordan - Basketball Culture',
      description: 'Campaña que celebra la cultura del basketball y el legado Jordan',
      finalPrompt: 'Desarrolla un mensaje publicitario que capture la esencia del basketball y el legado Michael Jordan',
      targetAudience: 'Atletas, fanáticos del basketball, coleccionistas',
      adStyle: 'Deportivo y dinámico',
      colorScheme: 'Rojo, negro y blanco',
      typography: 'Bold y deportiva',
      imageSize: '1024x1024',
      generationStatus: 'failed',
      errorMessage: 'Error: Contenido relacionado con marca registrada detectado',
      processingTime: 5200,
      originalFormData: {
        productName: 'Nike Air Jordan',
        description: 'Zapatillas icónicas de basketball',
        adStyle: 'Deportivo y dinámico'
      }
    }
  });

  const prompt4 = await prisma.prompt.create({
    data: {
      title: 'Anuncio MacBook Pro M3 - Productividad',
      description: 'Campaña dirigida a profesionales que buscan máximo rendimiento',
      finalPrompt: 'Crea un anuncio que destaque el rendimiento del chip M3 y la productividad para profesionales',
      targetAudience: 'Desarrolladores, diseñadores, video editores',
      adStyle: 'Profesional y elegante',
      colorScheme: 'Gris espacial y dorado',
      typography: 'Profesional',
      imageSize: '1024x1024',
      generationStatus: 'generating',
      processingTime: null
    }
  });

  console.log('📝 Prompts creados:', [prompt1.id, prompt2.id, prompt3.id, prompt4.id]);

  // Crear relaciones producto-prompt
  await prisma.productPrompt.create({
    data: {
      productId: producto1.id,
      promptId: prompt1.id
    }
  });

  await prisma.productPrompt.create({
    data: {
      productId: producto2.id,
      promptId: prompt2.id
    }
  });

  await prisma.productPrompt.create({
    data: {
      productId: producto3.id,
      promptId: prompt3.id
    }
  });

  await prisma.productPrompt.create({
    data: {
      productId: producto4.id,
      promptId: prompt4.id
    }
  });

  console.log('🔗 Relaciones producto-prompt creadas');

  console.log(`
✅ Seed completado exitosamente:
  - 3 usuarios creados (admin, manager, usuario1)
  - 4 productos creados con propietarios asignados
  - 4 prompts creados con diferentes estados
  - 4 relaciones producto-prompt establecidas

🔐 Credenciales de acceso:
  - admin@speedAD.com / 123456 (ADMIN)
  - manager@speedAD.com / 123456 (MANAGER)  
  - usuario1@test.com / 123456 (USER)
  `);
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 