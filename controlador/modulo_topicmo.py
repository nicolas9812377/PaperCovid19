import gensim
import pyLDAvis
import pyLDAvis.gensim
import gensim.corpora as corpora

################ Topic Modeling #############################
def topicmodeling(tweet):
    #Diccionario
    id2word = corpora.Dictionary(tweet)
    #Bolsa de palabras
    corpus = [id2word.doc2bow(text) for text in tweet]
    #algoritmo lda_model
    lda_model = gensim.models.ldamodel.LdaModel(
        corpus=corpus,
        id2word=id2word,
        num_topics=4,
        random_state=100,
        update_every=1,
        chunksize=100,
        alpha='auto')

    #Preparando Visualizacion
    vis = pyLDAvis.gensim.prepare(lda_model, corpus, id2word)
    pyLDAvis.save_html(vis, 'templates/LDA_Visualization.html')