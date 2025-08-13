import { FILTER_CONFIG, CONFIG} from "./config.js";
import { logDebug, showInfo } from "./logger.js";

// === State Management ===
class FilterState {
    constructor() {
        this.allRewards = [];
        this.filteredRewards = [];
        this.filters = {
            search: '',
            categories: [],
            priceMin: FILTER_CONFIG.DEFAULT_PRICE_MIN,
            priceMax: FILTER_CONFIG.DEFAULT_PRICE_MAX,
            sortBy: FILTER_CONFIG.DEFAULT_SORT
        };
        this.debounceTimers = new Map();
        this.lastFilterTime = 0;
        this.renderCallback = null;
        this.availableCategories = [];
    }

    updateRewards(rewards) {
        this.allRewards = [...(rewards || [])];
        this.filteredRewards = [...this.allRewards];
        this.updateAvailableCategories();
    }

    updateAvailableCategories() {
        // Normalize categories first, then get unique values
        const normalizedCategories = this.allRewards
            .map(reward => this.normalizeCategory(reward.category))
            .filter(Boolean);
        
        this.availableCategories = [...new Set(normalizedCategories)].sort();
        console.log('Available categories:', this.availableCategories);
    }

    // Add category normalization method to FilterState
    normalizeCategory(cat) {
        if (!cat) return 'uncategorized';
        
        // Remove extra spaces and convert to lowercase
        cat = cat.trim().toLowerCase();

        // Handle various category name variations
        if (cat === 'decoratiuni' || cat === 'decorații' || cat === 'decorations' || cat === 'decoration') {
            return 'decoratiuni';
        }
        if (cat === 'voucher' || cat === 'vouchere') {
            return 'vouchere';
        }
        if (cat === 'cariera' || cat === 'carieră' || cat === 'education') {
            return 'education';
        }
        if (cat === 'gentech') {
            return 'gentech';
        }
        if (cat === 'abonamente') {
            return 'abonamente';
        }
        if (cat === 'comori') {
            return 'comori';
        }
        
        return cat;
    }

    applyFilters() {
        if (this.allRewards.length === 0) {
            this.filteredRewards = [];
            this.triggerRender();
            return;
        }

        const startTime = performance.now();
        console.log('Applying filters:', this.filters);

        // Apply filters
        this.filteredRewards = this.allRewards.filter(reward => 
            this.matchesSearch(reward) &&
            this.matchesCategory(reward) &&
            this.matchesPrice(reward)
        );

        console.log(`Filtered ${this.filteredRewards.length}/${this.allRewards.length} rewards`);

        // Apply sorting
        this.applySorting();

        // Update timestamp
        this.lastFilterTime = Date.now();

        // Trigger render
        this.triggerRender();

        const duration = performance.now() - startTime;
        logDebug(`🔍 Filters applied in ${duration.toFixed(2)}ms: ${this.filteredRewards.length}/${this.allRewards.length} products`);
    }

    matchesSearch(reward) {
        if (!this.filters.search || this.filters.search.length < FILTER_CONFIG.MIN_SEARCH_LENGTH) {
            return true;
        }

        const searchTerms = this.filters.search.toLowerCase().split(' ').filter(term => term.length > 0);
        const searchableText = [
            reward.name,
            reward.description,
            reward.fullDescription,
            reward.category
        ].filter(Boolean).join(' ').toLowerCase();

        return searchTerms.every(term => searchableText.includes(term));
    }

    matchesCategory(reward) {
        if (this.filters.categories.length === 0) return true;
        
        const rewardCategory = this.normalizeCategory(reward.category);
        return this.filters.categories.some(category => 
            rewardCategory === category || rewardCategory?.includes(category)
        );
    }

    matchesPrice(reward) {
        return reward.price >= this.filters.priceMin && reward.price <= this.filters.priceMax;
    }

    applySorting() {
        const { sortBy } = this.filters;
        console.log('Applying sort:', sortBy);

        switch (sortBy.toLowerCase()) {
            case 'preț crescător':
                this.filteredRewards.sort((a, b) => a.price - b.price);
                break;
            case 'preț descrescător':
                this.filteredRewards.sort((a, b) => b.price - a.price);
                break;
            case 'ordine a-z':
                this.filteredRewards.sort((a, b) => a.name.localeCompare(b.name, 'ro'));
                break;
            case 'ordine z-a':
                this.filteredRewards.sort((a, b) => b.name.localeCompare(a.name, 'ro'));
                break;
            case 'cele mai noi':
                this.filteredRewards.sort((a, b) => (b.id || '').localeCompare(a.id || ''));
                break;
            case 'categorii':
            default:
                this.filteredRewards.sort((a, b) => {
                    const categoryCompare = (a.category || '').localeCompare(b.category || '', 'ro');
                    return categoryCompare !== 0 ? categoryCompare : a.name.localeCompare(b.name, 'ro');
                });
                break;
        }
    }

    triggerRender() {
        if (this.renderCallback && typeof this.renderCallback === 'function') {
            requestAnimationFrame(() => {
                this.renderCallback(this.filteredRewards);
            });
        }
    }

    debounce(key, callback, delay = FILTER_CONFIG.SEARCH_DEBOUNCE) {
        const existingTimer = this.debounceTimers.get(key);
        if (existingTimer) {
            clearTimeout(existingTimer);
        }

        const timer = setTimeout(() => {
            callback();
            this.debounceTimers.delete(key);
        }, delay);

        this.debounceTimers.set(key, timer);
    }

    reset() {
        this.filters = {
            search: '',
            categories: [],
            priceMin: FILTER_CONFIG.DEFAULT_PRICE_MIN,
            priceMax: FILTER_CONFIG.DEFAULT_PRICE_MAX,
            sortBy: FILTER_CONFIG.DEFAULT_SORT
        };
        this.debounceTimers.clear();
        this.applyFilters();
    }

    getStats() {
        return {
            total: this.allRewards.length,
            filtered: this.filteredRewards.length,
            categories: this.availableCategories.length,
            priceRange: this.allRewards.length > 0 ? {
                min: Math.min(...this.allRewards.map(r => r.price)),
                max: Math.max(...this.allRewards.map(r => r.price))
            } : { min: 0, max: 0 },
            lastUpdate: this.lastFilterTime
        };
    }
}

const state = new FilterState();

// === DOM Elements Cache ===
const elements = {
    // Filter controls
    filterBtn: null,
    filterDropdown: null,
    applyBtn: null,
    
    // Sort controls
    sortBtn: null,
    sortDropdown: null,
    
    // Search controls
    searchInput: null,
    searchBtn: null,
    
    // Price controls
    priceSlider: null,
    minPriceInput: null,
    maxPriceInput: null,
    
    // Category checkboxes (populated dynamically)
    categoryContainer: null,
    
    // Results
    rewardsGrid: null
};

// === Initialization ===
export const initFilterSort = () => {
    cacheElements();
    setupEventListeners();
    setupPriceControls();
    initializeSortOptions();
    
    logDebug('🔍 Filter-Sort module initialized');
};

const cacheElements = () => {
    elements.filterBtn = document.querySelector('.filter-btn');
    elements.filterDropdown = document.querySelector('#filterDropdown');
    elements.applyBtn = elements.filterDropdown?.querySelector('.apply-btn');
    
    elements.sortBtn = document.querySelector('#sort-toggle');
    elements.sortDropdown = document.querySelector('#sortDropdown');
    
    elements.searchInput = document.querySelector('#search-input');
    elements.searchBtn = document.querySelector('.search-btn');
    
    elements.priceSlider = document.querySelector('#price-slider');
    elements.minPriceInput = document.querySelector('#min-price');
    elements.maxPriceInput = document.querySelector('#max-price');
    
    elements.categoryContainer = document.querySelector('.filter-grid');
    elements.rewardsGrid = document.querySelector('#rewards-grid');
    
    console.log('Elements cached:', elements);
    logDebug('🔧 Filter-Sort DOM elements cached');
};

// === Public API ===
export const setRewardsData = (rewards) => {
    console.log('Setting rewards data:', rewards.length);
    state.updateRewards(rewards);
    updateCategoryCheckboxes();
    state.applyFilters();
    
    logDebug(`📦 Filter-Sort loaded ${rewards?.length || 0} rewards`);
};

export const setRenderCallback = (callback) => {
    state.renderCallback = callback;
    console.log('Render callback set');
};

export const setRewardsGrid = (gridElement) => {
    elements.rewardsGrid = gridElement;
};

export const getFilteredRewards = () => [...state.filteredRewards];

export const getCurrentFilters = () => ({ ...state.filters });

export const getFilterStats = () => state.getStats();

// === Filter Operations ===
export const searchRewards = (query) => {
    console.log('Search query:', query);
    if (elements.searchInput) {
        elements.searchInput.value = query;
    }
    state.filters.search = query.toLowerCase().trim();
    state.debounce('search', () => state.applyFilters());
};

export const filterByCategory = (category) => {
    const categoryLower = state.normalizeCategory(category);
    console.log('Filter by category:', categoryLower);
    
    if (!state.filters.categories.includes(categoryLower)) {
        state.filters.categories.push(categoryLower);
        updateCategoryUI();
        state.applyFilters();
    }
};

export const sortBy = (sortType) => {
    console.log('Sort by:', sortType);
    state.filters.sortBy = sortType;
    updateSortUI();
    state.applyFilters();
};

export const setPriceRange = (min, max) => {
    state.filters.priceMin = Math.max(0, min);
    state.filters.priceMax = Math.max(state.filters.priceMin, max);
    
    updatePriceUI();
    state.applyFilters();
};

export const resetFilters = () => {
    state.reset();
    resetUI();
    showInfo('Toate filtrele au fost resetate', 2000);
};

// === Event Listeners ===
const setupEventListeners = () => {
    // Toggle dropdowns
    elements.filterBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown('filter');
    });

    elements.sortBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown('sort');
    });

    // Search functionality
    setupSearchListeners();
    
    // Filter actions
    elements.applyBtn?.addEventListener('click', handleFilterApply);
    
    // Category filters
    elements.categoryContainer?.addEventListener('change', handleCategoryChange);
    
    // Sort options
    elements.sortDropdown?.addEventListener('click', handleSortClick);
    
    // Close dropdowns
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    
    logDebug('🎧 Filter-Sort event listeners setup');
};

const setupSearchListeners = () => {
    // Search input with debounce
    elements.searchInput?.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        state.filters.search = query.toLowerCase();
        
        state.debounce('search', () => {
            state.applyFilters();
        });
    });

    // Search button
    elements.searchBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        const query = elements.searchInput?.value.trim() || '';
        searchRewards(query);
    });

    // Enter key
    elements.searchInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = e.target.value.trim();
            searchRewards(query);
        }
    });
};

const setupPriceControls = () => {
    if (!elements.priceSlider || !elements.minPriceInput || !elements.maxPriceInput) {
        return;
    }

    // Price slider
    elements.priceSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        elements.maxPriceInput.value = value;
        state.filters.priceMax = value;
        state.applyFilters(); // Apply filters immediately on price change
    });

    // Min price input
    elements.minPriceInput.addEventListener('input', (e) => {
        const value = parseInt(e.target.value) || FILTER_CONFIG.DEFAULT_PRICE_MIN;
        state.filters.priceMin = value;
        elements.priceSlider.min = value;
        state.applyFilters(); // Apply filters immediately on price change
    });

    // Max price input
    elements.maxPriceInput.addEventListener('input', (e) => {
        const value = parseInt(e.target.value) || FILTER_CONFIG.DEFAULT_PRICE_MAX;
        state.filters.priceMax = value;
        elements.priceSlider.value = value;
        state.applyFilters(); // Apply filters immediately on price change
    });
};

// === Event Handlers ===
const toggleDropdown = (type) => {
    if (type === 'filter') {
        elements.filterDropdown?.classList.toggle('hidden');
        elements.sortDropdown?.classList.add('hidden');
    } else if (type === 'sort') {
        elements.sortDropdown?.classList.toggle('hidden');
        elements.filterDropdown?.classList.add('hidden');
    }
};

const handleOutsideClick = (e) => {
    if (!e.target.closest('.filter-dropdown') && !e.target.closest('.filter-btn')) {
        elements.filterDropdown?.classList.add('hidden');
    }
    
    if (!e.target.closest('.sort-dropdown') && !e.target.closest('#sort-toggle')) {
        elements.sortDropdown?.classList.add('hidden');
    }
};

const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
        elements.filterDropdown?.classList.add('hidden');
        elements.sortDropdown?.classList.add('hidden');
    }
};

const handleFilterApply = (e) => {
    e.preventDefault();
    console.log('Apply filters clicked');
    
    // Update price filters from inputs
    state.filters.priceMin = parseInt(elements.minPriceInput?.value) || FILTER_CONFIG.DEFAULT_PRICE_MIN;
    state.filters.priceMax = parseInt(elements.maxPriceInput?.value) || FILTER_CONFIG.DEFAULT_PRICE_MAX;
    
    // Update category filters
    updateCategoryFilters();
    
    // Apply filters
    state.applyFilters();
    
    // Close dropdown
    elements.filterDropdown?.classList.add('hidden');
    
    // Show feedback
    showFilterFeedback();
};

const handleCategoryChange = (e) => {
    console.log('Category change:', e.target);
    if (e.target.type === 'checkbox' && e.target.name === 'category') {
        updateCategoryFilters();
        state.applyFilters(); // Apply filters immediately on category change
    }
};

const handleSortClick = (e) => {
    if (e.target.tagName === 'LI') {
        const sortText = e.target.textContent.replace(' ✓', '').trim();
        console.log('Sort clicked:', sortText);
        sortBy(sortText);
        elements.sortDropdown?.classList.add('hidden');
    }
};

// === UI Updates ===
const updateCategoryCheckboxes = () => {
    if (!elements.categoryContainer || state.availableCategories.length === 0) {
        console.log('No category container or categories');
        return;
    }

    console.log('Updating category checkboxes with:', state.availableCategories);

    // Create a mapping between checkbox values and normalized categories
    const checkboxMapping = {
        'voucher': 'vouchere',
        'vouchere': 'vouchere',
        'decoration': 'decoratiuni',
        'decoratiuni': 'decoratiuni',
        'abonamente': 'abonamente',
        'gentech': 'gentech',
        'education': 'education',
        'comori': 'comori'
    };

    // Show/hide existing checkboxes based on available categories
    const checkboxes = elements.categoryContainer.querySelectorAll('input[name="category"]');
    checkboxes.forEach(checkbox => {
        const option = checkbox.closest('.filter-option');
        if (option) {
            const checkboxValue = checkbox.value.toLowerCase();
            const normalizedValue = checkboxMapping[checkboxValue] || checkboxValue;
            const isAvailable = state.availableCategories.includes(normalizedValue);
            
            console.log(`Checkbox ${checkboxValue} -> ${normalizedValue}, available: ${isAvailable}`);
            
            option.style.display = isAvailable ? '' : 'none';
        }
    });
    
    logDebug('📂 Category checkboxes updated');
};

const updateCategoryFilters = () => {
    const selectedCategories = [];
    const checkboxes = elements.categoryContainer?.querySelectorAll('input[name="category"]:checked') || [];
    
    console.log('Updating category filters, checked boxes:', checkboxes.length);
    
    checkboxes.forEach(cb => {
        const normalizedCategory = state.normalizeCategory(cb.value);
        selectedCategories.push(normalizedCategory);
        console.log(`Selected category: ${cb.value} -> ${normalizedCategory}`);
    });
    
    state.filters.categories = selectedCategories;
    console.log('Final selected categories:', state.filters.categories);
};

const updateCategoryUI = () => {
    if (!elements.categoryContainer) return;
    
    const checkboxes = elements.categoryContainer.querySelectorAll('input[name="category"]');
    checkboxes.forEach(checkbox => {
        const normalizedValue = state.normalizeCategory(checkbox.value);
        checkbox.checked = state.filters.categories.includes(normalizedValue);
    });
};

const updateSortUI = () => {
    if (!elements.sortDropdown) return;

    const items = elements.sortDropdown.querySelectorAll('li');
    items.forEach(item => {
        const text = item.textContent.replace(' ✓', '').trim();
        const isActive = text.toLowerCase() === state.filters.sortBy.toLowerCase();
        
        item.classList.toggle('active', isActive);
        
        if (isActive) {
            item.innerHTML = `${text} <span class="checkmark">✓</span>`;
        } else {
            item.innerHTML = text;
        }
    });
};

const updatePriceUI = () => {
    if (elements.minPriceInput) elements.minPriceInput.value = state.filters.priceMin;
    if (elements.maxPriceInput) elements.maxPriceInput.value = state.filters.priceMax;
    if (elements.priceSlider) {
        elements.priceSlider.min = state.filters.priceMin;
        elements.priceSlider.value = state.filters.priceMax;
    }
};

const resetUI = () => {
    // Reset search
    if (elements.searchInput) elements.searchInput.value = '';
    
    // Reset categories
    updateCategoryUI();
    
    // Reset prices
    updatePriceUI();
    
    // Reset sort
    initializeSortOptions();
};

const initializeSortOptions = () => {
    if (!elements.sortDropdown) return;

    const items = elements.sortDropdown.querySelectorAll('li');
    items.forEach(item => item.classList.remove('active'));

    const defaultItem = elements.sortDropdown.querySelector('li');
    if (defaultItem) {
        defaultItem.classList.add('active');
        defaultItem.innerHTML = `Categorii <span class="checkmark">✓</span>`;
    }
};

const showFilterFeedback = () => {
    const stats = state.getStats();
    const activeFilters = [];
    
    if (state.filters.search) {
        activeFilters.push(`căutare: "${state.filters.search}"`);
    }
    
    if (state.filters.categories.length > 0) {
        activeFilters.push(`categorii: ${state.filters.categories.join(', ')}`);
    }
    
    if (state.filters.priceMin > FILTER_CONFIG.DEFAULT_PRICE_MIN || 
        state.filters.priceMax < FILTER_CONFIG.DEFAULT_PRICE_MAX) {
        activeFilters.push(`preț: ${state.filters.priceMin} - ${state.filters.priceMax} AP`);
    }

    const message = activeFilters.length > 0 
        ? `${stats.filtered} produse găsite cu filtrele: ${activeFilters.join(', ')}`
        : `Toate ${stats.total} produsele afișate`;

    console.log('Filter feedback:', message);
    
    if (CONFIG.DEBUG_MODE) {
        logDebug('🔍 Filter feedback:', message);
    }
};

// === Global Functions (for HTML onclick) ===
if (typeof window !== 'undefined') {
    window.clearAllFilters = resetFilters;
    window.GTShopFilters = {
        search: searchRewards,
        filterByCategory,
        sortBy,
        setPriceRange,
        reset: resetFilters,
        getStats: getFilterStats,
        getCurrentFilters
    };
}

export default initFilterSort;