import { CONFIG } from "./config.js";
import { mockUserProfile, mockRewards, mockCart, mockCheckout, mockHistory, mockAddToCart, mockRemoveFromCart } from "./mockData.js";

const fetchWithTimeout = (url, options = {}, timeout = CONFIG.DEFAULT_TIMEOUT) => {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error("TIMEOUT")), timeout)
        )
    ]);
};

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
};

const logAPI = (endpoint, data, error = null) => {
    if (!CONFIG.DEBUG_MODE) return;
    
    if (error) {
        console.error(`❌ API Error [${endpoint}]:`, error);
    } else {
        console.log(`✅ API Success [${endpoint}]:`, data);
    }
};

const apiCall = async (endpoint, options = {}, mockFunction = null) => {
    if (CONFIG.MOCK_API && mockFunction) {
        try {
            const data = await mockFunction();
            logAPI(endpoint, data);
            return data;
        } catch (error) {
            logAPI(endpoint, null, error);
            throw error;
        }
    }

    try {
        const response = await fetchWithTimeout(`${CONFIG.API_BASE_URL}${endpoint}`, options);
        const data = await handleResponse(response);
        logAPI(endpoint, data);
        return data;
    } catch (error) {
        logAPI(endpoint, null, error);
        
        if (error.message === "TIMEOUT") {
            throw new Error(CONFIG.MESSAGES.TIMEOUT_ERROR);
        } else if (error.message.includes("fetch")) {
            throw new Error(CONFIG.MESSAGES.NETWORK_ERROR);
        }
        throw error;
    }
};

export const getUserProfile = () => {
    return apiCall("/api/user/profile", {}, mockUserProfile);
};

export const getRewards = () => {
    return apiCall("/api/rewards", {}, mockRewards);
};

export const getCart = () => {
    return apiCall("/api/cart", {}, mockCart);
};

export const addToCart = (rewardId, quantity = 1) => {
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rewardId, quantity })
    };
    
    return apiCall("/api/cart/add", options, () => mockAddToCart(rewardId, quantity));
};

export const removeFromCartAPI = async (rewardId) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rewardId })
    };
    
    return apiCall('/api/cart/remove', options, () => mockRemoveFromCart(rewardId));
};

export const checkout = (items) => {
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items })
    };
    
    return apiCall("/api/checkout", options, () => mockCheckout(items));
};

export const getUserHistory = () => {
    return apiCall("/api/user/history", {}, mockHistory);
};

export const retryAPICall = async (apiFunction, maxRetries = 3, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await apiFunction();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            
            console.warn(`🔄 Retry ${i + 1}/${maxRetries} for API call`);
            await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
    }
};

export const sendPointsAPI = (recipient, amount) => {
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient, amount })
    };

    const mockSendPoints = async () => {
        await mockStorage.networkDelay();
        if (mockStorage.user.activityPoints < amount) {
            return { success: false, message: "Puncte insuficiente", newBalance: mockStorage.user.activityPoints };
        }
        mockStorage.user.activityPoints -= amount;
        return { success: true, message: "Puncte trimise cu succes", newBalance: mockStorage.user.activityPoints };
    };

    return apiCall("/api/user/gift", options, mockSendPoints);
};

export const checkAPIHealth = async () => {
    if (CONFIG.MOCK_API) return { status: "OK", message: "Mock API is active" };
    
    try {
        const response = await fetchWithTimeout(`${CONFIG.API_BASE_URL}/health`, {}, 5000);
        return { status: "OK", response: await response.json() };
    } catch (error) {
        return { status: "ERROR", error: error.message };
    }
};