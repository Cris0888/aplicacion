from conexion import *

class Metodos:
    def __init__(self,miBD):
        self.miBD=miBD
    
    def traer_metodos(self):
        cursor = self.miBD.cursor()
        try:
            sql=("SELECT * FROM `medios_de_pago`")
            cursor.execute(sql)
            resultado=cursor.fetchall()
            return resultado
        finally:
            cursor.close()
    
    def insertar(self,nombre_metodo,nombre):
        cursor = self.miBD.cursor()
        try:
            sql=("INSERT INTO `medios_de_pago`(`tipo`,`creador`) VALUES (%s,%s)")
            cursor.execute(sql,(nombre_metodo,nombre))
            self.miBD.commit()
        finally:
            cursor.close()

    def eliminar(self,identificacion):
        cursor = self.miBD.cursor()
        try:
            sql=("DELETE FROM `medios_de_pago` WHERE id_medio = %s ")
            cursor.execute(sql,(identificacion,))
            self.miBD.commit()
        finally:
            cursor.close()


    def borrar_venta(self, identificacion):
        cursor = self.miBD.cursor()
        try:
            sql1 = "SELECT id_venta FROM ventas WHERE medio_de_pago = %s"
            cursor.execute(sql1, (identificacion,))
            id_venta = cursor.fetchone()

            if not id_venta:
                return False  # Si no hay venta, devuelve False

            id_venta = id_venta[0]  # Extrae el ID real

            sql2 = "DELETE FROM ventas WHERE id_venta = %s"
            cursor.execute(sql2, (id_venta,))
            self.miBD.commit()

            return True  # Se eliminó correctamente
        finally:
            cursor.close()  # Cierra el cursor siempre, evitando fugas de memoria


    def verificar_metodo(self,nombre):
        cursor = self.miBD.cursor()
        try:
            sql=("SELECT  `tipo` FROM `medios_de_pago` WHERE tipo = %s")
            cursor.execute(sql,(nombre,))
            existente=cursor.fetchone()
            return existente
        finally:
            cursor.close()
    
    def verificar_credito(self,identificacion):
        cursor = self.miBD.cursor()
        try:
            sql=("SELECT tipo FROM `medios_de_pago` WHERE tipo = 'credito' AND id_medio = %s")
            cursor.execute(sql,(identificacion,))
            credito=cursor.fetchone()
            return credito
        finally:
            cursor.close()
    
los_metodos=Metodos(miBD)
