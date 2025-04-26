from conexion import *
import plotly.express as px
import pandas as pd

class Graficos:
    def __init__(self, miBD):
        self.miBD = miBD

    def mas_vendidos(self):
        sql = '''
        SELECT 
        productos.nombre AS Productos, SUM(ventas.unidades) AS unidades 
        FROM ventas 
        JOIN productos ON productos.id_producto = ventas.id_producto 
        GROUP BY ventas.id_producto 
        ORDER BY unidades DESC 
        LIMIT 5;
        '''
        cursor = self.miBD.cursor()  # ✅ Crear el cursor dentro del método
        try:
            cursor.execute(sql)
            resultado = cursor.fetchall()
            convertidor_mayor = pd.DataFrame(resultado, columns=["Productos", "unidades"])
            return convertidor_mayor
        finally:
            cursor.close()  # ✅ Cerrar el cursor al finalizar la consulta

    def mas_vendidos_semana(self):
        sql = '''
        SELECT 
        productos.nombre AS Productos, 
        SUM(ventas.unidades) AS unidades 
        FROM ventas 
        JOIN productos ON productos.id_producto = ventas.id_producto 
        WHERE WEEK(ventas.fecha) = WEEK(CURDATE()) 
        AND YEAR(ventas.fecha) = YEAR(CURDATE())
        GROUP BY ventas.id_producto 
        ORDER BY unidades DESC 
        LIMIT 5;
        '''
        cursor = self.miBD.cursor()  # ✅ Crear el cursor dentro del método
        try:
            cursor.execute(sql)
            resultado = cursor.fetchall()
            los_mas_vendidos_de_la_semana = pd.DataFrame(resultado, columns=["Productos", "unidades"])
            return los_mas_vendidos_de_la_semana
        finally:
            cursor.close()  # ✅ Cerrar el cursor al finalizar la consulta


    def mas_vendidos_mes(self):
        sql = '''
        SELECT 
        productos.nombre AS Productos, 
        SUM(ventas.unidades) AS unidades 
        FROM ventas 
        JOIN productos ON productos.id_producto = ventas.id_producto 
        WHERE MONTH(ventas.fecha) = MONTH(CURDATE()) 
        AND YEAR(ventas.fecha) = YEAR(CURDATE())
        GROUP BY ventas.id_producto 
        ORDER BY unidades DESC 
        LIMIT 5;
        '''
        cursor = self.miBD.cursor()  # ✅ Crear el cursor dentro del método
        try:
            cursor.execute(sql)
            resultado = cursor.fetchall()
            los_mas_vendidos_del_mes = pd.DataFrame(resultado, columns=["Productos", "unidades"])
            return los_mas_vendidos_del_mes
        finally:
            cursor.close()  # ✅ Cerrar el cursor al finalizar la consulta


    


# ✅ Asegurar que la conexión a la BD ya esté establecida antes de crear `los_graficos`
los_graficos = Graficos(miBD)

