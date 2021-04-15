import numpy as np

################Voting#########################
def voting(*predictions):
  vector_predictions=[]
  for prediccion in predictions:
    vector_predictions.append(prediccion)
  #Numpy para facilitar promedio   
  final_predictions = np.array(vector_predictions)
  #promedio numpy
  final_predictions = np.mean(final_predictions, axis = 0)  
  #transformar a lista
  final_predictions = final_predictions.tolist()
  sentimiento = []
  for p in final_predictions:
    if (p >= -1 and p < 0):
      sentimiento.append(-1)
    elif (p == 0):
      sentimiento.append(0)
    elif (p > 0 and p <= 1):
      sentimiento.append(1)
  return sentimiento
###############################################


'''
Optimizar y realizacion de la nube por parte del frontend
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
'''