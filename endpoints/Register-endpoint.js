const formRegister = document.getElementById('register-form');

formRegister.addEventListener("submit", async(e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const matricula = document.getElementById('matricula').value;
    const password = document.getElementById('password').value;

    try{
        const response = await fetch('https://biblionsoftware.onrender.com/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, matricula, password })
        });

        const data = await response.text();
        console.log(data);
        
    } catch (error) {
        console.error('Error during registration:', error);
    }
});