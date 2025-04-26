from flask import Flask
import mysql.connector

aplicacion = Flask(__name__)
aplicacion.secret_key = "allyson_store123456789"




miBD = mysql.connector.connect(
host='localhost',
user='root',
password='',
database='allyson_store',
connection_timeout=300  # Establece el tiempo de espera en 5 minutos
)
        

