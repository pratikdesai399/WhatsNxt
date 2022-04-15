import sys
from nltk.corpus import PlaintextCorpusReader
from nltk.corpus import gutenberg
from nltk.corpus import semcor
from nltk.corpus import nps_chat
from nltk.corpus import reuters
from nltk.corpus import brown
from nltk.corpus import conll2000
from nltk.corpus import movie_reviews
import regex as re


from pprint import pprint
import nltk
import numpy as np
import pickle
import pandas as pd


nltk.download('brown')
nltk.download('reuters')
nltk.download('nps_chat')
nltk.download('semcor')
nltk.download('gutenberg')
nltk.download('conll2000')
nltk.download('movie_reviews')
# nltk.download('wordnet')
# nltk.download('sentiwordnet')

# nltk.download('senseval')


def get_trigram_freq(tokens):
    tgs = list(nltk.trigrams(tokens))

    a, b, c = list(zip(*tgs))
    bgs = list(zip(a, b))
    return nltk.ConditionalFreqDist(list(zip(bgs, c)))


def get_bigram_freq(tokens):
    bgs = list(nltk.bigrams(tokens))

    return nltk.ConditionalFreqDist(bgs)


def appendwithcheck(preds, to_append):
    for pred in preds:
        if pred[0] == to_append[0]:
            return
    preds.append(to_append)


def incomplete_pred(words, n):
    all_succeeding = bgs_freq[(words[n-2])].most_common()
    #print (all_succeeding, file=sys.stderr)
    preds = []
    number = 0
    for pred in all_succeeding:
        if pred[0].startswith(words[n-1]):
            appendwithcheck(preds, pred)
            number += 1
        if number == 3:
            return preds
    if len(preds) < 3:
        med = []
        for pred in all_succeeding:
            med.append((pred[0], nltk.edit_distance(
                pred[0], words[n-1], transpositions=True)))
        med.sort(key=lambda x: x[1])
        index = 0
        while len(preds) < 3:
            # print (index, len(med))
            if index < len(med):
                if med[index][1] > 0:
                    appendwithcheck(preds, med[index])
                index += 1
            if index >= len(preds):
                return preds

    return preds


tokens = brown.words()
# tokens = nltk.word_tokenize(raw)
# tokens += reuters.words()
# tokens += nps_chat.words()
# tokens += semcor.words()
# tokens += gutenberg.words()
# tokens += conll2000.words()
# tokens += movie_reviews.words()

# tokens = nltk.corpus.reuters.words()
print(type(tokens))
bgs_freq = get_bigram_freq(tokens)
tgs_freq = get_trigram_freq(tokens)
print(bgs_freq)
print(tgs_freq)


def worker(string, work):
    #print(request, file=sys.stderr)
    # string = "I told her that "
    # work = "pred"
    words = string.split()
    # print('\n\n\n')
    print(words)
    n = len(words)
    print('\n')

    # if work == 'pred':
    #     if n == 1:
    #         for s in bgs_freq[(string)].most_common(5):
    #             print("HOW")
    #             # print(i)
    #             # s = re.sub(r'[!,*)@#%(&$_?.^\'\";:]', '', s)
    #             print(s, file=sys.stderr)

    #         # return json.dumps(bgs_freq[(string)].most_common(5))

    #     elif n > 1:
    #         for s in bgs_freq[(string)].most_common(5):
    #             print("BYE")
    #             # print(i)
    #             # s = re.sub(r'[!,*)@#%(&$_?.^\'\";:]', '', s)
    #             print(s, file=sys.stderr)
    #         # print(tgs_freq[(words[n-2], words[n-1])
    #         #    ].most_common(5), file=sys.stderr)

    #         # return json.dumps(tgs_freq[(words[n-2],words[n-1])].most_common(5))

    if work == 'pred':
        if n == 1:
            bgs = bgs_freq[(string)].most_common(5)
            arr = []
            for s, i in bgs:
                s = re.sub(r'[!*)@#%(&$_^\'\";:]', '', s)
                print(s)
                if len(s) > 0:
                    arr.append((s, i))
            print(bgs_freq[(string)].most_common(5), file=sys.stderr)
            print(arr, file=sys.stderr)

            # return json.dumps(bgs_freq[(string)].most_common(5))

        elif n > 1:
            arr = []
            tgs = tgs_freq[(words[n-2], words[n-1])].most_common(5)
            for s, i in tgs:
                s = re.sub(r'[!*)@#%(&$_^\'\";:]', '', s)
                print(s)
                if len(s) > 0:
                    arr.append((s, i))
            print(tgs_freq[(words[n-2], words[n-1])
                           ].most_common(5), file=sys.stderr)
            print(arr, file=sys.stderr)

            # return json.dumps(tgs_freq[(words[n-2],words[n-1])].most_common(5))
    else:
        print(incomplete_pred(words, n), file=sys.stderr)
        # return json.dumps(incomplete_pred(words, n))


# Word Prediction
# string = "I am so "
# work = 'pred'
# worker(string, work)

# # Word Completion
# string = "I am so frustra"
# work = ''
# worker(string, work)

# # Spell Correct
# string = "Where aer"
# work = ''
# worker(string, work)

while(1):
    string = input("Enter String: ")
    work = input("Enter pred/none: ")
    worker(string, work)
