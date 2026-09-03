// server.js - High-Performance REST API & Static Server for Apex Product App
require('dotenv').config();

const http = require('node:http');
const url = require('node:url');
const path = require('node:path');
const fs = require('node:fs');
const db = require('./db/database.js');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

function sendJson(res, statusCode, data) {
  const payload = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Length': Buffer.byteLength(payload)
  });
  res.end(payload);
}

function sendError(res, statusCode, message, details = null) {
  sendJson(res, statusCode, {
    error: true,
    message,
    details,
    timestamp: new Date().toISOString()
  });
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 5 * 1024 * 1024) { // 5MB limit
        reject(new Error('Request body too large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON payload: ' + err.message));
      }
    });
    req.on('error', reject);
  });
}

async function handleRequest(req, res) {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    });
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const query = Object.fromEntries(parsedUrl.searchParams.entries());
  const method = req.method;

  try {
    // -------------------------------------------------------------
    // API ROUTES (/api/*)
    // -------------------------------------------------------------
    if (pathname.startsWith('/api/')) {
      // GET /api/health
      if (pathname === '/api/health' && method === 'GET') {
        return sendJson(res, 200, {
          status: 'ok',
          uptime: process.uptime(),
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        });
      }

      // GET /api/categories
      if (pathname === '/api/categories' && method === 'GET') {
        const categories = db.getCategories();
        return sendJson(res, 200, { categories });
      }

      // GET /api/analytics
      if (pathname === '/api/analytics' && method === 'GET') {
        const analytics = db.getAnalytics();
        return sendJson(res, 200, analytics);
      }

      // POST /api/seed (Reset & reseed DB)
      if (pathname === '/api/seed' && method === 'POST') {
        const result = db.resetDatabase();
        return sendJson(res, 200, result);
      }

      // POST /api/checkout
      if (pathname === '/api/checkout' && method === 'POST') {
        const body = await parseJsonBody(req);
        try {
          const order = db.createOrder(body);
          return sendJson(res, 201, {
            success: true,
            order
          });
        } catch (err) {
          return sendError(res, 400, err.message);
        }
      }

      // GET /api/orders
      if (pathname === '/api/orders' && method === 'GET') {
        const orders = db.getOrders();
        return sendJson(res, 200, { orders });
      }

      // Product Specific Routes: /api/products/:id/...
      const productMatch = pathname.match(/^\/api\/products(?:\/(\d+))?(?:\/([a-z]+))?$/);
      if (productMatch) {
        const productId = productMatch[1] ? parseInt(productMatch[1], 10) : null;
        const subAction = productMatch[2] || null;

        // 1. GET /api/products (List with search/filter/pagination)
        if (!productId && !subAction && method === 'GET') {
          const result = db.getProducts({
            q: query.q,
            category: query.category,
            brand: query.brand,
            minPrice: query.minPrice,
            maxPrice: query.maxPrice,
            rating: query.rating,
            inStock: query.inStock,
            sort: query.sort,
            page: query.page,
            limit: query.limit
          });
          return sendJson(res, 200, result);
        }

        // 2. POST /api/products (Create new product)
        if (!productId && !subAction && method === 'POST') {
          const body = await parseJsonBody(req);
          if (!body.name || !body.name.trim()) {
            return sendError(res, 400, 'Product name is required.');
          }
          if (body.price === undefined || isNaN(Number(body.price)) || Number(body.price) < 0) {
            return sendError(res, 400, 'Valid product price is required.');
          }
          const newProduct = db.createProduct(body);
          return sendJson(res, 201, newProduct);
        }

        // 3. GET /api/products/:id
        if (productId && !subAction && method === 'GET') {
          const product = db.getProductById(productId);
          if (!product) return sendError(res, 404, `Product #${productId} not found.`);
          return sendJson(res, 200, product);
        }

        // 4. PUT /api/products/:id (Update product)
        if (productId && !subAction && method === 'PUT') {
          const body = await parseJsonBody(req);
          const updated = db.updateProduct(productId, body);
          if (!updated) return sendError(res, 404, `Product #${productId} not found.`);
          return sendJson(res, 200, updated);
        }

        // 5. DELETE /api/products/:id
        if (productId && !subAction && method === 'DELETE') {
          const success = db.deleteProduct(productId);
          if (!success) return sendError(res, 404, `Product #${productId} not found.`);
          return sendJson(res, 200, { success: true, message: `Product #${productId} deleted.` });
        }

        // 6. PATCH /api/products/:id/stock (Quick inventory change)
        if (productId && subAction === 'stock' && method === 'PATCH') {
          const body = await parseJsonBody(req);
          const delta = parseInt(body.delta, 10);
          if (isNaN(delta)) return sendError(res, 400, 'Invalid delta amount for stock adjustment.');
          const result = db.adjustStock(productId, delta);
          if (!result) return sendError(res, 404, `Product #${productId} not found.`);
          return sendJson(res, 200, result);
        }

        // 7. POST /api/products/:id/reviews (Add customer review)
        if (productId && subAction === 'reviews' && method === 'POST') {
          const body = await parseJsonBody(req);
          if (!body.rating || body.rating < 1 || body.rating > 5) {
            return sendError(res, 400, 'Rating must be an integer between 1 and 5.');
          }
          if (!body.comment || !body.comment.trim()) {
            return sendError(res, 400, 'Review comment is required.');
          }
          const updatedProduct = db.addReview(productId, body);
          if (!updatedProduct) return sendError(res, 404, `Product #${productId} not found.`);
          return sendJson(res, 201, updatedProduct);
        }
      }

      return sendError(res, 404, `API endpoint not found: ${method} ${pathname}`);
    }

    // -------------------------------------------------------------
    // STATIC ASSETS & SPA FALLBACK
    // -------------------------------------------------------------
    let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
    if (safePath === '/' || safePath === '') {
      safePath = '/index.html';
    }

    let filePath = path.join(PUBLIC_DIR, safePath);

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        // SPA Fallback: serve index.html for non-asset browser navigation
        filePath = path.join(PUBLIC_DIR, 'index.html');
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      fs.readFile(filePath, (readErr, content) => {
        if (readErr) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          return res.end('500 Internal Server Error');
        }

        res.writeHead(200, {
          'Content-Type': contentType,
          'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(content);
      });
    });

  } catch (err) {
    console.error('Unhandled server error:', err);
    sendError(res, 500, 'Internal Server Error', err.message);
  }
}

const server = http.createServer(handleRequest);

if (require.main === module) {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`🚀 Apex Product OS & Storefront active at:`);
    console.log(`👉 http://localhost:${PORT}`);
    console.log(`👉 API Health: http://localhost:${PORT}/api/health`);
    console.log(`👉 Database: SQLite via node:sqlite`);
    console.log(`=======================================================`);
  });
}

module.exports = { server, handleRequest };
