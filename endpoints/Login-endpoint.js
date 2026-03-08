const loginForm = document.getElementById('login-form');

loginForm.addEventListener("submit", async(e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try{
       
        const response = await fetch('https://biblionsoftware.onrender.com/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.text();
        console.log(data);

        if (response.ok){
            console.log("Login exitoso");
            window.location.href = "/book.html";
        }

        if (!response.ok){
            console.log("Login fallido");
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
});