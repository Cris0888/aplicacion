from conexion import *

class Creditos:
    def __init__(self,miBD):
        self.miBD=miBD

    def creditos_pendientes(self, nombre_cliente=""):
        cursor = self.miBD.cursor()
        try:
            sql = """
            SELECT 
                creditos.id_credito, 
                clientes.nombre AS cliente, 
                creditos.creado AS creador,
                creditos.abonado_por AS abonador,
                productos.nombre AS producto, 
                categorias.tipo AS categoria, 
                creditos.unidades AS unidades,
                clientes.cedula, 
                clientes.telefono, 
                creditos.abonado, 
                creditos.restante, 
                creditos.fecha_ultima,
                creditos.fecha
            FROM creditos
            JOIN clientes ON clientes.id_cliente = creditos.id_cliente
            JOIN productos ON productos.id_producto = creditos.id_producto
            JOIN categorias ON productos.categoria = categorias.id_categoria
            WHERE creditos.estado = 'pendiente'
            """
            
            params = []
            
            if nombre_cliente.strip():
                sql += " AND clientes.nombre LIKE %s"
                params.append('%' + nombre_cliente + '%')


            if params:
                cursor.execute(sql, tuple(params))
            else:
                cursor.execute(sql)

            pendientes = cursor.fetchall() if cursor.description else []

            return pendientes
        
        finally:
            cursor.close() 




    def creditos_pagados(self, nombre_cliente=""):
        cursor = self.miBD.cursor()
        try:
            sql = """
            SELECT 
                creditos.creado AS creador,
                creditos.abonado_por AS abonador,
                productos.nombre AS producto, 
                categorias.tipo AS categoria, 
                creditos.unidades as unidades,
                clientes.nombre AS cliente, 
                clientes.cedula, 
                clientes.telefono, 
                creditos.abonado,  
                creditos.fecha_ultima
            FROM creditos
            JOIN clientes ON clientes.id_cliente = creditos.id_cliente
            JOIN productos ON productos.id_producto = creditos.id_producto
            JOIN categorias ON productos.categoria = categorias.id_categoria
            WHERE creditos.estado = 'pagado';
            """
            

            params = []
            
            if nombre_cliente.strip():
                sql += " AND clientes.nombre LIKE %s"
                params.append('%' + nombre_cliente + '%')

            if params:
                cursor.execute(sql, tuple(params))
            else:
                cursor.execute(sql)

            pagados = cursor.fetchall() if cursor.description else []

            return pagados
        
        finally:
            cursor.close()  

    




        

    def validar_pago(self,cliente_data):
        cursor = self.miBD.cursor()
        try:
            sql="SELECT `id_medio` FROM `medios_de_pago` WHERE id_medio = %s AND tipo = 'credito';"
            cursor.execute(sql,(cliente_data['metodo_pago'],))
            credito=cursor.fetchone()
            return credito
        finally:
            cursor.close()
    


    def guardar_creditos(self, cliente_id, carrito_data, fecha_formateada, nombre):
        cursor= self.miBD.cursor()
        try:
            sql = "INSERT INTO `creditos` (`creado`, `abonado_por`, `id_producto`,`unidades`, `id_cliente`, `abonado`, `restante`, `fecha`, `estado`) VALUES (%s, %s, %s, %s, %s, %s, %s, %s,%s)"

            for creditos in carrito_data:
                valores = (
                    nombre,           # creado
                    nombre,           # abonado_por
                    creditos['id_producto'],  # id_producto
                    creditos['cantidad'],
                    cliente_id,       # id_cliente
                    0,                # abonado (inicialmente 0)
                    creditos['precio'] * creditos['cantidad'],  # restante
                    fecha_formateada, # fecha
                    'pendiente'       # estado
                )
                cursor.execute(sql, valores)
            
            self.miBD.commit()  # Confirmar cambios en la base de datos

            return 'Crédito creado con éxito'
        
        finally:
            cursor.close()

    


    def abonar_venta(self, id_abono, por_abonar, abonador, fecha_formateada):
        cursor = self.miBD.cursor()
        try:
            sql1 = """
            UPDATE creditos 
            SET 
                abonado_por = %s,
                abonado = abonado + %s,
                restante = restante - %s,
                fecha_ultima = %s
            WHERE 
                id_credito = %s
                AND restante > 0;
            """
            valores1 = (abonador, por_abonar, por_abonar, fecha_formateada, id_abono)
            cursor.execute(sql1, valores1)

            # Segunda actualización: Marcar como pagado si el restante llega a 0
            sql2 = """
            UPDATE creditos 
            SET estado = 'pagado' 
            WHERE id_credito = %s 
            AND restante = 0;
            """
            valores2 = (id_abono,)
            cursor.execute(sql2, valores2)

            # Confirmar los cambios en la BD
            self.miBD.commit()

        finally:
            cursor.close()


    def eliminar_credito(self,nombre_identificacion,fecha_credito):
        cursor = self.miBD.cursor()
        try:
            sql= """
            SELECT 
                creditos.id_credito 
            FROM creditos
            INNER JOIN productos ON productos.id_producto = creditos.id_producto
            WHERE productos.nombre = %s 
            AND creditos.estado = 'pagado' 
            AND creditos.fecha_ultima = %s;"""

            cursor.execute(sql,(nombre_identificacion,fecha_credito,))
            resultado = cursor.fetchone()

            if resultado:
                sql2= "DELETE FROM `creditos` WHERE id_credito = %s"
                cursor.execute(sql2, (resultado[0],))



            self.miBD.commit()
        finally:
            cursor.close

loscreditos=Creditos(miBD)


    
        