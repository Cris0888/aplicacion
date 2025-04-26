from flask import  render_template,request,jsonify,session
from conexion import *
from routes.inicio_de_seccion import *
from models.class_creditos import loscreditos

from datetime import datetime
from models.class_venta_productos import venta_de_productos
from models.class_metodos_pago import los_metodos




@aplicacion.route('/venta_productos')
@login_required
def venta():
    resultado=venta_de_productos.productos()
    metodos=los_metodos.traer_metodos()
    productos_acabados = {item[0]: item[1] for item in venta_de_productos.avisar_producto_por_acabarse()}
    return render_template('/venta_de_productos.html',resultado = resultado,metodos=metodos, productos_acabados = productos_acabados)


@aplicacion.route('/busqueda_productos', methods=['GET'])
@login_required 
def buscador():
    busqueda = request.args.get('busqueda', "")
    
    resultado = venta_de_productos.productos(busqueda)

    return jsonify(resultado)



@aplicacion.route('/buscar_cliente', methods=['GET'])
@login_required 
def buscar_cliente():
    cedula = request.args.get('cedula')
    
    # Llama a la función para obtener los datos del cliente
    cliente = venta_de_productos.traer_datos_cliente(cedula)

    # Verifica si el cliente existe y envía la respuesta adecuada
    if cliente:
        return jsonify({
            'encontrado': True,
            'nombreCliente': cliente['nombre'],
            'telefonoCliente': cliente['telefono'],
            'correoCliente': cliente['correo']
        })
    else:
        return jsonify({'encontrado': False})




@aplicacion.route('/procesar_venta', methods=['POST'])
@login_required 
def procesar_venta():
    data = request.json
    cliente_data = data.get('cliente', {})
    carrito_data = data.get('carrito', [])
    nombre = session.get('nombre')  
    fecha_formateada = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    try:
        # Verificar si el cliente existe o insertarlo
        cliente = venta_de_productos.identificacion_del_cliente(cliente_data)

        
        if cliente:
            cliente_id = cliente[0]  # Si existe, usar su ID

        else:
            cliente_id = venta_de_productos.guardar_cliente(cliente_data)  # Insertar cliente



        credito = loscreditos.validar_pago(cliente_data)

        
        if cliente_data.get("metodo_pago") == "23" and (cliente_data.get("identificacion") in [None, ""] or any(valor == "no aplica" for valor in cliente_data.values())):
            return jsonify({"cliente_vacio": "Los créditos deben tener todos los datos del cliente"}),401
        
        
        if credito:
            loscreditos.guardar_creditos(cliente_id, carrito_data, fecha_formateada, nombre)
        else:
            venta_de_productos.guardar_venta(cliente_id, carrito_data, fecha_formateada, cliente_data, nombre)

        # Descontar unidades después de confirmar la venta/crédito
        if not venta_de_productos.descontar_unidades(carrito_data):
            return jsonify({"stock_error": "Stock insuficiente"}), 409
        
        return jsonify({"success": "Compra realizada con éxito"}), 200

    except Exception as e:
        return jsonify({"error": "Ocurrió un error al procesar la venta", "detalle": str(e)}), 500


@aplicacion.route('/total-hoy', methods=['GET'])
@login_required
def total_vendido_hoy():
    try:
        total_ventas = venta_de_productos.ventas_del_dia()

        # Convertir a string con punto como miles y coma como decimal
        total_formateado = f"{total_ventas:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")

        return jsonify({"ok": total_formateado}), 200
    except Exception as e:
        return jsonify({"error": "No se pudo obtener el total vendido", "detalle": str(e)}), 500
