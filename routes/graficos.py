from conexion import *
import dash
from dash import dcc,html
from models.class_grafica import los_graficos
import plotly.express as px
import pandas as pd

graficos = dash.Dash(__name__, server=aplicacion, url_base_pathname='/dash/')
graficos_semana = dash.Dash(__name__, server=aplicacion, url_base_pathname='/dash/semana/')
graficos_mes = dash.Dash(__name__, server=aplicacion, url_base_pathname='/dash/mes/')

# Funciones para obtener los datos
def concatenacion():
    return los_graficos.mas_vendidos()

def semana_vendidos():
    return los_graficos.mas_vendidos_semana()

def mes_vendidos():
    return los_graficos.mas_vendidos_mes()

# Llamadas a funciones
combinacion = concatenacion()
semana = semana_vendidos()
mes = mes_vendidos()

# Gráfico general
fig_general = px.bar(
    combinacion, 
    x="Productos", 
    y="unidades", 
    barmode="group",
    title="productos que mas se estan vendiendo",
    labels={"Productos": "Productos", "unidades": "Unidades"}
)

graficos.layout = html.Div([
    dcc.Graph(figure=fig_general)
])

# Gráfico semanal
fig_semana = px.bar(
    semana, 
    x="Productos", 
    y="unidades", 
    barmode="group",
    title="productos más vendido de la semana",
    labels={"Productos": "Productos", "unidades": "Unidades"}
)

graficos_semana.layout = html.Div([
    dcc.Graph(figure=fig_semana)
])

# Gráfico mensual
fig_mes = px.bar(
    mes, 
    x="Productos", 
    y="unidades", 
    barmode="group",
    title="productos más vendido del mes",
    labels={"Productos": "Productos", "unidades": "Unidades"}
)

graficos_mes.layout = html.Div([
    dcc.Graph(figure=fig_mes)
])



