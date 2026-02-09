import { userInfo, renderUserProfile, setupUserEventListeners } from "./modules/user.js";
import { initRewards, loadRewards } from "./modules/rewards.js";
import { initCart, setUserPoints, openCartModal } from "./modules/cart.js";
import { initAddressModal } from "./modules/addressModal.js";
import { initHistory } from "./modules/history.js";
import { showError, showLoading, hideLoading, setupGlobalErrorHandling, setupNetworkMonitoring, logDebug } from "./modules/logger.js";
import { CONFIG } from "./modules/config.js";

class GTShopApp {
    constructor() {
        this.user = null;
        this.isInitialized = false;
        this.initStartTime = Date.now();
        this.lastUpdateTime = 0;
    }

    async init() {
        try {
            logDebug('Starting GT Shop initialization');
            showLoading('Inițializare magazin...');
            
            setupGlobalErrorHandling();
            setupNetworkMonitoring();
            
            await this.loadUser();
            this.initializeModules();

            await this.loadData();
            this.setupGlobalEventListeners();
            
            this.isInitialized = true;
            logDebug(`GT Shop initialized successfully in ${Date.now() - this.initStartTime}ms`);
            
        } catch (error) {
            console.error('Failed to initialize GT Shop:', error);
            showError('Nu am putut încărca magazinul. Te rugăm să reîmprospătezi pagina.');
            setTimeout(() => this.initializeFallback(), 2000);
        } finally {
            hideLoading();
        }
    }

    async refresh() {
        if (!this.isInitialized) {
            logDebug(' Cannot refresh - app not initialized');
            return;
        }
        
        try {
            await this.loadUser();
            await this.loadData();
            setUserPoints(this.user.activityPoints);
            renderUserProfile(this.user);
            this.lastUpdateTime = Date.now();
            logDebug(' App refreshed successfully');
        } catch (error) {
            console.error(' Failed to refresh:', error);
            showError('Nu am putut actualiza datele. Te rugăm să reîncerci.');
        } finally {
            hideLoading();
        }
    }

    async loadUser() {
        try {
            this.user = await userInfo();
            
            if (!this.user || typeof this.user.activityPoints !== 'number') {
                throw new Error('Invalid user data!');
            }
            logDebug('User loaded:', this.user.name);

        } catch (error) {
            console.error('Failed to load user:', error);
            this.user = {
                id: "mock-user",
                name: "Miruna Popa",
                avatar: "https://i.pravatar.cc/100?img=3",
                activityPoints: 2020
            };
            console.warn('Using fallback user data');
        }
    }

    initializeModules() {
        try {
            logDebug('Initializing modules');
            renderUserProfile(this.user);
            setUserPoints(this.user.activityPoints);
            initCart(this.user);
            initAddressModal();
            initHistory();
            initRewards();
            setupUserEventListeners();
            logDebug('Modules initialized successfully');
        } catch (error) {
            console.error('Failed to initialize modules:', error);
            throw error;
        }
    }

    async loadData() {
        try {
            showLoading('Încărcare produse...');
            await loadRewards();
            logDebug('Data loaded successfully');
        } catch (error) {
            console.error('Failed to load data:', error);
            showError('Nu am putut încărca toate produsele.');
        }
    }

    setupGlobalEventListeners() {
        try {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeAllModals();
                }
            });

            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal')) {
                    e.target.classList.add('hidden');
                }
            });

            const cartIcon = document.querySelector('.fa-shopping-cart')?.closest('button');
            if (cartIcon) {
                cartIcon.addEventListener('click', (e) => {
                    e.preventDefault();
                    openCartModal();
                });
            }

            document.addEventListener('click', (e) => {
                if (e.target.matches('#back-to-landing')) {
                    e.preventDefault();
                    this.handleBackToLanding();
                }
            });

            logDebug('Global event listeners setup complete');
        } catch (error) {
            console.error('Failed to setup global event listeners:', error);
        }
    }

    closeAllModals() {
        const openModals = document.querySelectorAll('.modal:not(.hidden), .profile-modal:not(.hidden), .cart-modal:not(.hidden)');
        openModals.forEach(modal => modal.classList.add('hidden'));
    }

    handleBackToLanding() {
        showLoading('Redirecționare către pagina principală...');
        setTimeout(() => {
            hideLoading();
        }, 1000);
    }

    async initializeFallback() {
        try {
            showLoading('Încercare cu mock data');
            
            this.user = {
                id: "fallback-user",
                name: "Diana Popa",
                avatar: "https://i.pravatar.cc/100?img=1",
                activityPoints: 3000
            };
            
            renderUserProfile(this.user);
            setUserPoints(this.user.activityPoints);
            initCart(this.user);
            initAddressModal();
            initRewards();
            setupUserEventListeners();
            
            this.isInitialized = true;
            showError('Magazinul funcționează cu mock data.');
        } catch (error) {
            console.error('Fallback initialization failed:', error);
            showError('Aplicația nu poate fi încărcată. Te rugăm să reîmprospătezi pagina.');
        } finally {
            hideLoading();
        }
    }

    destroy() {
        this.isInitialized = false;
        this.user = null;
    }
}

const app = new GTShopApp();
window.GTShop = app;

if (CONFIG.DEBUG_MODE) {
    window.GTShopDebug = {
        refresh: () => app.refresh(),
        closeModals: () => app.closeAllModals(),
        config: CONFIG
    };
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

window.addEventListener('beforeunload', () => {
    app.destroy();
});
