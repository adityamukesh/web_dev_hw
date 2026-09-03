// filters.js - Sidebar and Filter Toolbar Component
const FiltersComponent = {
  renderSidebar(state) {
    const { filters, categories } = state;

    return `
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-6">
        
        <!-- Header & Reset -->
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
            </svg>
            <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm">Filters & Criteria</h3>
          </div>
          <button 
            id="reset-filters-btn" 
            class="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
          >
            Reset All
          </button>
        </div>

        <!-- Categories Filter -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
            Category
          </label>
          <div class="space-y-1">
            <button 
              data-category="" 
              class="category-filter-btn w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${!filters.category ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'}"
            >
              <span>All Categories</span>
              <span class="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                ${state.pagination.total || 0}
              </span>
            </button>
            ${categories.map(cat => `
              <button 
                data-category="${cat.name}" 
                class="category-filter-btn w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${filters.category === cat.name ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'}"
              >
                <span class="truncate">${cat.name}</span>
                <span class="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                  ${cat.count}
                </span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Price Range Slider -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Max Price
            </label>
            <span id="price-slider-display" class="text-xs font-black text-indigo-600 dark:text-indigo-400">
              $${filters.maxPrice >= 1000 ? '1,000+' : filters.maxPrice}
            </span>
          </div>
          <input 
            type="range" 
            id="price-range-slider" 
            min="50" 
            max="1000" 
            step="25" 
            value="${filters.maxPrice || 1000}" 
            class="w-full accent-indigo-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
          <div class="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
            <span>$50</span>
            <span>$500</span>
            <span>$1,000+</span>
          </div>
        </div>

        <!-- Customer Rating Filter -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Minimum Rating
          </label>
          <div class="grid grid-cols-4 gap-1.5">
            ${[0, 4, 4.5, 4.8].map(r => `
              <button 
                data-rating="${r}" 
                class="rating-filter-btn py-1.5 px-2 rounded-xl text-xs font-semibold text-center border transition-all ${Number(filters.rating) === r ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400' : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'}"
              >
                ${r === 0 ? 'All' : `${r}★+`}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- In Stock Only Switch -->
        <div class="pt-2">
          <label class="flex items-center justify-between cursor-pointer group">
            <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
              In Stock Only
            </span>
            <input 
              type="checkbox" 
              id="instock-filter-checkbox" 
              ${filters.inStock ? 'checked' : ''}
              class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
            />
          </label>
        </div>

      </div>
    `;
  },

  renderToolbar(state) {
    const { filters, pagination, viewMode } = state;
    const activeFilters = [];

    if (filters.q) activeFilters.push({ key: 'q', label: `Search: "${filters.q}"` });
    if (filters.category) activeFilters.push({ key: 'category', label: filters.category });
    if (filters.maxPrice < 1000) activeFilters.push({ key: 'maxPrice', label: `Max $${filters.maxPrice}` });
    if (filters.rating > 0) activeFilters.push({ key: 'rating', label: `Rating ${filters.rating}★+` });
    if (filters.inStock) activeFilters.push({ key: 'inStock', label: 'In Stock' });

    return `
      <div class="space-y-3 mb-6">
        
        <!-- Controls Bar -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          
          <!-- Results Count -->
          <div class="text-sm font-medium text-slate-500 dark:text-slate-400">
            Showing <span class="font-bold text-slate-900 dark:text-slate-100">${state.products.length}</span> of <span class="font-bold text-slate-900 dark:text-slate-100">${pagination.total || 0}</span> products
          </div>

          <!-- Right Sorting & View Mode -->
          <div class="flex items-center gap-3 self-end sm:self-auto">
            
            <!-- Sort Dropdown -->
            <div class="flex items-center gap-2 text-xs font-semibold">
              <span class="text-slate-400 hidden md:inline">Sort by:</span>
              <select 
                id="sort-select" 
                class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="featured" ${filters.sort === 'featured' ? 'selected' : ''}>Featured First</option>
                <option value="price-low" ${filters.sort === 'price-low' ? 'selected' : ''}>Price: Low to High</option>
                <option value="price-high" ${filters.sort === 'price-high' ? 'selected' : ''}>Price: High to Low</option>
                <option value="rating" ${filters.sort === 'rating' ? 'selected' : ''}>Highest Customer Rating</option>
                <option value="reviews" ${filters.sort === 'reviews' ? 'selected' : ''}>Most Reviewed</option>
              </select>
            </div>

            <!-- View Mode Switcher (Grid vs List) -->
            <div class="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button 
                id="view-grid-btn" 
                title="Grid View"
                class="p-1 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
              </button>
              <button 
                id="view-list-btn" 
                title="List View"
                class="p-1 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
              </button>
            </div>

          </div>

        </div>

        <!-- Active Filter Pills Bar -->
        ${activeFilters.length > 0 ? `
          <div class="flex items-center flex-wrap gap-2 pt-1">
            <span class="text-xs text-slate-400 font-semibold">Active filters:</span>
            ${activeFilters.map(f => `
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 text-xs font-medium">
                ${f.label}
                <button data-remove-filter="${f.key}" class="hover:text-rose-500 transition-colors">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </span>
            `).join('')}
            <button id="clear-all-pills-btn" class="text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors ml-1">
              Clear All
            </button>
          </div>
        ` : ''}

      </div>
    `;
  }
};

window.FiltersComponent = FiltersComponent;
