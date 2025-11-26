// ===== Модуль аутентификации =====

import { AUTH_CONFIG, STORAGE_KEYS } from './config.js';

/**
 * Проверка аутентификации пользователя
 */
export function isAuthenticated() {
    const token = localStorage.getItem(STORAGE_KEYS.authToken);
    return token !== null && token !== '';
}

/**
 * Вход в систему
 */
export async function login(username, password) {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (username === AUTH_CONFIG.username && password === AUTH_CONFIG.password) {
        // Generate simple token (UUID-like)
        const token = generateToken();
        localStorage.setItem(STORAGE_KEYS.authToken, token);
        return true;
    }
    
    return false;
}

/**
 * Выход из системы
 */
export function logout() {
    localStorage.removeItem(STORAGE_KEYS.authToken);
}

/**
 * Генерация простого токена
 */
function generateToken() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
