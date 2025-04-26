from flask import render_template, request,session,jsonify
from conexion import *
import os
from werkzeug.utils import secure_filename
from models.class_productos import los_productos
from models.class_categorias import ingresar_categorias
from routes.inicio_de_seccion import *
from decimal import Decimal

# Ruta para mostrar productos
@aplicacion.route('/productos')
@login_required
def productos():
    categoria = ingresar_categorias.traer_categorias()
    resultado = los_productos.traer_productos()
    # Verifica que las variables se estén pasando correctamente
    return render_template('/productos.html', resultado = resultado , categoria = categoria)


@aplicacion.route('/busqueda_inventario', methods=['GET'])
@login_required 
def buscar_inventario():
    nombre_producto = request.args.get('nombre_producto', "").strip()
    usuario_rol = session.get("rol")  # Obtener el rol del usuario desde la sesión
    
    # Llamar al método traer_productos con el nombre buscado
    productos = los_productos.traer_productos(nombre_producto)

    # Retornar los productos junto con el rol del usuario
    return jsonify({
        "productos": productos,  # Se mantiene "productos" para coincidencia con JS
        "rol": usuario_rol
    })




# Configuración
UPLOAD_FOLDER = 'static/img_producto'  # Carpeta donde se guardarán las imágenes
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
MAX_FILE_SIZE =  2 * 1024 * 1024  # 2MB

aplicacion.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
aplicacion.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Verifica si la extensión es válida
def verificar_extension(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS





@aplicacion.route('/productos/agregar', methods=['POST'])
@login_required
def agregar_producto():
    try:
        # Obtener datos del formulario
        nombre = request.form.get('nombre')
        categoria = request.form.get('categoria')
        descripcion = request.form.get('descripcion', '')
        
        # Limpiar y convertir precios
        precio_compra_raw = request.form.get('precio_compra', '0').replace('.', '')
        precio_venta_raw = request.form.get('precio_venta', '0').replace('.', '')
        precio_compra = Decimal(precio_compra_raw)
        precio_venta = Decimal(precio_venta_raw)

        unidades = int(request.form.get('unidades', 0))
        creador = session.get('nombre')
        imagen = request.files.get('imagen')

        # Validación de precios
        if precio_compra > precio_venta:
            return jsonify({"error": "El precio de compra no puede ser mayor al precio de la venta"}), 403

        # Validar si ya existe el producto
        if los_productos.traer_nombre_producto(nombre):
            return jsonify({"error": "Este producto ya existe"}), 403

        # Procesar imagen
        if imagen and imagen.filename != '':
            # Verificar formato
            if not verificar_extension(imagen.filename):
                return jsonify({"error": "Formato de imagen no válido"}), 403
            
            filename = secure_filename(imagen.filename)
            new_file_path = os.path.join(aplicacion.config['UPLOAD_FOLDER'], filename)

            if os.path.exists(new_file_path):
                return jsonify({"error": "Ya existe una imagen con ese nombre. Usa otro archivo."}), 403

            imagen.save(new_file_path)
        else:
            # Si no se subió imagen, usar la predeterminada
            filename = 'allyson_store.png'

        # Guardar producto
        los_productos.guardar_productos(
            nombre, categoria, descripcion,
            precio_compra, precio_venta,
            unidades, filename, creador
        )

        return jsonify({"exito": "Producto añadido con éxito"}), 200

    except Exception as e:
        return jsonify({"error": "Ocurrió un error al crear el producto", "detalle": str(e)}), 500




@aplicacion.route('/productos/actualizar', methods=['POST'])
@login_required
def actualizar_producto():
    try:
        # Obtener datos del formulario
        identificacion = request.form.get("identificacion")
        nombre = request.form.get("nombre")
        descripcion = request.form.get("descripcion", "")
        unidades = int(request.form.get("unidades", 0))
        imagen = request.files.get("imagen")  # Obtener la nueva imagen si se subió

        precio_compra_act = request.form.get('precio_compra', '0').replace('.', '')
        precio_venta_act = request.form.get('precio_venta', '0').replace('.', '')

        precio_compra = Decimal(precio_compra_act)
        precio_venta = Decimal(precio_venta_act)


        # Validaciones
        if precio_compra > precio_venta:
            return jsonify({"error": "El precio de compra no puede ser mayor al precio de la venta"}), 403

        # Obtener la imagen anterior antes de actualizar
        foto_old = los_productos.traer_foto(identificacion)
        filename = foto_old  # Mantener la imagen anterior si no hay nueva

        if imagen:  # Si se subió una nueva imagen
            if not verificar_extension(imagen.filename):
                return jsonify({"error": "Formato de imagen no válido"}), 403

            # Asegurar que el nuevo nombre no cause conflictos
            filename = secure_filename(imagen.filename)
            new_file_path = os.path.join(aplicacion.config['UPLOAD_FOLDER'], filename)

            # Evitar sobrescribir archivos existentes
            if os.path.exists(new_file_path):
                filename = f"{identificacion}_{filename}"
                new_file_path = os.path.join(aplicacion.config['UPLOAD_FOLDER'], filename)

            imagen.save(new_file_path)  # Guardar la nueva imagen

            # Eliminar la imagen anterior si existe y es diferente de la nueva
            if foto_old and foto_old.strip() and foto_old != filename:
                old_file_path = os.path.join(aplicacion.config['UPLOAD_FOLDER'], foto_old)
                if os.path.exists(old_file_path):
                    os.remove(old_file_path)

        # Actualizar en la base de datos
        los_productos.actualizar_productos(identificacion, nombre, descripcion, precio_compra, precio_venta, unidades, filename)

        return jsonify({"exito": "Producto actualizado con éxito"}), 200

    except Exception as e:
        return jsonify({"error": "Ocurrió un error al actualizar el producto", "detalle": str(e)}), 500



@aplicacion.route('/productos/eliminar', methods=['POST'])
@login_required 
@role_required('Administrador')
def borrar_producto():
    datos_eliminar_productos = request.get_json()
    identificacion = datos_eliminar_productos.get('identificacion')

    creditos = los_productos.buscar_creditos(identificacion)
    ventas = los_productos.buscar_ventas(identificacion)

    if creditos:
        return jsonify({"creditos_existentes": "Este producto tiene créditos asociados"}), 403
    
    elif ventas:
        return jsonify({"ventas_existentes": "Este producto tiene ventas asociadas"}), 403

    try:
        foto = los_productos.traer_foto(identificacion)
        old_file_path = os.path.join(aplicacion.config['UPLOAD_FOLDER'], foto)
        if os.path.exists(old_file_path):
            os.remove(old_file_path)
        los_productos.borrar_producto(identificacion)
        return jsonify({"exito": "Producto eliminado con éxito"}), 200

    except Exception as e:
        return jsonify({"error": f"Error al eliminar el producto: {str(e)}"}), 500
