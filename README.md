# Apex Product OS & Storefront 🚀

A modern, full-stack product application powered by MongoDB Atlas and Mongoose. It features both a high-performance **Customer Storefront** and a real-time **Inventory Control & Analytics Studio**.

---

## Key Highlights

- **Backend Architecture**:
  - Pure Node.js HTTP REST engine with MongoDB Atlas via Mongoose.
  - ACID transactional order processing and atomic inventory management.
  - Multi-faceted query filtering (search, categories, price range, ratings, in-stock status, sorting, pagination).
  - Business Intelligence analytics engine (catalog valuation, stock alerts, category breakdowns, revenue stats).
  - Automated test suite with 100% pass rate using `node:test`.

- **Frontend Architecture**:
  - Single-Page Application (SPA) styled with Tailwind CSS, Inter typography, and Lucide icons.
  - Dark / Light mode with persistent local storage.
  - Instant fuzzy search with keyboard shortcut (`/`).
  - Dynamic price slider and multi-criteria filters with one-click removable pills.
  - Interactive Product Details modal with multi-image gallery switcher, specs list, and verified customer review submission form.
  - Slide-out Cart Drawer with quantity steppers, promo coupon engine (`SAVE20`, `FREESHIP`, `TECH10`), and tax/shipping computation.
  - Simulated Checkout Modal with address and payment validation, producing generated order receipts.
  - Inventory Studio featuring KPI cards, category breakdown progress bars, inline stock adjustment counters (`+`/`-`), full CRUD modal forms, and CSV/JSON export.

---

## Quick Start

### 1. Run the Application
```bash
cd /Users/not_alive/.gemini/antigravity/scratch/apex-product-app
node server.js
```
Then visit **http://localhost:3000** in your browser.

### 2. Run the Automated Tests
```bash
npm test
```

### 3. Reset or Reseed Demo Catalog
```bash
npm run seed
```

### MongoDB Atlas and Render

The deployment configuration expects these environment variables:

- `MONGO_URI`: MongoDB Atlas connection string
- `MONGO_DB_NAME`: Atlas database name (defaults to `apex-product-app`)
- `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_TOKEN`: admin authentication secrets
- `AUTH_SECRET`: secret used to sign user session tokens

Copy `.env.example` to `.env` for local configuration. `.env` is ignored by Git. Add all five values as secrets/environment variables in Render.

Admin clients first call `POST /api/auth/login` with `{ "username": "...", "password": "..." }`, then send `Authorization: Bearer <ADMIN_TOKEN>` for catalog, stock, seed, and order-management operations.

Customers can create accounts with `POST /api/auth/signup` and sign in with `POST /api/auth/user-login`. The browser includes the returned session token automatically.

---

## Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>/</kbd> | Instantly focus the Search Bar |
| <kbd>C</kbd> | Toggle Shopping Cart Slide-out Drawer |
| <kbd>D</kbd> | Toggle Dark / Light Mode |
| <kbd>ESC</kbd> | Dismiss any open modal or drawer |

---

## REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service status, uptime, and version |
| `GET` | `/api/products` | Query products (`q`, `category`, `minPrice`, `maxPrice`, `rating`, `inStock`, `sort`, `page`, `limit`) |
| `GET` | `/api/products/:id` | Get single product with customer reviews and related items |
| `POST` | `/api/products` | Create a new product |
| `PUT` | `/api/products/:id` | Update an existing product |
| `DELETE` | `/api/products/:id` | Delete product |
| `PATCH` | `/api/products/:id/stock` | Atomically adjust inventory (`{ delta: 1 }` or `{ delta: -1 }`) |
| `POST` | `/api/products/:id/reviews` | Submit product review & auto-recompute rating score |
| `GET` | `/api/categories` | Categories list with item counts |
| `GET` | `/api/analytics` | Business intelligence overview and category breakdown |
| `POST` | `/api/checkout` | Process order, validate stock, atomically deduct inventory |
| `GET` | `/api/orders` | Order history log |
| `POST` | `/api/seed` | Reset database to original seed state |

---

## Demo Promo Codes

- **`SAVE20`**: $50 off any order over $150
- **`FREESHIP`**: Free express shipping
- **`TECH10`**: 10% off entire order
# web_dev_hw
# web_dev_hw
