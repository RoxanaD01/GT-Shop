export const CONFIG = {
    MOCK_API: true,
    API_BASE_URL: "https://shopgtteam1-production.up.railway.app",
    DEFAULT_TIMEOUT: 10000,
    DEBUG_MODE: true,
    ITEMS_PER_PAGE: 12,
    AUTO_SAVE_CART: true,
    
    MESSAGES: {
        NETWORK_ERROR: "Probleme de conectare. Verifică internetul.",
        TIMEOUT_ERROR: "Cererea a expirat. Încearcă din nou.",
        GENERIC_ERROR: "A apărut o eroare neașteptată.",
        INSUFFICIENT_POINTS: "Nu ai suficiente puncte pentru această achiziție.",
        CART_EMPTY: "Coșul este gol.",
        ITEM_OUT_OF_STOCK: "Produsul nu mai este disponibil."
    },
    
    ANIMATION: {
        MODAL_FADE: 300,
        CART_UPDATE: 500,
        NOTIFICATION: 3000
    }
};

export const FILTER_CONFIG = {
    SEARCH_DEBOUNCE: 300,
    MIN_SEARCH_LENGTH: 2,
    DEFAULT_PRICE_MIN: 15,
    DEFAULT_PRICE_MAX: 6000,
    DEFAULT_SORT: 'categorii'
};

export const LOG_CONFIG = {
    MAX_NOTIFICATIONS: 5,
    DEFAULT_DURATION: 3000,
    ANIMATION_DURATION: 300,
    DEBOUNCE_TIME: 100
};