
from conexion import *

class VentaProductos:
    def __init__(self, miBD):
        self.miBD = miBD


    
    def productos(self, busqueda=""):
        cursor = self.miBD.cursor()
        try:
            sql = """
                SELECT productos.nombre, productos.precio_venta, categorias.tipo AS categoria, 
                    productos.unidades, productos.id_producto, productos.imagen 
                FROM productos  
                JOIN categorias ON productos.categoria = categorias.id_categoria
            """

            parametros = []

            if busqueda:
                sql += " WHERE productos.nombre LIKE %s"
                parametros.append(f"%{busqueda}%")


            # 👇 Ejecutar dependiendo si hay parámetros
            if parametros:
                cursor.execute(sql, parametros)
            else:
                cursor.execute(sql)

            resultado = cursor.fetchall() if cursor.description else []

            return resultado
        
        finally:
            cursor.close()  



    

    def identificacion_del_cliente(self, cliente_data):
        # Asegurar que no haya resultados pendientes antes de ejecutar la consulta
        cursor = self.miBD.cursor()
        try:
            while cursor.nextset():
                pass  

            sql = "SELECT `id_cliente` FROM `clientes` WHERE cedula = %s;"
            cursor.execute(sql, (cliente_data['identificacion'],))
            
            cliente = cursor.fetchone()  

            # Si hay resultados adicionales, descartarlos para evitar errores
            while cursor.nextset():
                pass  

            return cliente
        
        finally:
            cursor.close()




    def guardar_cliente(self, cliente_data):
        cursor = self.miBD.cursor()
        try:
            sql = "INSERT INTO `clientes` (`nombre` ,`cedula`, `telefono`, `correo`) VALUES (%s, %s, %s,%s)"
            cursor.execute(sql, (cliente_data['nombre'], cliente_data['identificacion'], cliente_data['telefono'], cliente_data['correo']))
            self.miBD.commit()  
            return cursor.lastrowid
        
        finally:
            cursor.close()


    def guardar_venta(self, cliente_id, carrito_data, fecha_formateada, cliente_data, nombre):
        cursor = self.miBD.cursor()
        try:
            sql_venta = "INSERT INTO `ventas` (`unidades`, `id_producto`, `id_cliente`, `fecha`, `medio_de_pago`,`vendido`,`creado`) VALUES (%s, %s, %s, %s, %s,%s,%s);"

            for producto in carrito_data:
                venta=(
                    producto['cantidad'],  # unidades
                    producto['id_producto'],  # id_producto
                    cliente_id,  # id_cliente
                    fecha_formateada,  # fecha
                    cliente_data['metodo_pago'],  # medio_de_pago
                    producto['precio']*producto['cantidad'],  # vendido
                    nombre  # creado (nombre del vendedor)
                )
                cursor.execute(sql_venta, venta)

            self.miBD.commit()
            return "Venta registrada exitosamente"
            
        finally:
            cursor.close()


    
    def traer_datos_cliente(self, cedula):
        cursor = self.miBD.cursor()
        try:
            sql = "SELECT nombre, telefono, correo FROM clientes WHERE cedula = %s"
            cursor.execute(sql,(cedula,))
            cliente = cursor.fetchone()
            if cliente:
                return {'nombre': cliente[0], 'telefono': cliente[1], 'correo': cliente[2]}
            return None
        
        finally:
            cursor.close()
    
        
        
    def borrar_venta_productos(self,producto):
        cursor = self.miBD.cursor()
        try:
            sql=(f"DELETE FROM `ventas` WHERE id_producto = '{producto}'")
            cursor.execute(sql)
            self.miBD.commit()

        finally:
            cursor.close()

    
    def descontar_unidades(self, carrito_data):
        cursor = self.miBD.cursor()
        try:
            for producto in carrito_data:
                sql = "SELECT unidades FROM productos WHERE id_producto = %s"
                cursor.execute(sql, (producto['id_producto'],))
                stock_actual = cursor.fetchone()

                if stock_actual:
                    stock_actual = stock_actual[0]

                    # Verificar si hay suficiente stock
                    if stock_actual < producto['cantidad']:
                        return False  # Stock insuficiente

                    # Actualizar unidades
                    sql = "UPDATE productos SET unidades = unidades - %s WHERE id_producto = %s AND unidades >= %s"
                    cursor.execute(sql, (producto['cantidad'], producto['id_producto'], producto['cantidad']))
                else:
                    return False  # Producto no encontrado

            self.miBD.commit()
            return True
            
        finally:
            cursor.close()


        
            
    def avisar_producto_por_acabarse(self):
        cursor = self.miBD.cursor()
        try:
            sql=("SELECT nombre ,unidades FROM productos WHERE unidades <= 5;")
            cursor.execute(sql)
            acabado=cursor.fetchall()
            return acabado
        
        finally:
            cursor.close()


    def ventas_del_dia(self):
        cursor = self.miBD.cursor()
        try:
            sql= """ 
            SELECT IFNULL(SUM(vendido), 0)
            FROM ventas
            WHERE DATE(fecha) = CURDATE()"""
            cursor.execute(sql)
            total_ventas = cursor.fetchone()[0]
            return total_ventas
        finally:
            cursor.close()

    

    

venta_de_productos = VentaProductos(miBD)


