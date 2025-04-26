from flask import Flask,render_template

from routes.categorias import ingresar_categorias
from routes.graficos import los_graficos
from routes.inicio_de_seccion import *
from routes.metodos_pago import los_metodos
from routes.productos import los_productos
from routes.ventas import venta_de_productos
from routes.usuarios import los_usuarios
from routes.filtros import losfiltros
from routes.creditos import loscreditos

from conexion import *






