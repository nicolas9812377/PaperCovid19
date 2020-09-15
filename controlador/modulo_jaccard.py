################JACCARD############################
def vectores(tit,palabras):
  tt = []
  for temp in tit:
    tt.append(jaccard_similitud(temp, palabras))
  return tt

def jaccard_similitud(list1, list2):
  s1 = set(list1)
  s2 = set(list2)
  return len(s1.intersection(s2)) / len(s1.union(s2))
###################################################