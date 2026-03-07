// js/books.js
// Historia de Usuario: Como usuario quiero ver detalles de los libros para decidir si leerlos
// Tarea frontend: Implementar visualización de libros y detalles

import { getBooks, getBookById, createBook } from './api.js';

// Cargar libros en la página principal
document.addEventListener('DOMContentLoaded', async () => {
    const recentBooksGrid = document.getElementById('recent-books-grid');
    if (recentBooksGrid) {
        try {
            const books = await getBooks();
            displayBooks(books, recentBooksGrid);
        } catch (error) {
            recentBooksGrid.innerHTML = '<p class="error">Error cargando libros</p>';
        }
    }

    // Cargar detalle de libro si estamos en book.html
    const bookDetailContainer = document.getElementById('book-detail-container');
    if (bookDetailContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const bookId = urlParams.get('id');
        
        if (bookId) {
            try {
                const book = await getBookById(bookId);
                displayBookDetail(book, bookDetailContainer);
                
                // Registrar en historial
                addToHistory(book);
            } catch (error) {
                bookDetailContainer.innerHTML = '<p class="error">Error cargando el libro</p>';
            }
        }
    }

    // Formulario para agregar libros
    const addBookForm = document.getElementById('add-book-form');
    if (addBookForm) {
        addBookForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData();
            formData.append('title', document.getElementById('title').value);
            formData.append('author', document.getElementById('author').value);
            formData.append('category', document.getElementById('category').value);
            formData.append('year', document.getElementById('year').value);
            formData.append('description', document.getElementById('description').value);
            formData.append('pdf', document.getElementById('pdf').files[0]);
            
            const coverFile = document.getElementById('cover').files[0];
            if (coverFile) {
                formData.append('cover', coverFile);
            }

            try {
                await createBook(formData);
                alert('Libro agregado exitosamente');
                window.location.href = 'index.html';
            } catch (error) {
                alert('Error al agregar libro: ' + error.message);
            }
        });
    }
});

// Mostrar libros en grid
function displayBooks(books, container) {
    container.innerHTML = '';
    
    books.forEach(book => {
        const bookCard = createBookCard(book);
        container.appendChild(bookCard);
    });
}

// Crear tarjeta de libro
function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.onclick = () => window.location.href = `book.html?id=${book.id}`;
    
    card.innerHTML = `
        <img src="${book.cover || 'assets/default-cover.jpg'}" alt="${book.title}" class="book-cover">
        <div class="book-info">
            <h3>${book.title}</h3>
            <p>${book.author}</p>
            <p>${book.category}</p>
        </div>
    `;
    
    return card;
}

// Mostrar detalle de libro
function displayBookDetail(book, container) {
    container.innerHTML = `
        <div class="book-detail">
            <img src="${book.cover || 'assets/default-cover.jpg'}" alt="${book.title}" class="book-detail-cover">
            <div class="book-detail-info">
                <h1>${book.title}</h1>
                <div class="book-detail-meta">
                    <div class="meta-item">
                        <span class="meta-label">Autor</span>
                        <span class="meta-value">${book.author}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Categoría</span>
                        <span class="meta-value">${book.category}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Año</span>
                        <span class="meta-value">${book.year || 'N/A'}</span>
                    </div>
                </div>
                <div class="book-description">
                    <h3>Descripción</h3>
                    <p>${book.description}</p>
                </div>
                <div class="book-actions">
                    <button onclick="openPDF('${book.pdfUrl}')" class="btn btn-primary">Abrir PDF</button>
                </div>
            </div>
        </div>
    `;
}

// Función global para abrir PDF
window.openPDF = (pdfUrl) => {
    window.open(pdfUrl, '_blank');
};

// Gestión del historial
const HISTORY_KEY = 'bookHistory';

function addToHistory(book) {
    let history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    
    // Evitar duplicados
    history = history.filter(b => b.id !== book.id);
    
    // Agregar al inicio
    history.unshift({
        id: book.id,
        title: book.title,
        author: book.author,
        cover: book.cover,
        viewedAt: new Date().toISOString()
    });
    
    // Mantener solo últimos 10
    history = history.slice(0, 10);
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    
    // Actualizar UI si estamos en index
    displayHistory();
}

// Mostrar historial
function displayHistory() {
    const historyGrid = document.getElementById('history-grid');
    if (!historyGrid) return;
    
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    
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