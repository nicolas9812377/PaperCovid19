import math
import numpy as np
from controlador import nlp as nl
#############wtf#########################
def wtf (vector):
  wtf = []
  for f in vector:
    temp = []
    for y,c in enumerate(f):
      if c != 0 :
        temp.append(round(1+math.log10(c),6))
      else:
        temp.append(0)
    wtf.append(temp)
  return wtf
#######################################################
#################DF###########################
def df (vector):
  df = []
  for f in vector:
    cont = 0
    for y,c in enumerate(f):
      if c != 0 :
        cont +=1
    df.append(cont)
  return df

#######################################################
#################IDF###########################
def idf (df,tam):
  idf = []
  for x in df:
    if x != 0:
      idf.append(round(math.log10(tam/x),3))
    else:
      idf.append(0)
  return idf
#######################################################
#################TF-IDF###########################
def tfidf (bolsa,idf):
  for x,i in enumerate(bolsa):
    for y,g in enumerate(i):
      bolsa[x][y] = g*idf[x]
  return bolsa
#######################################################
#############################################
def modulo(vector):
  temp = []
  for f in range(len(vector[0])):
    acum = 0
    for y in range(len(vector)):
      acum += vector[y][f]*vector[y][f]
    temp.append(round(math.sqrt(acum),6))
  return temp

def longnorm(vector,modulo):
  lng = []
  for f in range(len(vector[0])):
    temp = []
    for y in range(len(vector)):
      if modulo[f] !=0:
        temp.append(round(vector[y][f]/modulo[f],6))
      else:
        temp.append(0)
    lng.append(temp)
  return lng

def vectordistance(longnorm):
  temp = np.eye(len(longnorm),len(longnorm))
  i = 0
  for x in range(len(longnorm)):
    for z in range(x+1,len(longnorm)):
      i=0
      for y in range(len(longnorm[0])):
        i += longnorm[x][y]*longnorm[z][y]
        #impresion especifica documento y operacion
        #print(x,z,i)
      temp[x][z]=round(i,6)
      temp[z][x]=round(i,6)
    break
  return temp
########################################
##########Proceso Completo#############
def coseno(tweet,dic):
  tweetneg = []
  tweetneg.append(dic)
  tweetneg = tweetneg + tweet
  invertit = nl.inverted(tweetneg, dic)
  dfP = df(invertit)
  idfP = idf(dfP, len(invertit[0]))
  wtfP = wtf(invertit)
  tfidfP = tfidf(wtfP, idfP)
  moduloP = modulo(tfidfP)
  longnorP = longnorm(tfidfP, moduloP)
  vectorP = vectordistance(longnorP)
  return vectorP
