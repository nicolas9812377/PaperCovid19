import nltk
nltk.download('stopwords')
from nltk.stem import PorterStemmer
from nltk.corpus import stopwords
import re
##################################################
def minusculas(tit):
  for x,temp in enumerate(tit):
    tit[x]= temp.lower() #hacer minisculas
  return tit
def eliminarce(tit):
  for x,temp in enumerate(tit):
    tit[x] = re.sub('[^A-Za-záéíóúñ]|http\S+', ' ', temp)
    #limpiar caracteres 
  return tit
def tokenizar(tit):
  for x,temp in enumerate(tit):
    tit[x]= temp.split()#tokenizar las palabras
  return tit
######################################################

################STEMMER############################
def stemmer(tit):
  st = PorterStemmer()
  for i in tit:#recorre vector
    for x,h in enumerate(i):#recorre posicion del vector
      i[x]=st.stem(h)#agrega stemmer
  return tit#retorna vector
#######################################################

#####################STOPWORDS#######################
def qstopwords(tit,cont):
  c = 0#contador
  n4 = stopwords.words('spanish')#vector de stopwords
  n4 += stopwords.words('english')
  n4.append('gt')
  n4.append('oms')
  n4.append('así')
  n4.append('aquí')
  n4.append('cómo')
  #print(n4)
  if(cont > 0):#compara el contador en caso de ser mayor sigue eliminando las stopwords
    for word in tit:#recorre vector
      for w in word:#recorre posicions del vector
        if w in n4:#comparacion de cada palabra en el vector de stopword
          word.remove(w)#remueve los stopword
          c += 1#contador suma
    qstopwords(tit,c)#recursividad
  else:#en caso de no eliminar mas stopwords rompe la recursividad
    print()
  return tit#retorna vector
#######################################################
##############GENERAR DICCIONARIO##################
def generardic(tit):
  diccionario=[]
  for temp in tit:
    for temp1 in temp:
      try:
        #busca si la palabra se encuentra en el vector diccionario
        #caso de no ser encontrada salta un error y se necesita
        #capturar en el except
        if diccionario.index(temp1): 
          continue#continua con las ejecucion
      except ValueError:
          #agrega la palabra al vector
          diccionario.append(temp1)
  return diccionario
#####################################################
#################INVERTED INDEX########################
def inverted(tit,diccionario):
  vector = []
  #recorre el vector diccionario
  for temp in diccionario: 
    #recorre el vector de documentos
    t=[]
    for y,temp1 in enumerate(tit):
      cont=0 #contador para saber cantidad de palabras repetidas
      for x,temp2 in enumerate(temp1):
        #verifica igualdad del diccionario con los documentos
        if temp == temp2:
          cont=cont+1#cuenta las palabras
          #pos.append(x+1)#agrega las posiciones al vector pos
      t.append(cont)  
    vector.append(t)   
  #print(vector)
  return vector 
#######################################################