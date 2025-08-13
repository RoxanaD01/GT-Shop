import { getUserProfile, sendPointsAPI } from "./api.js";
import { CONFIG } from "./config.js";
import { showSuccess, showError } from "./logger.js";

let currentUser = null;

export const userInfo = async () => {
    try {
        currentUser = await getUserProfile();
        if (CONFIG.DEBUG_MODE) {
            console.log('👤 User loaded:', currentUser);
        }
        return currentUser;
    } catch (error) {
        console.error("❌ Error loading user profile:", error);
        throw error;
    }
};

export const renderUserProfile = (user = currentUser) => {
    const userProfileElement = document.querySelector('#user-profile');
    
    if (!userProfileElement) {
        console.warn('User profile element not found');
        return;
    }

    if (!user) {
        userProfileElement.innerHTML = `
            <div class="user-card error">
                <p>❌ Nu am putut încărca profilul</p>
                <button onclick="window.location.reload()">Reîncarcă</button>
            </div>
        `;
        return;
    }

    const safeUser = {
        name: escapeHtml(user.name || 'Utilizator Necunoscut'),
        avatar: user.avatar || '/images/default-avatar.png',
        activityPoints: Number(user.activityPoints) || 0
    };

    userProfileElement.innerHTML = `
        <div class="user-card" role="banner" aria-label="Profil utilizator">
            <div class="user-avatar"></div>
            <div class="user-info">
                <h3 class="user-name">${safeUser.name}</h3>
                <p class="user-points">
                    <span id="user-ap" class="points-value">${safeUser.activityPoints}</span> AP
                </p>
            </div>
        </div>
    `;

    currentUser = user;
    updateNavbarAP(safeUser.activityPoints);
};

const initAPModal = () => {
    const apIndicator = document.querySelector('.ap-indicator');
    const sendApModal = document.getElementById('send-ap-modal');
    const closeApBtn = document.getElementById('close-send-ap');
    const sendApBtn = document.getElementById('send-ap-btn');
    const recipientInput = document.getElementById('recipient');
    const apAmountInput = document.getElementById('ap-amount');

    if (!apIndicator || !sendApModal) {
        console.warn('AP modal elements not found');
        return;
    }

    apIndicator.addEventListener('click', () => {
        sendApModal.classList.remove('hidden');
        recipientInput.focus();
    });

    const closeModal = () => {
        sendApModal.classList.add('hidden');
        if (recipientInput) recipientInput.value = '';
        if (apAmountInput) apAmountInput.value = '';
    };

    if (closeApBtn) {
        closeApBtn.addEventListener('click', closeModal);
    }

    sendApModal.addEventListener('click', (e) => {
        if (e.target === sendApModal) {
            closeModal();
        }
    });

    if (sendApBtn) {
      sendApBtn.addEventListener('click', async () => {
    const recipient = recipientInput?.value.trim();
    const amount = apAmountInput?.value.trim();

    if (!recipient) {
        showError('Te rugăm să introduci email-ul sau Discord-ul destinatarului.');
        recipientInput?.focus();
        return;
    }

    if (!amount || isNaN(amount) || parseInt(amount) <= 0) {
        showError('Te rugăm să introduci o sumă validă de AP.');
        apAmountInput?.focus();
        return;
    }

    const apAmount = parseInt(amount);
    const userAP = getUserPoints();

    if (apAmount > userAP) {
        showError(`Nu ai suficiente puncte. Ai doar ${userAP} AP disponibili.`);
        return;
    }

    try {
        const response = await sendPointsAPI(recipient, apAmount);

        if (response.success) {
            const newBalance = typeof response.newBalance === "number"
                ? response.newBalance
                : userAP - apAmount;

            updateUserPoints(newBalance);
            emitUserPointsChange(newBalance);

            showSuccess(`Ai trimis ${apAmount} AP către ${recipient}!`);
            closeModal();
        } else {
            showError(response.message || 'Eroare la trimiterea AP.');
        }
    } catch (err) {
        console.error('❌ Error sending points:', err);
        showError('Eroare de rețea. Încearcă din nou.');
    }
});
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !sendApModal.classList.contains('hidden')) {
            closeModal();
        }
    });
};

const initProfileModal = () => {
    const userAvatar = document.getElementById('user-avatar-btn');
    const profileModal = document.getElementById('profile-modal');
    const closeProfileBtn = document.querySelector('.close-profile');

    if (!userAvatar || !profileModal) {
        console.warn('Profile modal elements not found');
        return;
    }

    userAvatar.addEventListener('click', () => {
        profileModal.classList.remove('hidden');
    });

    const closeModal = () => {
        profileModal.classList.add('hidden');
    };

    if (closeProfileBtn) {
        closeProfileBtn.addEventListener('click', closeModal);
    }

    document.addEventListener('click', (e) => {
        if (!profileModal.contains(e.target) && !userAvatar.contains(e.target)) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !profileModal.classList.contains('hidden')) {
            closeModal();
        }
    });
};

export const updateUserPoints = (newPoints) => {
    if (currentUser) {
        currentUser.activityPoints = newPoints;
        
        const pointsElement = document.getElementById('user-ap');
        if (pointsElement) {
            pointsElement.textContent = newPoints;
            
            pointsElement.classList.add('points-updated');
            setTimeout(() => {
                pointsElement.classList.remove('points-updated');
            }, CONFIG.ANIMATION.CART_UPDATE);
        }

        updateNavbarAP(newPoints);
    }
};

const updateNavbarAP = (points) => {
    const apIndicator = document.querySelector('.ap-indicator');
    if (apIndicator) {
        const apText = apIndicator.childNodes[0];
        if (apText && apText.nodeType === Node.TEXT_NODE) {
            apText.textContent = `AP: ${points} `;
        } else {
            apIndicator.innerHTML = `AP: ${points} <i class="fas fa-bolt ap-icon"></i>`;
        }
        
        apIndicator.style.transform = 'scale(1.05)';
        setTimeout(() => {
            apIndicator.style.transform = 'scale(1)';
        }, 200);
    }
};

export const getCurrentUser = () => currentUser;

export const getUserPoints = () => currentUser?.activityPoints || 0;

const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

export const initUser = async () => {
    try {
        const user = await userInfo();
        renderUserProfile(user);
        return user;
    } catch (error) {
        console.error('Failed to initialize user:', error);
        renderUserProfile(null);
        throw error;
    }
};

export const setupUserEventListeners = () => {
    initAPModal();
    initProfileModal();
    
    document.addEventListener('userPointsChanged', (event) => {
        updateUserPoints(event.detail.newPoints);
    });
    
    document.addEventListener('click', (e) => {
        if (e.target.matches('[data-action="refresh-user"]')) {
            initUser().catch(console.error);
        }
    });
};

export const emitUserPointsChange = (newPoints) => {
    const event = new CustomEvent('userPointsChanged', {
        detail: { newPoints, timestamp: Date.now() }
    });
    document.dispatchEvent(event);
};