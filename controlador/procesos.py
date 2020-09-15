import numpy as np
from controlador import modulo_jaccard as ja
from controlador import modulo_coseno as cs
from controlador import modulo_tweets as tw
from controlador import modulo_lec_escri as lc
from controlador import modulo_maquinavec as mv
from controlador import modulo_api as api
from textblob import TextBlob
import gensim
import pyLDAvis
import pyLDAvis.gensim
from nltk.corpus import stopwords
import gensim.corpora as corpora
from wordcloud import WordCloud

from controlador import nlp as nl


##############CALCULADOR########################
def categorizar(positivo, negativo):
    negativo = np.array(negativo)
    positivo = np.array(positivo)
    print('Vector Resultante')
    total = np.vstack((positivo, negativo)).T
    temp1 = []
    contpos = 0
    contneg = 0
    contneutro = 0
    for temp in total:
        if temp[0] > temp[1]:
            temp1.append('Positivo')
            contpos += 1
        elif temp[0] == temp[1]:
            temp1.append('Neutro')
            contneutro += 1
        elif temp[0] < temp[1]:
            temp1.append('Negativo')
            contneg += 1

    #for i in zip(total,temp1):
    # print(i)

    print("Porcentaje de Positivos: ", round(contpos / len(total), 2))
    print("Porcentaje de Negativos: ", round(contneg / len(total), 2))
    print("Porcentaje de Neutros: ", round(contneutro / len(total), 2))
    print("Total de Tweets: ", len(total))
    return temp1


##########################################################


###########LITERAL 1###################
def literal1(n, fechaInicio, fechaFin):
    rs = []
    print("Literal 1")
    #Consultando Tweets
    tweet, fecha = tw.obtenerTweets(n, fechaInicio, fechaFin)
    #variable q contiene los tweets generales
    temp = tweet[:]
    #variable temporal para evitar cambios de los tweets
    tempo = temp[:]
    #Proceso NLP
    tweet = nl.minusculas(tweet)
    tweet = nl.eliminarce(tweet)
    tweet = nl.tokenizar(tweet)
    tweet = nl.qstopwords(tweet, 1)
    #Obteniendo Diccionarios
    dicposi = lc.leerTxt('modelo/dic_posi.txt')
    dicneg = lc.leerTxt('modelo/dic_neg.txt')

    print("***************Jaccard*********************")
    #Jaccard de Negativos
    negativo = ja.vectores(tweet, dicneg)
    #Jaccard de Positivos
    positivo = ja.vectores(tweet, dicposi)
    #Obteniendo Resultados
    jp = categorizar(positivo, negativo)

    print("\n*************Coseno*******************")
    #Coseno de Negativos
    tweetneg = []
    tweetneg.append(dicneg)
    tweetneg = tweetneg + tweet
    invertit = nl.inverted(tweetneg, dicneg)
    df = cs.df(invertit)
    idf = cs.idf(df, len(invertit[0]))
    wtf = cs.wtf(invertit)
    tfidf = cs.tfidf(wtf, idf)
    modulo = cs.modulo(tfidf)
    longnorneg = cs.longnorm(tfidf, modulo)
    vectorneg = cs.vectordistance(longnorneg)
    #Coseno de Positivos
    tweetpos = []
    tweetpos.append(dicposi)
    tweetpos = tweetpos + tweet
    invertit = nl.inverted(tweetpos, dicposi)
    df = cs.df(invertit)
    idf = cs.idf(df, len(invertit[0]))
    wtf = cs.wtf(invertit)
    tfidf = cs.tfidf(wtf, idf)
    modulo = cs.modulo(tfidf)
    longnorpos = cs.longnorm(tfidf, modulo)
    vectorpos = cs.vectordistance(longnorpos)
    #Obteniendo Resultados, columnas = vectorneg[0,1:]
    # filas = vectorneg[1:,0]
    cp= categorizar(vectorpos[1:, 0], vectorneg[1:, 0])

    rs.append(fecha) #fecha
    rs.append(temp) #tweet general
    rs.append(jp) #Jacard
    rs.append(cp) #Coseno
    rs.append(textblob(tempo)) #textblob
    rs.append(mv.maqvec(tempo)) #SVM
    #rs.append(topicmodeling(tweet))
    rs.append([])
    #Resultados api
    confirmados,muertos,recuperados,activos,fecha = api.obtenerInfo()
    rs.append(confirmados)
    rs.append(muertos)
    rs.append(recuperados)
    rs.append(activos)
    rs.append(fecha)
    nube(temp)
    return rs


##########################################################
def topicmodeling(tweet):
    tpm = []
    #stopwords
    n4 = stopwords.words('spanish')
    n4.append('gt')
    n4.append('oms')
    n4.append('así')
    n4.append('aquí')
    n4.append('cómo')

    print("Topic Modeling")

    #Diccionario
    id2word = corpora.Dictionary(tweet)
    #Bolsa de palabras
    corpus = [id2word.doc2bow(text) for text in tweet]
    #algoritmo lda_model
    lda_model = gensim.models.ldamodel.LdaModel(
        corpus=corpus,
        id2word=id2word,
        num_topics=1,
        random_state=100,
        update_every=1,
        chunksize=100,
        alpha='auto')

    topics = []
    for idx, topic in lda_model.print_topics(num_topics=1, num_words=10):
        print(topic)
        tp = topic.split('+')
        tp = [w.split('*') for w in tp]
        topics.append(tp)

    temp = []
    for top in topics:
        t = []
        for j in top:
            t.append(j[1].replace('"', '').strip())
        temp.append(t)

    #tpm.append(temp)
    #print(temp)

    #Obteniendo Diccionarios
    dicposi = lc.leerTxt('modelo/dic_posi.txt')
    dicneg = lc.leerTxt('modelo/dic_neg.txt')

    print("***************Jaccard Topics***************")
    #Jaccard de Negativos
    negativo = ja.vectores(temp, dicneg)
    #Jaccard de Positivos
    positivo = ja.vectores(temp, dicposi)
    #Obteniendo Resultados
    cl1 = categorizar(positivo, negativo)

    #Vector para enviar a al web
    #tpm.append(est1)
    tpm.append(cl1)
    #print(est1)
    print(cl1)

    #Preparando Visualizacion
    vis = pyLDAvis.gensim.prepare(lda_model, corpus, id2word)
    pyLDAvis.save_html(vis, 'templates/LDA_Visualization.html')

    return tpm


##############TEXT BLOB ###########################
def textblob(temp1):
    print("TEXT BLOB")
    temp1 = nl.minusculas(temp1)
    temp1 = nl.eliminarce(temp1)
    sentimiento = []
    for tweet in temp1:
        try:
            c1 = TextBlob(tweet).translate(from_lang='es', to='en')
            if (c1.sentiment.polarity >= -1 and c1.sentiment.polarity < 0):
                sentimiento.append('Negativo')
            elif (c1.sentiment.polarity == 0):
                sentimiento.append('Neutro')
            elif (c1.sentiment.polarity > 0 and c1.sentiment.polarity <= 1):
                sentimiento.append('Positivo')
        except Exception as e:
            print(e)
            print('corregido error')
            sentimiento.append('na')
    return sentimiento


##################################################
##########WORDCLOUD##########################
def nube(tweet):
    #Unir tweets en uno solo
    text = "".join(review for review in tweet)
    #wordcloud
    wordcloud = WordCloud(
        max_font_size=50, background_color="white").generate(text)
    #Guardar Imagen
    wordcloud.to_file("static/wordc/0.png")
###############################################