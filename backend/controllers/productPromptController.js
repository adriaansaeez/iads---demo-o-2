const { prisma } = require('../db');

// Asignar prompt a producto
exports.assignPromptToProduct = async (req, res) => {
  try {
    const { productId, promptId } = req.body;

    if (!productId || !promptId) {
      return res.status(400).json({
        success: false,
        error: 'Product ID y Prompt ID son requeridos'
      });
    }

    // Verificar que el producto existe y pertenece al usuario
    const product = await prisma.product.findFirst({
      where: { 
        id: productId,
        userId: req.user.id
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado o no tienes permisos'
      });
    }

    // Verificar que el prompt existe
    const prompt = await prisma.prompt.findUnique({
      where: { id: promptId }
    });

    if (!prompt) {
      return res.status(404).json({
        success: false,
        error: 'Prompt no encontrado'
      });
    }

    // Crear la relación
    const productPrompt = await prisma.productPrompt.create({
      data: {
        productId,
        promptId
      },
      include: {
        product: { select: { id: true, name: true } },
        prompt: { select: { id: true, prompt: true, title: true } }
      }
    });

    res.status(201).json({
      success: true,
      data: productPrompt
    });

  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        error: 'Este prompt ya está asignado al producto'
      });
    }
    
    console.error('Error asignando prompt:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Obtener productos del usuario actual
exports.getUserProducts = async (req, res) => {
  try {
    let whereClause = { userId: req.user.id };
    
    if (req.user.role === 'ADMIN' || req.user.role === 'MANAGER') {
      whereClause = {};
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        user: {
          select: { id: true, username: true, email: true }
        },
        productPrompts: {
          include: {
            prompt: {
              select: { id: true, prompt: true, title: true, description: true }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    res.json({
      success: true,
      data: products
    });

  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
}; 