// app.js - Apex Product OS Central Application Controller
(function () {
  const STORAGE_KEYS = {
    CART: 'apex_cart_v1',
    WISHLIST: 'apex_wishlist_v1',
    THEME: 'apex_theme_v1'
  };

  const state = {
    view: 'storefront', // 'storefront' | 'admin'
    viewMode: 'grid',    // 'grid' | 'list'
    products: [],
    categories: [],
    pagination: { total: 0, page: 1, limit: 24, totalPages: 1 },
    filters: {
      q: '',
      category: '',
      brand: '',
      minPrice: 0,
      maxPrice: 1000,
      rating: 0,
      inStock: false,
      sort: 'featured',
      page: 1
    },
    cart: loadFromStorage(STORAGE_KEYS.CART, []),
    wishlist: loadFromStorage(STORAGE_KEYS.WISHLIST, []),
    analytics: null,
    isCartOpen: false,
    activeModal: null, // 'detail' | 'checkout' | 'receipt' | 'crud'
    currentDetailProduct: null,
    currentOrderReceipt: null,
    user: loadFromStorage('apex_user', null)
  };

  function loadFromStorage(key, fallback) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  }

  function saveToStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }

  // Initial Theme Setup
  function initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem(STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
    renderNavbar();
  }

  // API Data Loaders
  async function fetchCatalog() {
    try {
      const data = await window.API.getProducts(state.filters);
      state.products = data.products;
      state.pagination = data.pagination;
      renderMain();
    } catch (err) {
      window.toast.error('Failed to load products: ' + err.message);
    }
  }

  async function fetchCategories() {
    try {
      const data = await window.API.getCategories();
      state.categories = data.categories;
      renderSidebar();
    } catch (err) {
      console.error('Categories error:', err);
    }
  }

  async function fetchAnalytics() {
    try {
      state.analytics = await window.API.getAnalytics();
      if (state.view === 'admin') {
        renderAdmin();
      }
    } catch (err) {
      console.error('Analytics error:', err);
    }
  }

  // Cart Operations
  function addToCart(product, quantity = 1) {
    if (product.stock <= 0) {
      window.toast.warning(`"${product.name}" is currently out of stock`);
      return;
    }

    const existingIndex = state.cart.findIndex(i => i.id === product.id);
    if (existingIndex > -1) {
      const newQty = state.cart[existingIndex].quantity + quantity;
      if (newQty > product.stock) {
        window.toast.warning(`Maximum available stock reached (${product.stock})`);
        state.cart[existingIndex].quantity = product.stock;
      } else {
        state.cart[existingIndex].quantity = newQty;
        window.toast.success(`Updated "${product.name}" quantity to ${newQty}`);
      }
    } else {
      state.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        stock: product.stock,
        quantity: Math.min(quantity, product.stock)
      });
      window.toast.success(`Added "${product.name}" to cart`);
    }

    saveToStorage(STORAGE_KEYS.CART, state.cart);
    renderNavbar();
    renderCart();
  }

  function updateCartQuantity(productId, delta) {
    const item = state.cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      state.cart = state.cart.filter(i => i.id !== productId);
      window.toast.info(`Removed "${item.name}" from cart`);
    } else if (item.quantity > item.stock) {
      item.quantity = item.stock;
      window.toast.warning(`Max available quantity reached (${item.stock})`);
    }

    saveToStorage(STORAGE_KEYS.CART, state.cart);
    renderNavbar();
    renderCart();
  }

  function removeFromCart(productId) {
    const item = state.cart.find(i => i.id === productId);
    state.cart = state.cart.filter(i => i.id !== productId);
    if (item) window.toast.info(`Removed "${item.name}" from cart`);
    saveToStorage(STORAGE_KEYS.CART, state.cart);
    renderNavbar();
    renderCart();
  }

  // Wishlist Operations
  function toggleWishlist(productId) {
    const idx = state.wishlist.indexOf(productId);
    const product = state.products.find(p => p.id === productId);
    const title = product ? product.name : 'Item';

    if (idx > -1) {
      state.wishlist.splice(idx, 1);
      window.toast.info(`Removed from wishlist: ${title}`);
    } else {
      state.wishlist.push(productId);
      window.toast.success(`Saved to wishlist: ${title}`);
    }

    saveToStorage(STORAGE_KEYS.WISHLIST, state.wishlist);
    renderNavbar();
    renderMain();
  }

  // Renderers
  function renderNavbar() {
    const navEl = document.getElementById('navbar-container');
    if (navEl) {
      navEl.innerHTML = window.NavbarComponent.render(state);
      bindNavbarEvents();
    }
  }

  function renderSidebar() {
    const sideEl = document.getElementById('sidebar-container');
    if (sideEl && state.view === 'storefront') {
      sideEl.innerHTML = window.FiltersComponent.renderSidebar(state);
      bindSidebarEvents();
    }
  }

  function renderToolbar() {
    const toolEl = document.getElementById('toolbar-container');
    if (toolEl && state.view === 'storefront') {
      toolEl.innerHTML = window.FiltersComponent.renderToolbar(state);
      bindToolbarEvents();
    }
  }

  function renderProducts() {
    const prodEl = document.getElementById('products-grid');
    if (!prodEl) return;

    if (state.products.length === 0) {
      prodEl.className = 'w-full';
      prodEl.innerHTML = `
        <div class="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div class="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
          <h3 class="text-base font-bold text-slate-800 dark:text-slate-200">No products match your criteria</h3>
          <p class="text-xs text-slate-400 max-w-sm mx-auto">Try clearing one or more active filters, resetting the price range, or searching for broader terms.</p>
          <button id="empty-reset-btn" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md">
            Reset All Filters
          </button>
        </div>
      `;
      const emptyReset = document.getElementById('empty-reset-btn');
      if (emptyReset) emptyReset.addEventListener('click', resetFilters);
      return;
    }

    if (state.viewMode === 'grid') {
      prodEl.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6';
      prodEl.innerHTML = state.products.map(p => window.ProductCardComponent.renderGrid(p, state)).join('');
    } else {
      prodEl.className = 'space-y-4';
      prodEl.innerHTML = state.products.map(p => window.ProductCardComponent.renderList(p, state)).join('');
    }

    bindProductCardEvents();
  }

  function renderMain() {
    if (state.view === 'storefront') {
      document.getElementById('storefront-view').classList.remove('hidden');
      document.getElementById('admin-view').classList.add('hidden');
      renderSidebar();
      renderToolbar();
      renderProducts();
    } else {
      document.getElementById('storefront-view').classList.add('hidden');
      document.getElementById('admin-view').classList.remove('hidden');
      renderAdmin();
    }
  }

  function renderCart() {
    const cartContainer = document.getElementById('cart-drawer-container');
    if (cartContainer) {
      cartContainer.innerHTML = window.CartDrawerComponent.renderDrawer(state.cart, state.isCartOpen);
      bindCartEvents();
    }
  }

  function renderAdmin() {
    const adminEl = document.getElementById('admin-view');
    if (adminEl) {
      adminEl.innerHTML = window.AdminViewComponent.render(state, state.analytics);
      bindAdminEvents();
    }
  }

  // Event Bindings
  function bindNavbarEvents() {
    const authBtn = document.getElementById('nav-auth-btn');
    if (authBtn) authBtn.addEventListener('click', () => state.user ? logout() : openAuthModal());

    // Brand home
    const homeBtn = document.getElementById('brand-home-btn');
    if (homeBtn) {
      homeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        state.view = 'storefront';
        resetFilters();
      });
    }

    // View tabs
    const tabStorefront = document.getElementById('tab-storefront-btn');
    const tabAdmin = document.getElementById('tab-admin-btn');

    if (tabStorefront) {
      tabStorefront.addEventListener('click', () => {
        state.view = 'storefront';
        renderNavbar();
        renderMain();
      });
    }

    if (tabAdmin) {
      tabAdmin.addEventListener('click', () => {
        state.view = 'admin';
        renderNavbar();
        fetchAnalytics();
        renderMain();
      });
    }

    // Theme toggle
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    // Search inputs
    const searchInputs = [document.getElementById('nav-search-input'), document.getElementById('mobile-search-input')];
    searchInputs.forEach(input => {
      if (!input) return;
      let debounceTimeout;
      input.addEventListener('input', (e) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          state.filters.q = e.target.value;
          state.filters.page = 1;
          fetchCatalog();
        }, 300);
      });
    });

    // Wishlist Trigger
    const wishBtn = document.getElementById('nav-wishlist-btn');
    if (wishBtn) {
      wishBtn.addEventListener('click', () => {
        if (state.wishlist.length === 0) {
          window.toast.info('Your wishlist is empty. Click the heart icon on any product to save it.');
          return;
        }
        window.toast.info(`You have ${state.wishlist.length} item(s) saved in your wishlist.`);
      });
    }

    // Cart trigger
    const cartBtn = document.getElementById('nav-cart-btn');
    if (cartBtn) {
      cartBtn.addEventListener('click', () => {
        state.isCartOpen = true;
        renderCart();
      });
    }
  }

  function logout() {
    localStorage.removeItem('apex_auth_token');
    localStorage.removeItem('apex_user');
    state.user = null;
    renderNavbar();
    window.toast.info('You have been logged out.');
  }

  function openAuthModal() {
    const container = document.getElementById('auth-modal-container');
    let mode = 'login';
    const render = () => {
      container.innerHTML = `<div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" id="auth-backdrop"><form id="auth-form" class="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4"><div class="flex items-center justify-between"><h2 class="text-xl font-black">${mode === 'login' ? 'Welcome back' : 'Create your account'}</h2><button type="button" id="auth-close" class="text-slate-400 text-xl">&times;</button></div>${mode === 'signup' ? '<input required id="auth-name" placeholder="Full name" class="w-full rounded-xl border p-3 text-sm dark:bg-slate-800 dark:border-slate-700">' : ''}<input required type="email" id="auth-email" placeholder="Email address" class="w-full rounded-xl border p-3 text-sm dark:bg-slate-800 dark:border-slate-700"><input required minlength="8" type="password" id="auth-password" placeholder="Password (min. 8 characters)" class="w-full rounded-xl border p-3 text-sm dark:bg-slate-800 dark:border-slate-700"><button class="w-full rounded-xl bg-indigo-600 py-3 text-white font-bold">${mode === 'login' ? 'Login' : 'Sign up'}</button><button type="button" id="auth-switch" class="w-full text-sm text-indigo-600">${mode === 'login' ? 'New here? Create an account' : 'Already have an account? Login'}</button></form></div>`;
      container.querySelector('#auth-close').onclick = () => { container.innerHTML = ''; };
      container.querySelector('#auth-switch').onclick = () => { mode = mode === 'login' ? 'signup' : 'login'; render(); };
      container.querySelector('#auth-form').onsubmit = async event => { event.preventDefault(); const form = event.currentTarget; const data = { email: form.querySelector('#auth-email').value, password: form.querySelector('#auth-password').value }; if (mode === 'signup') data.name = form.querySelector('#auth-name').value; try { const result = mode === 'signup' ? await window.API.signup(data) : await window.API.login(data); state.user = result.user; localStorage.setItem('apex_auth_token', result.token); localStorage.setItem('apex_user', JSON.stringify(result.user)); container.innerHTML = ''; renderNavbar(); window.toast.success(mode === 'signup' ? 'Account created successfully.' : 'Welcome back.'); } catch (error) { window.toast.error(error.message); } };
    };
    render();
  }

  function bindSidebarEvents() {
    // Reset button
    const resetBtn = document.getElementById('reset-filters-btn');
    if (resetBtn) resetBtn.addEventListener('click', resetFilters);

    // Categories
    const catBtns = document.querySelectorAll('.category-filter-btn');
    catBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        state.filters.category = btn.dataset.category || '';
        state.filters.page = 1;
        fetchCatalog();
      });
    });

    // Price Slider
    const slider = document.getElementById('price-range-slider');
    const display = document.getElementById('price-slider-display');
    if (slider && display) {
      slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        display.textContent = val >= 1000 ? '$1,000+' : `$${val}`;
      });
      slider.addEventListener('change', (e) => {
        state.filters.maxPrice = parseInt(e.target.value, 10);
        state.filters.page = 1;
        fetchCatalog();
      });
    }

    // Rating Filter
    const ratingBtns = document.querySelectorAll('.rating-filter-btn');
    ratingBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        state.filters.rating = parseFloat(btn.dataset.rating) || 0;
        state.filters.page = 1;
        fetchCatalog();
      });
    });

    // In Stock Checkbox
    const stockChk = document.getElementById('instock-filter-checkbox');
    if (stockChk) {
      stockChk.addEventListener('change', (e) => {
        state.filters.inStock = e.target.checked;
        state.filters.page = 1;
        fetchCatalog();
      });
    }
  }

  function bindToolbarEvents() {
    // Sort
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        state.filters.sort = e.target.value;
        fetchCatalog();
      });
    }

    // View mode
    const gridBtn = document.getElementById('view-grid-btn');
    const listBtn = document.getElementById('view-list-btn');

    if (gridBtn) {
      gridBtn.addEventListener('click', () => {
        state.viewMode = 'grid';
        renderToolbar();
        renderProducts();
      });
    }

    if (listBtn) {
      listBtn.addEventListener('click', () => {
        state.viewMode = 'list';
        renderToolbar();
        renderProducts();
      });
    }

    // Active filter removals
    const removeBtns = document.querySelectorAll('[data-remove-filter]');
    removeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.removeFilter;
        if (key === 'q') state.filters.q = '';
        if (key === 'category') state.filters.category = '';
        if (key === 'maxPrice') state.filters.maxPrice = 1000;
        if (key === 'rating') state.filters.rating = 0;
        if (key === 'inStock') state.filters.inStock = false;
        fetchCatalog();
      });
    });

    const clearAll = document.getElementById('clear-all-pills-btn');
    if (clearAll) clearAll.addEventListener('click', resetFilters);
  }

  function bindProductCardEvents() {
    // Add to cart buttons
    const addBtns = document.querySelectorAll('[data-add-cart]');
    addBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.addCart, 10);
        const product = state.products.find(p => p.id === id);
        if (product) addToCart(product, 1);
      });
    });

    // Wishlist buttons
    const wishBtns = document.querySelectorAll('[data-wishlist-id]');
    wishBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.wishlistId, 10);
        toggleWishlist(id);
      });
    });

    // Quick View triggers
    const triggers = document.querySelectorAll('.product-detail-trigger');
    triggers.forEach(el => {
      el.addEventListener('click', () => {
        const id = parseInt(el.dataset.productId, 10);
        openProductModal(id);
      });
    });
  }

  async function openProductModal(productId) {
    try {
      const product = await window.API.getProduct(productId);
      state.currentDetailProduct = product;
      const container = document.getElementById('product-modal-container');
      container.innerHTML = window.ProductModalComponent.render(product);
      window.ProductModalComponent.bindEvents(container, {
        onAddToCart: (p, q) => addToCart(p, q),
        onReviewSubmitted: (updated) => {
          // refresh catalog and analytics
          fetchCatalog();
          fetchAnalytics();
        }
      });
    } catch (err) {
      window.toast.error('Could not load product details: ' + err.message);
    }
  }

  function bindCartEvents() {
    const backdrop = document.getElementById('cart-drawer-backdrop');
    const closeBtn = document.getElementById('close-cart-btn');
    const exploreBtn = document.getElementById('cart-explore-btn');

    function closeCart() {
      state.isCartOpen = false;
      renderCart();
    }

    if (closeBtn) closeBtn.addEventListener('click', closeCart);
    if (exploreBtn) exploreBtn.addEventListener('click', closeCart);
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeCart();
      });
    }

    // Plus/minus buttons
    const minusBtns = document.querySelectorAll('[data-cart-minus]');
    minusBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.cartMinus, 10);
        updateCartQuantity(id, -1);
      });
    });

    const plusBtns = document.querySelectorAll('[data-cart-plus]');
    plusBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.cartPlus, 10);
        updateCartQuantity(id, 1);
      });
    });

    const removeBtns = document.querySelectorAll('[data-cart-remove]');
    removeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.cartRemove, 10);
        removeFromCart(id);
      });
    });

    // Promo code apply/remove
    const promoInput = document.getElementById('promo-code-input');
    const promoBtn = document.getElementById('apply-promo-btn');
    if (promoBtn) {
      promoBtn.addEventListener('click', () => {
        if (window.CartDrawerComponent.activePromo) {
          window.CartDrawerComponent.activePromo = null;
          window.toast.info('Coupon removed');
          renderCart();
          return;
        }

        const code = promoInput.value.trim().toUpperCase();
        if (code === 'SAVE20') {
          window.CartDrawerComponent.activePromo = { code: 'SAVE20' };
          window.toast.success('Coupon SAVE20 applied ($50 OFF over $150)!');
        } else if (code === 'FREESHIP') {
          window.CartDrawerComponent.activePromo = { code: 'FREESHIP' };
          window.toast.success('Coupon FREESHIP applied (Free Shipping)!');
        } else if (code === 'TECH10') {
          window.CartDrawerComponent.activePromo = { code: 'TECH10' };
          window.toast.success('Coupon TECH10 applied (10% OFF entire order)!');
        } else {
          window.toast.error('Invalid coupon code. Try SAVE20 or FREESHIP');
        }
        renderCart();
      });
    }

    // Checkout modal trigger
    const chkBtn = document.getElementById('checkout-modal-btn');
    if (chkBtn) {
      chkBtn.addEventListener('click', () => {
        closeCart();
        openCheckoutModal();
      });
    }
  }

  function openCheckoutModal() {
    const container = document.getElementById('checkout-modal-container');
    container.innerHTML = window.CartDrawerComponent.renderCheckoutModal(state.cart);

    const closeBtn = container.querySelector('#close-checkout-btn');
    const backdrop = container.querySelector('#checkout-modal-backdrop');
    const form = container.querySelector('#checkout-form');

    function closeCheckout() {
      container.innerHTML = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeCheckout);
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeCheckout();
      });
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('#confirm-payment-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing Authorization...';

        const totals = window.CartDrawerComponent.calculateTotals(state.cart);

        const orderPayload = {
          customer_name: form.querySelector('#chk-name').value.trim(),
          customer_email: form.querySelector('#chk-email').value.trim(),
          shipping_address: form.querySelector('#chk-address').value.trim(),
          promo_code: window.CartDrawerComponent.activePromo ? window.CartDrawerComponent.activePromo.code : null,
          discount: totals.discount,
          items: state.cart.map(i => ({ id: i.id, quantity: i.quantity }))
        };

        try {
          const res = await window.API.checkout(orderPayload);
          // Clear cart
          state.cart = [];
          saveToStorage(STORAGE_KEYS.CART, state.cart);
          window.CartDrawerComponent.activePromo = null;
          renderNavbar();

          // Close checkout modal & show receipt
          closeCheckout();
          showReceiptModal(res.order);

          // Update inventory and analytics in background
          fetchCatalog();
          fetchAnalytics();
        } catch (err) {
          window.toast.error('Order failed: ' + err.message);
          submitBtn.disabled = false;
          submitBtn.textContent = 'Authorize & Place Order';
        }
      });
    }
  }

  function showReceiptModal(order) {
    const container = document.getElementById('checkout-modal-container');
    container.innerHTML = window.CartDrawerComponent.renderReceiptModal(order);

    const finishBtn = container.querySelector('#finish-receipt-btn');
    if (finishBtn) {
      finishBtn.addEventListener('click', () => {
        container.innerHTML = '';
      });
    }
  }

  // Admin Events
  function bindAdminEvents() {
    // Reset Demo
    const resetBtn = document.getElementById('admin-reset-demo-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', async () => {
        if (confirm('Reset entire catalog to original demo dataset? All manual edits will be re-seeded.')) {
          try {
            await window.API.resetDemo();
            window.toast.success('Catalog restored to original seed state.');
            await fetchCatalog();
            await fetchAnalytics();
            await fetchCategories();
          } catch (err) {
            window.toast.error(err.message);
          }
        }
      });
    }

    // Export JSON
    const exportJsonBtn = document.getElementById('admin-export-json-btn');
    if (exportJsonBtn) {
      exportJsonBtn.addEventListener('click', () => {
        window.AdminViewComponent.exportToJson(state.products);
        window.toast.success('Exported catalog to JSON.');
      });
    }

    // Export CSV
    const exportCsvBtn = document.getElementById('admin-export-csv-btn');
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', () => {
        window.AdminViewComponent.exportToCsv(state.products);
        window.toast.success('Exported catalog to CSV.');
      });
    }

    // Add Product Modal
    const addProdBtn = document.getElementById('admin-add-product-btn');
    if (addProdBtn) {
      addProdBtn.addEventListener('click', () => {
        openCrudModal(null);
      });
    }

    // Table Search
    const tableSearch = document.getElementById('admin-table-search');
    if (tableSearch) {
      tableSearch.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const rows = document.querySelectorAll('.admin-table-row');
        rows.forEach(row => {
          const text = row.dataset.searchText || '';
          row.style.display = text.includes(query) ? '' : 'none';
        });
      });
    }

    // Inline Stock adjustments (+ / -)
    const stockButtons = document.querySelectorAll('[data-admin-stock-delta]');
    stockButtons.forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = parseInt(btn.dataset.productId, 10);
        const delta = parseInt(btn.dataset.adminStockDelta, 10);
        try {
          const res = await window.API.adjustStock(id, delta);
          // Update product in local state
          const target = state.products.find(p => p.id === id);
          if (target) target.stock = res.stock;
          window.toast.info(`Adjusted stock for product #${id} to ${res.stock}`);
          renderAdmin();
          fetchAnalytics();
        } catch (err) {
          window.toast.error(err.message);
        }
      });
    });

    // Edit Product
    const editBtns = document.querySelectorAll('[data-admin-edit]');
    editBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.adminEdit, 10);
        const product = state.products.find(p => p.id === id);
        if (product) openCrudModal(product);
      });
    });

    // Delete Product
    const deleteBtns = document.querySelectorAll('[data-admin-delete]');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = parseInt(btn.dataset.adminDelete, 10);
        const product = state.products.find(p => p.id === id);
        const name = product ? product.name : `Product #${id}`;

        if (confirm(`Are you sure you want to permanently delete "${name}"?`)) {
          try {
            await window.API.deleteProduct(id);
            window.toast.success(`Deleted "${name}"`);
            fetchCatalog();
            fetchAnalytics();
            fetchCategories();
          } catch (err) {
            window.toast.error(err.message);
          }
        }
      });
    });
  }

  function openCrudModal(product = null) {
    const container = document.getElementById('crud-modal-container');
    container.innerHTML = window.AdminViewComponent.renderProductFormModal(product);

    const closeBtn = container.querySelector('#close-form-modal-btn');
    const cancelBtn = container.querySelector('#cancel-form-modal-btn');
    const backdrop = container.querySelector('#product-form-modal-backdrop');
    const form = container.querySelector('#product-crud-form');

    function closeCrud() {
      container.innerHTML = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeCrud);
    if (cancelBtn) cancelBtn.addEventListener('click', closeCrud);
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeCrud();
      });
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('#save-product-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';

        const tagsRaw = form.querySelector('#form-tags').value;
        const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);

        const payload = {
          name: form.querySelector('#form-name').value.trim(),
          sku: form.querySelector('#form-sku').value.trim(),
          category: form.querySelector('#form-category').value.trim(),
          brand: form.querySelector('#form-brand').value.trim(),
          stock: parseInt(form.querySelector('#form-stock').value, 10) || 0,
          price: parseFloat(form.querySelector('#form-price').value) || 0,
          compare_at_price: form.querySelector('#form-compare-price').value ? parseFloat(form.querySelector('#form-compare-price').value) : null,
          image_url: form.querySelector('#form-image').value.trim(),
          description: form.querySelector('#form-description').value.trim(),
          tags
        };

        try {
          if (product) {
            await window.API.updateProduct(product.id, payload);
            window.toast.success(`Updated "${payload.name}" successfully.`);
          } else {
            await window.API.createProduct(payload);
            window.toast.success(`Created "${payload.name}" successfully.`);
          }
          closeCrud();
          fetchCatalog();
          fetchAnalytics();
          fetchCategories();
        } catch (err) {
          window.toast.error(err.message);
          submitBtn.disabled = false;
          submitBtn.textContent = product ? 'Save Changes' : 'Publish Product';
        }
      });
    }
  }

  function resetFilters() {
    state.filters = {
      q: '',
      category: '',
      brand: '',
      minPrice: 0,
      maxPrice: 1000,
      rating: 0,
      inStock: false,
      sort: 'featured',
      page: 1
    };
    renderNavbar();
    fetchCatalog();
  }

  // Global Keyboard Shortcuts
  function initKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Don't intercept if typing in an input or textarea
      const tag = document.activeElement.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') {
        if (e.key === 'Escape') {
          document.activeElement.blur();
        }
        return;
      }

      // '/' to focus search
      if (e.key === '/') {
        e.preventDefault();
        const searchInput = document.getElementById('nav-search-input');
        if (searchInput) searchInput.focus();
      }

      // 'c' or 'C' for cart
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        state.isCartOpen = !state.isCartOpen;
        renderCart();
      }

      // 'd' or 'D' for theme toggle
      if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        toggleTheme();
      }

      // 'Escape' to close all open drawers / modals
      if (e.key === 'Escape') {
        state.isCartOpen = false;
        renderCart();
        const detailContainer = document.getElementById('product-modal-container');
        if (detailContainer) detailContainer.innerHTML = '';
        const checkoutContainer = document.getElementById('checkout-modal-container');
        if (checkoutContainer) checkoutContainer.innerHTML = '';
        const crudContainer = document.getElementById('crud-modal-container');
        if (crudContainer) crudContainer.innerHTML = '';
      }
    });
  }

  // Application Startup
  async function init() {
    initTheme();
    initKeyboardShortcuts();
    renderNavbar();
    await Promise.all([
      fetchCatalog(),
      fetchCategories(),
      fetchAnalytics()
    ]);
  }

  // Run on DOM loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
