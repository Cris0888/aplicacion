from flask import  render_template,request,redirect,url_for,session
from conexion import *
import hashlib
from routes.inicio_de_seccion import *

from models.class_usuarios import los_usuarios

@aplicacion.route('/Usuarios')
@login_required
@role_required('Administrador')
def Usuarios():

    usuario= los_usuarios.Traer_usuarios()
    # Verifica que las variables se estén pasando correctamente
    return render_template('/usuarios.html', usuario = usuario)



@aplicacion.route('/crear_usuario',methods=['POST'])
@login_required 
@role_required('Administrador')
def crear():

    datos_crear = request.get_json()

    nombre = datos_crear.get('nombre')
    correo = datos_crear.get('correo')
    contrasena  = datos_crear.get('contrasena')
    rol = datos_crear.get('rol')

    cifrada=hashlib.sha512(contrasena.encode('utf-8')).hexdigest()
    
    correo_usuario = los_usuarios.verificar_correo(correo)

    if correo_usuario:
        return jsonify({"correo_existente" : 'este correo ya existe'}),403
    try:
        los_usuarios.crear_usuario(nombre,correo,cifrada,rol)
        return jsonify({"exito" : 'usuario creado con exito'}),200
    
    except Exception as e:
        return jsonify({"error" : f'Error al crear el usuario {e}'}),500




@aplicacion.route('/actualizar_usuario', methods=['POST'])
@login_required 
@role_required('Administrador')
def actualizar_usuarios():
    datos_actualizar = request.get_json()
    id_usuario = datos_actualizar.get('idetificacion')
    contrasena_nueva = datos_actualizar.get('contrasena_nueva')
    contrasena_antigua = datos_actualizar.get('contrasena_anterior')

    almacenada_antigua = los_usuarios.traer_cifrada(id_usuario)


    # Cifrar la contraseña antigua ingresada por el usuario
    contrasena_antigua_cifrada = hashlib.sha512(contrasena_antigua.encode('utf-8')).hexdigest()

    # Comparar la contraseña ingresada con la almacenada
    if contrasena_antigua_cifrada != almacenada_antigua:
        return jsonify({"contraseña_incorrecta" : 'La contraseña antigua no es correcta'}),403
    
    try:
        contrasena_nueva = hashlib.sha512(contrasena_nueva.encode('utf-8')).hexdigest()
        los_usuarios.actualizar_contrasena(contrasena_nueva,id_usuario)
        return jsonify({"exito" :'Contraseña actualizada con éxito'}),200
    except Exception as e:
        return jsonify({"error" : f'Error al actualizar la contraseña {e}'}),500




    
@aplicacion.route('/eliminar_usuario',methods=['POST'])
@login_required 
@role_required('Administrador')
def eliminar_usuario():
        datos_eliminar = request.get_json()
        try:        
            identificacion= datos_eliminar.get('idetificacion')

            los_usuarios.eliminar_usuario(identificacion)

            return jsonify({"exito" : 'usuario eliminado con exito'}),200
        
        except Exception as e:
            return jsonify({"error" : f'Error al eliminar el usuario {e}'}),500


        





