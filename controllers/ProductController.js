const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ProductRequest {
  constructor() { }

  async getAllProducts() {
    const getAllItems = await prisma.product.findMany();
    return getAllItems;
  }

  async getProductById(id) {
    const productFeatures = await prisma.product.findUnique({
      where: {
        id: id
      },
      include: {
        features: {
          select: {
            feature: true,
            value: true
          }
        }
      }
    });
    return productFeatures;
  }

  async getProductPhotos(productId) {
    const getPhotos = await prisma.photo.findMany({
      where: {
        styleId: productId,
      },
      select: {
        url: true,
        thumbnail_url: true
      }
    });
    return getPhotos.length ? getPhotos : [{ thumbnail_url: null, url: null }];
  }

  async getProductSkus(productId) {
    const productSkus = await prisma.sku.findMany({
      where: {
        styleId: productId
      }
    });

    const skusMap = {};
    productSkus.forEach(sku => {
      skusMap[sku.id] = {
        quantity: sku.quantity,
        size: sku.size
      };
    });

    if (Object.keys(skusMap).length === 0) {
      return { "null": { quantity: null, size: null } };
    } else {
      return skusMap;
    }
  }

  async getProductStyles(productId) {
    const productStyles = await prisma.style.findMany({
      where: {
        productId: productId
      }
    });

    const result = {
      product_id: productId,
      results: await Promise.all(productStyles.map(async style => ({
        style_id: style.id,
        name: style.name,
        original_price: style.original_price.toFixed(2),
        sale_price: style.sale_price === '' ? null : style.sale_price,
        default: style.default_style === 1,
        photos: await this.getProductPhotos(style.id),
        skus: await this.getProductSkus(style.id)
      })))
    };
    return result;
  }
}

module.exports = ProductRequest
