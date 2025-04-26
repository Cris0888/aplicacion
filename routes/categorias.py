from flask import  render_template,request,jsonify,session,redirect,flash,url_for
from conexion import *
from models.class_categorias import ingresar_categorias
from routes.inicio_de_seccion import *



@aplicacion.route('/categorias')
@login_required  
def categorias():
    categorias = ingresar_categorias.traer_categorias()  # <-- Asegúrate de que sea una lista
    return render_template('categorias.html', categorias=categorias)  # <-- Se pasa como "categorias"




@aplicacion.route('/busqueda_categorias', methods=['GET'])
@login_required 
def busqueda_categorias():
    nombre_categorias = request.args.get('nombre_categorias', "").strip()
    usuario_rol = session.get("rol", "")  # Asegurar que no sea None

    # Si no se proporciona un nombre, no devolver todas las categorías para optimizar
    if not nombre_categorias:
        return jsonify({"productos": [], "rol": usuario_rol})

    # Llamar al método traer_categorias con el nombre buscado
    categoria = ingresar_categorias.traer_categorias(nombre_categorias)

    # Retornar los productos junto con el rol del usuario
    return jsonify({
        "productos": categoria,  
        "rol": usuario_rol
    })





@aplicacion.route('/crear_categoria', methods=['POST'])
def crear_categoria():
    if not session.get("logueado"):
        return redirect('/')
    if session.get("rol") in ['Administrador', 'Vendedor']:
        datos = request.get_json()
        nombre_categoria = datos.get('nombre')
        
        nombre = session['nombre']

        categorias = ingresar_categorias.verificar_existencia( nombre_categoria )

        if categorias:
            return jsonify({"error": "esta categoria ya existe"}), 400

        try:
            ingresar_categorias.categoria(nombre_categoria,nombre)
            return jsonify({"exito": "Categoría creada con éxito"}), 200
        except Exception as e:
            return jsonify({"error": "Ocurrió un error al crear la categoría", "detalle": str(e)}), 500
    else:
        return redirect('/home')
    


@aplicacion.route('/eliminar_categoria',methods=['POST'])
@role_required('Administrador')
def eliminar_categoria():
    if not session.get("logueado"):
        return redirect('/')
    if session.get("rol") in ['Administrador']:
        datos_eliminar = request.get_json()
        identificacion = datos_eliminar.get('identificacion')
        negacion = ingresar_categorias.borrar_categoria(identificacion)
        try:
            if negacion == False:
                return jsonify({"error_borrar": "no se puede eliminar esta categoria porque tiene productos asociados"}), 400
            ingresar_categorias.borrar_categoria(identificacion)
            return jsonify({"exito": "categoria eliminada con exito"}),200
        except Exception as e:
            return jsonify({"error": "ocurrio un error al borrar la categoria", "detalle": str(e)}),500
    else:
        return redirect('/home')


@aplicacion.route('/actualizar_categoria', methods=['POST'])
@login_required
def actualizar_categoria():
        if not session.get("logueado"):
            return redirect('/')
        if session.get("rol") in ['Administrador', 'Vendedor']:
            datos_actualizar = request.get_json()
            identificacion = datos_actualizar.get('identificacion')
            nombre = datos_actualizar.get('nombre')

            categorias = ingresar_categorias.verificar_existencia(nombre)

            if categorias:
                return jsonify({"error": "esta categoria ya existe"}), 400
            try:
                ingresar_categorias.actualizar_categoria(identificacion,nombre)
                return jsonify({"exito" : "categoria actualizada con exito"}),200
            except Exception as e:
                return jsonify({"error": "ocurrio un error al actualizar la categoria", "detalle": str(e)}),500
        else:
            return redirect('/home')
    