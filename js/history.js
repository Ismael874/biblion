// js/history.js
// Historia de Usuario: Como usuario autenticado quiero ver mi historial de consultas para recordar libros interesantes
// Tarea frontend: Implementar visualización del historial de libros consultados

import { getLoans } from './api.js';
import { Auth } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
    const historySection = document.getElementById('history-section');
    
    if (historySection && Auth.isAuthenticated()) {
        try {
            // Intentar obtener préstamos del backend
            const loans = await getLoans();
            displayLoansHistory(loans);
        } catch (error) {
            console.log('Usando historial local');
            // Fallback al historial local si el endpoint falla
            displayLocalHistory();
        }
    }
});

function displayLoansHistory(loans) {
    const historyGrid = document.getElementById('history-grid');
    if (!historyGrid) return;
    
    if (loans.length === 0) {
        historyGrid.innerHTML = '<p class="no-history">No tienés préstamos activos</p>';
        return;
    }
    
    historyGrid.innerHTML = '';
    loans.forEach(loan => {
        if (loan.book) {
            const card = createBookCard(loan.book);
            historyGrid.appendChild(card);
        }
    });
}

function displayLocalHistory() {
    const history = JSON.parse(localStorage.getItem('bookHistory') || '[]');
    const historyGrid = document.getElementById('history-grid');
    
    if (!historyGrid) return;
    
    if (history.length === 0) {
        historyGrid.innerHTML = '<p class="no-history">Aún no has visto ningún libro</p>';
        return;
    }
    
    historyGrid.innerHTML = '';
    history.forEach(book => {
        const card = createBookCard(book);
        historyGrid.appendChild(card);
    });
}

function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.onclick = () => window.location.href = `book.html?id=${book.id}`;
    
    card.innerHTML = `
        <img src="${book.cover || 'assets/default-cover.jpg'}" alt="${book.title}" class="book-cover">
        <div class="book-info">
            <h3>${book.title}</h3>
            <p>${book.author}</p>
            <small>Visto: ${new Date(book.viewedAt).toLocaleDateString()}</small>
        </div>
    `;
    
    return card;
}