from conexion import *

class Usuarios:
    def __init__(self,miBD):
        self.miBD =miBD

    def Traer_usuarios(self):
        cursor = self.miBD.cursor()
        try:
            sql="SELECT `id_usuario`, `nombre`, `usuario`, `rol` FROM `usuarios`;"
            cursor.execute(sql)
            usuario=cursor.fetchall()
            return usuario
        
        finally:
            cursor.close()
    
    def crear_usuario(self,nombre,correo,cifrada,rol):
        cursor = self.miBD.cursor()
        try:
            sql=("INSERT INTO `usuarios`( `nombre`, `usuario`, `contrasena`, `rol`) VALUES (%s,%s,%s,%s)")
            cursor.execute(sql,(nombre,correo,cifrada,rol))
            self.miBD.commit()

        finally:
            cursor.close()


    
    def verificar_correo(self,correo):
        cursor = self.miBD.cursor()
        try:
            sql=("SELECT `usuario` FROM `usuarios` WHERE `usuario` = %s")
            cursor.execute(sql,(correo,))
            correo_usuario = cursor.fetchone()
            return correo_usuario
        
        finally:
            cursor.close()
    
    def traer_cifrada(self,id_usuario):
        cursor = self.miBD.cursor()
        try:
            sql=("SELECT contrasena FROM `usuarios` WHERE id_usuario = %s")
            cursor.execute(sql,(id_usuario,))
            almacenada_antigua=cursor.fetchone()
            return almacenada_antigua[0]
        
        finally:
            cursor.close()
    
    def actualizar_contrasena(self,contrasena_nueva,id_usuario):
        cursor = self.miBD.cursor()
        try:
            sql=("UPDATE `usuarios` SET `contrasena`= %s WHERE id_usuario = %s")
            cursor.execute(sql,(contrasena_nueva,id_usuario))
            self.miBD.commit()

        finally:
            cursor.close()

    def eliminar_usuario(self,idetificacion): 
        cursor = self.miBD.cursor()
        try:
            sql=("DELETE FROM `usuarios` WHERE id_usuario = %s")
            cursor.execute(sql,(idetificacion,))
            self.miBD.commit()
            
        finally:
            cursor.close()
    
    
los_usuarios = Usuarios(miBD)


