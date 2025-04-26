from flask import Flask, session, render_template, request, redirect, url_for, flash,jsonify
import hashlib
from conexion import *
from models.class_login import validar_usuarios
import re




@aplicacion.route('/inicio_seccion', methods=['POST'])
def inicio():
    datos = request.get_json()
    
    if datos:
        usuario = datos.get('correo', None)
        contrasena = datos.get('contrasena', None)
    else:
        usuario = request.form.get('usuario', None)
        contrasena = request.form.get('contrasena', None)

    if not usuario or not contrasena:
        return jsonify({"error": "⚠️ Faltan datos. Complete todos los campos."}), 400

    cifrada = hashlib.sha512(contrasena.encode('utf-8')).hexdigest()

    # Protección contra inyección SQL
    palabras_prohibidas = ["SELECT", "INSERT", "UPDATE", "DELETE", "FROM", "WHERE"]
    if any(palabra in usuario.upper() for palabra in palabras_prohibidas) or \
        any(palabra in contrasena.upper() for palabra in palabras_prohibidas):
        return jsonify({"inyesion": "( error de usuario )"}), 403

    try:
        resultados = validar_usuarios.validacion(usuario, cifrada)
    except mysql.connector.Error as err:
        return jsonify({"error": f"Error de conexión a la base de datos: {err}"}), 500

    if resultados and cifrada == resultados[0][3]:
        session['logueado'] = True
        session['usuario'] = resultados[0][2]
        session['nombre'] = resultados[0][1]
        session['rol'] = resultados[0][4]
        return jsonify({"exito": True, "usuario": resultados[0][2], "nombre": resultados[0][1], "rol": resultados[0][4]}), 200

    return jsonify({"error": "( Correo o contraseña incorrectos )"}), 401
# Decorador para verificar que el usuario esté logueado
def login_required(f):
    def wrap(*args, **kwargs):
        if not session.get('logueado'):
            return redirect(url_for('login',error="Debes iniciar sesión para acceder a esta página"))  # Redirige al login si no está logueado
        return f(*args, **kwargs)
    wrap.__name__ = f.__name__
    return wrap

# Página de inicio de sesión (login) - NO requiere estar logueado
@aplicacion.route('/')
def login():
    return render_template('inicio_seccion.html')

# Página protegida (Home) - Requiere estar logueado
@aplicacion.route('/home')
@login_required  # Solo accesible si está logueado
def home():
    return render_template('home.html', iniciado = session['logueado'], usuario=session['usuario'], rol=session['rol'],nombre=session['nombre'])

# Página de categorías protegida (solo logueados)


# Cerrar sesión
@aplicacion.route('/logout')
def logout():
    session.clear()  # Borra todos los datos de sesión
    flash("Sesión cerrada exitosamente", "success")
    return redirect(url_for('login'))  # Redirige al login después de cerrar sesión

if __name__ == '__main__':
    aplicacion.run(debug=True)



def role_required(*roles):
    def decorator(f):
        def wrap(*args, **kwargs):
            if not session.get('logueado'):
                flash("Debes iniciar sesión para acceder a esta página", "error")
                return redirect(url_for('index'))
            
            if session.get('rol') not in roles:
                flash("No tienes permisos para acceder a esta página", "error")
                return redirect(url_for('home'))
            
            return f(*args, **kwargs)
        wrap.__name__ = f.__name__
        return wrap
    return decorator
