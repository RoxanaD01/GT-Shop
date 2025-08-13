import { getUserHistory } from "./api.js";
import { CONFIG } from "./config.js";
import { logDebug, showError } from "./logger.js";

// === State Management ===
class HistoryState {
    constructor() {
        this.data = [];
        this.isLoading = false;
        this.lastUpdated = null;
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
    }

    get isDataStale() {
        return !this.lastUpdated || (Date.now() - this.lastUpdated > this.cacheExpiry);
    }

    updateData(data) {
        this.data = data || [];
        this.lastUpdated = Date.now();
        this.isLoading = false;
    }

    clearCache() {
        this.data = [];
        this.lastUpdated = null;
    }
}

const state = new HistoryState();

// === DOM Elements Cache ===
const elements = {
    modal: null,
    list: null,
    closeBtn: null,
    triggerBtn: null
};

// === Initialization ===
export const initHistory = () => {
    cacheElements();
    setupEventListeners();
    setupCustomEvents();
    
    logDebug('📋 History module initialized');
};

const cacheElements = () => {
    elements.modal = document.querySelector("#history-modal");
    elements.list = document.querySelector("#history-list");
    elements.closeBtn = document.querySelector("#close-history");
    elements.triggerBtn = document.querySelector("#history-btn");
    
    if (!elements.modal || !elements.list) {
        console.warn('⚠️ History: Required DOM elements not found');
    }
};

// === Main Functions ===
export const openHistory = async () => {
    if (!elements.modal || !elements.list) {
        showError('Istoricul nu poate fi afișat');
        return;
    }

    showModal();
    
    if (state.isLoading) {
        showLoadingState();
        return;
    }

    try {
        await loadHistoryData();
        renderHistory();
    } catch (error) {
        console.error('❌ History loading failed:', error);
        showErrorState();
    }
};

const loadHistoryData = async () => {
    if (!state.isDataStale && state.data.length > 0) {
        logDebug('📋 Using cached history data');
        return;
    }

    state.isLoading = true;
    showLoadingState();

    try {
        const response = await getUserHistory();
        state.updateData(response.purchases);
        
        logDebug(`📋 History loaded: ${state.data.length} purchases`);
    } catch (error) {
        state.isLoading = false;
        throw error;
    }
};

const renderHistory = () => {
    if (!elements.list) return;

    if (state.data.length === 0) {
        renderEmptyState();
        return;
    }

    const groupedOrders = groupOrdersById(state.data);
    const sortedOrders = Object.entries(groupedOrders)
        .sort(([, a], [, b]) => new Date(b[0].purchaseDate) - new Date(a[0].purchaseDate));

    elements.list.innerHTML = sortedOrders
        .map(([orderId, items]) => renderOrderGroup(orderId, items))
        .join('');

    logDebug(`📋 Rendered ${sortedOrders.length} order groups`);
};

// === Rendering Functions ===
const renderOrderGroup = (orderId, items) => {
    const firstItem = items[0];
    const totalPoints = items.reduce((sum, item) => sum + item.pointsSpent, 0);
    const formattedDate = formatDate(firstItem.purchaseDate);

    return `
        <div class="order-container" data-order-id="${escapeHtml(orderId)}">
            <div class="order-header">
                <h3 class="order-id">${escapeHtml(orderId)}</h3>
                
            </div>
            <div class="order-meta">
                    <span class="order-date"> Data: ${formattedDate}</span> ➖ <span class="order-total">${totalPoints} AP</span>
                </div>
                
            <div class="order-items">
                ${items.map(renderOrderItem).join('')}
            </div>
        </div>
    `;
};

const renderOrderItem = (item) => {
    const physical = !!item.awbNumber;
    
    return `
        <div class="order-item ${physical ? 'physical-item' : 'virtual-item'}">
            <div class="item-info">
                <div class="item-quantity">${item.quantity}x</div>
                <div class="item-type-indicator">
                    <div class="item-icon ${physical ? 'physical' : 'virtual'}" 
                         title="${physical ? 'Produs fizic' : 'Produs digital'}"></div>
                </div>
                <div class="item-details">
                    <span class="item-name" title="${escapeHtml(item.rewardName)}">
                        ${escapeHtml(item.rewardName)}
                    </span>
                    ${physical ? 
                        `<div class="awb-container">
                            <span class="awb-number" title="Număr AWB pentru urmărire">
                                ${item.awbNumber}
                            </span>
                        </div>` : 
                        '<span class="virtual-label">Obiect Digital</span>'
                    }
                </div>
            </div>
            <div class="item-points">${item.pointsSpent} ⚡</div>
        </div>
    `;
};

const renderEmptyState = () => {
    elements.list.innerHTML = `
        <div class="history-empty">
            <div class="empty-icon">📋</div>
            <h4>Istoric gol</h4>
            <p>Nu ai făcut încă nicio achiziție din magazin.</p>
        </div>
    `;
};

const showLoadingState = () => {
    if (elements.list) {
        elements.list.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Se încarcă istoricul...</p>
            </div>
        `;
    }
};

const showErrorState = () => {
    if (elements.list) {
        elements.list.innerHTML = `
            <div class="error-state">
                <div class="error-icon">❌</div>
                <h4>Eroare la încărcare</h4>
                <p>Nu am putut încărca istoricul comenzilor.</p>
                <button class="retry-btn" onclick="window.GTShop?.refreshHistory?.()">
                    Încearcă din nou
                </button>
            </div>
        `;
    }
};

// === Modal Management ===
const showModal = () => {
    if (!elements.modal) return;

    elements.modal.classList.remove("hidden");
    elements.modal.setAttribute('aria-hidden', 'false');
    
    // Focus management
    const firstFocusable = elements.modal.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 100);
    }

    document.body.classList.add('modal-open');
    logDebug('📋 History modal opened');
};

const hideModal = () => {
    if (!elements.modal) return;

    elements.modal.classList.add("hidden");
    elements.modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');

    // Return focus to trigger button
    if (elements.triggerBtn) {
        setTimeout(() => elements.triggerBtn.focus(), 100);
    }

    logDebug('📋 History modal closed');
};

// === Event Listeners ===
const setupEventListeners = () => {
    // Trigger button
    elements.triggerBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        openHistory();
    });

    // Close button
    elements.closeBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        hideModal();
    });

    // Modal backdrop click
    elements.modal?.addEventListener('click', (e) => {
        if (e.target === elements.modal) {
            hideModal();
        }
    });

    // Keyboard events
    setupKeyboardEvents();
};

const setupKeyboardEvents = () => {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !elements.modal?.classList.contains('hidden')) {
            hideModal();
        }
    });
};

const setupCustomEvents = () => {
    // Refresh history after successful checkout
    document.addEventListener('cartCheckoutSuccess', () => {
        logDebug('📋 Refreshing history after checkout');
        setTimeout(() => {
            state.clearCache();
            if (!elements.modal?.classList.contains('hidden')) {
                openHistory();
            }
        }, 1000);
    });

    // Listen for manual refresh requests
    document.addEventListener('refreshHistory', () => {
        refreshHistory();
    });
};

// === Utility Functions ===
const groupOrdersById = (orders) => {
    return orders.reduce((groups, order) => {
        const orderId = order.id || 'UNKNOWN';
        if (!groups[orderId]) {
            groups[orderId] = [];
        }
        groups[orderId].push(order);
        return groups;
    }, {});
};

const formatDate = (timestamp) => {
    try {
        const date = new Date(timestamp);
        return date.toLocaleString('ro-RO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return 'Dată invalidă';
    }
};

const escapeHtml = (text) => {
    if (typeof text !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

// === Public API ===
export const refreshHistory = () => {
    state.clearCache();
    if (!elements.modal?.classList.contains('hidden')) {
        openHistory();
    }
    logDebug('📋 History refresh requested');
};

export const getHistoryData = () => [...state.data];

export const getHistoryStats = () => ({
    totalPurchases: state.data.length,
    totalSpent: state.data.reduce((sum, item) => sum + item.pointsSpent, 0),
    uniqueOrders: new Set(state.data.map(item => item.id)).size,
    physicalItems: state.data.filter(item => !!item.awbNumber).length,
    lastUpdated: state.lastUpdated
});

export const closeHistory = hideModal;

// === Global Access ===
if (typeof window !== 'undefined') {
    window.GTShopHistory = {
        open: openHistory,
        close: hideModal,
        refresh: refreshHistory,
        getStats: getHistoryStats
    };
}

export default initHistory;