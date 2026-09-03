// api.js - Frontend API Client
const API = {
  baseUrl: '/api',

  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      };

      const config = {
        ...options,
        headers
      };

      if (options.body && typeof options.body === 'object') {
        config.body = JSON.stringify(options.body);
      }

      const response = await fetch(url, config);
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMsg = data?.message || `Request failed with status ${response.status}`;
        throw new Error(errorMsg);
      }

      return data;
    } catch (err) {
      console.error(`API Error on [${options.method || 'GET'}] ${endpoint}:`, err);
      throw err;
    }
  },

  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return this.request(`/products${queryString}`);
  },

  async getProduct(id) {
    return this.request(`/products/${id}`);
  },

  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: productData
    });
  },

  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: productData
    });
  },

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE'
    });
  },

  async adjustStock(id, delta) {
    return this.request(`/products/${id}/stock`, {
      method: 'PATCH',
      body: { delta }
    });
  },

  async addReview(productId, reviewData) {
    return this.request(`/products/${productId}/reviews`, {
      method: 'POST',
      body: reviewData
    });
  },

  // Categories & Analytics
  async getCategories() {
    return this.request('/categories');
  },

  async getAnalytics() {
    return this.request('/analytics');
  },

  // Checkout & Orders
  async checkout(orderPayload) {
    return this.request('/checkout', {
      method: 'POST',
      body: orderPayload
    });
  },

  async getOrders() {
    return this.request('/orders');
  },

  // Reset database demo
  async resetDemo() {
    return this.request('/seed', {
      method: 'POST'
    });
  }
};

window.API = API;
