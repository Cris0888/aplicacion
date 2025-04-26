from conexion import *

class valida_login:
    def __init__(self,miBD):
        self.miBD = miBD
        self.cursor = self.miBD.cursor()

    def validacion(self,usuario,cifrada):
        sql=("SELECT  * FROM usuarios WHERE usuario = %s AND contrasena = %s;")
        self.cursor.execute(sql, (usuario,cifrada))
        resultados=self.cursor.fetchall()
        self.miBD.commit()
        return resultados 
    

validar_usuarios = valida_login (miBD)

