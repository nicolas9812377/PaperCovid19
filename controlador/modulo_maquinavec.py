import numpy as np
from controlador import modulo_lec_escri as lc
from controlador import nlp as nl


def maqvec(tweets):
  #leer diccionario
  dic = lc.leerTxt('modelo/dic_datasetGlobal.txt')

  '''
  #BOlsa y diccionario tweets consultados
  #Proceso NLP
  tt1 = nl.minusculas(tweets)
  tt1 = nl.eliminarce(tt1)
  tt1 = nl.tokenizar(tt1)
  tt1 = nl.qstopwords(tt1,1)
  
  '''
  tt1 = nl.stemmer(tweets)
  
  print('Generando Bolsa de Palabras')
  bolsa1 = nl.inverted(tt1,dic)  
  bolsa1 = np.array(bolsa1).T

  #importar modelo
  import pickle
  loaded_model = pickle.load(open('modelo/SVM.pkl', 'rb'))

  #Realizo una predicción
  y_pred = loaded_model.predict(bolsa1)
  sentimiento = []
  for tweet in y_pred.tolist():
    if(int(tweet) == -1):
      sentimiento.append('Negativo')
    elif (int(tweet) == 0):
      sentimiento.append('Neutro')
    elif (int(tweet) == 1):
      sentimiento.append('Positivo')  
  return sentimiento
  

'''
Lo que guarda en el modelo entrenado
#Lee el DatasetGlobal.csv
  tt,etiquetado = lc.leercsv('modelo/datasetGlobal.csv')
  #Proceso NLP
  tt = nl.minusculas(tt)
  tt = nl.eliminarce(tt)
  tt = nl.tokenizar(tt)
  tt = nl.qstopwords(tt,1)
  tt = nl.stemmer(tt)
  
  print('Generando Diccionario')
  dic = nl.generardic(tt)
  print('Generando Bolsa de Palabras')
  bolsa = nl.inverted(tt,dic)
  
  #Guardar dic en archivo
  with open('modelo/dic_datasetGlobal.txt', 'w') as file:
    for tem in dic:
      file.write(tem+'\n')

  X = np.array(bolsa).T
  y = np.array(etiquetado)
  
  #Defino el algoritmo a utilizar
  from sklearn.svm import SVC
  algoritmo = SVC(kernel='linear')
  #Entreno el modelo
  algoritmo.fit(X, y)

  #importar diccionario
  import pickle
  pickle.dump(algoritmo, open('modelo/SVM.pkl', 'wb'))
'''