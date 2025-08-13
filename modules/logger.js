import { CONFIG, LOG_CONFIG } from "./config.js";

// State Management
class NotificationState {
    constructor() {
        this.container = null;
        this.activeNotifications = new Set();
        this.loadingOverlay = null;
        this.stylesInjected = false;
    }

    addNotification(notification) {
        this.activeNotifications.add(notification);
        this.cleanup();
    }

    removeNotification(notification) {
        this.activeNotifications.delete(notification);
    }

    cleanup() {
        if (this.activeNotifications.size > LOG_CONFIG.MAX_NOTIFICATIONS) {
            const oldest = this.activeNotifications.values().next().value;
            if (oldest) {
                this.removeNotificationElement(oldest);
            }
        }
    }

    removeNotificationElement(notification) {
        if (notification.parentNode) {
            notification.classList.add('gt-notification--removing');
            setTimeout(() => {
                notification.remove();
                this.removeNotification(notification);
            }, LOG_CONFIG.ANIMATION_DURATION);
        }
    }
}

const state = new NotificationState();

const injectStyles = () => {
    if (state.stylesInjected || document.querySelector('#gt-ui-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'gt-ui-styles';
    styles.textContent = `
        /* Loading Overlay */
        .gt-loader-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            animation: gtFadeIn ${LOG_CONFIG.ANIMATION_DURATION}ms ease;
        }
        
        .gt-loader {
            background: white;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
            text-align: center;
            max-width: 320px;
            min-width: 280px;
        }
        
        .gt-loader .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #e5e7eb;
            border-top-color: #6366f1;
            border-radius: 50%;
            animation: gtSpin 1s linear infinite;
            margin: 0 auto 1rem;
        }
        
        .loader-message {
            color: #374151;
            font-weight: 500;
            margin: 0;
            font-size: 0.95rem;
        }

        /* Notifications */
        .gt-notifications-container {
            position: fixed;
            top: 1rem;
            right: 1rem;
            z-index: 9998;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            max-width: 400px;
            pointer-events: none;
        }
        
        .gt-notification {
            background: white;
            border-radius: 0.75rem;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
            border-left: 4px solid;
            transform: translateX(100%);
            transition: all ${LOG_CONFIG.ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
            pointer-events: auto;
            overflow: hidden;
        }
        
        .gt-notification--show {
            transform: translateX(0);
            opacity: 1;
        }
        
        .gt-notification--removing {
            transform: translateX(100%);
            opacity: 0;
            margin-bottom: -100px;
        }
        
        .gt-notification--success { border-left-color: #10b981; }
        .gt-notification--error { border-left-color: #ef4444; }
        .gt-notification--warning { border-left-color: #f59e0b; }
        .gt-notification--info { border-left-color: #3b82f6; }
        
        .gt-notification__content {
            display: flex;
            align-items: flex-start;
            padding: 1rem;
            gap: 0.75rem;
        }
        
        .gt-notification__icon {
            font-size: 1.25rem;
            flex-shrink: 0;
            margin-top: 0.125rem;
        }
        
        .gt-notification__message {
            flex: 1;
            color: #374151;
            font-weight: 500;
            line-height: 1.5;
            font-size: 0.875rem;
            word-wrap: break-word;
        }
        
        .gt-notification__close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #9ca3af;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s;
            flex-shrink: 0;
            line-height: 1;
        }
        
        .gt-notification__close:hover {
            background: #f3f4f6;
            color: #374151;
        }

        /* Animations */
        @keyframes gtSpin {
            to { transform: rotate(360deg); }
        }
        
        @keyframes gtFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes gtSlideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        /* Responsive Design */
        @media (max-width: 640px) {
            .gt-notifications-container {
                top: 0.5rem;
                right: 0.5rem;
                left: 0.5rem;
                max-width: none;
            }
            
            .gt-loader {
                margin: 0 1rem;
                padding: 1.5rem;
            }
        }
    `;
    
    document.head.appendChild(styles);
    state.stylesInjected = true;
    
    logDebug(' UI styles injected');
};

// Loading
export const showLoading = (message = 'Se încarcă...') => {
    // Prevent multiple loaders
    if (state.loadingOverlay) {
        updateLoadingMessage(message);
        return;
    }

    injectStyles();
    
    state.loadingOverlay = document.createElement('div');
    state.loadingOverlay.className = 'gt-loader-overlay';
    state.loadingOverlay.innerHTML = `
        <div class="gt-loader">
            <div class="spinner"></div>
            <p class="loader-message">${escapeHtml(message)}</p>
        </div>
    `;
    
    document.body.appendChild(state.loadingOverlay);
    document.body.classList.add('gt-loading');
    
    logDebug('🔄 Loading shown:', message);
};

export const hideLoading = () => {
    if (!state.loadingOverlay) return;

    state.loadingOverlay.style.opacity = '0';
    
    setTimeout(() => {
        if (state.loadingOverlay?.parentNode) {
            state.loadingOverlay.parentNode.removeChild(state.loadingOverlay);
        }
        state.loadingOverlay = null;
        document.body.classList.remove('gt-loading');
    }, LOG_CONFIG.ANIMATION_DURATION);
    
    logDebug('✅ Loading hidden');
};

const updateLoadingMessage = (message) => {
    if (!state.loadingOverlay) return;
    
    const messageElement = state.loadingOverlay.querySelector('.loader-message');
    if (messageElement) {
        messageElement.textContent = message;
    }
};

// Notifications
export const showNotification = (message, type = 'info', duration = LOG_CONFIG.DEFAULT_DURATION) => {
    if (!message) return;

    injectStyles();
    
    const container = getOrCreateNotificationContainer();
    const notification = createNotificationElement(message, type);
    
    state.addNotification(notification);
    container.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.classList.add('gt-notification--show');
    });
    
    // Auto-remove
    if (duration > 0) {
        setTimeout(() => {
            removeNotification(notification);
        }, duration);
    }
    
    logDebug(` ${type.toUpperCase()}: ${message}`);
    return notification;
};

const getOrCreateNotificationContainer = () => {
    if (!state.container || !state.container.parentNode) {
        state.container = document.createElement('div');
        state.container.className = 'gt-notifications-container';
        document.body.appendChild(state.container);
    }
    return state.container;
};

const createNotificationElement = (message, type) => {
    const notification = document.createElement('div');
    notification.className = `gt-notification gt-notification--${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    notification.innerHTML = `
        <div class="gt-notification__content">
            <span class="gt-notification__icon">${getNotificationIcon(type)}</span>
            <span class="gt-notification__message">${escapeHtml(message)}</span>
            <button class="gt-notification__close" 
                    aria-label="Închide notificarea"
                    type="button">×</button>
        </div>
    `;

    const closeBtn = notification.querySelector('.gt-notification__close');
    closeBtn?.addEventListener('click', () => removeNotification(notification));
    
    return notification;
};

const removeNotification = (notification) => {
    if (!notification || !notification.parentNode) return;

    state.removeNotificationElement(notification);
    
    // Clean up container if empty
    setTimeout(() => {
        if (state.container && state.container.children.length === 0) {
            state.container.remove();
            state.container = null;
        }
    }, LOG_CONFIG.ANIMATION_DURATION + 100);
};

const getNotificationIcon = (type) => {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || 'ℹ️';
};

export const showSuccess = (message, duration = 3000) => {
    return showNotification(message, 'success', duration);
};

export const showError = (message, duration = 5000) => {
    return showNotification(message, 'error', duration);
};

export const showWarning = (message, duration = 4000) => {
    return showNotification(message, 'warning', duration);
};

export const showInfo = (message, duration = 3000) => {
    return showNotification(message, 'info', duration);
};

export const logDebug = (message, data = null) => {
    if (!CONFIG.DEBUG_MODE) return;
    const timestamp = new Date().toISOString().slice(11, 23);
};

export const logAPI = (endpoint, method = 'GET', data = null, success = true) => {
    if (!CONFIG.DEBUG_MODE) return;
    
    const icon = success ? '✅' : '❌';
    const status = success ? 'SUCCESS' : 'ERROR';
    const timestamp = new Date().toISOString().slice(11, 23);
};

export const logError = (error, context = '') => {
    const timestamp = new Date().toISOString().slice(11, 23);
    const message = context ? `[${context}] ${error.message}` : error.message;
    
    console.error(`❌ [${timestamp}] ERROR: ${message}`);
    
    if (CONFIG.DEBUG_MODE && error.stack) {
        console.error('Stack trace:', error.stack);
    }
    
    // In production, send to monitoring service
    if (!CONFIG.DEBUG_MODE && typeof sendErrorToMonitoring === 'function') {
        sendErrorToMonitoring(error, context);
    }
};

// Performance
const timers = new Map();

export const startTimer = (label) => {
    if (!CONFIG.DEBUG_MODE) return;
    timers.set(label, performance.now());
    console.time(label);
};

export const endTimer = (label) => {
    if (!CONFIG.DEBUG_MODE) return;
    
    const startTime = timers.get(label);
    if (startTime) {
        const duration = performance.now() - startTime;
        logDebug(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
        timers.delete(label);
    }
    console.timeEnd(label);
};

// Error Handling
let errorHandlersSetup = false;

export const setupGlobalErrorHandling = () => {
    if (errorHandlersSetup) return;
    
    // JavaScript errors
    window.addEventListener('error', (event) => {
        logError(event.error || new Error(event.message), 'Global Error Handler');
        
        if (!CONFIG.DEBUG_MODE) {
            showError('A apărut o eroare neașteptată. Pagina va fi reîncărcată.');
            setTimeout(() => location.reload(), 3000);
        }
    });
    
    // Promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        logError(new Error(event.reason), 'Unhandled Promise Rejection');
        
        if (!CONFIG.DEBUG_MODE) {
            showError('A apărut o problemă cu conexiunea. Te rugăm să încerci din nou.');
        }
        
        event.preventDefault();
    });
    
    errorHandlersSetup = true;
    logDebug(' Global error handling initialized');
};

// Network
let networkMonitoringSetup = false;

export const setupNetworkMonitoring = () => {
    if (networkMonitoringSetup || typeof navigator.onLine === 'undefined') return;
    
    const handleOnline = () => {
        showSuccess('Conexiune restabilită!');
        logDebug(' Network: Back online');
        document.dispatchEvent(new CustomEvent('networkStatusChanged', { 
            detail: { online: true } 
        }));
    };
    
    const handleOffline = () => {
        showWarning('Conexiunea la internet a fost pierdută', 0);
        logDebug(' Network: Gone offline');
        document.dispatchEvent(new CustomEvent('networkStatusChanged', { 
            detail: { online: false } 
        }));
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check initial status
    if (!navigator.onLine) {
        handleOffline();
    }
    
    networkMonitoringSetup = true;
    logDebug(' Network monitoring initialized');
};

// Utility Functions 
const escapeHtml = (text) => {
    if (typeof text !== 'string') return String(text || '');
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

// Public API
export const clearAllNotifications = () => {
    state.activeNotifications.forEach(notification => {
        removeNotification(notification);
    });
    logDebug(' All notifications cleared');
};

export const getLoggerState = () => ({
    activeNotifications: state.activeNotifications.size,
    hasContainer: !!state.container,
    isLoading: !!state.loadingOverlay,
    stylesInjected: state.stylesInjected
});

// Global 
if (typeof window !== 'undefined') {
    window.GTShopLogger = {
        showLoading,
        hideLoading,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        clearAll: clearAllNotifications,
        getState: getLoggerState
    };
}

export default {
    showLoading,
    hideLoading,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    logDebug,
    logError,
    setupGlobalErrorHandling,
    setupNetworkMonitoring
};