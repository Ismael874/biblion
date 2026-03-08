const AddBookForm = document.getElementById('add-book-form');

AddBookForm.addEventListener("submit", async(e) =>{
    e.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const categoria = document.getElementById('category').value;
    const estado = document.getElementById('estado').value;

    try{
        const response = await fetch('https://biblionsoftware.onrender.com/api/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, author, categoria, estado })
        });
        const data = await response.text();
        console.log(data);

        if (response.ok){
            console.log("Libro agregado exitosamente");
            window.location.href = "/book.html";
        }else {
            console.log("Error al agregar el libro");
        }

    } catch (error) {
        console.error('Error during adding book:', error);  

    }
})