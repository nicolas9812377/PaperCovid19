from flask import Flask, render_template,request
from controlador import procesos as p  
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

if __name__ == '__main__':
  app.run(host='0.0.0.0')   

