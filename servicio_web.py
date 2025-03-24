
from flask import Flask,request,jsonify
from flask_cors import CORS

app = Flask(__name__)
#app.config['JSON_SORT_KEYS'] = False
CORS(app)  # Esto permite solicitudes desde cualquier origen, como http://127.0.0.1:5500

usuarios = [
    {"id": 1, "nombre": "Juan", "email": "juan@example.com"},
    {"id": 2, "nombre": "Maria", "email": "maria@example.com"}
]
#def JsonToSting(ruta,contenido):
 #   with open(ruta,"r") as archivo
        

    
# Ruta principal - GET
@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "mensaje": "Bienvenido al Web Service",
        "endpoints_disponibles": ["/usuarios", "/usuarios/<id>"]
    })


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
def eliminar_usuario(user_id):
    global usuarios
    usuario = next((user for user in usuarios if user["id"] == user_id), None)
    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404
    
    usuarios = [user for user in usuarios if user["id"] != user_id]
    return jsonify({"mensaje": "Usuario eliminado"})

# Configuración y ejecución del servidor
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
