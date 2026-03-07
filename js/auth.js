// js/auth.js
// Historia de Usuario: Como usuario quiero registrarme e iniciar sesión para acceder a funciones personalizadas
// Tarea frontend: Implementar sistema de autenticación completo

import { loginUser, registerUser } from './api.js';

// Gestión del estado de autenticación
export const Auth = {
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    login: (userData, token) => {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        updateUIForAuth(true);
    },

    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        updateUIForAuth(false);
        window.location.href = 'index.html';
    },

    // Tarea frontend: Implementar acceso como invitado
    guestLogin: () => {
        localStorage.setItem('guest', 'true');
        updateUIForAuth(false, true);
        window.location.href = 'index.html';
    }
};

// Actualizar UI basado en estado de autenticación
function updateUIForAuth(isAuthenticated, isGuest = false) {
    const historySection = document.getElementById('history-section');
    const guestBtn = document.getElementById('guest-btn');
    
    if (historySection) {
        historySection.style.display = isAuthenticated ? 'block' : 'none';
    }
    
    if (guestBtn) {
        guestBtn.style.display = isAuthenticated || isGuest ? 'none' : 'block';
    }
}

// Inicializar formulario de login
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const credentials = {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            };

            try {
                const response = await loginUser(credentials);
                // Asumiendo que la respuesta contiene user y token
                Auth.login(response.user, response.token);
                window.location.href = 'index.html';
            } catch (error) {
                alert('Error al iniciar sesión: ' + error.message);
            }
        });
    }

    // Inicializar formulario de registro
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validar que las contraseñas coincidan
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden');
                return;
            }

            const userData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                password: password
            };

            try {
                await registerUser(userData);
                alert('Registro exitoso. Por favor inicia sesión.');
                window.location.href = 'login.html';
            } catch (error) {
                alert('Error al registrarse: ' + error.message);
            }
        });
    }

    // Botón de invitado
    const guestBtn = document.getElementById('guest-btn');
    if (guestBtn) {
        guestBtn.addEventListener('click', () => {
            Auth.guestLogin();
        });
    }

    // Verificar estado inicial
    if (Auth.isAuthenticated()) {
        updateUIForAuth(true);
    }
});