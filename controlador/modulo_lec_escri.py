import csv
from controlador import nlp as nl
###############LEER DATASET###############
def leercsv(nombre):
  tweet = []
  etiquetado = []
  with open(nombre, 'r', encoding = "utf-8") as csvfile:#abre documento en forma de lectura
      leer = csv.DictReader(csvfile, delimiter=',')
      for row in leer:#recorre lineas del documentp
        tweet.append(row['texto'])
        if(row['cs']=='-1'):
          etiquetado.append(0)
        elif(row['cs']=='0'):
          etiquetado.append(-1)
        else:
          etiquetado.append(row['cs'])
  return tweet,etiquetado
#####################################################
###########LEER TXT#################################
def leerTxt(nombre):
  f = open (nombre,'r')
  palabrasneg = []
  for linea in f.readlines():
    palabrasneg.append(linea.strip('\n'))
  f.close()
  return palabrasneg
######################################
#####################GUARDAR CSV#################
def guardarCSV(nombre,tit):
  with open(nombre, 'a',encoding='utf-8') as csvfile:#abre documento y escribe
    writer = csv.writer(csvfile, delimiter=',')#escribe en documento
    writer.writerows(tit)
    return True#retorna verdadero si no hubo problemas
  return False#retorna falso en caso de error
###################################################