import tweepy

def obtenerTweets(n,fechaInicio,fechaFin):
  # 4 cadenas para la autenticacion
  consumer_key = "cgr7RCgecGri8ECGP6W1uTfdN"
  consumer_secret = "4gvnMkiXnI0IRJPkrvIQSCTJxH1MOLAMKM3lTn1xhTVLB9K4Jy"
  access_token = "632593702-Meuukj41hpkMbQiBVfZuzkHtlHARxB0jl59jgmVp"
  access_token_secret = "NblysojLFfIendBE0MXJiM19L2F5EA9iAibSOzIK01wkI"
  
  auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
  auth.set_access_token(access_token, access_token_secret)
  # con este objeto realizaremos todas las llamadas al API
  api = tweepy.API(auth,wait_on_rate_limit=True,wait_on_rate_limit_notify=True)

  query = {'q': ['coronavirus','covid','pandemia'],
          'result_type': 'recent',
          'lang': 'es',
          'geocode': '-1.95529,-78.70604,350km',
          #'since': fechaInicio,
          #'until' : fechaFin,
          'tweet_mode' :'extended'
          }
  t= []
  fecha = []
 
  for x,tweet in enumerate(tweepy.Cursor(api.search, **query).items(n)):
    #for tweet in tweet1:
    try:
      if(tweet.retweeted_status.full_text.replace('\n', ' ') not in t):
        fecha.append(str(tweet.created_at))  
        t.append(tweet.retweeted_status.full_text.replace('\n', ' '))
    except:
      if(tweet.full_text.replace('\n', ' ') not in t):
        fecha.append(str(tweet.created_at))
        t.append(tweet.full_text.replace('\n', ' '))
  return t,fecha
