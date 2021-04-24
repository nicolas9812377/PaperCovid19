import numpy as np
from controlador import modulo_lec_escri as lc
from controlador import nlp as nl


def maqvec(tweets):
  #'''
  #leer diccionario quemado para optimizar tiempo
  dic = lc.leerTxt('modelo/dic_datasetGlobal.txt')

  tt1 = nl.stemmer(tweets)
  #BOLSA
  bolsa1 = nl.inverted(tt1,dic)  
  bolsa1 = np.array(bolsa1).T

  #importar modelo
  import pickle
  loaded_model = pickle.load(open('modelo/SVM.pkl', 'rb'))

  #Realizo una predicción
  y_pred = loaded_model.predict(bolsa1)
  return [int(i) for i in y_pred.tolist()]
  #'''

'''
#Lo que guarda en el modelo entrenado
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
  
  #Separar tweets
  from sklearn.model_selection import train_test_split
  X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3)
  #Defino el algoritmo a utilizar
  from sklearn.svm import SVC
  algoritmo = SVC(kernel='linear')
  #Entreno el modelo
  algoritmo.fit(X_train, y_train)
  #Realizo una predicción
  y_pred = algoritmo.predict(X_test)
  #matriz de confusion
  from sklearn.metrics import confusion_matrix
  matriz = confusion_matrix(y_test, y_pred)
  print(matriz)
  #importar diccionario
  import pickle
  pickle.dump(algoritmo, open('modelo/SVM.pkl', 'wb'))
'''