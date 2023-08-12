const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const productJSON = require('./json/product.json')
const featureJSON = require('./json/features.json')
const styleJSON = require('./json/styles.json')
const skuJSON = require('./json/skus.json')
const photoJSON = require('./json/photos.json')

const TABLE = {
  'product': { data: productJSON, dependencies: [] },
  'feature': { data: featureJSON, dependencies: ['product'] },// Add dependencies if needed
  'style': { data: styleJSON, dependencies: ['product'] },
  'sku': { data: skuJSON, dependencies: ['style'] },
  'photo': { data: photoJSON, dependencies: ['style'] }
};

const sortedTables = [];
const visited = new Set();

function visitTable(tableName) {
  if (visited.has(tableName)) return;
  visited.add(tableName);

  const table = TABLE[tableName];
  table.dependencies.forEach(dep => visitTable(dep));
  sortedTables.push(tableName);
}

for (const tableName in TABLE) {
  visitTable(tableName);
}

async function seedData(tableName, dataArray) {
  try {
    for (const data of dataArray) {
      await prisma[tableName].create({
        data
      });
    }
    console.log(`Seeding ${tableName} data successful.`);
  } catch (error) {
    console.error(`Error seeding ${tableName} data:`, error);
  } finally {
    console.log(`Disconnecting from the database...`);
    await prisma.$disconnect();
  }
}

async function seedAllTables() {
  for (const tableName of sortedTables) {
    const { data } = TABLE[tableName];
    await seedData(tableName, data);
  }
}

/*
  The seeding may take awhile. Ranges from 30s - 2min.
*/
seedAllTables();