// Подключаем Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://lekfinikofmjbhkqxzkg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxla2Zpbmlrb2ZtamJoa3F4emtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNDA0OTIsImV4cCI6MjA3OTcxNjQ5Mn0.WcfhUXDmGobTs74swdx-9z_3f6er3k8v3rwWb5BO4TM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function fetchMenu() {
    const { data, error } = await supabase.from('menu').select('*').order('order', { ascending: true });
    if (error) { console.error('Ошибка меню:', error); return []; }
    return data;
}

export async function fetchSections(pageSlug) {
    const { data, error } = await supabase.from('sections').select('*').eq('page', pageSlug).order('order', { ascending: true });
    if (error) { console.error('Ошибка секций:', error); return []; }
    return data.map(sec => ({
        ...sec,
        section_content: sec.section_content ? JSON.parse(sec.section_content) : []
    }));
}
// Получение текущего пользователя
export function getCurrentUser() {
    return supabase.auth.user();
}

// Вход
export async function signIn(email, password) {
    const { user, error } = await supabase.auth.signIn({ email, password });
    if (error) throw error;
    return user;
}

// Выход
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

// CRUD для меню
export async function addMenuItem(item) {
    const { data, error } = await supabase.from('menu').insert([item]);
    if (error) throw error;
    return data;
}

export async function updateMenuItem(id, updates) {
    const { data, error } = await supabase.from('menu').update(updates).eq('id', id);
    if (error) throw error;
    return data;
}

export async function deleteMenuItem(id) {
    const { data, error } = await supabase.from('menu').delete().eq('id', id);
    if (error) throw error;
    return data;
}

// CRUD для секций
export async function addSection(section) {
    const { data, error } = await supabase.from('sections').insert([section]);
    if (error) throw error;
    return data;
}

export async function updateSection(id, updates) {
    const { data, error } = await supabase.from('sections').update(updates).eq('id', id);
    if (error) throw error;
    return data;
}

export async function deleteSection(id) {
    const { data, error } = await supabase.from('sections').delete().eq('id', id);
    if (error) throw error;
    return data;
}
