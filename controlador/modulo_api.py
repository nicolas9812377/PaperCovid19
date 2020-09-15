import requests
import time
from calendar import timegm

def obtenerInfo():
  covid = requests.get("https://api.covid19api.com/country/ecuador").json()
  confirmados= []
  muertos=[]
  recuperados=[]
  activos=[]
  fecha=[]
  for cv in covid:
    confirmados.append(cv['Confirmed'])
    muertos.append(cv['Deaths'])
    recuperados.append(cv['Recovered'])
    activos.append(cv['Active']) 
    fecha.append(cv['Date'])
  return confirmados,muertos,recuperados,activos,fecha


#Obtener Fecha Epoch
#fecha.append(timegm(time.strptime(cv['Date'], "%Y-%m-%dT%H:%M:%SZ")))
