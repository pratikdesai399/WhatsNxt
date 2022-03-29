from distutils.log import debug
from email.policy import default
from unittest.util import _MAX_LENGTH
from flask import Flask, jsonify, request
import sys
from flask_cors import CORS
from transformers import pipeline

# for ngram
from pprint import pprint
import json
import sys 
from nltk.corpus import brown
from nltk.corpus import reuters
import nltk
from nltk.corpus import PlaintextCorpusReader

# nltk.download('brown')



global modelPipeline
modelPipeline = pipeline('text-generation', model = '/home/versatile/RON/Btech_Project/Models/6l_data_model/output')
# modelPipeline = pipeline('text-generation', model = '/home/versatile/Desktop/6l_data_model/output')

def get_trigram_freq(tokens):
    tgs = list(nltk.trigrams(tokens))

    a,b,c = list(zip(*tgs))
    bgs = list(zip(a,b))
    return nltk.ConditionalFreqDist(list(zip(bgs, c)))
    
def get_bigram_freq(tokens):
    bgs = list(nltk.bigrams(tokens))
    return nltk.ConditionalFreqDist(bgs)

def appendwithcheck (preds, to_append):
    for pred in preds:
        if pred[0] == to_append[0]:
            return
    preds.append(to_append)

def incomplete_pred(words, n):
    all_succeeding = bgs_freq[(words[n-2])].most_common()
    #print (all_succeeding, file=sys.stderr)
    preds = []
    number=0
    for pred in all_succeeding:
        if pred[0].startswith(words[n-1]):
            appendwithcheck(preds, pred)
            number+=1
        if number==3:
            return preds
    if len(preds)<3:
        med=[]
        for pred in all_succeeding:
            med.append((pred[0], nltk.edit_distance(pred[0],words[n-1], transpositions=True)))
        med.sort(key=lambda x:x[1])
        index=0
        while len(preds)<3:
            # print (index, len(med))
            if index<len(med):
                if med[index][1]>0:
                    appendwithcheck(preds, med[index])
                index+=1
            if index>=len(preds):
                return preds
    return preds

tokens = brown.words()
bgs_freq = get_bigram_freq(tokens)
tgs_freq = get_trigram_freq(tokens)
# print(bgs_freq)
# print(tgs_freq)


def worker(string, work):
    #print(request, file=sys.stderr)
    # string = "I told her that "
    # work = "pred"
    words=string.split()
    # print('\n\n\n')
    # print(words)
    n=len(words)
    # print('\n')
    if work=='pred':
        if n==1:
            print (bgs_freq[(string)].most_common(5),file=sys.stderr)

            return bgs_freq[(string)].most_common(5)
          
        elif n>1:
            print (tgs_freq[(words[n-2],words[n-1])].most_common(5),file=sys.stderr)

            return tgs_freq[(words[n-2],words[n-1])].most_common(5)
    else:
        print (incomplete_pred(words, n), file=sys.stderr)
        return incomplete_pred(words, n)

worker("How about going ot", '')

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello():
    res = jsonify({
        "Hello":"WhatsNxt!"
    })
    return res

@app.route("/autocomplete")
def autocomplete():
    #sample context
    context = request.args.get('context', default = '', type = str)
    result = []
    i = 0
    while i < 5 :
        temp = modelPipeline(context, max_length=90, num_return_sequences=1, do_sample=True, eos_token_id=2, pad_token_id=0, skip_special_tokens=True, top_k=50, top_p=0.95)
        if len(temp[0]['generated_text']) - len(context) > 3 :
            result.append(temp[0])
            i = i + 1

    print("Result: {}".format(result))

    res = jsonify({
        "AUTOCOMPLETE":result
    })
    return res

@app.route("/wordcomplete")
def wordcomplete() :
    #sample context
    # context = "How aer"
    context = request.args.get('context', default = "", type = str)
    context = context.split("#")[-1].split(":")[-1]
    print("Context", len(context))
    result = []
    if len(context) != 0 :
        result = worker(context, '')
    else :
        result = [["Hello", 1], ["Hi", 2]]
        result.extend(worker("How about going to", 'prod'))
    # result = list(dict.fromkeys(result))
    print(result)
    res = jsonify({
        "WORDCOMPLETE":result
    })
    return res



if __name__ == "__main__":  
    app.run(debug=True)