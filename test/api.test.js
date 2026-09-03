// test/api.test.js - Comprehensive in-memory test suite for Apex Product OS
const test = require('node:test');
const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const { Readable } = require('node:stream');
const { handleRequest } = require('../server.js');
const db = require('../db/database.js');

test.beforeEach(async () => {
  await db.resetDatabase();
});

test.after(() => db.closeDatabase());

// In-memory HTTP request harness (bypasses loopback networking restrictions)
function testRequest(pathname, { method = 'GET', body = null } = {}) {
  return new Promise((resolve, reject) => {
    const req = new Readable({
      read() {}
    });
    req.url = pathname;
    req.method = method;
    req.headers = {
      'content-type': 'application/json',
      authorization: `Bearer ${process.env.ADMIN_TOKEN}`
    };

    if (body !== null) {
      req.push(JSON.stringify(body));
    }
    req.push(null);

    const headers = {};
    let statusCode = 200;
    let chunks = [];

    const res = new EventEmitter();
    res.writeHead = (code, hdrs = {}) => {
      statusCode = code;
      for (const [k, v] of Object.entries(hdrs)) {
        headers[k.toLowerCase()] = v;
      }
    };
    res.setHeader = (k, v) => {
      headers[k.toLowerCase()] = v;
    };
    res.write = (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    };
    res.end = (chunk) => {
      if (chunk) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      const rawBody = Buffer.concat(chunks).toString('utf-8');
      let data = null;
      try {
        data = JSON.parse(rawBody);
      } catch {
        data = rawBody;
      }
      resolve({ status: statusCode, headers, data });
    };

    handleRequest(req, res).catch(reject);
  });
}

test('GET /api/health returns 200 and healthy status', async () => {
  const res = await testRequest('/api/health');
  assert.equal(res.status, 200);
  assert.equal(res.data.status, 'ok');
  assert.equal(res.data.version, '1.0.0');
});

test('GET /api/products returns paginated list of products', async () => {
  const res = await testRequest('/api/products');
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.data.products));
  assert.ok(res.data.products.length > 0);
  assert.ok(res.data.pagination.total >= 16);
});

test('GET /api/products filters by category', async () => {
  const res = await testRequest('/api/products?category=Audio+%26+Acoustics');
  assert.equal(res.status, 200);
  assert.ok(res.data.products.length > 0);
  for (const product of res.data.products) {
    assert.equal(product.category, 'Audio & Acoustics');
  }
});

test('GET /api/products filters by price range', async () => {
  const min = 200;
  const max = 500;
  const res = await testRequest(`/api/products?minPrice=${min}&maxPrice=${max}`);
  assert.equal(res.status, 200);
  assert.ok(res.data.products.length > 0);
  for (const product of res.data.products) {
    assert.ok(product.price >= min && product.price <= max, `Price ${product.price} out of range`);
  }
});

test('GET /api/products search query matches title, description, or tags', async () => {
  const res = await testRequest('/api/products?q=Titanium');
  assert.equal(res.status, 200);
  assert.ok(res.data.products.length > 0);
  const matched = res.data.products.some(p =>
    p.name.includes('Titanium') || p.description.includes('Titanium') || p.tags.includes('Titanium')
  );
  assert.ok(matched);
});

test('GET /api/products/:id returns detailed product with reviews & related items', async () => {
  const res = await testRequest('/api/products/1');
  assert.equal(res.status, 200);
  assert.equal(res.data.id, 1);
  assert.ok(Array.isArray(res.data.reviews));
  assert.ok(Array.isArray(res.data.related));
});

test('POST, PUT, PATCH and DELETE Product lifecycle', async () => {
  // 1. Create
  const newProductPayload = {
    name: 'Neural Interface Headband',
    sku: `TEC-NI-${Date.now()}`,
    category: 'Tech & Computing',
    brand: 'NeuroSynapse',
    price: 399.99,
    compare_at_price: 450.00,
    stock: 25,
    description: 'EEG sensor array with real-time focus tracking.',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    features: ['8 Dry EEG channels', 'Low latency Bluetooth 5.4'],
    tags: ['EEG', 'Neurotech', 'Wireless']
  };

  const createRes = await testRequest('/api/products', { method: 'POST', body: newProductPayload });
  assert.equal(createRes.status, 201);
  const createdId = createRes.data.id;
  assert.ok(createdId);
  assert.equal(createRes.data.name, newProductPayload.name);

  // 2. Update
  const updateRes = await testRequest(`/api/products/${createdId}`, {
    method: 'PUT',
    body: { price: 349.99, brand: 'NeuroSynapse Labs' }
  });
  assert.equal(updateRes.status, 200);
  assert.equal(updateRes.data.price, 349.99);
  assert.equal(updateRes.data.brand, 'NeuroSynapse Labs');

  // 3. Adjust Stock
  const stockRes = await testRequest(`/api/products/${createdId}/stock`, {
    method: 'PATCH',
    body: { delta: -5 }
  });
  assert.equal(stockRes.status, 200);
  assert.equal(stockRes.data.stock, 20);

  // 4. Add Review
  const reviewRes = await testRequest(`/api/products/${createdId}/reviews`, {
    method: 'POST',
    body: {
      user_name: 'Alex Mercer',
      rating: 5,
      title: 'Mind blown',
      comment: 'Incredible precision and very comfortable.'
    }
  });
  assert.equal(reviewRes.status, 201);
  assert.equal(reviewRes.data.reviews_count, 1);
  assert.equal(reviewRes.data.rating, 5);

  // 5. Delete
  const deleteRes = await testRequest(`/api/products/${createdId}`, { method: 'DELETE' });
  assert.equal(deleteRes.status, 200);

  // Verify deletion
  const getDeleted = await testRequest(`/api/products/${createdId}`);
  assert.equal(getDeleted.status, 404);
});

test('POST /api/checkout successfully validates and deducts stock', async () => {
  // Check product 2 stock
  const p2Before = await testRequest('/api/products/2');
  const initialStock = p2Before.data.stock;
  assert.ok(initialStock >= 2);

  const checkoutPayload = {
    customer_name: 'Jordan Belfort',
    customer_email: 'jordan@wallstreet.com',
    shipping_address: '40 Wall St, New York, NY 10005',
    promo_code: 'SAVE20',
    discount: 50.00,
    items: [
      { id: 2, quantity: 2 }
    ]
  };

  const checkoutRes = await testRequest('/api/checkout', {
    method: 'POST',
    body: checkoutPayload
  });

  assert.equal(checkoutRes.status, 201);
  assert.ok(checkoutRes.data.order.orderId);
  assert.equal(checkoutRes.data.order.status, 'confirmed');

  // Verify stock decremented
  const p2After = await testRequest('/api/products/2');
  assert.equal(p2After.data.stock, initialStock - 2);
});

test('POST /api/checkout fails when requesting more stock than available', async () => {
  const checkoutPayload = {
    customer_name: 'Overbuyer',
    customer_email: 'over@test.com',
    shipping_address: '123 Fake Street',
    items: [
      { id: 2, quantity: 99999 } // Exceeds available stock
    ]
  };

  const checkoutRes = await testRequest('/api/checkout', {
    method: 'POST',
    body: checkoutPayload
  });

  assert.equal(checkoutRes.status, 400);
  assert.ok(checkoutRes.data.message.includes('Insufficient stock'));
});

test('GET /api/analytics returns accurate metrics', async () => {
  const res = await testRequest('/api/analytics');
  assert.equal(res.status, 200);
  assert.ok(res.data.overview.totalProducts > 0);
  assert.ok(res.data.overview.totalInventoryValue > 0);
  assert.ok(Array.isArray(res.data.categories));
});

test('GET / serves index.html with valid HTML content', async () => {
  const res = await testRequest('/');
  assert.equal(res.status, 200);
  assert.equal(res.headers['content-type'], 'text/html; charset=utf-8');
  assert.ok(typeof res.data === 'string' && res.data.includes('Apex Product OS'));
});

test('GET /css/styles.css serves CSS stylesheet', async () => {
  const res = await testRequest('/css/styles.css');
  assert.equal(res.status, 200);
  assert.equal(res.headers['content-type'], 'text/css; charset=utf-8');
  assert.ok(typeof res.data === 'string' && res.data.includes('glass-panel'));
});

test('GET /js/app.js serves frontend application script', async () => {
  const res = await testRequest('/js/app.js');
  assert.equal(res.status, 200);
  assert.equal(res.headers['content-type'], 'application/javascript; charset=utf-8');
  assert.ok(typeof res.data === 'string' && res.data.includes('STORAGE_KEYS'));
});
