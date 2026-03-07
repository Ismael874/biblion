// js/search.js
// Historia de Usuario: Como usuario quiero buscar libros para encontrar material disponible en la biblioteca
// Tarea frontend: Implementar barra de búsqueda y renderizado dinámico de resultados desde la API

import { getBooks } from './api.js';

let searchTimeout;

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    if (searchInput && searchResults) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            // Limpiar timeout anterior
            clearTimeout(searchTimeout);
            
            // Ocultar resultados si la búsqueda está vacía
            if (query.length < 2) {
                searchResults.style.display = 'none';
                return;
            }
            
            // Debounce para evitar demasiadas peticiones
            searchTimeout = setTimeout(async () => {
                try {
                    const books = await getBooks(query);
                    displaySearchResults(books, searchResults);
                } catch (error) {
                    console.error('Error en búsqueda:', error);
                }
            }, 300);
        });

        // Cerrar resultados al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }
});

function displaySearchResults(books, container) {
    if (books.length === 0) {
        container.innerHTML = '<div class="search-result-item">No se encontraron libros</div>';
    } else {
        container.innerHTML = books.slice(0, 5).map(book => `
            <div class="search-result-item" onclick="window.location.href='book.html?id=${book.id}'">
                <h4>${book.title}</h4>
                <p>${book.author} - ${book.category}</p>
            </div>
        `).join('');
    }
    
    container.style.display = 'block';
}