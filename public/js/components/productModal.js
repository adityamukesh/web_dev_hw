// productModal.js - Detailed Product Modal with Gallery, Specs, and Review Submission
const ProductModalComponent = {
  currentProduct: null,
  activeImageIndex: 0,
  quantity: 1,

  render(product) {
    this.currentProduct = product;
    this.activeImageIndex = 0;
    this.quantity = 1;

    const allImages = [product.image_url, ...(product.secondary_images || [])];
    const isOutOfStock = product.stock === 0;
    const isLowStock = product.stock > 0 && product.stock <= 5;
    const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;

    return `
      <div id="product-modal-backdrop" class="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 transition-opacity animate-fade-in">
        <div class="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 transform transition-transform">
          
          <!-- Close Button -->
          <button 
            id="close-product-modal" 
            class="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>

          <!-- Modal Body Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
            
            <!-- Left: Gallery -->
            <div class="p-6 bg-slate-50/70 dark:bg-slate-800/40 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
              <div>
                <!-- Main Image Preview -->
                <div class="relative aspect-square rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 shadow-xs mb-4">
                  <img 
                    id="modal-main-image" 
                    src="${allImages[0]}" 
                    alt="${product.name}" 
                    class="h-full w-full object-cover object-center transition-all duration-300"
                  />
                  ${hasDiscount ? `
                    <span class="absolute top-3 left-3 bg-rose-500 text-white text-xs font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                      Sale
                    </span>
                  ` : ''}
                </div>

                <!-- Thumbnail Switcher -->
                ${allImages.length > 1 ? `
                  <div class="flex items-center gap-2.5 overflow-x-auto pb-2">
                    ${allImages.map((img, idx) => `
                      <button 
                        data-img-idx="${idx}" 
                        class="modal-thumb-btn w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${idx === 0 ? 'border-indigo-600 scale-95 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'}"
                      >
                        <img src="${img}" alt="Thumbnail ${idx}" class="w-full h-full object-cover object-center"/>
                      </button>
                    `).join('')}
                  </div>
                ` : ''}
              </div>

              <!-- Tags Chips -->
              ${product.tags && product.tags.length > 0 ? `
                <div class="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700/60">
                  <span class="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Tags:</span>
                  <div class="flex flex-wrap gap-1.5">
                    ${product.tags.map(t => `
                      <span class="px-2.5 py-1 rounded-lg bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">
                        #${t}
                      </span>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            </div>

            <!-- Right: Details & Order Controls -->
            <div class="p-6 sm:p-8 flex flex-col justify-between space-y-6">
              
              <div>
                <!-- Brand & SKU -->
                <div class="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                  <span class="text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-black">${product.category}</span>
                  <span class="font-mono">${product.sku}</span>
                </div>

                <!-- Title -->
                <h1 class="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                  ${product.name}
                </h1>
                <p class="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Brand: <strong class="text-slate-700 dark:text-slate-200">${product.brand}</strong></p>

                <!-- Rating & Stock Badge -->
                <div class="flex items-center justify-between gap-4 mt-3">
                  <div class="flex items-center gap-1.5">
                    <div class="flex text-amber-400">
                      ${ProductCardComponent.renderStarRating(product.rating)}
                    </div>
                    <span class="text-sm font-black text-slate-800 dark:text-slate-200">${product.rating.toFixed(1)}</span>
                    <span class="text-xs text-slate-400 font-medium">(${product.reviews_count} customer reviews)</span>
                  </div>

                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${isOutOfStock ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400' : isLowStock ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400' : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'}">
                    <span class="w-2 h-2 rounded-full ${isOutOfStock ? 'bg-rose-500' : isLowStock ? 'bg-amber-500' : 'bg-emerald-500'}"></span>
                    ${isOutOfStock ? 'Out of Stock' : isLowStock ? `Low Stock (${product.stock})` : `In Stock (${product.stock})`}
                  </span>
                </div>

                <!-- Price Section -->
                <div class="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div class="text-3xl font-black text-slate-900 dark:text-white">
                      $${product.price.toFixed(2)}
                    </div>
                    ${hasDiscount ? `
                      <div class="flex items-center gap-2 mt-0.5">
                        <span class="text-sm text-slate-400 line-through">$${product.compare_at_price.toFixed(2)}</span>
                        <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          Save $${(product.compare_at_price - product.price).toFixed(2)}
                        </span>
                      </div>
                    ` : ''}
                  </div>
                  <div class="text-right text-[11px] text-slate-400 font-medium">
                    <div>Tax calculated at checkout</div>
                    <div class="text-emerald-600 dark:text-emerald-400 font-semibold">Free shipping eligible</div>
                  </div>
                </div>

                <!-- Description -->
                <div class="mt-5">
                  <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Description</h4>
                  <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    ${product.description}
                  </p>
                </div>

                <!-- Features Bullets -->
                ${product.features && product.features.length > 0 ? `
                  <div class="mt-5">
                    <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Key Highlights</h4>
                    <ul class="space-y-1.5">
                      ${product.features.map(f => `
                        <li class="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                          <svg class="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                          <span>${f}</span>
                        </li>
                      `).join('')}
                    </ul>
                  </div>
                ` : ''}

              </div>

              <!-- Order Action Bar -->
              <div class="pt-5 border-t border-slate-200 dark:border-slate-800 space-y-4">
                <div class="flex items-center gap-3">
                  
                  <!-- Quantity Selector -->
                  <div class="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 p-1">
                    <button 
                      id="modal-qty-minus" 
                      class="w-8 h-8 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 flex items-center justify-center font-black transition-colors"
                      ${isOutOfStock ? 'disabled' : ''}
                    >
                      -
                    </button>
                    <span id="modal-qty-display" class="w-10 text-center font-bold text-sm text-slate-900 dark:text-white">
                      1
                    </span>
                    <button 
                      id="modal-qty-plus" 
                      class="w-8 h-8 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 flex items-center justify-center font-black transition-colors"
                      ${isOutOfStock ? 'disabled' : ''}
                    >
                      +
                    </button>
                  </div>

                  <!-- Add To Cart Button -->
                  <button 
                    id="modal-add-cart-btn" 
                    ${isOutOfStock ? 'disabled' : ''}
                    class="flex-1 py-3 px-6 rounded-xl font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 ${isOutOfStock ? 'bg-slate-300 dark:bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-indigo-500/25'}"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                    <span>${isOutOfStock ? 'Out of Stock' : 'Add to Bag'}</span>
                  </button>

                </div>
              </div>

            </div>

          </div>

          <!-- Bottom: Reviews & Submission Section -->
          <div class="p-6 sm:p-8 bg-slate-50/50 dark:bg-slate-950/40 border-t border-slate-200 dark:border-slate-800">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-lg font-black text-slate-900 dark:text-white">Customer Reviews</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">Verified buyer experiences & feedback</p>
              </div>
              <button 
                id="toggle-review-form-btn" 
                class="px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 hover:border-indigo-300 transition-all shadow-xs"
              >
                Write a Review
              </button>
            </div>

            <!-- Review Submission Form (Collapsible) -->
            <div id="review-form-container" class="hidden mb-8 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 shadow-sm space-y-4">
              <h4 class="font-bold text-sm text-slate-900 dark:text-white">Share Your Feedback</h4>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Your Name</label>
                  <input type="text" id="review-name-input" placeholder="e.g. Alex Morgan" class="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"/>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Rating</label>
                  <div class="flex items-center gap-1 mt-1" id="star-picker-container">
                    ${[1, 2, 3, 4, 5].map(star => `
                      <button type="button" data-star="${star}" class="star-btn p-1 text-slate-300 hover:text-amber-400 focus:outline-none">
                        <svg class="w-6 h-6 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      </button>
                    `).join('')}
                    <input type="hidden" id="selected-rating-val" value="5"/>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Review Headline</label>
                <input type="text" id="review-title-input" placeholder="Summarize your experience..." class="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"/>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Detailed Review</label>
                <textarea id="review-comment-input" rows="3" placeholder="What did you love? How is the quality?" class="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"></textarea>
              </div>

              <div class="flex justify-end gap-2">
                <button id="cancel-review-btn" class="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Cancel</button>
                <button id="submit-review-btn" class="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">Submit Review</button>
              </div>
            </div>

            <!-- Existing Reviews List -->
            <div class="space-y-4" id="modal-reviews-list">
              ${product.reviews && product.reviews.length > 0 ? product.reviews.map(r => `
                <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-3">
                      <img src="${r.user_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}" alt="${r.user_name}" class="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"/>
                      <div>
                        <div class="text-xs font-bold text-slate-900 dark:text-white">${r.user_name}</div>
                        <div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                          Verified Buyer
                        </div>
                      </div>
                    </div>
                    <div class="flex text-amber-400">
                      ${ProductCardComponent.renderStarRating(r.rating)}
                    </div>
                  </div>
                  <h5 class="text-xs font-bold text-slate-800 dark:text-slate-200">${r.title}</h5>
                  <p class="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">${r.comment}</p>
                </div>
              `).join('') : `
                <div class="text-center py-6 text-slate-400 text-xs">
                  No reviews yet for this product. Be the first to share your thoughts!
                </div>
              `}
            </div>

          </div>

        </div>
      </div>
    `;
  },

  bindEvents(container, { onAddToCart, onReviewSubmitted }) {
    const product = this.currentProduct;
    if (!product) return;

    // Close button & backdrop click
    const backdrop = container.querySelector('#product-modal-backdrop');
    const closeBtn = container.querySelector('#close-product-modal');
    
    if (closeBtn) closeBtn.addEventListener('click', () => this.close(container));
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) this.close(container);
      });
    }

    // Thumbnails
    const thumbs = container.querySelectorAll('.modal-thumb-btn');
    const mainImg = container.querySelector('#modal-main-image');
    const allImages = [product.image_url, ...(product.secondary_images || [])];

    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const idx = parseInt(thumb.dataset.imgIdx, 10);
        this.activeImageIndex = idx;
        if (mainImg) mainImg.src = allImages[idx];
        thumbs.forEach(t => t.classList.replace('border-indigo-600', 'border-transparent'));
        thumb.classList.replace('border-transparent', 'border-indigo-600');
      });
    });

    // Quantity controls
    const qtyMinus = container.querySelector('#modal-qty-minus');
    const qtyPlus = container.querySelector('#modal-qty-plus');
    const qtyDisplay = container.querySelector('#modal-qty-display');

    if (qtyMinus && qtyPlus && qtyDisplay) {
      qtyMinus.addEventListener('click', () => {
        if (this.quantity > 1) {
          this.quantity--;
          qtyDisplay.textContent = this.quantity;
        }
      });
      qtyPlus.addEventListener('click', () => {
        if (this.quantity < product.stock) {
          this.quantity++;
          qtyDisplay.textContent = this.quantity;
        } else {
          window.toast.warning(`Only ${product.stock} units available in stock`);
        }
      });
    }

    // Add to cart
    const addCartBtn = container.querySelector('#modal-add-cart-btn');
    if (addCartBtn) {
      addCartBtn.addEventListener('click', () => {
        if (product.stock > 0) {
          onAddToCart(product, this.quantity);
          this.close(container);
        }
      });
    }

    // Review toggle
    const toggleReviewBtn = container.querySelector('#toggle-review-form-btn');
    const reviewForm = container.querySelector('#review-form-container');
    const cancelReviewBtn = container.querySelector('#cancel-review-btn');

    if (toggleReviewBtn && reviewForm) {
      toggleReviewBtn.addEventListener('click', () => {
        reviewForm.classList.toggle('hidden');
      });
    }
    if (cancelReviewBtn && reviewForm) {
      cancelReviewBtn.addEventListener('click', () => {
        reviewForm.classList.add('hidden');
      });
    }

    // Star Picker
    const starBtns = container.querySelectorAll('.star-btn');
    const selectedRatingVal = container.querySelector('#selected-rating-val');
    
    function updateStarHighlights(val) {
      starBtns.forEach(btn => {
        const starNum = parseInt(btn.dataset.star, 10);
        if (starNum <= val) {
          btn.classList.add('text-amber-400');
          btn.classList.remove('text-slate-300');
        } else {
          btn.classList.add('text-slate-300');
          btn.classList.remove('text-amber-400');
        }
      });
    }

    updateStarHighlights(5); // default 5

    starBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const star = parseInt(btn.dataset.star, 10);
        selectedRatingVal.value = star;
        updateStarHighlights(star);
      });
    });

    // Review submit
    const submitReviewBtn = container.querySelector('#submit-review-btn');
    if (submitReviewBtn) {
      submitReviewBtn.addEventListener('click', async () => {
        const nameInput = container.querySelector('#review-name-input');
        const titleInput = container.querySelector('#review-title-input');
        const commentInput = container.querySelector('#review-comment-input');

        if (!commentInput.value.trim()) {
          window.toast.warning('Please enter a review comment');
          return;
        }

        const reviewPayload = {
          user_name: nameInput.value.trim() || 'Verified Customer',
          rating: parseInt(selectedRatingVal.value, 10) || 5,
          title: titleInput.value.trim() || 'Verified Customer Review',
          comment: commentInput.value.trim()
        };

        try {
          submitReviewBtn.disabled = true;
          submitReviewBtn.textContent = 'Submitting...';
          const updated = await window.API.addReview(product.id, reviewPayload);
          window.toast.success('Your review was published!');
          if (onReviewSubmitted) onReviewSubmitted(updated);
          this.close(container);
        } catch (err) {
          window.toast.error(err.message);
        } finally {
          submitReviewBtn.disabled = false;
          submitReviewBtn.textContent = 'Submit Review';
        }
      });
    }
  },

  close(container) {
    if (container) container.innerHTML = '';
    this.currentProduct = null;
  }
};

window.ProductModalComponent = ProductModalComponent;
