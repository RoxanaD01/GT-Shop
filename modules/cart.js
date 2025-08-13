import { removeFromCartAPI, getCart, addToCart as addToCartAPI, checkout as checkoutAPI } from "./api.js";
import { getCurrentUser, updateUserPoints, emitUserPointsChange } from "./user.js";
import { isPhysicalProduct, openAddressModal } from "./addressModal.js";
import { CONFIG } from "./config.js";
import { showError, showSuccess, logDebug } from "./logger.js";

let cartState = {
    items: [],
    totalPoints: 0,
    isLoading: false,
    lastUpdated: null
};

const elements = {
    cartItems: null,
    totalPoints: null,
    checkoutBtn: null,
    checkoutMsg: null,
    cartEmpty: null,
    cartSummary: null,
    cartModal: null,
    cartModalBody: null,
    cartItemsList: null,
    cartTotalPoints: null,
    cartCheckoutBtn: null,
    cartCheckoutMsg: null,
    closeCartBtn: null,
    cartIconBtn: null
};

const cacheElements = () => {
    elements.cartItems = document.querySelector("#cart-items");
    elements.totalPoints = document.querySelector("#total-points");
    elements.checkoutBtn = document.querySelector("#checkout-btn");
    elements.checkoutMsg = document.querySelector("#checkout-msg");
    elements.cartEmpty = document.querySelector("#cart-empty");
    elements.cartSummary = document.querySelector("#cart-summary");
    elements.cartModal = document.querySelector("#cart-modal");
    elements.cartModalBody = document.querySelector("#cart-modal-body");
    elements.cartItemsList = document.querySelector("#cart-items-list");
    elements.cartTotalPoints = document.querySelector("#cart-total-points");
    elements.cartCheckoutBtn = document.querySelector("#cart-checkout-btn");
    elements.cartCheckoutMsg = document.querySelector("#cart-checkout-msg");
    elements.closeCartBtn = document.querySelector(".close-cart");
    elements.cartIconBtn = document.querySelector('.fa-shopping-cart')?.closest('button');
};

export const getCartState = () => cartState;

export const updateCartState = (newState) => {
    cartState = { ...cartState, ...newState };
    cartState.lastUpdated = Date.now();
    
    if (CONFIG.DEBUG_MODE) {
        console.log('🛒 Cart state updated:', cartState);
    }
};

export const clearCart = () => {
    cartState.items = [];
    cartState.totalPoints = 0;
    cartState.lastUpdated = Date.now();
};

const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

const createCartItemElementModal = (item) => {
    return `
        <li class="cart-item" data-reward-id="${item.rewardId}">
            <div class="cart-item-content">
                <img src="${item.image}" alt="${escapeHtml(item.name)}" class="cart-item-image" />
                <div class="cart-item-info">
                    <h4 class="cart-item-name">${escapeHtml(item.name)}</h4>
                    <p class="cart-item-price">${item.price} <i class="fas fa-bolt"></i> × ${item.quantity}</p>
                </div>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-controls">
                    <button class="quantity-btn" data-action="decrease" data-reward-id="${item.rewardId}" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" data-action="increase" data-reward-id="${item.rewardId}">+</button>
                </div>
                <button class="remove-btn" data-action="remove" data-reward-id="${item.rewardId}" aria-label="Elimină ${escapeHtml(item.name)}">&times;</button>
            </div>
        </li>
    `;
};

const showEmptyCartModal = () => {
    const emptyElement = elements.cartModal?.querySelector('#cart-empty');
    const summaryElement = elements.cartModal?.querySelector('#cart-summary');
    
    if (emptyElement) emptyElement.classList.remove('hidden');
    if (summaryElement) summaryElement.classList.add('hidden');
    
    if (elements.cartItemsList) {
        elements.cartItemsList.innerHTML = '';
    }
};

const showFullCartModal = () => {
    const emptyElement = elements.cartModal?.querySelector('#cart-empty');
    const summaryElement = elements.cartModal?.querySelector('#cart-summary');
    
    if (emptyElement) emptyElement.classList.add('hidden');
    if (summaryElement) summaryElement.classList.remove('hidden');
};

export const renderCartModal = () => {
    if (!elements.cartItemsList) return;

    if (elements.cartCheckoutMsg) {
        elements.cartCheckoutMsg.textContent = '';
        elements.cartCheckoutMsg.className = 'checkout-message';
    }

    if (cartState.items.length === 0) {
        showEmptyCartModal();
        return;
    }

    showFullCartModal();
    
    elements.cartItemsList.innerHTML = cartState.items.map(item => 
        createCartItemElementModal(item)
    ).join('');
    
    updateCartSummaryModal();
    updateCheckoutButtonModal();
};

const updateCartSummaryModal = () => {
    if (elements.cartTotalPoints) {
        elements.cartTotalPoints.textContent = cartState.totalPoints;
    }
};

export const updateCheckoutButtonModal = () => {
    if (!elements.cartCheckoutBtn) return;
    
    const hasItems = cartState.items.length > 0;
    const currentUser = getCurrentUser();
    const hasEnoughPoints = currentUser && currentUser.activityPoints >= cartState.totalPoints;
    
    elements.cartCheckoutBtn.disabled = !hasItems || !hasEnoughPoints || cartState.isLoading;
    
    if (!hasItems) {
        elements.cartCheckoutBtn.textContent = 'Coș gol';
    } else if (!hasEnoughPoints) {
        elements.cartCheckoutBtn.textContent = `Puncte insuficiente (${cartState.totalPoints} AP necesar)`;
    } else {
        elements.cartCheckoutBtn.textContent = 'Finalizează comanda';
    }
};

const showCartMessageModal = (message, type = 'info') => {
    if (!elements.cartCheckoutMsg) return;
    
    elements.cartCheckoutMsg.textContent = message;
    elements.cartCheckoutMsg.className = `checkout-message ${type}`;
    elements.cartCheckoutMsg.setAttribute('role', 'alert');
    
    setTimeout(() => {
        elements.cartCheckoutMsg.textContent = '';
        elements.cartCheckoutMsg.className = 'checkout-message';
    }, CONFIG.ANIMATION.NOTIFICATION);
};

const animateCartUpdate = () => {
    const cartIcon = document.querySelector('.fa-shopping-cart');
    if (cartIcon) {
        cartIcon.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
        }, 200);
    }
};

export const openCartModal = () => {
    if (!elements.cartModal) {
        console.error('Cart modal element not found');
        return;
    }
    
    renderCartModal();
    elements.cartModal.classList.remove('hidden');
    elements.cartModal.setAttribute('aria-hidden', 'false');
    
    const firstFocusable = elements.cartModal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) firstFocusable.focus();
    
    if (CONFIG.DEBUG_MODE) {
        console.log('🛒 Cart modal opened');
    }
};

export const closeCartModal = () => {
    if (!elements.cartModal) return;
    
    elements.cartModal.classList.add('hidden');
    elements.cartModal.setAttribute('aria-hidden', 'true');
    
    if (elements.cartIconBtn) elements.cartIconBtn.focus();
    
    if (CONFIG.DEBUG_MODE) {
        console.log('🛒 Cart modal closed');
    }
};

export const loadCart = async () => {
    try {
        cartState.isLoading = true;
        const cartData = await getCart();
        
        updateCartState({
            items: cartData.items || [],
            totalPoints: cartData.totalPoints || 0
        });
        
        if (CONFIG.DEBUG_MODE) {
            console.log('🛒 Cart loaded:', getCartState());
        }
        
    } catch (error) {
        console.error('❌ Error loading cart:', error);
        showCartMessageModal('Nu am putut încărca coșul', 'error');
    } finally {
        cartState.isLoading = false;
    }
};

export const addItemToCart = async (reward) => {
    if (!reward || !reward.id) {
        console.error('Invalid reward object');
        return;
    }

    const needsAddress = isPhysicalProduct(reward);
    
    if (CONFIG.DEBUG_MODE) {
        console.log('🛒 Adding item to cart:', reward.name);
        console.log('📍 Is physical product:', needsAddress);
    }
    
    try {
        cartState.isLoading = true;
        showCartMessageModal('Se adaugă în coș...', 'info');
        
        const response = await addToCartAPI(reward.id, 1);
        
        if (response.success) {
            updateCartState({
                items: response.cart.items || [],
                totalPoints: response.cart.totalPoints || 0
            });
            
            renderCartModal();
            showCartMessageModal(response.message || 'Produs adăugat în coș!', 'success');
            animateCartUpdate();

            if (needsAddress) {
                if (CONFIG.DEBUG_MODE) {
                    console.log('📍 Physical product detected - opening address modal...');
                }
                
                setTimeout(() => {
                    try {
                        openAddressModal();
                        if (CONFIG.DEBUG_MODE) {
                            console.log('✅ Address modal opened successfully');
                        }
                    } catch (addressError) {
                        console.error('❌ Error opening address modal:', addressError);
                    }
                }, 300);
            }
            
        } else {
            showCartMessageModal(response.message || 'Nu s-a putut adăuga în coș', 'error');
        }
        
    } catch (error) {
        console.error('❌ Error adding to cart:', error);
        showCartMessageModal('Eroare la adăugarea în coș', 'error');
    } finally {
        cartState.isLoading = false;
    }
};

export const processCheckout = async () => {
    if (cartState.items.length === 0) {
        showCartMessageModal('Coșul este gol', 'warning');
        return;
    }

    try {
        cartState.isLoading = true;
        showCartMessageModal('Se procesează comanda...', 'info');

        const response = await checkoutAPI(cartState.items);
   
        if (response.success) {
            const hadPhysicalProducts = cartState.items.some(item => isPhysicalProduct(item));

            updateUserPoints(response.newBalance);
            emitUserPointsChange(response.newBalance);

            clearCart();
            renderCartModal();

            showCartMessageModal(response.message || 'Comandă finalizată cu succes!', 'success');

            if (hadPhysicalProducts) {
                if (CONFIG.DEBUG_MODE) {
                    console.log('📍 Physical products in checkout, opening address modal...');
                }
                
                setTimeout(() => {
                    openAddressModal();
                }, 500);
            }

            document.dispatchEvent(new CustomEvent('cartCheckoutSuccess', {
                detail: { purchasedItems: response.purchasedItems }
            }));

        } else {
            showCartMessageModal(response.message || 'Comanda nu a putut fi procesată', 'error');
        }
        
    } catch (error) {
        console.error('❌ Checkout error:', error);
        showCartMessageModal('Eroare la procesarea comenzii', 'error');
    } finally {
        cartState.isLoading = false;
    }
};

export const updateItemQuantity = async (rewardId, action) => {
    const item = cartState.items.find(item => item.rewardId === rewardId);
    if (!item) return;

    try {
        cartState.isLoading = true;
        
        let newQuantity = item.quantity;
        if (action === 'increase') {
            newQuantity += 1;
        } else if (action === 'decrease' && item.quantity > 1) {
            newQuantity -= 1;
        }
        
        if (newQuantity !== item.quantity) {
            const response = await addToCartAPI(rewardId, newQuantity - item.quantity);
            
            if (response.success) {
                updateCartState({
                    items: response.cart.items,
                    totalPoints: response.cart.totalPoints
                });
                renderCartModal();
            }
        }
        
    } catch (error) {
        console.error('Error updating quantity:', error);
        showCartMessageModal('Nu s-a putut actualiza cantitatea', 'error');
    } finally {
        cartState.isLoading = false;
    }
};

export const removeFromCart = async (rewardId) => {
    try {
        cartState.isLoading = true;

        const response = await removeFromCartAPI(rewardId);

        if (response.success) {
            updateCartState({
                items: response.cart.items || [],
                totalPoints: response.cart.totalPoints || 0
            });
            renderCartModal();
            showCartMessageModal('Produs eliminat din coș', 'success');
        } else {
            showCartMessageModal(response.message || 'Nu s-a putut elimina produsul', 'error');
        }

    } catch (error) {
        console.error('Error removing from cart:', error);
        showCartMessageModal('Nu s-a putut elimina produsul', 'error');
    } finally {
        cartState.isLoading = false;
    }
};

const setupEventListeners = () => {
    if (elements.cartIconBtn) {
        elements.cartIconBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openCartModal();
        });
    }
    
    if (elements.closeCartBtn) {
        elements.closeCartBtn.addEventListener('click', closeCartModal);
    }
    
    if (elements.cartModal) {
        elements.cartModal.addEventListener('click', (e) => {
            if (e.target === elements.cartModal) {
                closeCartModal();
            }
        });
    }
    
    elements.cartCheckoutBtn?.addEventListener('click', processCheckout);
    
    elements.cartItemsList?.addEventListener('click', handleCartItemActions);
    
    setupKeyboardEvents();
    
    document.addEventListener('userPointsChanged', () => {
        updateCheckoutButtonModal();
    });
};

const setupKeyboardEvents = () => {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!elements.cartModal?.classList.contains('hidden')) {
                closeCartModal();
            }
        }
    });
};

const handleCartItemActions = (e) => {
    const action = e.target.getAttribute('data-action');
    const rewardId = e.target.getAttribute('data-reward-id');
    
    if (!action || !rewardId) return;
    
    switch (action) {
        case 'increase':
        case 'decrease':
            updateItemQuantity(rewardId, action);
            break;
        case 'remove':
            if (confirm('Sigur vrei să elimini acest produs din coș?')) {
                removeFromCart(rewardId);
            }
            break;
    }
};

export const setUserPoints = (points) => {
    if (typeof points === 'number' && points >= 0) {
        const user = getCurrentUser();
        if (user) {
            user.activityPoints = points;
            updateCheckoutButtonModal();
            
            if (CONFIG.DEBUG_MODE) {
                console.log(`💰 User points updated to: ${points} AP`);
            }
        }
    } else {
        console.warn('Invalid points value:', points);
    }
};

export const initCart = (user) => {
    cacheElements();
    setupEventListeners();
    loadCart();
    
    logDebug('🛒 Cart module initialized');
};