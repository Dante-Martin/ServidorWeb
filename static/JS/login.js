document.getElementById('loginForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            console.log('Enviando autenticación:', { username, password });

            fetch('/autenticacion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include'  // Incluir cookies para sesiones
            })
            .then(response => {
                console.log('Respuesta recibida:', {
                    status: response.status,
                    redirected: response.redirected,
                    url: response.url
                });
                if (response.redirected) {// si en respuesta hay un redirect, te redirige a la url.
                    console.log('Redirigiendo a:', response.url);
                    window.location.href = response.url;
                } else {
                    return response.json();
                }
            })
            .then(data => {
                if (data && data.error) {
                    console.log('Error del servidor:', data.error);
                    document.getElementById('errorMsg').textContent = data.error;
                    document.getElementById('errorMsg').style.display = 'block';
                }
            })
            /*LO QUE ESTABA ANTES, CON ESTO NO PODIA REDIRIGIRSE A LA PAGINA DE ADMINISTRADOR.HTML   
                fetch('/autenticacion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = '/administrador.html';
                } else {
                    document.getElementById('errorMsg').textContent = data.error || 'Usuario o contraseña incorrectos';
                    document.getElementById('errorMsg').style.display = 'block';
                }
            }) */
            .catch(error => {
                console.error('Error en fetch:', error);
                document.getElementById('errorMsg').textContent = 'Error al conectar con el servidor';
                document.getElementById('errorMsg').style.display = 'block';
            });
});