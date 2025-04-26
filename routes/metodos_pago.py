from flask import  render_template,request,redirect,session,url_for
from conexion import *
from routes.inicio_de_seccion import *

from models.class_metodos_pago import los_metodos

@aplicacion.route('/metodos')
@login_required
def metodos():
    exito = request.args.get('exito')
    error = request.args.get('error')
    resultado=los_metodos.traer_metodos()
    return render_template("metodos_pago.html",resultado=resultado, error=error, exito=exito)


    

@aplicacion.route('/metodos/crear',methods=['POST'])
@login_required
@role_required('Administrador')
def añadir_metodo():

    datos_crear = request.get_json()
    nombre_metodo = datos_crear.get('nombre_metodo')
    """nombre del usuario que inicio sesion"""
    nombre = session['nombre']

    existente=los_metodos.verificar_metodo(nombre_metodo)

    if existente:
        return jsonify({"existente" : 'este metodo de pago ya existe'})
    
    try:
        los_metodos.insertar(nombre_metodo,nombre)
        return jsonify({"exito" : 'metodo creado con exito'})
    
    except Exception as e:
        return jsonify({"error" :f'Error al crear el metodo: {str(e)}'})

    

@aplicacion.route('/metodos/eliminar',methods=['POST'])
@login_required 
@role_required('Administrador')
def borrar_metodo():

    datos_eliminar = request.get_json()

    identificacion = datos_eliminar.get('id_metodo')

    credito=los_metodos.verificar_credito(identificacion)

    if credito:
        return jsonify({"metodo_incorrecto": 'este metodo no esta permitido borrarlo'}),403
    try:
        los_metodos.borrar_venta(identificacion)
        los_metodos.eliminar(identificacion)
        return jsonify({"exito" : 'metodo eliminado con exito'}),200 
    except Exception as e:
        return jsonify({"error" f'Error al eliminar el metodo: {str(e)}'}),500
