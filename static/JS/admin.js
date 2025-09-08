document.addEventListener('DOMContentLoaded', () => {
    const userForm = document.getElementById('userForm');
    const userTable = document.querySelector('#userTable tbody');
    const errorMsg = document.getElementById('errorMsg');
    const cancelEditBtn = document.getElementById('cancelEdit');

    const btmABMuser = document.getElementById('btm-ABM-user');
    const listauser = document.getElementById('lista-user');
    const btmABMprod = document.getElementById('btm-ABM-prod');
    const listaprod = document.getElementById('lista-prod');
    
    const prodForm = document.getElementById('prodForm');
    const prodTable = document.querySelector('#prodTable tbody');
    const errorMsgProd = document.getElementById('errorMsgProd');
    const cancelEditBtnProd = document.getElementById('cancelEditProd');

    //boton para elejir la ABM de usuarios
    btmABMuser.addEventListener('click', ()=>{
        listauser.classList.remove('oculta-si')
        listauser.classList.add('oculta-no')
        listaprod.classList.add('oculta-si')
        listaprod.classList.remove('oculta-no')
    })
    //boton para elejir la ABM de productos
    btmABMprod.addEventListener('click', ()=>{
        listaprod.classList.remove('oculta-si')
        listaprod.classList.add('oculta-no')
        listauser.classList.add('oculta-si')
        listauser.classList.remove('oculta-no')
    })
    // Cargar lista de usuarios al iniciar
    fetchUsers();

    // Manejar envío del formulario (crear o actualizar)
    userForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const userId = document.getElementById('userId').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const rol = document.getElementById('rol').value;

        const method = userId ? 'PUT' : 'POST';
        const url = userId ? `/api/users/${userId}` : '/api/users';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, rol }),
            credentials: 'include'
        })
        .then(response => {
            if (response.status === 401) {
                window.location.href = '/'; // Redirigir a login si no está autorizado
                return;
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                errorMsg.textContent = data.error;
                errorMsg.style.display = 'block';
            } else {
                errorMsg.style.display = 'none';
                userForm.reset();
                cancelEditBtn.style.display = 'none';
                document.getElementById('userId').value = '';
                fetchUsers(); // Actualizar la lista
            }
        })
        .catch(error => {
            console.error('Error:', error);
            errorMsg.textContent = 'Error al conectar con el servidor';
            errorMsg.style.display = 'block';
        });
    });

    // Manejar cancelar edición
    cancelEditBtn.addEventListener('click', () => {
        userForm.reset();
        cancelEditBtn.style.display = 'none';
        document.getElementById('userId').value = '';
        errorMsg.style.display = 'none';
    });

    // Función para cargar y mostrar usuarios
    function fetchUsers() {
        fetch('/api/users', {
            credentials: 'include'
        })
        .then(response => {
            if (response.status === 401) {
                window.location.href = '/'; // Redirigir a login si no está autorizado
                return;
            }
            return response.json();
        })
        .then(users => {
            if (!users) return;
            userTable.innerHTML = '';
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.rol}</td>
                    <td>
                        <button class="action-btn edit-btn" data-id="${user.id}" data-username="${user.username}" data-rol="${user.rol}">Editar</button>
                        <button class="action-btn delete-btn" data-id="${user.id}">Eliminar</button>
                    </td>
                `;
                userTable.appendChild(row);
            });

            // Agregar eventos a botones de editar
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    const username = btn.getAttribute('data-username');
                    const rol = btn.getAttribute('data-rol')
                    document.getElementById('userId').value = id;
                    document.getElementById('username').value = username;
                    document.getElementById('password').value = '';
                    document.getElementById('rol').value = rol ;
                    cancelEditBtn.style.display = 'block';
                    errorMsg.style.display = 'none';
                });
            });

            // Agregar eventos a botones de eliminar
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    if (confirm('¿Estás seguro de eliminar este usuario?')) {
                        fetch(`/api/users/${id}`, {
                            method: 'DELETE',
                            credentials: 'include'
                        })
                        .then(response => {
                            if (response.status === 401) {
                                window.location.href = '/';
                                return;
                            }
                            return response.json();
                        })
                        .then(data => {
                            if (data.error) {
                                errorMsg.textContent = data.error;
                                errorMsg.style.display = 'block';
                            } else {
                                errorMsg.style.display = 'none';
                                fetchUsers();
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            errorMsg.textContent = 'Error al conectar con el servidor';
                            errorMsg.style.display = 'block';
                        });
                    }
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            errorMsg.textContent = 'Error al conectar con el servidor';
            errorMsg.style.display = 'block';
        });
    }
});