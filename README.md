# ServidorWeb
La idea es crear un servidor que maneje varias paginas web

from flask import Flask,request,jsonify,render_template
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
#app.config['JSON_SORT_KEYS'] = False
CORS(app)  # Esto permite solicitudes desde cualquier origen, como http://127.0.0.1:5500

#def JsonToSting(rutaJson,rutaTxt):
#    with open(rutaJson,"r",encoding="utf-8") as archivo:
#       datos= jsonify.load(archivo)#convierte el texto Json en un objeto de python equivalente
#    with open(rutaTxt,"w",encoding="utf-8") as :

 # Ruta de la base de datos (se crea automáticamente)
DATABASE = 'database.db'

# Función para ejecutar consultas SQL
def query_db(query, args=(), one=False):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
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

# Inicializar la BD al iniciar el servidor
with app.app_context():
    init_db()       

    
# Ruta principal - GET
@app.route('/')
def index():
    return render_template('pagina.html')

# Obtener todos los usuarios - GET
@app.route('/usuarios', methods=['GET'])
def get_usuarios():
    return jsonify({"usuarios": usuarios})


# Obtener un usuario por ID - GET
@app.route('/usuarios/<int:user_id>', methods=['GET'])
def get_usuario(user_id):
    #archivo= open("BD.txt","r")
    usuario = next((user for user in usuarios if user["id"] == user_id), None)
    if usuario:
        return jsonify({"usuario": usuario})
    return jsonify({"error": "Usuario no encontrado"}), 404

# Crear un nuevo usuario - POST
@app.route('/usuarios', methods=['POST'])
def crear_usuario():
    print(request)
    data = request.get_json()
    archivo=open("BD.txt","w")
    if not data or 'nombre' not in data or 'email' not in data:
        return jsonify({"error": "Faltan datos requeridos"}), 400
    
    nuevo_usuario = {
        "id": len(usuarios) + 1,
        "nombre": data['nombre'],
        "email": data['email']
    }
    usuarios.append(nuevo_usuario)
    #for usuario in usuarios:
    archivo.write(str(usuarios))
    archivo.close()
    return jsonify({"mensaje": "Usuario creado", "usuario": nuevo_usuario}), 201

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

# Configuración y ejecución del servidor
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
