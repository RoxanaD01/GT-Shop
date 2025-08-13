import { getRewards } from "./api.js";
import { addItemToCart } from "./cart.js";
import { CONFIG } from "./config.js";
import { logDebug, showError, showSuccess } from "./logger.js";
import { initFilterSort, setRewardsData, setRenderCallback, setRewardsGrid } from "./filter-sort.js";

let allRewards = [];
let selectedReward = null;
let categorizedRewards = {};

const elements = {
    rewardsGrid: null,
    modal: null,
    modalElements: {}
};

// Updated category mapping to match both JSON and HTML
const categoryMapping = {
    'vouchere': 'Vouchere',
    'voucher': 'Vouchere', // Handle both variations
    'abonamente': 'Abonamente', 
    'decoratiuni': 'Decorațiuni',
    'decoration': 'Decorațiuni', // Handle HTML variation
    'gentech': 'GenTech',
    'education': 'Carieră',
    'cariera': 'Carieră', // Handle JSON variation
    'comori': 'Comori'
};

// Centralized category normalization (should match filter-sort.js)
const normalizeCategory = (cat) => {
    if (!cat) return 'uncategorized';
    
    // Remove extra spaces and convert to lowercase
    cat = cat.trim().toLowerCase();
    
    console.log(`Normalizing category: "${cat}"`);

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
    
    console.log(`Category normalized to: "${cat}"`);
    return cat;
};

export const initRewards = () => {
    cacheElements();
    setupEventListeners();
    initFilterSort();
    setupFilterIntegration();
    
    logDebug('🎁 Rewards module initialized');
};

const cacheElements = () => {
    elements.rewardsGrid = document.querySelector('#rewards-grid');
    elements.modal = document.querySelector('#reward-modal');
    
    if (elements.modal) {
        elements.modalElements = {
            image: elements.modal.querySelector("#modal-image"),
            name: elements.modal.querySelector('#modal-name'),
            description: elements.modal.querySelector("#modal-fullDescription"),
            price: elements.modal.querySelector("#modal-price"),
            addToCartBtn: elements.modal.querySelector("#add-to-cart-btn"),
            closeBtn: elements.modal.querySelector("#close-reward")
        };
    }
    
    console.log('Rewards elements cached:', elements);
    logDebug('🔧 DOM elements cached');
};

const setupFilterIntegration = () => {
    if (elements.rewardsGrid) {
        setRewardsGrid(elements.rewardsGrid);
    }
    
    setRenderCallback(renderFilteredRewards);
    
    console.log('Filter integration setup complete');
    logDebug('🔗 Filter integration setup complete');
};

export const loadRewards = async () => {
    if (!elements.rewardsGrid) {
        console.error('Rewards grid element not found');
        return;
    }

    try {
        showLoadingState();
        
        const response = await getRewards();
        allRewards = response.rewards || [];
        
        console.log('Raw rewards loaded:', allRewards.length);
        console.log('Sample reward categories:', allRewards.slice(0, 5).map(r => r.category));
        
        // Normalize categories in rewards data
        allRewards = allRewards.map(reward => ({
            ...reward,
            normalizedCategory: normalizeCategory(reward.category)
        }));
        
        console.log('Normalized sample categories:', allRewards.slice(0, 5).map(r => r.normalizedCategory));
        
        categorizeRewards();
        setRewardsData(allRewards);
        renderCollapsibleCategories();
        logDebug(`🎁 Loaded ${allRewards.length} rewards`);
        
    } catch (error) {
        console.error("❌ Error loading rewards:", error);
        showErrorState(error.message);
    }
};

const categorizeRewards = () => {
    categorizedRewards = {};
    
    allRewards.forEach(reward => {
        const category = normalizeCategory(reward.category);
        if (!categorizedRewards[category]) {
            categorizedRewards[category] = [];
        }
        categorizedRewards[category].push(reward);
    });
    
    console.log('Categorized rewards:', Object.keys(categorizedRewards));
    logDebug('📂 Rewards categorized:', Object.keys(categorizedRewards));
};

const renderCollapsibleCategories = () => {
    if (!elements.rewardsGrid) {
        console.error('No rewards grid element found');
        return;
    }

    console.log('Rendering collapsible categories...');
    
    // Use the same category order as in filter-sort
    const categoryOrder = ['vouchere', 'abonamente', 'decoratiuni', 'gentech', 'education', 'comori'];
    const sortedCategories = categoryOrder.filter(cat => categorizedRewards[cat] && categorizedRewards[cat].length > 0);
    
    // Add categories that exist in data but aren't in the predefined order
    Object.keys(categorizedRewards).forEach(cat => {
        if (!categoryOrder.includes(cat) && categorizedRewards[cat].length > 0) {
            sortedCategories.push(cat);
        }
    });

    console.log('Sorted categories to render:', sortedCategories);

    const categoriesHTML = sortedCategories.map(category => 
        createCategorySection(category, categorizedRewards[category])
    ).join('');

    elements.rewardsGrid.innerHTML = categoriesHTML;
    
    // Setup collapse functionality
    setupCollapseListeners();
    
    console.log(`Rendered ${sortedCategories.length} collapsible categories`);
    logDebug(`📦 Rendered ${sortedCategories.length} collapsible categories`);
};

const createCategorySection = (category, rewards) => {
    const categoryName = categoryMapping[category] || category.charAt(0).toUpperCase() + category.slice(1);
    const categoryId = `category-${category}`;
    
    console.log(`Creating category section: ${category} -> ${categoryName} (${rewards.length} items)`);
    
    return `
        <div class="category-section" data-category="${category}">
            <div class="category-header" data-target="${categoryId}" role="button" tabindex="0" aria-expanded="true">
                <h3 class="category-title">${categoryName}</h3>
                <div class="category-toggle">
                    <svg class="chevron" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                </div>
            </div>
            <div class="category-content" id="${categoryId}">
                <div class="category-grid">
                    ${rewards.map(reward => createRewardCard(reward)).join('')}
                </div>
            </div>
        </div>
    `;
};

const renderFilteredRewards = (rewardsToRender) => {
    if (!elements.rewardsGrid) {
        console.error('No rewards grid element found for filtered render');
        return;
    }

    console.log(`Rendering ${rewardsToRender.length} filtered rewards`);

    if (rewardsToRender.length === 0) {
        elements.rewardsGrid.innerHTML = `
            <div class="no-results">
                <p>🔍 Nu am găsit produse care să corespundă criteriilor</p>
                <button onclick="clearAllFilters()">Șterge filtrele</button>
            </div>
        `;
        return;
    }

    // Re-categorize filtered rewards
    const filteredCategorized = {};
    rewardsToRender.forEach(reward => {
        const category = normalizeCategory(reward.category);
        if (!filteredCategorized[category]) {
            filteredCategorized[category] = [];
        }
        filteredCategorized[category].push(reward);
    });

    console.log('Filtered categorized:', Object.keys(filteredCategorized));

    // Use the same category order
    const categoryOrder = ['vouchere', 'abonamente', 'decoratiuni', 'gentech', 'education', 'comori'];
    const sortedCategories = categoryOrder.filter(cat => filteredCategorized[cat] && filteredCategorized[cat].length > 0);
    
    // Add other categories
    Object.keys(filteredCategorized).forEach(cat => {
        if (!categoryOrder.includes(cat) && filteredCategorized[cat].length > 0) {
            sortedCategories.push(cat);
        }
    });

    const categoriesHTML = sortedCategories.map(category => 
        createCategorySection(category, filteredCategorized[category])
    ).join('');

    elements.rewardsGrid.innerHTML = categoriesHTML;
    setupCollapseListeners();
    
    console.log(`Rendered ${rewardsToRender.length} filtered rewards in ${sortedCategories.length} categories`);
    logDebug(`📦 Rendered ${rewardsToRender.length} filtered reward cards in ${sortedCategories.length} categories`);
};

const createRewardCard = (reward) => {
    const isOutOfStock = !reward.inStock || reward.stockCount <= 0; 
    const normalizedCategory = normalizeCategory(reward.category);

    return `   
        <article class="reward-card ${normalizedCategory} ${isOutOfStock ? 'out-of-stock' : ''}" 
                 data-reward-id="${reward.id}"
                 data-category="${normalizedCategory}"
                 data-price="${reward.price}"
                 data-action="open-modal"
                 role="button"
                 tabindex="0"
                 aria-label="Vezi detalii ${escapeHtml(reward.name)} - ${reward.price} AP">
            
            <div class="reward-image">
                <img src="${escapeHtml(reward.image)}"
                    alt="${escapeHtml(reward.name)}"
                    loading="lazy"
                    onerror="this.style.display='none'"/>
                ${isOutOfStock ? '<div class="stock-overlay">Stoc epuizat</div>' : ''}
            </div>
        </article>
    `;
};

const setupCollapseListeners = () => {
    const headers = document.querySelectorAll('.category-header');
    
    console.log(`Setting up collapse listeners for ${headers.length} headers`);
    
    headers.forEach(header => {
        // Remove existing listeners by cloning
        const newHeader = header.cloneNode(true);
        header.parentNode.replaceChild(newHeader, header);
        
        newHeader.addEventListener('click', () => {
            toggleCategory(newHeader);
        });
        
        newHeader.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleCategory(newHeader);
            }
        });
    });
    
    logDebug('🎯 Collapse listeners setup complete');
};

const toggleCategory = (header) => {
    const targetId = header.getAttribute('data-target');
    const content = document.getElementById(targetId);
    const chevron = header.querySelector('.chevron');
    const isExpanded = header.getAttribute('aria-expanded') === 'true';
    
    if (!content) {
        console.error('No content found for', targetId);
        return;
    }
    
    console.log(`Toggling category ${targetId}, currently expanded: ${isExpanded}`);
    
    if (isExpanded) {
        // Collapse
        content.style.maxHeight = '0px';
        content.style.opacity = '0';
        header.setAttribute('aria-expanded', 'false');
        chevron.style.transform = 'rotate(0deg)';
        
        setTimeout(() => {
            content.style.display = 'none';
        }, 300);
    } else {
        // Expand
        content.style.display = 'block';
        content.style.maxHeight = 'none';
        const scrollHeight = content.scrollHeight;
        content.style.maxHeight = '0px';
        
        requestAnimationFrame(() => {
            content.style.maxHeight = scrollHeight + 'px';
            content.style.opacity = '1';
            header.setAttribute('aria-expanded', 'true');
            chevron.style.transform = 'rotate(180deg)';
        });
        
        setTimeout(() => {
            content.style.maxHeight = 'none';
        }, 300);
    }
    
    logDebug(`🔄 Category ${targetId} ${isExpanded ? 'collapsed' : 'expanded'}`);
};

const openRewardModal = (rewardId) => {
    selectedReward = allRewards.find(reward => reward.id === rewardId);
    
    if (!selectedReward || !elements.modal) {
        console.error('Cannot open modal - reward or modal element not found');
        return;
    }

    console.log('Opening modal for:', selectedReward.name);

    const { image, name, description, price, addToCartBtn } = elements.modalElements;

    if (image) {
        image.src = selectedReward.image;
        image.alt = selectedReward.name;
        image.onerror = () => {
            image.src = '';
            image.style.display = 'none';
        };
    }
    
    if (name) name.textContent = selectedReward.name;
    if (description) description.textContent = selectedReward.fullDescription || selectedReward.description;
    if (price) price.textContent = `${selectedReward.price}`;
    
    if (addToCartBtn) {
        addToCartBtn.disabled = !selectedReward.inStock;
        addToCartBtn.textContent = selectedReward.inStock ? 'Adaugă în Coș' : 'Indisponibil';
    }

    elements.modal.classList.remove('hidden');
    elements.modal.setAttribute('aria-hidden', 'false');
    
    // Focus management
    const firstFocusable = elements.modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) firstFocusable.focus();
    
    logDebug('📋 Modal opened for reward:', selectedReward.name);
};

const closeRewardModal = () => {
    if (!elements.modal) return;
    
    console.log('Closing modal');
    
    elements.modal.classList.add('hidden');
    elements.modal.setAttribute('aria-hidden', 'true');
    
    const rewardId = selectedReward?.id;
    selectedReward = null;
    
    // Return focus to the card that opened the modal
    if (rewardId) {
        const activeCard = document.querySelector(`[data-reward-id="${rewardId}"]`);
        if (activeCard) activeCard.focus();
    }
    
    logDebug('📋 Modal closed');
};

const setupEventListeners = () => {
    console.log('Setting up rewards event listeners');
    
    // Use event delegation for better performance
    document.addEventListener('click', (e) => {
        // Handle reward card clicks
        const rewardCard = e.target.closest('.reward-card');
        
        if (rewardCard && rewardCard.getAttribute('data-action') === 'open-modal') {
            e.preventDefault();
            const rewardId = rewardCard.getAttribute('data-reward-id');
            const isOutOfStock = rewardCard.classList.contains('out-of-stock');
            
            console.log('Reward card clicked:', rewardId, 'out of stock:', isOutOfStock);
            
            if (rewardId && !isOutOfStock) {
                openRewardModal(rewardId);
            }
            return;
        }
        
        // Handle modal close buttons
        if (e.target.matches('#close-reward') || e.target.closest('#close-reward')) {
            closeRewardModal();
            return;
        }
        
        // Handle add to cart
        if (e.target.matches('#add-to-cart-btn')) {
            if (selectedReward && selectedReward.inStock) {
                handleAddToCart(selectedReward);
            }
            return;
        }
        
        // Handle modal backdrop clicks
        if (e.target.classList.contains('modal') && e.target.id === 'reward-modal') {
            closeRewardModal();
            return;
        }
    });

    // Handle keyboard interactions
    document.addEventListener('keydown', (e) => {
        // Close modal with Escape
        if (e.key === 'Escape' && !elements.modal?.classList.contains('hidden')) {
            closeRewardModal();
            return;
        }
        
        // Handle reward card keyboard activation
        if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('reward-card')) {
            e.preventDefault();
            const rewardId = e.target.getAttribute('data-reward-id');
            const isOutOfStock = e.target.classList.contains('out-of-stock');
            
            if (rewardId && !isOutOfStock) {
                openRewardModal(rewardId);
            }
            return;
        }
    });
    
    console.log('Rewards event listeners setup complete');
    logDebug('🎧 Event listeners setup complete');
};

const handleAddToCart = async (reward) => {
    try {
        console.log('Adding to cart:', reward.name);
        closeRewardModal();
        await new Promise(resolve => setTimeout(resolve, 200));
        await addItemToCart(reward);
        showSuccess(`${reward.name} a fost adăugat în coș!`);
        logDebug('🛒 Item added to cart:', reward.name);
        
    } catch (error) {
        console.error('❌ Failed to add item to cart:', error);
        showError('Nu s-a putut adăuga produsul în coș. Încearcă din nou.');
    }
};

const showLoadingState = () => {
    if (elements.rewardsGrid) {
        elements.rewardsGrid.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Se încarcă produsele...</p>
            </div>
        `;
    }
};

const showErrorState = (message) => {
    if (elements.rewardsGrid) {
        elements.rewardsGrid.innerHTML = `
            <div class="error-state">
                <p>❌ ${message}</p>
                <button onclick="window.location.reload()">Reîncarcă pagina</button>
            </div>
        `;
    }
};

const escapeHtml = (text) => {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

// Export functions for category management
export const expandAllCategories = () => {
    const headers = document.querySelectorAll('.category-header[aria-expanded="false"]');
    console.log(`Expanding ${headers.length} categories`);
    headers.forEach(header => toggleCategory(header));
};

export const collapseAllCategories = () => {
    const headers = document.querySelectorAll('.category-header[aria-expanded="true"]');
    console.log(`Collapsing ${headers.length} categories`);
    headers.forEach(header => toggleCategory(header));
};

export const getRewardsData = () => ({
    all: [...allRewards],
    categorized: {...categorizedRewards},
    selected: selectedReward
});

export const refreshRewards = () => {
    console.log('Refreshing rewards...');
    loadRewards();
};

// Export filter functions from filter-sort module
export { searchRewards, filterByCategory, sortBy, setPriceRange, resetFilters as clearAllFilters } from "./filter-sort.js";