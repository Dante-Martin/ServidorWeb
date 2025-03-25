// public/script.js
document.addEventListener('DOMContentLoaded', cargarUsuarios);

// Cambia la URL base según donde corra tu servidor Python
const API_URL = 'http://localhost:5000/usuarios';

async function cargarUsuarios() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error en la respuesta del servidor: ' + response.status);
        const data = await response.json();
        console.log(data);
        const tbody = document.getElementById('usuariosTable');
        tbody.innerHTML = '';

        if (Array.isArray(data.usuarios)) {
            for (let i = 0; i < data.usuarios.length; i++) {
                const usuario = data.usuarios[i];
                const row = `<tr>
                                <td>${usuario.id}</td>
                                <td>${usuario.nombre}</td>
                                <td>${usuario.email}</td>
                                <td>
                                    <button class="trash-icon" data-id="${usuario.id}">&#128465;</button>
                                </td>
                            </tr>`;
                tbody.innerHTML += row;
            }
        } else {
            document.getElementById('error').textContent = 'Error: La respuesta no contiene una lista de usuarios válida.';
        }
        // Agregar event listeners a los íconos de tacho
        document.querySelectorAll('.trash-icon').forEach(button => {
            button.addEventListener('click', mostrarConfirmacion);
        });
    } catch (error) {
        document.getElementById('error').textContent = 'Error al obtener los datos: ' + error.message;
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