from conexion import *

class Filtros:
    def __init__(self,miBD):
        self.miBD=miBD

    def traer_filtros(self, fecha_filtro="", metodo_filtro=""):
        cursor = self.miBD.cursor()
        try:
            sql = """
                SELECT 
                    ventas.creado,
                    productos.nombre AS nombre_producto,
                    categorias.tipo AS categoria,
                    ventas.vendido AS vendido,
                    ventas.unidades AS cantidad,
                    medios_de_pago.tipo AS metodo_pago,
                    ventas.fecha ,
                    ventas.id_venta
                FROM ventas
                JOIN productos ON ventas.id_producto = productos.id_producto 
                JOIN categorias ON productos.categoria = categorias.id_categoria
                JOIN medios_de_pago ON ventas.medio_de_pago = medios_de_pago.id_medio
            """
            filtros = []
            if fecha_filtro and metodo_filtro:
                sql += " WHERE DATE(ventas.fecha) = %s AND ventas.medio_de_pago = %s"
                filtros = [fecha_filtro, metodo_filtro]

            cursor.execute(sql, tuple(filtros) if filtros else ())
            resultado = cursor.fetchall() if cursor.description else []
            return resultado
        
        finally:
            cursor.close()

    def eliminar_ventas(self,identificacion):
        cursor= self.miBD.cursor()
        try:
            sql = "DELETE FROM `ventas`  WHERE id_venta = %s"
            cursor.execute(sql,(identificacion,))
            self.miBD.commit()
        finally:
            cursor.close()

        
losfiltros = Filtros(miBD)

