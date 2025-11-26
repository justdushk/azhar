// ===== Модуль Supabase =====

import { SUPABASE_CONFIG } from './config.js';

/**
 * Инициализация Supabase клиента
 * Используется CDN версия библиотеки
 */

let supabaseClient = null;

/**
 * Получить Supabase клиент
 */
export async function getSupabase() {
    if (supabaseClient) {
        return supabaseClient;
    }
    
    // Load Supabase library from CDN if not already loaded
    if (!window.supabase) {
        await loadSupabaseLibrary();
    }
    
    const { createClient } = window.supabase;
    supabaseClient = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);
    
    return supabaseClient;
}

/**
 * Загрузка библиотеки Supabase из CDN
 */
function loadSupabaseLibrary() {
    return new Promise((resolve, reject) => {
        // Check if already loaded
        if (window.supabase) {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

/**
 * Универсальная функция для SELECT запросов
 */
export async function selectData(table, options = {}) {
    try {
        const supabase = await getSupabase();
        let query = supabase.from(table).select(options.select || '*');
        
        // Фильтры
        if (options.eq) {
            Object.entries(options.eq).forEach(([key, value]) => {
                query = query.eq(key, value);
            });
        }
        
        // Сортировка
        if (options.order) {
            query = query.order(options.order.column, { 
                ascending: options.order.ascending !== false 
            });
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Select error:', error);
        return { data: null, error };
    }
}

/**
 * Универсальная функция для INSERT запросов
 */
export async function insertData(table, data) {
    try {
        const supabase = await getSupabase();
        const { data: insertedData, error } = await supabase
            .from(table)
            .insert(data)
            .select();
        
        if (error) throw error;
        return { data: insertedData, error: null };
    } catch (error) {
        console.error('Insert error:', error);
        return { data: null, error };
    }
}

/**
 * Универсальная функция для UPDATE запросов
 */
export async function updateData(table, id, data) {
    try {
        const supabase = await getSupabase();
        const { data: updatedData, error } = await supabase
            .from(table)
            .update(data)
            .eq('id', id)
            .select();
        
        if (error) throw error;
        return { data: updatedData, error: null };
    } catch (error) {
        console.error('Update error:', error);
        return { data: null, error };
    }
}

/**
 * Универсальная функция для DELETE запросов
 */
export async function deleteData(table, id) {
    try {
        const supabase = await getSupabase();
        const { error } = await supabase
            .from(table)
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return { error: null };
    } catch (error) {
        console.error('Delete error:', error);
        return { error };
    }
}

/**
 * Подсчет записей в таблице
 */
export async function countRecords(table, options = {}) {
    try {
        const supabase = await getSupabase();
        let query = supabase.from(table).select('*', { count: 'exact', head: true });
        
        // Фильтры
        if (options.eq) {
            Object.entries(options.eq).forEach(([key, value]) => {
                query = query.eq(key, value);
            });
        }
        
        const { count, error } = await query;
        
        if (error) throw error;
        return { count, error: null };
    } catch (error) {
        console.error('Count error:', error);
        return { count: 0, error };
    }
}
