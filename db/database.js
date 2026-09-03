// db/database.js - SQLite Database Manager powered by native node:sqlite
const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');
const { seedProducts, seedReviews } = require('./seed.js');

const DB_PATH = path.join(__dirname, 'products.db');

let dbInstance = null;

function getDb() {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(DB_PATH);
    dbInstance.exec('PRAGMA journal_mode = WAL;');
    dbInstance.exec('PRAGMA foreign_keys = ON;');
    initTables(dbInstance);
  }
  return dbInstance;
}

function initTables(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      sku TEXT NOT NULL UNIQUE,
      category TEXT NOT NULL,
      brand TEXT NOT NULL,
      price REAL NOT NULL,
      compare_at_price REAL,
      stock INTEGER NOT NULL DEFAULT 0,
      rating REAL NOT NULL DEFAULT 5.0,
      reviews_count INTEGER NOT NULL DEFAULT 0,
      description TEXT NOT NULL,
      image_url TEXT NOT NULL,
      secondary_images TEXT DEFAULT '[]',
      features TEXT DEFAULT '[]',
      tags TEXT DEFAULT '[]',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      user_name TEXT NOT NULL,
      user_avatar TEXT,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      title TEXT NOT NULL,
      comment TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      shipping_address TEXT NOT NULL,
      subtotal REAL NOT NULL,
      discount REAL NOT NULL DEFAULT 0,
      shipping REAL NOT NULL DEFAULT 0,
      tax REAL NOT NULL DEFAULT 0,
      total REAL NOT NULL,
      promo_code TEXT,
      status TEXT NOT NULL DEFAULT 'confirmed',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      product_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
    CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);
    CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
    CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
  `);

  // Check if products table is empty, if so, seed it
  const countRow = db.prepare('SELECT COUNT(*) as count FROM products').get();
  if (countRow.count === 0) {
    seedDatabase(db);
  }
}

function seedDatabase(db) {
  const insertProduct = db.prepare(`
    INSERT INTO products (
      name, sku, category, brand, price, compare_at_price, stock,
      rating, reviews_count, description, image_url, secondary_images,
      features, tags, created_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `);

  const insertReview = db.prepare(`
    INSERT INTO reviews (
      product_id, user_name, user_avatar, rating, title, comment, created_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?
    )
  `);

  for (const p of seedProducts) {
    insertProduct.run(
      p.name,
      p.sku,
      p.category,
      p.brand,
      p.price,
      p.compare_at_price,
      p.stock,
      p.rating,
      p.reviews_count,
      p.description,
      p.image_url,
      p.secondary_images,
      p.features,
      p.tags,
      p.created_at
    );
  }

  for (const r of seedReviews) {
    insertReview.run(
      r.product_id,
      r.user_name,
      r.user_avatar,
      r.rating,
      r.title,
      r.comment,
      r.created_at
    );
  }
}

function resetDatabase() {
  const db = getDb();
  db.exec('PRAGMA foreign_keys = OFF;');
  db.exec('DELETE FROM order_items;');
  db.exec('DELETE FROM orders;');
  db.exec('DELETE FROM reviews;');
  db.exec('DELETE FROM products;');
  db.exec('DELETE FROM sqlite_sequence;');
  db.exec('PRAGMA foreign_keys = ON;');
  seedDatabase(db);
  return { success: true, message: 'Database reseeded successfully.' };
}

// ----------------- Product Operations -----------------

function getProducts({
  q = '',
  category = '',
  brand = '',
  minPrice = 0,
  maxPrice = 1000000,
  rating = 0,
  inStock = false,
  sort = 'featured',
  page = 1,
  limit = 24
} = {}) {
  const db = getDb();
  const conditions = [];
  const params = [];

  if (q && q.trim()) {
    conditions.push('(name LIKE ? OR description LIKE ? OR brand LIKE ? OR tags LIKE ?)');
    const searchTerm = `%${q.trim()}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }

  if (category && category.trim()) {
    conditions.push('category = ?');
    params.push(category.trim());
  }

  if (brand && brand.trim()) {
    conditions.push('brand = ?');
    params.push(brand.trim());
  }

  if (Number(minPrice) > 0) {
    conditions.push('price >= ?');
    params.push(Number(minPrice));
  }

  if (Number(maxPrice) < 1000000) {
    conditions.push('price <= ?');
    params.push(Number(maxPrice));
  }

  if (Number(rating) > 0) {
    conditions.push('rating >= ?');
    params.push(Number(rating));
  }

  if (inStock === true || inStock === 'true' || inStock === '1') {
    conditions.push('stock > 0');
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Sorting
  let orderByClause = 'ORDER BY id DESC';
  switch (sort) {
    case 'price-low':
      orderByClause = 'ORDER BY price ASC';
      break;
    case 'price-high':
      orderByClause = 'ORDER BY price DESC';
      break;
    case 'rating':
      orderByClause = 'ORDER BY rating DESC, reviews_count DESC';
      break;
    case 'reviews':
      orderByClause = 'ORDER BY reviews_count DESC';
      break;
    case 'name-asc':
      orderByClause = 'ORDER BY name ASC';
      break;
    case 'featured':
    default:
      orderByClause = 'ORDER BY rating DESC, id ASC';
      break;
  }

  // Count total matching items
  const countSql = `SELECT COUNT(*) as total FROM products ${whereClause}`;
  const countRow = db.prepare(countSql).get(...params);
  const total = countRow.total;

  // Pagination
  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.max(1, Math.min(100, parseInt(limit, 10) || 24));
  const offset = (parsedPage - 1) * parsedLimit;

  const dataSql = `SELECT * FROM products ${whereClause} ${orderByClause} LIMIT ? OFFSET ?`;
  const products = db.prepare(dataSql).all(...params, parsedLimit, offset);

  // Parse JSON fields
  const formattedProducts = products.map(p => ({
    ...p,
    secondary_images: safeJsonParse(p.secondary_images, []),
    features: safeJsonParse(p.features, []),
    tags: safeJsonParse(p.tags, [])
  }));

  return {
    products: formattedProducts,
    pagination: {
      total,
      page: parsedPage,
      limit: parsedLimit,
      totalPages: Math.ceil(total / parsedLimit)
    }
  };
}

function getProductById(id) {
  const db = getDb();
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  if (!product) return null;

  const reviews = db.prepare('SELECT * FROM reviews WHERE product_id = ? ORDER BY id DESC').all(id);
  
  // Find related products in same category
  const related = db.prepare('SELECT id, name, price, rating, image_url, category FROM products WHERE category = ? AND id != ? LIMIT 4')
    .all(product.category, id);

  return {
    ...product,
    secondary_images: safeJsonParse(product.secondary_images, []),
    features: safeJsonParse(product.features, []),
    tags: safeJsonParse(product.tags, []),
    reviews,
    related
  };
}

function createProduct(data) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO products (
      name, sku, category, brand, price, compare_at_price, stock,
      rating, reviews_count, description, image_url, secondary_images,
      features, tags, created_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `);

  const now = new Date().toISOString();
  const secondaryImages = Array.isArray(data.secondary_images) ? JSON.stringify(data.secondary_images) : (data.secondary_images || '[]');
  const features = Array.isArray(data.features) ? JSON.stringify(data.features) : (data.features || '[]');
  const tags = Array.isArray(data.tags) ? JSON.stringify(data.tags) : (data.tags || '[]');

  const result = stmt.run(
    data.name,
    data.sku || `SKU-${Date.now().toString().slice(-6)}`,
    data.category || 'General',
    data.brand || 'Apex',
    Number(data.price) || 0,
    data.compare_at_price ? Number(data.compare_at_price) : null,
    Number(data.stock) || 0,
    Number(data.rating) || 5.0,
    0,
    data.description || '',
    data.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    secondaryImages,
    features,
    tags,
    now
  );

  return getProductById(Number(result.lastInsertRowid));
}

function updateProduct(id, data) {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  if (!existing) return null;

  const secondaryImages = data.secondary_images !== undefined
    ? (Array.isArray(data.secondary_images) ? JSON.stringify(data.secondary_images) : data.secondary_images)
    : existing.secondary_images;

  const features = data.features !== undefined
    ? (Array.isArray(data.features) ? JSON.stringify(data.features) : data.features)
    : existing.features;

  const tags = data.tags !== undefined
    ? (Array.isArray(data.tags) ? JSON.stringify(data.tags) : data.tags)
    : existing.tags;

  const stmt = db.prepare(`
    UPDATE products SET
      name = ?,
      sku = ?,
      category = ?,
      brand = ?,
      price = ?,
      compare_at_price = ?,
      stock = ?,
      description = ?,
      image_url = ?,
      secondary_images = ?,
      features = ?,
      tags = ?
    WHERE id = ?
  `);

  stmt.run(
    data.name !== undefined ? data.name : existing.name,
    data.sku !== undefined ? data.sku : existing.sku,
    data.category !== undefined ? data.category : existing.category,
    data.brand !== undefined ? data.brand : existing.brand,
    data.price !== undefined ? Number(data.price) : existing.price,
    data.compare_at_price !== undefined ? (data.compare_at_price ? Number(data.compare_at_price) : null) : existing.compare_at_price,
    data.stock !== undefined ? Number(data.stock) : existing.stock,
    data.description !== undefined ? data.description : existing.description,
    data.image_url !== undefined ? data.image_url : existing.image_url,
    secondaryImages,
    features,
    tags,
    id
  );

  return getProductById(id);
}

function deleteProduct(id) {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(id);
  if (!existing) return false;

  db.prepare('DELETE FROM products WHERE id = ?').run(id);
  return true;
}

function adjustStock(id, delta) {
  const db = getDb();
  const product = db.prepare('SELECT stock FROM products WHERE id = ?').get(id);
  if (!product) return null;

  const newStock = Math.max(0, product.stock + delta);
  db.prepare('UPDATE products SET stock = ? WHERE id = ?').run(newStock, id);
  return { id, stock: newStock };
}

function addReview(productId, { user_name, user_avatar, rating, title, comment }) {
  const db = getDb();
  const product = db.prepare('SELECT id FROM products WHERE id = ?').get(productId);
  if (!product) return null;

  const parsedRating = Math.max(1, Math.min(5, parseInt(rating, 10) || 5));
  const now = new Date().toISOString();

  const insertStmt = db.prepare(`
    INSERT INTO reviews (product_id, user_name, user_avatar, rating, title, comment, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertStmt.run(
    productId,
    user_name || 'Verified Customer',
    user_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    parsedRating,
    title || 'Product Feedback',
    comment || '',
    now
  );

  // Recalculate average rating and review count
  const stats = db.prepare(`
    SELECT COUNT(*) as count, AVG(rating) as avg_rating
    FROM reviews
    WHERE product_id = ?
  `).get(productId);

  const roundedRating = stats.count > 0 ? Math.round(stats.avg_rating * 10) / 10 : 5.0;

  db.prepare('UPDATE products SET rating = ?, reviews_count = ? WHERE id = ?')
    .run(roundedRating, stats.count, productId);

  return getProductById(productId);
}

// ----------------- Categories & Analytics -----------------

function getCategories() {
  const db = getDb();
  const rows = db.prepare(`
    SELECT category as name, COUNT(*) as count
    FROM products
    GROUP BY category
    ORDER BY count DESC
  `).all();
  return rows;
}

function getAnalytics() {
  const db = getDb();

  const productStats = db.prepare(`
    SELECT
      COUNT(*) as totalProducts,
      COALESCE(SUM(stock), 0) as totalInventoryUnits,
      COALESCE(SUM(price * stock), 0) as totalInventoryValue,
      COALESCE(AVG(price), 0) as averagePrice,
      COALESCE(AVG(rating), 0) as averageRating
    FROM products
  `).get();

  const lowStockCount = db.prepare('SELECT COUNT(*) as count FROM products WHERE stock > 0 AND stock <= 5').get().count;
  const outOfStockCount = db.prepare('SELECT COUNT(*) as count FROM products WHERE stock = 0').get().count;

  const categoryBreakdown = db.prepare(`
    SELECT
      category,
      COUNT(*) as count,
      SUM(stock) as stock,
      ROUND(AVG(price), 2) as avgPrice
    FROM products
    GROUP BY category
    ORDER BY count DESC
  `).all();

  const orderStats = db.prepare(`
    SELECT
      COUNT(*) as totalOrders,
      COALESCE(SUM(total), 0) as totalRevenue
    FROM orders
  `).get();

  return {
    overview: {
      totalProducts: productStats.totalProducts,
      totalInventoryUnits: productStats.totalInventoryUnits,
      totalInventoryValue: Math.round(productStats.totalInventoryValue * 100) / 100,
      averagePrice: Math.round(productStats.averagePrice * 100) / 100,
      averageRating: Math.round(productStats.averageRating * 10) / 10,
      lowStockCount,
      outOfStockCount,
      totalOrders: orderStats.totalOrders,
      totalRevenue: Math.round(orderStats.totalRevenue * 100) / 100
    },
    categories: categoryBreakdown
  };
}

// ----------------- Checkout & Orders -----------------

function createOrder({ customer_name, customer_email, shipping_address, items, promo_code, discount = 0 }) {
  const db = getDb();

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error('Order must contain at least one item');
  }

  // Validate stock for all items
  for (const item of items) {
    const product = db.prepare('SELECT id, name, price, stock FROM products WHERE id = ?').get(item.id);
    if (!product) {
      throw new Error(`Product with ID ${item.id} not found.`);
    }
    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${item.quantity}.`);
    }
  }

  const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
  const now = new Date().toISOString();

  let subtotal = 0;
  for (const item of items) {
    const p = db.prepare('SELECT price FROM products WHERE id = ?').get(item.id);
    subtotal += p.price * item.quantity;
  }

  const discountAmount = Number(discount) || 0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = Math.round(taxableAmount * 0.08 * 100) / 100; // 8% sales tax
  const shipping = subtotal > 150 ? 0 : 15.00; // Free shipping over $150
  const total = Math.max(0, Math.round((subtotal - discountAmount + tax + shipping) * 100) / 100);

  // Begin transaction: insert order, insert items, decrement stock
  db.exec('BEGIN TRANSACTION;');
  try {
    db.prepare(`
      INSERT INTO orders (
        id, customer_name, customer_email, shipping_address,
        subtotal, discount, shipping, tax, total, promo_code, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      orderId,
      customer_name || 'Guest Shopper',
      customer_email || 'shopper@example.com',
      shipping_address || '123 Innovation Way, San Francisco, CA',
      Math.round(subtotal * 100) / 100,
      discountAmount,
      shipping,
      tax,
      total,
      promo_code || null,
      'confirmed',
      now
    );

    const insertItemStmt = db.prepare(`
      INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
      VALUES (?, ?, ?, ?, ?)
    `);

    const decrementStockStmt = db.prepare(`
      UPDATE products SET stock = stock - ? WHERE id = ?
    `);

    for (const item of items) {
      const p = db.prepare('SELECT name, price FROM products WHERE id = ?').get(item.id);
      insertItemStmt.run(orderId, item.id, p.name, item.quantity, p.price);
      decrementStockStmt.run(item.quantity, item.id);
    }

    db.exec('COMMIT;');

    return {
      orderId,
      status: 'confirmed',
      customer: {
        name: customer_name,
        email: customer_email,
        address: shipping_address
      },
      breakdown: {
        subtotal: Math.round(subtotal * 100) / 100,
        discount: discountAmount,
        shipping,
        tax,
        total
      },
      items,
      createdAt: now
    };
  } catch (err) {
    db.exec('ROLLBACK;');
    throw err;
  }
}

function getOrders() {
  const db = getDb();
  const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 50').all();
  return orders.map(order => {
    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
    return {
      ...order,
      items
    };
  });
}

function safeJsonParse(val, fallback) {
  if (!val) return fallback;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

module.exports = {
  getDb,
  resetDatabase,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustStock,
  addReview,
  getCategories,
  getAnalytics,
  createOrder,
  getOrders
};
