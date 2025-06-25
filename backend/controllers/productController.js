const { prisma } = require('../db');

// Obtener todos los productos
exports.getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        },
        productPrompts: {
          include: {
            prompt: {
              select: {
                id: true,
                prompt: true,
                title: true,
                description: true
              }
            }
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
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

// Obtener producto por ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Crear nuevo producto
exports.createProduct = async (req, res) => {
  try {
    const { name, desc, website, producto_study } = req.body;

    // Validación básica
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'El nombre del producto es requerido'
      });
    }

    // Crear el producto asignado al usuario actual
    const product = await prisma.product.create({
      data: {
        name,
        desc: desc || null,
        website: website || null,
        producto_study: producto_study || null,
        userId: req.user.id // Asignar al usuario autenticado
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error creando producto:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Actualizar producto
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, desc, website, producto_study } = req.body;

    // Verificar si el producto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }

    // Preparar datos para actualizar
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (desc !== undefined) updateData.desc = desc;
    if (website !== undefined) updateData.website = website;
    if (producto_study !== undefined) updateData.producto_study = producto_study;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Eliminar producto
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el producto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }

    await prisma.product.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Producto eliminado correctamente'
    });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
}; 