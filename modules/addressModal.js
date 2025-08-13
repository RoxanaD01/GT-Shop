import { CONFIG } from './config.js';

export const isPhysicalProduct = (reward) => {
    const physicalCategories = ['merchandise', 'electronics'];
    return physicalCategories.includes(reward.category?.toLowerCase()) ||
           reward.physical === true ||
           reward.type === 'physical';
};

const elements = {
    addressModal: null,
    closeAddressBtn: null,
    confirmAddressBtn: null,
    countyInput: null,
    cityInput: null,
    fullAddressInput: null,
    phoneInput: null
};

export const initAddressModal = () => {
    cacheElements();
    setupEventListeners();
};

const cacheElements = () => {
    elements.addressModal = document.querySelector("#address-modal");
    elements.closeAddressBtn = document.querySelector("#close-address");
    elements.confirmAddressBtn = document.querySelector("#confirm-address-btn");
    elements.countyInput = document.querySelector("#county");
    elements.cityInput = document.querySelector("#city");
    elements.fullAddressInput = document.querySelector("#full-address");
    elements.phoneInput = document.querySelector("#phone");
};

export const openAddressModal = () => {
    if (!elements.addressModal) {
        console.error('❌ Address modal element not found');
        return;
    }
    
    if (!elements.addressModal.classList.contains('hidden')) {
        return;
    }
    const rewardModal = document.querySelector("#reward-modal");
    const cartModal = document.querySelector("#cart-modal");
    
    if (rewardModal && !rewardModal.classList.contains('hidden')) {
        rewardModal.classList.add('hidden');
        rewardModal.setAttribute('aria-hidden', 'true');
    }
    
    if (cartModal && !cartModal.classList.contains('hidden')) {
        cartModal.classList.add('hidden');
        cartModal.setAttribute('aria-hidden', 'true');
    }
    
    clearAddressForm();
    
    setTimeout(() => {
        elements.addressModal.classList.remove('hidden');
        elements.addressModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        
        if (elements.countyInput) {
            setTimeout(() => {
                elements.countyInput.focus();
            }, 100);
        }
    }, 100);
};

export const closeAddressModal = () => {
    if (!elements.addressModal) return;
    
    elements.addressModal.classList.add('hidden');
    elements.addressModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
};

export const clearAddressForm = () => {
    if (elements.countyInput) elements.countyInput.value = '';
    if (elements.cityInput) elements.cityInput.value = '';
    if (elements.fullAddressInput) elements.fullAddressInput.value = '';
    if (elements.phoneInput) elements.phoneInput.value = '';
};

export const handleAddressConfirmation = () => {
    const county = elements.countyInput?.value.trim();
    const city = elements.cityInput?.value.trim();
    const fullAddress = elements.fullAddressInput?.value.trim();
    const phone = elements.phoneInput?.value.trim();
    
    if (!county || !city || !fullAddress || !phone) {
        alert('Te rugăm să completezi toate câmpurile pentru adresă.');
        return;
    }
    
    const phoneRegex = /^[+]?[0-9\s\-()]{8,15}$/;
    if (!phoneRegex.test(phone)) {
        alert('Te rugăm să introduci un număr de telefon valid.');
        return;
    }
    
    alert('Adresa a fost confirmată cu succes!');
    clearAddressForm();
    closeAddressModal();
};

const setupEventListeners = () => {
    if (elements.closeAddressBtn) {
        elements.closeAddressBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeAddressModal();
        });
    }
    
    if (elements.confirmAddressBtn) {
        elements.confirmAddressBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleAddressConfirmation();
        });
    }
    
    if (elements.addressModal) {
        elements.addressModal.addEventListener('click', (e) => {
            if (e.target === elements.addressModal) {
                e.preventDefault();
                handleAddressModalClickOutside();
            }
        });
    }
    
    const addressInputs = [elements.countyInput, elements.cityInput, elements.fullAddressInput, elements.phoneInput];
    addressInputs.forEach(input => {
        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddressConfirmation();
                }
            });
        }
    });
    
    setupKeyboardEvents();
};

const setupKeyboardEvents = () => {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !elements.addressModal?.classList.contains('hidden')) {
            handleAddressModalEscape();
        }
    });
};

const handleAddressModalClickOutside = () => {
    const hasData = elements.countyInput?.value.trim() || 
                   elements.cityInput?.value.trim() || 
                   elements.fullAddressInput?.value.trim() || 
                   elements.phoneInput?.value.trim();
    
    if (hasData) {
        const confirmClose = confirm('Ai date neconfirmate. Sigur vrei să închizi modalul?');
        if (confirmClose) {
            closeAddressModal();
        }
    } else {
        closeAddressModal();
    }
};

const handleAddressModalEscape = () => {
    const hasData = elements.countyInput?.value.trim() || 
                   elements.cityInput?.value.trim() || 
                   elements.fullAddressInput?.value.trim() || 
                   elements.phoneInput?.value.trim();
    
    if (hasData) {
        const confirmClose = confirm('Ai date neconfirmate. Sigur vrei să închizi modalul?');
        if (confirmClose) {
            closeAddressModal();
        }
    } else {
        closeAddressModal();
    }
};