const { prisma } = require('../db');

// Obtener todos los prompts con filtros
const getPrompts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status,
      productId,
      userId,
      search,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    // Construir filtros
    const where = {};
    
    if (status) {
      where.generationStatus = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { targetAudience: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Filtro por producto (solo si el usuario es owner)
    if (productId) {
      where.productPrompts = {
        some: {
          productId: productId,
          product: req.user.role === 'ADMIN' ? {} : { userId: req.user.id }
        }
      };
    }

    // Solo admin puede ver todos los prompts
    if (req.user.role !== 'ADMIN') {
      where.productPrompts = {
        some: {
          product: { userId: req.user.id }
        }
      };
    }

    const [prompts, total] = await Promise.all([
      prisma.prompt.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: sortOrder },
        include: {
          productPrompts: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  userId: true,
                  user: {
                    select: { id: true, username: true, email: true }
                  }
                }
              }
            }
          }
        }
      }),
      prisma.prompt.count({ where })
    ]);

    res.json({
      prompts,
      pagination: {
        page: parseInt(page),
        limit: take,
        total,
        pages: Math.ceil(total / take)
      }
    });

  } catch (error) {
    console.error('Error obteniendo prompts:', error);
    res.status(500).json({
      error: 'Error al obtener los prompts',
      message: error.message
    });
  }
};

// Obtener un prompt específico
const getPromptById = async (req, res) => {
  try {
    const { id } = req.params;

    const prompt = await prisma.prompt.findUnique({
      where: { id },
      include: {
        productPrompts: {
          include: {
            product: {
              include: {
                user: {
                  select: { id: true, username: true, email: true }
                }
              }
            }
          }
        }
      }
    });

    if (!prompt) {
      return res.status(404).json({ error: 'Prompt no encontrado' });
    }

    // Verificar permisos (solo owner o admin)
    const hasAccess = req.user.role === 'ADMIN' || 
      prompt.productPrompts.some(pp => pp.product.userId === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ error: 'No tienes permisos para ver este prompt' });
    }

    res.json(prompt);

  } catch (error) {
    console.error('Error obteniendo prompt:', error);
    res.status(500).json({
      error: 'Error al obtener el prompt',
      message: error.message
    });
  }
};

// Obtener prompts de un usuario específico
const getUserPrompts = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;

    // Solo admin puede ver prompts de otros usuarios
    if (userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'No tienes permisos para ver estos prompts' });
    }

    const prompts = await prisma.prompt.findMany({
      where: {
        productPrompts: {
          some: {
            product: { userId }
          }
        }
      },
      include: {
        productPrompts: {
          include: {
            product: {
              select: { id: true, name: true, desc: true }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    res.json(prompts);

  } catch (error) {
    console.error('Error obteniendo prompts del usuario:', error);
    res.status(500).json({
      error: 'Error al obtener los prompts del usuario',
      message: error.message
    });
  }
};

// Obtener prompts de un producto específico
const getProductPrompts = async (req, res) => {
  try {
    const { productId } = req.params;

    // Verificar que el producto existe y el usuario tiene acceso
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        ...(req.user.role === 'ADMIN' ? {} : { userId: req.user.id })
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado o sin permisos' });
    }

    const prompts = await prisma.prompt.findMany({
      where: {
        productPrompts: {
          some: { productId }
        }
      },
      include: {
        productPrompts: {
          where: { productId },
          select: { created_at: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    res.json(prompts);

  } catch (error) {
    console.error('Error obteniendo prompts del producto:', error);
    res.status(500).json({
      error: 'Error al obtener los prompts del producto',
      message: error.message
    });
  }
};

// Eliminar un prompt
const deletePrompt = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el prompt existe
    const prompt = await prisma.prompt.findUnique({
      where: { id },
      include: {
        productPrompts: {
          include: {
            product: true
          }
        }
      }
    });

    if (!prompt) {
      return res.status(404).json({ error: 'Prompt no encontrado' });
    }

    // Verificar permisos (solo owner o admin)
    const hasAccess = req.user.role === 'ADMIN' || 
      prompt.productPrompts.some(pp => pp.product.userId === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ error: 'No tienes permisos para eliminar este prompt' });
    }

    // Eliminar relaciones y prompt
    await prisma.$transaction([
      prisma.productPrompt.deleteMany({
        where: { promptId: id }
      }),
      prisma.prompt.delete({
        where: { id }
      })
    ]);

    res.json({ message: 'Prompt eliminado exitosamente' });

  } catch (error) {
    console.error('Error eliminando prompt:', error);
    res.status(500).json({
      error: 'Error al eliminar el prompt',
      message: error.message
    });
  }
};

// Actualizar un prompt (solo campos editables)
const updatePrompt = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    // Verificar que el prompt existe
    const prompt = await prisma.prompt.findUnique({
      where: { id },
      include: {
        productPrompts: {
          include: {
            product: true
          }
        }
      }
    });

    if (!prompt) {
      return res.status(404).json({ error: 'Prompt no encontrado' });
    }

    // Verificar permisos (solo owner o admin)
    const hasAccess = req.user.role === 'ADMIN' || 
      prompt.productPrompts.some(pp => pp.product.userId === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ error: 'No tienes permisos para editar este prompt' });
    }

    const updatedPrompt = await prisma.prompt.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description })
      },
      include: {
        productPrompts: {
          include: {
            product: {
              select: { id: true, name: true, userId: true }
            }
          }
        }
      }
    });

    res.json(updatedPrompt);

  } catch (error) {
    console.error('Error actualizando prompt:', error);
    res.status(500).json({
      error: 'Error al actualizar el prompt',
      message: error.message
    });
  }
};

// Obtener estadísticas de prompts
const getPromptStats = async (req, res) => {
  try {
    const userId = req.user.role === 'ADMIN' ? undefined : req.user.id;

    const where = userId ? {
      productPrompts: {
        some: {
          product: { userId }
        }
      }
    } : {};

    const [total, completed, failed, generating, thisWeek] = await Promise.all([
      prisma.prompt.count({ where }),
      prisma.prompt.count({ where: { ...where, generationStatus: 'completed' } }),
      prisma.prompt.count({ where: { ...where, generationStatus: 'failed' } }),
      prisma.prompt.count({ where: { ...where, generationStatus: 'generating' } }),
      prisma.prompt.count({ 
        where: { 
          ...where, 
          created_at: { 
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 
          } 
        } 
      })
    ]);

    const avgProcessingTime = await prisma.prompt.aggregate({
      where: { 
        ...where, 
        generationStatus: 'completed',
        processingTime: { not: null }
      },
      _avg: { processingTime: true }
    });

    res.json({
      total,
      completed,
      failed,
      generating,
      thisWeek,
      avgProcessingTime: Math.round(avgProcessingTime._avg.processingTime || 0)
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      error: 'Error al obtener estadísticas',
      message: error.message
    });
  }
};

module.exports = {
  getPrompts,
  getPromptById,
  getUserPrompts,
  getProductPrompts,
  deletePrompt,
  updatePrompt,
  getPromptStats
}; 