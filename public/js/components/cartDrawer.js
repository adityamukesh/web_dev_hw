// cartDrawer.js - Slide-Over Cart Drawer, Promo Coupons, Checkout Simulator, & Receipt
const CartDrawerComponent = {
  activePromo: null, // { code: 'SAVE20', discount: 50 }

  calculateTotals(cart) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let discount = 0;
    if (this.activePromo) {
      if (this.activePromo.code === 'SAVE20') {
        discount = subtotal >= 150 ? 50 : 0;
      } else if (this.activePromo.code === 'TECH10') {
        discount = subtotal * 0.10;
      }
    }

    let shipping = subtotal > 150 ? 0 : 15.00;
    if (this.activePromo && this.activePromo.code === 'FREESHIP') {
      shipping = 0;
    }

    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = taxableAmount > 0 ? Math.round(taxableAmount * 0.08 * 100) / 100 : 0;
    const total = Math.max(0, Math.round((subtotal - discount + shipping + tax) * 100) / 100);

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      discount: Math.round(discount * 100) / 100,
      shipping: Math.round(shipping * 100) / 100,
      tax,
      total
    };
  },

  renderDrawer(cart, isOpen = false) {
    const totals = this.calculateTotals(cart);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return `
      <div id="cart-drawer-backdrop" class="fixed inset-0 z-50 overflow-hidden ${isOpen ? 'block' : 'hidden'}">
        <!-- Backdrop blur overlay -->
        <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"></div>

        <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div class="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between">
            
            <!-- Cart Header -->
            <div class="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                </div>
                <div>
                  <h2 class="text-base font-black text-slate-900 dark:text-white">Your Shopping Cart</h2>
                  <p class="text-xs text-slate-400">${totalItems} ${totalItems === 1 ? 'item' : 'items'} ready for checkout</p>
                </div>
              </div>
              <button id="close-cart-btn" class="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <!-- Cart Items List -->
            <div class="flex-1 overflow-y-auto p-6 space-y-4">
              ${cart.length === 0 ? `
                <div class="text-center py-16 space-y-4">
                  <div class="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                  </div>
                  <div>
                    <h3 class="text-sm font-bold text-slate-800 dark:text-slate-200">Your bag is currently empty</h3>
                    <p class="text-xs text-slate-400 mt-1">Explore our high-performance gear and add items to your cart.</p>
                  </div>
                  <button id="cart-explore-btn" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/25 transition-all">
                    Browse Catalog
                  </button>
                </div>
              ` : cart.map(item => `
                <div class="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 group">
                  <img src="${item.image_url}" alt="${item.name}" class="w-16 h-16 rounded-xl object-cover bg-white dark:bg-slate-800 flex-shrink-0"/>
                  
                  <div class="flex-1 min-w-0">
                    <h4 class="text-xs font-bold text-slate-900 dark:text-white truncate leading-snug">${item.name}</h4>
                    <p class="text-[11px] text-slate-400 font-mono mt-0.5">$${item.price.toFixed(2)} each</p>
                    
                    <!-- Qty Steppers -->
                    <div class="flex items-center gap-2 mt-2">
                      <div class="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
                        <button data-cart-minus="${item.id}" class="w-6 h-6 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold">-</button>
                        <span class="w-6 text-center text-xs font-bold text-slate-800 dark:text-slate-200">${item.quantity}</span>
                        <button data-cart-plus="${item.id}" class="w-6 h-6 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold">+</button>
                      </div>
                      <span class="text-xs font-black text-slate-900 dark:text-white ml-auto">
                        $${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button data-cart-remove="${item.id}" title="Remove item" class="p-1.5 text-slate-400 hover:text-rose-500 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              `).join('')}
            </div>

            <!-- Cart Footer with Pricing & Checkout -->
            ${cart.length > 0 ? `
              <div class="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-4">
                
                <!-- Promo Code Box -->
                <div class="flex items-center gap-2">
                  <div class="relative flex-1">
                    <input 
                      type="text" 
                      id="promo-code-input" 
                      placeholder="Coupon code (e.g. SAVE20)" 
                      value="${this.activePromo ? this.activePromo.code : ''}"
                      class="w-full text-xs uppercase font-mono px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400"
                    />
                  </div>
                  <button 
                    id="apply-promo-btn" 
                    class="px-4 py-2 text-xs font-bold rounded-xl ${this.activePromo ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400' : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'} transition-all"
                  >
                    ${this.activePromo ? 'Remove' : 'Apply'}
                  </button>
                </div>

                ${this.activePromo ? `
                  <div class="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    Coupon "${this.activePromo.code}" applied: Saved $${totals.discount.toFixed(2)}
                  </div>
                ` : ''}

                <!-- Price Breakdown -->
                <div class="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800 font-medium">
                  <div class="flex justify-between">
                    <span>Subtotal</span>
                    <span class="font-bold text-slate-800 dark:text-slate-200">$${totals.subtotal.toFixed(2)}</span>
                  </div>
                  ${totals.discount > 0 ? `
                    <div class="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>Promo Discount</span>
                      <span>-$${totals.discount.toFixed(2)}</span>
                    </div>
                  ` : ''}
                  <div class="flex justify-between">
                    <span>Shipping</span>
                    <span class="font-bold text-slate-800 dark:text-slate-200">${totals.shipping === 0 ? '<span class="text-emerald-600 dark:text-emerald-400 font-bold uppercase text-[10px]">FREE</span>' : `$${totals.shipping.toFixed(2)}`}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Estimated Sales Tax (8%)</span>
                    <span class="font-bold text-slate-800 dark:text-slate-200">$${totals.tax.toFixed(2)}</span>
                  </div>
                  <div class="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span>Total Due</span>
                    <span class="text-indigo-600 dark:text-indigo-400 text-base">$${totals.total.toFixed(2)}</span>
                  </div>
                </div>

                <!-- Checkout Button -->
                <button 
                  id="checkout-modal-btn" 
                  class="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  <span>Proceed to Checkout • $${totals.total.toFixed(2)}</span>
                </button>

              </div>
            ` : ''}

          </div>
        </div>
      </div>
    `;
  },

  renderCheckoutModal(cart) {
    const totals = this.calculateTotals(cart);

    return `
      <div id="checkout-modal-backdrop" class="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-8 animate-fade-in">
          
          <!-- Close Button -->
          <button id="close-checkout-btn" class="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>

          <!-- Header -->
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/30">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            </div>
            <div>
              <h2 class="text-xl font-black text-slate-900 dark:text-white">Secure Checkout</h2>
              <p class="text-xs text-slate-400">Total payable: <strong class="text-indigo-600 dark:text-indigo-400 font-black">$${totals.total.toFixed(2)}</strong></p>
            </div>
          </div>

          <!-- Checkout Form -->
          <form id="checkout-form" class="space-y-4">
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Full Name</label>
                <input type="text" id="chk-name" required value="Alex Carter" class="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"/>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Email Address</label>
                <input type="email" id="chk-email" required value="alex.carter@innovator.io" class="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"/>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Delivery Address</label>
              <input type="text" id="chk-address" required value="500 Howard St, Suite 400, San Francisco, CA 94105" class="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"/>
            </div>

            <!-- Simulated Payment Box -->
            <div class="p-4 rounded-2xl bg-indigo-50/50 dark:bg-slate-800/70 border border-indigo-100 dark:border-indigo-950 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <svg class="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                  Simulated Payment Method
                </span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">Sandbox Test Mode</span>
              </div>

              <div>
                <input type="text" readonly value="•••• •••• •••• 4242  (Expires 12/28 - CVC 982)" class="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"/>
              </div>
            </div>

            <!-- Order Submit -->
            <button 
              type="submit" 
              id="confirm-payment-btn" 
              class="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-black text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 mt-4"
            >
              <span>Authorize & Place Order ($${totals.total.toFixed(2)})</span>
            </button>
          </form>

        </div>
      </div>
    `;
  },

  renderReceiptModal(order) {
    return `
      <div id="receipt-modal-backdrop" class="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-8 animate-fade-in text-center">
          
          <!-- Success Badge -->
          <div class="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20 animate-bounce">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
          </div>

          <h2 class="text-2xl font-black text-slate-900 dark:text-white">Order Confirmed!</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Thank you for your purchase. Your receipt and confirmation details are below.</p>

          <!-- Receipt Details Card -->
          <div class="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-left space-y-3 font-mono text-xs">
            <div class="flex justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2">
              <span class="text-slate-400">Order ID:</span>
              <span class="font-bold text-indigo-600 dark:text-indigo-400">${order.orderId}</span>
            </div>
            <div class="flex justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2">
              <span class="text-slate-400">Customer:</span>
              <span class="font-bold text-slate-800 dark:text-slate-200">${order.customer.name}</span>
            </div>
            <div class="flex justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2">
              <span class="text-slate-400">Shipping To:</span>
              <span class="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[200px]">${order.customer.address}</span>
            </div>
            <div class="flex justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2">
              <span class="text-slate-400">Items Ordered:</span>
              <span class="font-bold text-slate-800 dark:text-slate-200">${order.items.reduce((s, i) => s + i.quantity, 0)} units</span>
            </div>
            <div class="flex justify-between pt-1 text-sm font-sans font-black text-slate-900 dark:text-white">
              <span>Total Paid:</span>
              <span class="text-emerald-600 dark:text-emerald-400 font-mono">$${order.breakdown.total.toFixed(2)}</span>
            </div>
          </div>

          <button 
            id="finish-receipt-btn" 
            class="w-full mt-6 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 font-bold text-xs shadow-md transition-all"
          >
            Continue Shopping
          </button>

        </div>
      </div>
    `;
  }
};

window.CartDrawerComponent = CartDrawerComponent;
