from conexion import *

class Categorias:
    def __init__(self, miBD):
        self.miBD = miBD

    def categoria(self, nombre_categoria, nombre):
        cursor = self.miBD.cursor()
        try:
            sql = "INSERT INTO categorias (creado, tipo) VALUES (%s, %s)"
            cursor.execute(sql, (nombre, nombre_categoria))
            self.miBD.commit()
        finally:
            cursor.close()  # 🔹 Cerrar cursor manualmente

    def verificar_existencia(self, nombre_categoria):
        cursor = self.miBD.cursor()
        try:
            sql = "SELECT tipo FROM categorias WHERE tipo = %s"
            cursor.execute(sql, (nombre_categoria,))
            resultado = cursor.fetchone()
            return resultado
        finally:
            cursor.close()  # 🔹 Cerrar cursor manualmente

    def traer_categorias(self, nombre_categorias=""):
        cursor = self.miBD.cursor()
        try:
            sql = """
                SELECT * FROM categorias
            """
            parametros = []

            if nombre_categorias:
                sql += " WHERE tipo LIKE %s"
                parametros.append(f"%{nombre_categorias}%")


            # 👇 Ejecutar dependiendo si hay parámetros
            if parametros:
                cursor.execute(sql, parametros)
            else:
                cursor.execute(sql)

            categorias = cursor.fetchall() if cursor.description else []
            return categorias
        
        finally:
            cursor.close()  # 🔸 Cierre seguro del cursor

    def borrar_categoria(self, identificacion):
        cursor = self.miBD.cursor()  # 🔹 Crear el cursor correctamente

        try:
            # Verificar si hay productos asociados a la categoría
            cursor.execute("SELECT COUNT(*) FROM productos WHERE categoria = %s", (identificacion,))
            cantidad_productos = cursor.fetchone()[0]

            if cantidad_productos > 0:
                return False

            # Si no hay productos, proceder con la eliminación
            sql = "DELETE FROM categorias WHERE id_categoria = %s"
            cursor.execute(sql, (identificacion,))
            self.miBD.commit()

            return True  # Indicar que la eliminación fue exitosa
        finally:
            cursor.close()  # 🔹 Asegurar que el cursor se cierre siempre



    def actualizar_categoria(self, identificacion, nombre):
        cursor = self.miBD.cursor()
        try:
            sql = "UPDATE categorias SET tipo = %s WHERE id_categoria = %s"
            cursor.execute(sql, (nombre, identificacion))
            self.miBD.commit()
        finally:
            cursor.close()  # 🔹 Cerrar cursor manualmente

# Crear instancia de la clase
ingresar_categorias = Categorias(miBD)
