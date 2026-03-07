// js/api.js
// Archivo central para todas las conexiones con el backend
// Tarea frontend: Implementar todas las llamadas a la API

const API_BASE_URL = 'https://biblionsoftware.onrender.com/api';

// Helper para manejar las respuestas de la API
async function handleResponse(response) {
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Error en la petición');
    }
    return response.json();
}

// ============================================
// ENDPOINTS DE AUTENTICACIÓN
// ============================================

// Tarea frontend: Conexión con endpoint /auth/login
export async function loginUser(credentials) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });
        return await handleResponse(response);
    } catch (error) {
        console.error('Error en login:', error);
        throw error;
    }
}

// Tarea frontend: Conexión con endpoint /auth/register
export async function registerUser(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        return await handleResponse(response);
    } catch (error) {
        console.error('Error en registro:', error);
        throw error;
    }
}

// ============================================
// ENDPOINTS DE LIBROS
// ============================================

// Tarea frontend: Conexión con endpoint GET /book
export async function getBooks(searchTerm = '') {
    try {
        const url = searchTerm 
            ? `${API_BASE_URL}/book?search=${encodeURIComponent(searchTerm)}`
            : `${API_BASE_URL}/book`;
        
        const response = await fetch(url);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error obteniendo libros:', error);
        throw error;
    }
}

// Tarea frontend: Conexión con endpoint GET /book/{id}
export async function getBookById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/book/${id}`);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error obteniendo libro:', error);
        throw error;
    }
}

// Tarea frontend: Conexión con endpoint POST /book
export async function createBook(bookData) {
    try {
        const response = await fetch(`${API_BASE_URL}/book`, {
            method: 'POST',
            headers: {
                // No establecer Content-Type, el navegador lo configurará automáticamente para FormData
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: bookData // bookData debe ser FormData
        });
        return await handleResponse(response);
    } catch (error) {
        console.error('Error creando libro:', error);
        throw error;
    }
}

// ============================================
// ENDPOINTS DE PRÉSTAMOS
// ============================================

// Tarea frontend: Conexión con endpoint GET /loan
export async function getLoans() {
    try {
        const response = await fetch(`${API_BASE_URL}/loan`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return await handleResponse(response);
    } catch (error) {
        console.error('Error obteniendo préstamos:', error);
        throw error;
    }
}

// Tarea frontend: Conexión con endpoint POST /loan
export async function createLoan(loanData) {
    try {
        const response = await fetch(`${API_BASE_URL}/loan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(loanData)
        });
        return await handleResponse(response);
    } catch (error) {
        console.error('Error creando préstamo:', error);
        throw error;
    }
}