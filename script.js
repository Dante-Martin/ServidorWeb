// public/script.js
document.addEventListener('DOMContentLoaded', cargarUsuarios);

// Cambia la URL base según donde corra tu servidor Python
const API_URL = 'http://localhost:5000/usuarios';

async function cargarUsuarios() {
    try {
        const response = await fetch(API_URL);
        const usuarios = await response.json();
        console.log(usuarios[0]);
        const tbody = document.getElementById('usuariosTable');
        tbody.innerHTML = '';

        usuarios.forEach(usuario => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${usuario.id}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.email}</td>
                <td><button class="delete-btn" onclick="eliminarUsuario(${usuario.id})">Eliminar</button></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
    }
}

document.getElementById('usuarioForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const usuario = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value
    };

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        });
        document.getElementById('usuarioForm').reset();
        cargarUsuarios();
    } catch (error) {
        console.error('Error al agregar usuario:', error);
    }
});

async function eliminarUsuario(id) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        cargarUsuarios();
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
    }
}