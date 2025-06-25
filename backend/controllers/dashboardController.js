const { prisma } = require('../db');

// Obtener estadísticas del dashboard del usuario
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    
    // Fecha de inicio de la semana (lunes)
    const startOfWeek = new Date(now);
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    // Fecha de fin de la semana
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Consultas en paralelo para optimizar rendimiento
    const [
      totalProducts,
      productsThisWeek,
      totalPrompts,
      promptsThisWeek,
      recentProducts,
      recentActivity
    ] = await Promise.all([
      // Total de productos del usuario
      prisma.product.count({
        where: { userId }
      }),

      // Productos creados esta semana
      prisma.product.count({
        where: {
          userId,
          created_at: {
            gte: startOfWeek,
            lte: endOfWeek
          }
        }
      }),

      // Total de prompts/anuncios (relaciones product-prompt del usuario)
      prisma.productPrompt.count({
        where: {
          product: { userId }
        }
      }),

      // Prompts/anuncios creados esta semana
      prisma.productPrompt.count({
        where: {
          product: { userId },
          created_at: {
            gte: startOfWeek,
            lte: endOfWeek
          }
        }
      }),

      // Últimos productos del usuario (para el listado)
      prisma.product.findMany({
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
      }),

      // Actividad reciente (últimos prompts creados)
      prisma.productPrompt.findMany({
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
      })
    ]);

    // Calcular estadísticas adicionales
    const stats = {
      products: {
        total: totalProducts,
        thisWeek: productsThisWeek,
        growth: totalProducts > 0 ? ((productsThisWeek / Math.max(totalProducts - productsThisWeek, 1)) * 100).toFixed(1) : 0
      },
      prompts: {
        total: totalPrompts,
        thisWeek: promptsThisWeek,
        growth: totalPrompts > 0 ? ((promptsThisWeek / Math.max(totalPrompts - promptsThisWeek, 1)) * 100).toFixed(1) : 0
      },
      productivity: {
        averagePromptsPerProduct: totalProducts > 0 ? (totalPrompts / totalProducts).toFixed(1) : 0,
        weeklyAverage: (promptsThisWeek / 7).toFixed(1)
      }
    };

    res.json({
      success: true,
      data: {
        stats,
        recentProducts,
        recentActivity,
        user: {
          id: req.user.id,
          username: req.user.username,
          email: req.user.email,
          role: req.user.role
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas del dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Obtener productos del usuario para el selector
exports.getUserProductsForSelector = async (req, res) => {
  try {
    const userId = req.user.id;

    const products = await prisma.product.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        desc: true,
        website: true,
        created_at: true,
        productPrompts: {
          select: {
            id: true,
            created_at: true,
            prompt: {
              select: {
                id: true,
                title: true
              }
            }
          },
          orderBy: { created_at: 'desc' }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    res.json({
      success: true,
      data: products
    });

  } catch (error) {
    console.error('Error obteniendo productos para selector:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
}; 