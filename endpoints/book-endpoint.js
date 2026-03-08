async function getBooks() {

    try {

        const response = await fetch(`https://biblionsoftware.onrender.com/api/book`);
        const books = await response.json();

        console.log(books);

        const container = document.getElementById('book-detail-container');

        container.innerHTML = books.map(book => `
            <div class="book-detail">
                <h1>${book.title}</h1>
                <p><strong>Autor:</strong> ${book.author}</p>
                <p><strong>Categoría:</strong> ${book.categoria}</p>
                <p><strong>Estado:</strong> ${book.estado}</p>
            </div>
        `).join("");

    } catch (error) {
        console.error('Error fetching book details:', error);
    }
}

getBooks();