from flask import  render_template,request,session
from conexion import *
from routes.inicio_de_seccion import *

from datetime import datetime
import pytz

from models.class_creditos import loscreditos
from decimal import Decimal


colombia_tz = pytz.timezone("America/Bogota")

# Suponiendo que p[10] es un datetime en UTC
def convertir_fecha(fecha_utc):
    if isinstance(fecha_utc, datetime):
        return fecha_utc.astimezone(colombia_tz).strftime("%Y-%m-%d %H:%M:%S")
    return fecha_utc  # Si no es datetime, devolver el valor original


@aplicacion.route('/creditos')
@login_required
def creditos():
    pendientes=loscreditos.creditos_pendientes()
    pagados=loscreditos.creditos_pagados()
    return render_template("creditos.html", pendientes=pendientes, pagados=pagados)


@aplicacion.route('/creditos/buscar_credito', methods=['POST'])
def buscar_credito():
    data = request.get_json()  # Recibe datos en JSON
    nombre_cliente = data.get('nombre_cliente', '').strip()
    estado_credito = data.get('estado_credito', '').strip()

    # Si no hay filtros, devolver todos los datos
    if not nombre_cliente and not estado_credito:
        pendientes = loscreditos.creditos_pendientes()
        pagados = loscreditos.creditos_pagados()
    elif estado_credito == 'Pendientes':
        pendientes = loscreditos.creditos_pendientes(nombre_cliente)
        pagados = []
    elif estado_credito == 'Pagados':
        pagados = loscreditos.creditos_pagados(nombre_cliente)
        pendientes = []

    else:
        pendientes = loscreditos.creditos_pendientes()
        pagados = loscreditos.creditos_pagados()
        
    return jsonify({
        "pendientes": [
            {
                "id_credito": p[0], "cliente": p[1], "creador": p[2], "abonador": p[3],
                "producto": p[4], "categoria": p[5], "unidades": p[6], "cedula": p[7], "telefono": p[8],
                "abonado": p[9], "restante": p[10], "fecha_ultima": convertir_fecha(p[11]), "fecha": convertir_fecha(p[12])
            } for p in pendientes
        ],
        "pagados": [
            {
                "creador": p[0], "abonador": p[1], "producto": p[2], "categoria": p[3], "unidades": p[4],
                "cliente": p[5], "cedula": p[6], "telefono": p[7], "abonado": p[8], "fecha_ultima": convertir_fecha(p[9])
            } for p in pagados   
        ]

    })        





@aplicacion.route('/creditos/abonar_credito', methods=['POST'])
@login_required 
def abonar():
    datos_abonar = request.get_json()

    id_abono = datos_abonar.get('identificacion_abono')
    abonador = session['nombre']
    fecha_formateada = datetime.now().strftime('%Y-%m-%d %H:%M:%S')


    # Limpiar y convertir precios
    por_por_pagar_raw = datos_abonar.get('por_por_pagar').replace('.', '')
    por_abonar_raw =  datos_abonar.get('por_abonar').replace('.', '')

    por_pagar = Decimal(por_por_pagar_raw)
    por_abonar = Decimal(por_abonar_raw)

    # Validar si el monto a abonar es mayor que la deuda
    if por_abonar > por_pagar:
        return jsonify({'error_monto' : "El monto excede la deuda"}),401
    try:
    # Registrar el abono si la validación es correcta
        loscreditos.abonar_venta(id_abono, por_abonar, abonador, fecha_formateada)
        return jsonify({'exito' : "Crédito pagado con éxito"}),200
    except Exception as e:
        return jsonify({"error": "ocurrio un error al abonar el credito", "detalle": str(e)}),500




@aplicacion.route("/creditos/eliminar",methods = ['POST'])
def eliminar_credito():
    creditos_eliminados = request.get_json()
    nombre_identificacion = creditos_eliminados.get('nombre')
    fecha_credito = creditos_eliminados.get('fecha')
    try:
        loscreditos.eliminar_credito(nombre_identificacion,fecha_credito)
        return jsonify({"exito": 'credito eliminado con exito'}),200
    except Exception as e:
        return jsonify({"error": "ocurrio un error al eliminar el credito", "detalle": str(e)}),500




