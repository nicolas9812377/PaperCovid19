
from controlador import modulo_jaccard as ja
from controlador import modulo_coseno as cs
from controlador import modulo_tweets as tw
from controlador import modulo_lec_escri as lc
from controlador import modulo_maquinavec as mv
from controlador import nlp as nl
from controlador import modulo_textblob as txtbl
from controlador import modulo_topicmo as tpm
from controlador import modulo_voting as vt
from threading import Thread

##############CALCULADOR########################
def categorizar(positivo, negativo):
    temp1 = []
    for x,temp in enumerate(positivo):
        if temp > negativo[x]:
            temp1.append(1)
        elif temp == negativo[x]:
            temp1.append(0)
        elif temp < negativo[x]:
            temp1.append(-1)
    return temp1
##########################################################


###########LITERAL 1###################
def literal1(n, fechaInicio, fechaFin):
    
    print("Procesos")
    #Consultando Tweets
    tweet, fecha = tw.obtenerTweets(n, fechaInicio, fechaFin)
    #variable q contiene los tweets generales
    temp = tweet[:]
    #variable q contiene los tweets generales
    tempo = temp[:]
    #Proceso NLP
    tweet = nl.minusculas(tweet)
    tweet = nl.eliminarce(tweet)
    tweet = nl.tokenizar(tweet)
    tweet = nl.qstopwords(tweet, 1)
    
    #Proceso Nube
    vec_nube_temp = []
    for review in tweet:
      vec_nube_temp += review

    #Obteniendo Diccionarios
    dicposi = lc.leerTxt('modelo/dic_posi.txt')
    dicneg = lc.leerTxt('modelo/dic_neg.txt')

    #Cantidad Tweets
    print("Cantidad de tweets: " +str(len(tweet)))
    #"""
    print("\n-- Topic Modeling --")
    hilo = Thread(target=tpm.topicmodeling, args=(tweet,))
    hilo.start()
    hilo.join()
    #"""
    print("-- Jaccard --")
    #Jaccard de Negativos
    negativo = ja.vectores(tweet, dicneg)
    #Jaccard de Positivos
    positivo = ja.vectores(tweet, dicposi)
    #Obteniendo Resultados
    rsJaccard = categorizar(positivo, negativo)
    
    print("\n-- Coseno --")
    #Coseno de Negativos
    vectorneg = cs.coseno(tweet,dicneg)
    #Coseno de Positivos
    vectorpos = cs.coseno(tweet,dicposi)
    #Obteniendo Resultados, columnas = vectorneg[0,1:]
    # filas = vectorneg[1:,0]
    rsCoseno = categorizar(vectorpos[1:, 0], vectorneg[1:, 0])

    print("\n-- TextBlob --")
    rsTextBlob = txtbl.textblob(tempo)

    print("\n-- SVM --")
    rsSVM = mv.maqvec(tweet)

    print("\n-- Voting --")
    rsVoting = vt.voting(rsJaccard,rsCoseno,rsTextBlob,rsSVM)
    
    print("-- Envio al servidor --")
    rs = []
    rs.append(fecha) #fecha
    rs.append(temp) #tweet general
    rs.append(rsJaccard)#Jaccard
    rs.append(rsCoseno)#Coseno
    rs.append(rsTextBlob)#TextBlob
    rs.append(rsSVM)#SVM
    rs.append(rsVoting)#Voting
    rs.append(" ".join(review2 for review2 in vec_nube_temp))#Datos para la nube
    
    return rs