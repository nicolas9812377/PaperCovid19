from controlador import nlp as nl
from textblob import TextBlob

##############TEXT BLOB ###########################
def textblob(temp1):
    temp1 = nl.minusculas(temp1)
    temp1 = nl.eliminarce(temp1)
    sentimiento = []
    for tweet in temp1:
        try:
            c1 = TextBlob(tweet).translate(from_lang='es', to='en')
            if (c1.sentiment.polarity >= -1 and c1.sentiment.polarity < 0):
                sentimiento.append(-1)
            elif (c1.sentiment.polarity == 0):
                sentimiento.append(0)
            elif (c1.sentiment.polarity > 0 and c1.sentiment.polarity <= 1):
                sentimiento.append(1)
        except Exception as e:
            print(e)
            print('corregido error')
            sentimiento.append(0)
            #sentimiento.append('na')
    return sentimiento
##################################################
