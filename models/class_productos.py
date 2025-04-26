from conexion import *

class Productos:
    def __init__(self, miBD):
        self.miBD = miBD

    def traer_productos(self, nombre_producto=""):
        cursor = self.miBD.cursor()
        try:
            sql = """
                SELECT 
                    productos.id_producto,
                    productos.nombre,
                    categorias.tipo AS categoria,
                    productos.descripcion,
                    productos.precio_compra,
                    productos.precio_venta,
                    productos.unidades,
                    productos.imagen,
                    productos.creador
                FROM productos
                JOIN categorias ON productos.categoria = categorias.id_categoria
            """
            parametros = []

            if nombre_producto:
                sql += " WHERE productos.nombre LIKE %s"
                parametros.append(f"%{nombre_producto}%")


            if parametros:
                cursor.execute(sql, parametros)
            else:
                cursor.execute(sql)

            productos = cursor.fetchall() if cursor.description else []
            return productos
        
        finally:
            cursor.close()

    def guardar_productos(self, nombre, categoria, comentarios, precio_compra, precio_venta, unidades, filename, creador):
        cursor = self.miBD.cursor()
        try:
            sql = """
            INSERT INTO productos 
            (nombre, categoria, descripcion, precio_compra, precio_venta, unidades, imagen, creador) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
        
            cursor.execute(sql, (nombre, categoria, comentarios, precio_compra, precio_venta, unidades, filename, creador))
            self.miBD.commit()

        finally:
            cursor.close()

    def traer_nombre_producto(self, nombre):
        cursor = self.miBD.cursor()
        try:
            sql = "SELECT nombre FROM productos WHERE nombre = %s LIMIT 1"
            cursor.execute(sql, (nombre,))
            existe = cursor.fetchone() is not None
            return existe
        
        finally:
            cursor.close()
    
    def traer_foto(self, identificacion):
        cursor = self.miBD.cursor()
        try:
            sql = "SELECT imagen FROM productos WHERE id_producto = %s"
            cursor.execute(sql, (identificacion,))
            resultado = cursor.fetchone()
            return resultado[0] if resultado else None
        
        finally:
            cursor.close()
    
    def actualizar_productos(self, identificacion, nombre, descripcion, precio_compra, precio_venta, unidades, filename):
        cursor = self.miBD.cursor()
        try:
            sql = """
                UPDATE productos 
                SET nombre = %s, descripcion = %s, precio_compra = %s, precio_venta = %s, unidades = %s, imagen = %s 
                WHERE id_producto = %s
            """
            cursor.execute(sql, (nombre, descripcion, precio_compra, precio_venta, unidades, filename, identificacion))
            self.miBD.commit()

        finally:
            cursor.close()

    def borrar_producto(self, identificacion):
        cursor = self.miBD.cursor()
        try:
            sql = "DELETE FROM productos WHERE id_producto = %s"
            cursor.execute(sql, (identificacion,))
            self.miBD.commit()

        finally:
            cursor.close()


    def buscar_creditos(self, identificacion):
        cursor = self.miBD.cursor()
        try:
            identificacion = int(identificacion)  # Asegura que sea un número
            sql = """
            SELECT 1 FROM productos
            INNER JOIN creditos ON creditos.id_producto = productos.id_producto
            WHERE productos.id_producto = %s;
            """
            cursor.execute(sql, (identificacion,))
            resultado = cursor.fetchall()  # Leer todos los resultados
            return len(resultado) > 0  # Si hay resultados, retorna True
        finally:
            cursor.close()

    def buscar_ventas(self, identificacion):
        cursor = self.miBD.cursor()
        try:
            identificacion = int(identificacion)
            sql = """
            SELECT 1 FROM productos
            INNER JOIN ventas ON ventas.id_producto = productos.id_producto
            WHERE productos.id_producto = %s;
            """
            cursor.execute(sql, (identificacion,))
            resultado = cursor.fetchall()  # Leer todos los resultados
            return len(resultado) > 0
        finally:
            cursor.close()



    def buscar_imagen(self, identificacion):
        cursor = self.miBD.cursor()
        try:
            sql = "SELECT imagen FROM productos WHERE id_producto = %s"
            cursor.execute(sql, (identificacion,))
            foto_old = cursor.fetchone()
            return foto_old[0] if foto_old else None
        
        finally:
            cursor.close()

# Instancia de la clase
los_productos = Productos(miBD)


        