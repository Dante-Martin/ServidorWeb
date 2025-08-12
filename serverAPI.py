from flask import Flask,request,jsonify,render_template,redirect, url_for,session
from flask_cors import CORS
import sqlite3

app = Flask(__name__)

app.secret_key = 'star'  # Necesario para usar sesiones

CORS(app)  # Esto permite solicitudes desde cualquier origen, como http://127.0.0.1:5500

 # Ruta de la base de datos (se crea automáticamente)
DATABASE = 'database.db'

# Función para ejecutar consultas SQL
def query_db(query, args=(), one=False): # args=() indica que no hay argumentos para los placeholders -> ? 
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()#intermedairio entre python y SQLite
    cursor.execute(query, args)
    conn.commit()
    results = cursor.fetchall()
    conn.close()
    return (results[0] if results else None) if one else results

# Crear tabla de usuarios (solo una vez)
def init_db():
    query_db('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')
    print("Tabla 'users' creada/existe.")
#usuario default
query_db('''
            INSERT INTO users (username, password) 
            VALUES (?, ?)
            ON CONFLICT(username) DO NOTHING
        ''', ("aa", "a"))
# Inicializar la BD al iniciar el servidor
with app.app_context():
    init_db()       

    
# Ruta principal - GET
@app.route('/')
def index():
    return render_template('login.html')


# verificar un nuevo usuario - POST
@app.route('/autenticacion', methods=['POST'])
def verificar_usuario():
    print(request)
    data = request.get_json()
    username = data["username"]
    password = data["password"]
    print(username)
    if  query_db('''
             SELECT username
             FROM users
             WHERE username = ? and password = ?''',(username,password)) :
            print("existe")
            session['logged_in'] = True  # Marcar al usuario como autenticado
            session['username'] = username  # Opcional: almacenar el nombre de usuario
            return redirect(url_for('admin'))
            #return  jsonify({"error": "Usuario o contraseña incorrectos"}), 200
    else:
        print("no")
        
        return redirect(url_for('admin'))

# Ruta protegida para administrador.html
@app.route('/admin')
def admin():
    if not session.get('logged_in'):
        print(1)
        return redirect(url_for('index'))  # Redirigir a login si no está autenticado
        
    return render_template('administrador.html')

# Ruta para cerrar sesión
@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    session.pop('username', None)
    return redirect(url_for('index'))




'''
# Actualizar un usuario - PUT
@app.route('/usuarios/<int:user_id>', methods=['PUT'])
def actualizar_usuario(user_id):
    #archivo= open("BD.txt","a")
    usuario = next((user for user in usuarios if user["id"] == user_id), None)
    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404
    
    data = request.get_json()
    usuario.update({
        "nombre": data.get('nombre', usuario['nombre']),
        "email": data.get('email', usuario['email'])
    })
    return jsonify({"mensaje": "Usuario actualizado", "usuario": usuario})

# Eliminar un usuario - DELETE
@app.route('/usuarios/<int:user_id>', methods=['DELETE'])
#abirir el doc y borrar
def eliminar_usuario(user_id):
    archivo=open("BD.txt","w")
    global usuarios
    usuario = next((user for user in usuarios if user["id"] == user_id), None)
    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404
    
    usuarios = [user for user in usuarios if user["id"] != user_id]
    archivo.write(str(usuarios))
    archivo.close() 
    return jsonify({"mensaje": "Usuario eliminado"})
'''
# Configuración y ejecución del servidor
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)