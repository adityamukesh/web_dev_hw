// adminView.js - Admin & Inventory Management Studio
const AdminViewComponent = {
  render(state, analytics) {
    const { products } = state;
    const overview = analytics?.overview || {
      totalProducts: 0,
      totalInventoryUnits: 0,
      totalInventoryValue: 0,
      averagePrice: 0,
      averageRating: 0,
      lowStockCount: 0,
      outOfStockCount: 0,
      totalOrders: 0,
      totalRevenue: 0
    };

    const categories = analytics?.categories || [];

    return `
      <div class="space-y-8 animate-fade-in">
        
        <!-- Header & Action Bar -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 pulse-dot"></span>
              <h2 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">Inventory & Operations Studio</h2>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Live analytics, stock controls, and catalog CRUD engine</p>
          </div>

          <div class="flex items-center flex-wrap gap-2">
            <button 
              id="admin-reset-demo-btn" 
              class="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              <span>Reset Catalog</span>
            </button>

            <button 
              id="admin-export-json-btn" 
              class="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              <span>Export JSON</span>
            </button>

            <button 
              id="admin-export-csv-btn" 
              class="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              <span>Export CSV</span>
            </button>

            <button 
              id="admin-add-product-btn" 
              class="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
              <span>Add Product</span>
            </button>
          </div>
        </div>

        <!-- KPI Metric Cards Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div class="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
              <span>Catalog Value</span>
              <div class="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
            </div>
            <div class="text-2xl font-black text-slate-900 dark:text-white">$${overview.totalInventoryValue.toLocaleString()}</div>
            <div class="text-[11px] text-slate-400 mt-1">${overview.totalInventoryUnits} total physical units</div>
          </div>

          <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div class="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
              <span>Active SKUs</span>
              <div class="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
              </div>
            </div>
            <div class="text-2xl font-black text-slate-900 dark:text-white">${overview.totalProducts}</div>
            <div class="text-[11px] text-slate-400 mt-1">Avg Price: $${overview.averagePrice.toFixed(2)}</div>
          </div>

          <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div class="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
              <span>Inventory Health</span>
              <div class="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </div>
            </div>
            <div class="text-2xl font-black text-amber-500">${overview.lowStockCount} Low / ${overview.outOfStockCount} Out</div>
            <div class="text-[11px] text-slate-400 mt-1">Requires restock attention</div>
          </div>

          <div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div class="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
              <span>Simulated Orders</span>
              <div class="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
            </div>
            <div class="text-2xl font-black text-slate-900 dark:text-white">${overview.totalOrders} Orders</div>
            <div class="text-[11px] text-emerald-500 font-semibold mt-1">+$${overview.totalRevenue.toFixed(2)} revenue generated</div>
          </div>

        </div>

        <!-- Category Distribution Progress Bars -->
        <div class="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
            <span>Category Distribution & Units</span>
            <span class="text-xs font-normal text-slate-400">${categories.length} verticals</span>
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            ${categories.map(cat => {
              const percent = overview.totalInventoryUnits > 0 ? Math.round((cat.stock / overview.totalInventoryUnits) * 100) : 0;
              return `
                <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800">
                  <div class="flex justify-between text-xs font-bold mb-1.5">
                    <span class="text-slate-800 dark:text-slate-200 truncate">${cat.category}</span>
                    <span class="text-indigo-600 dark:text-indigo-400">${percent}%</span>
                  </div>
                  <div class="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                    <div class="h-full bg-indigo-600 rounded-full" style="width: ${percent}%"></div>
                  </div>
                  <div class="flex justify-between text-[11px] text-slate-400">
                    <span>${cat.count} products</span>
                    <span>${cat.stock} in stock</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Product Inventory Management Table -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          
          <div class="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 class="text-base font-black text-slate-900 dark:text-white">Product Inventory Table</h3>
              <p class="text-xs text-slate-400">Directly adjust inventory levels with +/- buttons or modify specs</p>
            </div>

            <!-- Table Search Input -->
            <div class="w-full sm:w-64">
              <input 
                type="text" 
                id="admin-table-search" 
                placeholder="Filter table rows..." 
                class="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th class="p-4">Item & SKU</th>
                  <th class="p-4">Category</th>
                  <th class="p-4">Unit Price</th>
                  <th class="p-4 text-center">Stock Control</th>
                  <th class="p-4">Status</th>
                  <th class="p-4">Rating</th>
                  <th class="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80" id="admin-table-tbody">
                ${products.map(p => this.renderTableRow(p)).join('')}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    `;
  },

  renderTableRow(p) {
    const isOutOfStock = p.stock === 0;
    const isLowStock = p.stock > 0 && p.stock <= 5;

    return `
      <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors admin-table-row" data-search-text="${p.name.toLowerCase()} ${p.sku.toLowerCase()} ${p.category.toLowerCase()} ${p.brand.toLowerCase()}">
        
        <!-- Thumbnail & Name -->
        <td class="p-4">
          <div class="flex items-center gap-3">
            <img src="${p.image_url}" alt="${p.name}" class="w-10 h-10 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"/>
            <div class="min-w-0 max-w-[220px]">
              <div class="font-bold text-slate-900 dark:text-white truncate">${p.name}</div>
              <div class="text-[10px] font-mono text-slate-400">${p.sku} • ${p.brand}</div>
            </div>
          </div>
        </td>

        <!-- Category -->
        <td class="p-4">
          <span class="inline-block px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
            ${p.category}
          </span>
        </td>

        <!-- Price -->
        <td class="p-4 font-mono font-bold text-slate-900 dark:text-white">
          $${p.price.toFixed(2)}
        </td>

        <!-- Inline Stock Controller -->
        <td class="p-4">
          <div class="flex items-center justify-center gap-1.5">
            <button 
              data-admin-stock-delta="-1" 
              data-product-id="${p.id}" 
              class="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-black transition-colors"
              title="Decrease stock by 1"
            >
              -
            </button>
            <span class="w-12 text-center font-bold text-xs font-mono text-slate-900 dark:text-white">
              ${p.stock}
            </span>
            <button 
              data-admin-stock-delta="1" 
              data-product-id="${p.id}" 
              class="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-black transition-colors"
              title="Increase stock by 1"
            >
              +
            </button>
          </div>
        </td>

        <!-- Status Badge -->
        <td class="p-4">
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${isOutOfStock ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-400' : isLowStock ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400'}">
            <span class="w-1.5 h-1.5 rounded-full ${isOutOfStock ? 'bg-rose-500' : isLowStock ? 'bg-amber-500' : 'bg-emerald-500'}"></span>
            ${isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
          </span>
        </td>

        <!-- Rating -->
        <td class="p-4">
          <div class="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-semibold">
            <span class="text-amber-400">★</span>
            <span>${p.rating.toFixed(1)}</span>
            <span class="text-[10px] text-slate-400">(${p.reviews_count})</span>
          </div>
        </td>

        <!-- Actions -->
        <td class="p-4 text-right">
          <div class="flex items-center justify-end gap-2">
            <button 
              data-admin-edit="${p.id}" 
              title="Edit Product"
              class="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            </button>
            <button 
              data-admin-delete="${p.id}" 
              title="Delete Product"
              class="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </td>

      </tr>
    `;
  },

  renderProductFormModal(product = null) {
    const isEdit = !!product;

    return `
      <div id="product-form-modal-backdrop" class="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-8 animate-fade-in">
          
          <button id="close-form-modal-btn" class="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>

          <h2 class="text-xl font-black text-slate-900 dark:text-white mb-1">
            ${isEdit ? 'Edit Product' : 'Add New Product'}
          </h2>
          <p class="text-xs text-slate-400 mb-6">${isEdit ? `Updating product #${product.id}` : 'Fill in the details to publish a new product to your catalog.'}</p>

          <form id="product-crud-form" class="space-y-4">
            ${isEdit ? `<input type="hidden" id="form-product-id" value="${product.id}" />` : ''}

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Product Name *</label>
                <input type="text" id="form-name" required value="${isEdit ? product.name : ''}" placeholder="e.g. Apex Studio Earphones" class="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"/>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">SKU Code *</label>
                <input type="text" id="form-sku" required value="${isEdit ? product.sku : `SKU-${Date.now().toString().slice(-6)}`}" class="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"/>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Category *</label>
                <input type="text" id="form-category" required value="${isEdit ? product.category : 'Tech & Computing'}" placeholder="e.g. Workspace Essentials" class="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"/>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Brand</label>
                <input type="text" id="form-brand" value="${isEdit ? product.brand : 'Apex Gear'}" class="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"/>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Initial Stock Units *</label>
                <input type="number" id="form-stock" required min="0" value="${isEdit ? product.stock : 20}" class="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"/>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Sale Price ($) *</label>
                <input type="number" step="0.01" id="form-price" required value="${isEdit ? product.price : 149.99}" class="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"/>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Compare At Price ($)</label>
                <input type="number" step="0.01" id="form-compare-price" value="${isEdit && product.compare_at_price ? product.compare_at_price : ''}" placeholder="Original price before discount" class="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"/>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Primary Image URL</label>
              <input type="url" id="form-image" value="${isEdit ? product.image_url : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'}" class="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"/>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Description</label>
              <textarea id="form-description" rows="3" class="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100">${isEdit ? product.description : 'High-grade precision engineered hardware designed for everyday productivity.'}</textarea>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Search Tags (Comma-separated)</label>
              <input type="text" id="form-tags" value="${isEdit && pHasTags(product) ? product.tags.join(', ') : 'Wireless, Premium, New'}" class="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"/>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button type="button" id="cancel-form-modal-btn" class="px-5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900">Cancel</button>
              <button type="submit" id="save-product-btn" class="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20">
                ${isEdit ? 'Save Changes' : 'Publish Product'}
              </button>
            </div>

          </form>

        </div>
      </div>
    `;
  },

  exportToJson(products) {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `apex-catalog-export-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  exportToCsv(products) {
    if (!products.length) return;
    const headers = ['ID', 'Name', 'SKU', 'Category', 'Brand', 'Price', 'Stock', 'Rating', 'ReviewsCount'];
    const rows = products.map(p => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.sku,
      `"${p.category}"`,
      `"${p.brand}"`,
      p.price,
      p.stock,
      p.rating,
      p.reviews_count
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `apex-inventory-export-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};

function pHasTags(product) {
  return product && Array.isArray(product.tags) && product.tags.length > 0;
}

window.AdminViewComponent = AdminViewComponent;
