from flask import Flask, render_template,request
from controlador import procesos as p  
from controlador import modulo_api as api
import json
app = Flask(__name__)

@app.route('/')
def hello_world(): 
  return render_template('index.html')

@app.route('/lit1',methods=['GET','POST'])
def recibircant():
  if request.method == 'POST':
    rs = p.literal1(int(request.values.get('cant')),str(request.values.get('fechaInicio')),str(request.values.get('fechaFin')))
  return json.dumps(rs),{'Content-Type': 'application/json'}

@app.route('/topic')
def topic():
  with open('templates/LDA_Visualization.html') as file:
    return file.read(),200,{'Content-Type': 'text/html; charset=utf-8'}

@app.route('/api',methods=['GET','POST'])
def apid():
  if request.method == 'POST':
    rs = []
    #Resultados api
    confirmados,muertos,recuperados,activos,fecha = api.obtenerInfo()
    rs.append(confirmados)
    rs.append(muertos)
    rs.append(recuperados)
    rs.append(activos)
    rs.append(fecha)
    return json.dumps(rs),{'Content-Type': 'application/json'}

if __name__ == '__main__':
  app.run(host='0.0.0.0')   

