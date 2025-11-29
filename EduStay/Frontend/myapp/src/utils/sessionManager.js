//utils/sessionManager.js
let sessionTimer = null;

export const startSessionTimer = (navigate) => {
    // Clear any existing timer
    if (sessionTimer) {
        clearTimeout(sessionTimer);
    }
    
    // Only start timer if token exists
    const token = localStorage.getItem('token');
    if (!token) return;
    
    // Check if session start time exists, if not set it
    let sessionStart = localStorage.getItem('sessionStart');
    if (!sessionStart) {
        sessionStart = Date.now().toString();
        localStorage.setItem('sessionStart', sessionStart);
    }
    
    // Calculate remaining time
    const elapsed = Date.now() - parseInt(sessionStart);
    const remaining = (30 * 60 * 1000) - elapsed;
    
    // If already expired, logout immediately
    if (remaining <= 0) {
        logout(navigate);
        return;
    }
    
    // Set timer for remaining time
    sessionTimer = setTimeout(() => {
        logout(navigate);
    }, remaining);
};

export const logout = (navigate) => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('sessionStart');
    if (sessionTimer) {
        clearTimeout(sessionTimer);
        sessionTimer = null;
    }
    alert('Session expired. Please login again.');
    if (navigate) navigate('/login');
};

export const clearSessionTimer = () => {
    if (sessionTimer) {
        clearTimeout(sessionTimer);
        sessionTimer = null;
    }
};