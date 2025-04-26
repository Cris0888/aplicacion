from flask import  render_template,request
from conexion import *
from routes.inicio_de_seccion import *


from models.class_metodos_pago import los_metodos

from models.class_filtros import losfiltros







@aplicacion.route('/filtros', methods=['GET', 'POST'])
@login_required
def filtros():
    metodos = los_metodos.traer_metodos()
    filtro_sin_atributos = losfiltros.traer_filtros()
    return render_template("filtros.html", filtro_sin_atributos=filtro_sin_atributos, metodos=metodos)



@aplicacion.route('/filtros/buscar_filtros', methods=['POST'])
def buscar_filtros():
    data = request.get_json()
    fecha_filtro = data.get('fecha', '')
    metodo_filtro = data.get('metodo', '')

    if fecha_filtro and metodo_filtro:
        filtro_atributos = losfiltros.traer_filtros(fecha_filtro, metodo_filtro)
        return jsonify({'busqueda': filtro_atributos if filtro_atributos else []})

    filtro_todos = losfiltros.traer_filtros()
    return jsonify({'busqueda': filtro_todos})


@aplicacion.route("/filtros/eliminar",methods= ['POST'])
def eliminar():
    eliminar_filtros = request.get_json()
    identificacion = eliminar_filtros.get('identificacion')
    try:
        losfiltros.eliminar_ventas(identificacion)
        return jsonify({"exito": "venta eliminada con exito"})
    except Exception as e:
        return jsonify({"error" : f"Error al eliminar el metodo: {str(e)}"})

