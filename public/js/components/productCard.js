// productCard.js - Product Display Components (Grid & List Views)
const ProductCardComponent = {
  renderGrid(product, state) {
    const isWishlisted = state.wishlist.includes(product.id);
    const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
    const discountPercent = hasDiscount 
      ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100) 
      : 0;
    
    const isOutOfStock = product.stock === 0;
    const isLowStock = product.stock > 0 && product.stock <= 5;

    return `
      <div class="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700/80 transition-all duration-300 flex flex-col">
        
        <!-- Image Container -->
        <div class="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer product-detail-trigger" data-product-id="${product.id}">
          <img 
            src="${product.image_url}" 
            alt="${product.name}" 
            loading="lazy"
            onerror="this.src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'"
            class="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          <!-- Badges Overlay -->
          <div class="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
            ${hasDiscount ? `
              <span class="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-black tracking-wider uppercase bg-rose-500 text-white shadow-sm">
                -${discountPercent}% OFF
              </span>
            ` : ''}
            ${isOutOfStock ? `
              <span class="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-black tracking-wider uppercase bg-slate-800/90 backdrop-blur-md text-rose-300 border border-rose-500/30">
                Out of Stock
              </span>
            ` : isLowStock ? `
              <span class="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-black tracking-wider uppercase bg-amber-500 text-slate-950 shadow-sm">
                Only ${product.stock} Left
              </span>
            ` : ''}
          </div>

          <!-- Wishlist Button -->
          <button 
            data-wishlist-id="${product.id}" 
            title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}"
            class="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-600 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 hover:scale-110 active:scale-95 shadow-sm transition-all z-20"
          >
            <svg class="w-4 h-4 transition-colors" fill="${isWishlisted ? '#ef4444' : 'none'}" stroke="${isWishlisted ? '#ef4444' : 'currentColor'}" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          <!-- Quick View Hover Overlay -->
          <div class="absolute inset-x-3 bottom-3 hidden group-hover:flex items-center justify-center transition-all z-10">
            <button 
              data-product-id="${product.id}"
              class="product-detail-trigger w-full py-2 px-3 rounded-xl bg-slate-900/80 dark:bg-white/90 hover:bg-slate-900 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold backdrop-blur-md shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-1.5"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              Quick View
            </button>
          </div>
        </div>

        <!-- Product Meta -->
        <div class="p-4 flex-1 flex flex-col justify-between">
          <div>
            <!-- Category & Brand -->
            <div class="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
              <span class="uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold">${product.category}</span>
              <span>${product.brand}</span>
            </div>

            <!-- Title -->
            <h3 
              class="product-detail-trigger font-bold text-slate-900 dark:text-slate-100 text-sm leading-snug line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors" 
              data-product-id="${product.id}"
            >
              ${product.name}
            </h3>

            <!-- Rating -->
            <div class="flex items-center gap-1.5 mt-2">
              <div class="flex text-amber-400">
                ${this.renderStarRating(product.rating)}
              </div>
              <span class="text-xs font-bold text-slate-700 dark:text-slate-300">${product.rating.toFixed(1)}</span>
              <span class="text-[11px] text-slate-400">(${product.reviews_count})</span>
            </div>
          </div>

          <!-- Price & Add to Cart -->
          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
            <div>
              <div class="flex items-baseline gap-1.5">
                <span class="text-lg font-black text-slate-900 dark:text-white">
                  $${product.price.toFixed(2)}
                </span>
                ${hasDiscount ? `
                  <span class="text-xs text-slate-400 line-through">
                    $${product.compare_at_price.toFixed(2)}
                  </span>
                ` : ''}
              </div>
            </div>

            <button 
              data-add-cart="${product.id}" 
              ${isOutOfStock ? 'disabled' : ''}
              class="p-2.5 rounded-xl ${isOutOfStock ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 active:scale-95'} transition-all flex items-center justify-center"
              title="${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
            </button>
          </div>

        </div>

      </div>
    `;
  },

  renderList(product, state) {
    const isWishlisted = state.wishlist.includes(product.id);
    const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
    const isOutOfStock = product.stock === 0;

    return `
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-5">
        
        <!-- Thumbnail -->
        <div class="relative w-full sm:w-44 aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 cursor-pointer product-detail-trigger" data-product-id="${product.id}">
          <img 
            src="${product.image_url}" 
            alt="${product.name}" 
            class="h-full w-full object-cover object-center"
          />
        </div>

        <!-- Content -->
        <div class="flex-1 w-full min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">${product.category}</span>
            <span class="text-xs text-slate-400">•</span>
            <span class="text-xs text-slate-500 font-medium">${product.brand}</span>
            <span class="text-xs text-slate-400">•</span>
            <span class="text-[11px] font-mono text-slate-400">${product.sku}</span>
          </div>

          <h3 
            class="product-detail-trigger text-base font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors" 
            data-product-id="${product.id}"
          >
            ${product.name}
          </h3>

          <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
            ${product.description}
          </p>

          <div class="flex items-center gap-4 mt-3">
            <div class="flex items-center gap-1.5">
              <div class="flex text-amber-400">${this.renderStarRating(product.rating)}</div>
              <span class="text-xs font-bold text-slate-700 dark:text-slate-300">${product.rating.toFixed(1)}</span>
              <span class="text-xs text-slate-400">(${product.reviews_count})</span>
            </div>

            <span class="text-xs ${product.stock > 5 ? 'text-emerald-600 dark:text-emerald-400' : product.stock > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'} font-semibold">
              ${product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
        </div>

        <!-- Action Box -->
        <div class="w-full sm:w-auto flex sm:flex-col items-center justify-between sm:justify-center gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
          <div class="text-left sm:text-right">
            <div class="text-xl font-black text-slate-900 dark:text-white">
              $${product.price.toFixed(2)}
            </div>
            ${hasDiscount ? `
              <div class="text-xs text-slate-400 line-through">
                $${product.compare_at_price.toFixed(2)}
              </div>
            ` : ''}
          </div>

          <div class="flex items-center gap-2">
            <button 
              data-wishlist-id="${product.id}"
              class="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-500 transition-colors"
            >
              <svg class="w-4 h-4" fill="${isWishlisted ? '#ef4444' : 'none'}" stroke="${isWishlisted ? '#ef4444' : 'currentColor'}" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            </button>

            <button 
              data-add-cart="${product.id}" 
              ${isOutOfStock ? 'disabled' : ''}
              class="px-4 py-2 rounded-xl text-xs font-bold ${isOutOfStock ? 'bg-slate-200 dark:bg-slate-800 text-slate-400' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 active:scale-95'} transition-all"
            >
              ${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>

      </div>
    `;
  },

  renderStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.4;
    let starsHtml = '';

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        starsHtml += '<svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
      } else if (i === fullStars + 1 && hasHalf) {
        starsHtml += '<svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" opacity="0.4"/></svg>';
      } else {
        starsHtml += '<svg class="w-3.5 h-3.5 text-slate-200 dark:text-slate-700 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
      }
    }
    return starsHtml;
  }
};

window.ProductCardComponent = ProductCardComponent;
