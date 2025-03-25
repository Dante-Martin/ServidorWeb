// script.js
document.addEventListener('DOMContentLoaded', cargarUsuarios);

const API_URL = 'http://localhost:5000/api/usuarios';

async function cargarUsuarios() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error en la respuesta del servidor: ' + response.status);
        const usuarios = await response.json();
        const tbody = document.getElementById('usuariosTable');
        tbody.innerHTML = '';

        usuarios.forEach(usuario => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${usuario.id}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.email}</td>
                <td>
                    <button class="trash-icon" data-id="${usuario.id}">&#128465;</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Agregar event listeners a los íconos de tacho
        document.querySelectorAll('.trash-icon').forEach(button => {
            button.addEventListener('click', mostrarConfirmacion);
        });
    } catch (error) {
        document.getElementById('error').textContent = 'Error al cargar usuarios: ' + error.message;
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
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        });
        if (!response.ok) throw new Error('Error al agregar usuario');
        document.getElementById('usuarioForm').reset();
        cargarUsuarios();
    } catch (error) {
        document.getElementById('error').textContent = 'Error al agregar usuario: ' + error.message;
        console.error('Error al agregar usuario:', error);
    }
});

// Manejar el modal de confirmación
const modal = document.getElementById('confirmModal');
const confirmYes = document.getElementById('confirmYes');
const confirmNo = document.getElementById('confirmNo');
let idToDelete = null;

function mostrarConfirmacion(event) {
    idToDelete = event.target.getAttribute('data-id');
    modal.style.display = 'flex';
}

confirmYes.addEventListener('click', async () => {
    if (idToDelete) {
        try {
            const response = await fetch(`${API_URL}/${idToDelete}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Error al eliminar usuario');
            modal.style.display = 'none';
            idToDelete = null;
            cargarUsuarios();
        } catch (error) {
            document.getElementById('error').textContent = 'Error al eliminar usuario: ' + error.message;
            console.error('Error al eliminar usuario:', error);
        }
    }
});

confirmNo.addEventListener('click', () => {
    modal.style.display = 'none';
    idToDelete = null;
});