# from audioop import reverse
# from distutils.log import debug
# from opcode import hascompare, haslocal
# from traceback import print_tb
# from email.policy import default
# from unittest.util import _MAX_LENGTH
from distutils.dep_util import newer
from xml.dom.minidom import parseString
from flask import Flask, jsonify, request
import sys
from flask_cors import CORS
# from matplotlib.pyplot import text
# from pandas import array
# from sympy import content
from transformers import pipeline
import pickle
import numpy as np
import pandas as pd
import nltk
from nltk.corpus import stopwords
from textblob import Word
from timefhuman import timefhuman
import datetime
import re

# for ngram
# from pprint import pprint
import json
import sys
from nltk.corpus import brown
from nltk.corpus import gutenberg
from nltk.corpus import semcor
from nltk.corpus import nps_chat
from nltk.corpus import reuters
from nltk.corpus import conll2000
from nltk.corpus import movie_reviews
import nltk
# from nltk.corpus import PlaintextCorpusReader

nltk.download('brown')
nltk.download('reuters')
nltk.download('nps_chat')
nltk.download('semcor')
nltk.download('gutenberg')
nltk.download('conll2000')
nltk.download('movie_reviews')


def data_preprocessing(text_data):
    # Doing some preprocessing on these text_data as done before
    text_data[0] = text_data[0].str.replace('[^\w\s]', ' ')

    stop = stopwords.words('english')
    text_data[0] = text_data[0].apply(
        lambda x: " ".join(x for x in x.split() if x not in stop))

    text_data[0] = text_data[0].apply(lambda x: " ".join(
        [Word(word).lemmatize() for word in x.split()]))

    return text_data[0]


# Loading the saved model
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('omw-1.4')

emotion_loaded_model = pickle.load(open(
    '/home/rhugaved/Academics/BTech/PROJECT/GIT_PROJECT/emotion_detection/emotion_pipeline_model.pickle', 'rb'))
# text_data = pd.DataFrame(['I am pissed at you', 'How are you?', 'What a weird experience that was!', 'I feel sparkling', 'I miss him', 'I loved the way you cooked for me'])
# raw_data = text_data.copy()
# line = data_preprocessing(text_data)
# result = loaded_model.predict(line)

# emotions = np.array(['Anger', 'Happy', 'Love', 'Neutral', 'Sad', 'Surprise'])
# i = 0
# print("\n")
# for t in raw_data.values:
#     print(emotions[result[i]],  end='\t\t\t')
#     print(t[0])
#     i += 1
# # print(emotions[result])
# print("\n")
# 0: Anger, 1: Happpy, 2: love, 3: Neutral, 4: sad, 5: surprise
# print(result)

global modelPipeline
# modelPipeline = pipeline('text-generation', model='/home/rhugaved/Academics/BTech/PROJECT/GIT_PROJECT/DistilGPT2_1l_chats_new_model/output')

# modelPipeline = pipeline(
# 'text-generation', model='/home/rhugaved/Academics/BTech/PROJECT/GIT_PROJECT/DistilGPT2_1l_chats_new_model/output')
modelPipeline = pipeline(
    'text-generation', model='/home/rhugaved/Academics/BTech/PROJECT/GIT_PROJECT/rhugaved_without_name/output')


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
    # print (all_succeeding, file=sys.stderr)
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


# Below code added for word spell correction and completion for the first word
first_words_in_sent = []
for s in brown.sents():
    if not s[0].isalpha():
        continue
    if len(s[0]) > 2:
        first_words_in_sent.append(s[0].capitalize())

first_words_in_sent_set = set(first_words_in_sent)

# Make a dict of words along with their frequency
first_words_dict_with_freq = {}
for item in first_words_in_sent:
    first_words_dict_with_freq[item] = first_words_dict_with_freq.get(
        item, 0) + 1

first_words_dict_with_freq = dict(
    sorted(first_words_dict_with_freq.items(), key=lambda kv: (kv[1], kv[0]), reverse=True))


def first_word(words, n):

    preds = []
    med = []
    for pred in first_words_in_sent_set:
        # Setting penalty for substitution to 2 to help in word completion more than spell check
        med.append((pred, nltk.edit_distance(
            pred, words[n-1], substitution_cost=2, transpositions=True)))
    med.sort(key=lambda x: x[1])
    index = 0
    while len(preds) < 5:
        if index < len(med):
            if med[index][1] > 0:
                val = appendwithcheck(preds, med[index])
            index += 1

    return preds


tokens = brown.words()
print("Brown added")
# tokens += reuters.words()
# print("Reuters added")
# tokens += nps_chat.words()
# print("NPS Chat added")
# tokens += semcor.words()
# print("Semcor added")
# tokens += gutenberg.words()
# print("Gutenberg added")
# tokens += conll2000.words()
# print("Conll 2000 added")
# tokens += movie_reviews.words()
# print("Movie Review added")

bgs_freq = get_bigram_freq(tokens)
tgs_freq = get_trigram_freq(tokens)
# print(bgs_freq)
# print(tgs_freq)


def worker(string, work):
    # print(request, file=sys.stderr)
    # string = "I told her that "
    # work = "pred"
    words = string.split()
    # print('\n\n\n')
    # print(words)
    n = len(words)
    # print('\n')
    if work == 'pred':
        if n == 1:
            bgs = bgs_freq[(string)].most_common(3)
            arr = []
            for s, i in bgs:
                s = re.sub(r'[!*)@#%(&$_^\'\";:]', '', s)
                if len(s) > 0:
                    arr.append((s, i))
            print(arr, file=sys.stderr)
            return arr

        elif n > 1:
            arr = []
            tgs = tgs_freq[(words[n-2], words[n-1])].most_common(3)
            for s, i in tgs:
                s = re.sub(r'[!*)@#%(&$_^\'\";:]', '', s)
                if len(s) > 0:
                    arr.append((s, i))
            print(tgs_freq[(words[n-2], words[n-1])
                           ].most_common(3), file=sys.stderr)
            return arr

    elif work == 'first_word':
        preds = first_word(words, n)
        print("First Word: ", preds)
        return preds

    else:
        print(incomplete_pred(words, n), file=sys.stderr)
        return incomplete_pred(words, n)


worker("How about going ot", '')

app = Flask(__name__)
CORS(app)


@app.route("/")
def hello():
    res = jsonify({
        "Hello": "WhatsNxt!"
    })
    return res


@app.route("/emotion")
def emotion():
    try:
        # emotions = np.array(['Anger', 'Happy', 'Love', 'Neutral', 'Sad', 'Surprise'])
        emotions = np.array(
            ['😡', '😄', '❤️', '😐', '😞', '😮'])
        context = request.args.get('context', default='', type=str)
        # print("EMOTION CONTEXT: ", context)
        msgs = []
        # To split at the last occurance, use rsplit instead of split
        context = context.rsplit("#", 1)
        myname = context[1]
        context = context[0]
        print("EMOTION context: ")
        print(context)
        for msg in context.split("#")[:]:
            # print(msg.split(":"))
            # if myname != msg.split(":")[0]:
            msgs.append(msg.split(":", 1)[1])
        text_data = pd.DataFrame(msgs)
        text_data_preprocessed = data_preprocessing(text_data)
        result = emotion_loaded_model.predict(text_data_preprocessed)
        print("MESSAGES====>>> ", msgs)

        # print("REsult: ", result)
        # print("length; ", len(result))
        result_emotion = []
        for i in range(len(result)):
            result_emotion.append(emotions[result[i]])
        print("Emotion Result: {}".format(result_emotion))
    except:
        result_emotion = []

    res = jsonify({
        "EMOTION": result_emotion
    })
    print("EMOTION RESULT: ", result_emotion)
    print()
    return res


@app.route("/autocomplete")
def autocomplete():
    context = request.args.get('context', default='', type=str)
    print("Original context: ", context)
    # context = context.split("#")
    # print("List: ", context)
    context = re.sub(r' \[(.*?)\]', '', context)
    print("After regex: ", context)
    # new_context = context.split("##")[-6:]
    # context = ""
    # for c in new_context:
    #     context += c

    # if(len(context) > 90) :
    #     context = context[-90:]
    print("Context len : ", len(context))
    result = []
    i = 0
    # while i < 5:
    #     temp = modelPipeline(context, max_length=200, num_return_sequences=1, do_sample=True,
    #                          eos_token_id=2, pad_token_id=0, skip_special_tokens=True, top_k=50, top_p=0.95)
    #     if len(temp[0]['generated_text']) - len(context) > 3:
    #         result.append(temp[0])
    #         i = i + 1
    result = modelPipeline(context, max_length=100, num_return_sequences=5, do_sample=True,
                           eos_token_id=2, pad_token_id=0, skip_special_tokens=True, top_k=50, top_p=0.95)

    print("Result: {}".format(result))
    new_result = []
    for dic in result:
        gen_text = dic['generated_text']
        new_result.append({'generated_text': gen_text.replace(context, "")})

    print(new_result)
    res = jsonify({
        "AUTOCOMPLETE": new_result
    })
    return res


@app.route("/wordcomplete")
def wordcomplete():
    context = request.args.get('context', default="", type=str)
    print()
    print("Word Complete ORIGINAL context: ", context)
    context = context.split("#")[-1].split(":")[-1]
    print("Context length : ", len(context))
    print("Word COmplete context: ", context)
    print()

    complete = []
    predict = []
    manual = []
    wordlist = context.split(" ")
    if len(context) != 0 and len(wordlist) > 2:
        complete = worker(context, '')
        predict = worker(context, 'pred')
    elif len(context) == 0:
        manual = ["Hello", 1], ['Hi', 1], ['Hey', 1]
        # first_words_list_with_freq = list(first_words_dict_with_freq)[:4]
        # [manual.append([ele, 2]) for ele in first_words_list_with_freq]
        # print("manual:: ", manual)

    else:
        # print("context: ", context)
        pred = worker(context, 'first_word')

        """ Below code is the priority algorithm to display the first word "word completion" results in order of priority.
        The word with least minimum edit distance will come first. But if the minimum edit distance of few words is
        same, then the words will be arranges based on their frequency in the Brown Corpus as first words. """
        pred_list = []
        same_cost_list = []
        same_cost_value = 0
        for p, v in pred:
            if v > same_cost_value and len(same_cost_list) > 0:
                pred_dict_each = {}
                # print("-->", same_cost_list)
                for ele in same_cost_list:
                    pred_dict_each[ele] = first_words_dict_with_freq[ele]
                # print(pred_dict_each)
                pred_list.extend(sorted(pred_dict_each.items(),
                                        key=lambda kv: (kv[1], kv[0]), reverse=True))
                # print(pred_list)

                same_cost_list = []
                same_cost_list.append(p)
                same_cost_value = v

                continue
            same_cost_value = v
            # print("*", p)
            same_cost_list.append(p)

        pred_dict_each = {}
        for ele in same_cost_list:
            pred_dict_each[ele] = first_words_dict_with_freq[ele]
        # print(pred_dict_each)
        pred_list.extend(sorted(pred_dict_each.items(),
                                key=lambda kv: (kv[1], kv[0]), reverse=True))
        print(pred_list)
        # pred_list_final = []
        # [pred_list_final.append(i) for i, j in pred_list]
        # pred_list_final

        # Setting manual which has the list of first words to the pred_list_final to send as response
        complete = pred_list
        # manual = [["Hello", 1], ["Hi", 2]]

    # result = []
    # wordlist = context.split(" ")
    # if len(context) != 0 and len(wordlist) > 2:
    #     result = worker(context, '')
    #     print("Pred : ", result[0][0], context.split(" ", -1)[-1])
    #     if result[0][0] == context.split(" ", -1)[-1]:
    #         result = worker(context, 'prod')
    # else:
    #     result = [["Hello", 1], ["Hi", 2]]
    print("COmplete: ", complete)
    print("predict: ", predict)
    print("manual: ", manual)

    res = jsonify({
        "COMPLETE": complete,
        "PREDICT": predict,
        "MANUAL": manual
    })
    return res


@ app.route("/calendar")
def calendar():
    result = []
    context = request.args.get('context', default='', type=str)
    print(f'Calendar context = {context}')
    language = 'en'
    context = context.split('<SPLIT>')
    print("Calendar context: ", context)
    now = datetime.datetime.now()
    for line in context:
        if(len(line) > 0):
            print(f'line = {line}')
            line = re.sub(r'[^\w]', ' ', line)
            print(f'line = {line}')
            try:
                dt, meeting_words_list = timefhuman(line)
            except:
                dt = []
                meeting_words_list = []
            print("Dt: ", type(dt))
            print("Meeting words", meeting_words_list)
            has_calendar = False
            day = None
            month = None
            year = None
            hour = None
            minute = None
            # print(dt)
            # If there is no date and time mentioned in the messsage
            if(dt == [] or type(dt) is tuple or meeting_words_list == []):
                print(dt)
                pass
            else:
                has_calendar = True
                year = dt.year
                month = dt.month
                day = dt.day
                hour = dt.hour
                minute = dt.minute
                print(has_calendar)
                print(year)
                print(month)
                print(day)
                print(hour)
                print(minute)

                # The first regular expression evaluates to True if strings like 9 am or 10pm etc. are not found in the line
                # The second regex evaluates to True if only numbers are present like 9 or 10 etc. This is to avo   id adding 12 Hrs if words like morning, noon are present.
                if now > dt:
                    if re.search("(\d{1}\s*(am|pm))|(\d{2}\s*(am|pm))", line) is None and re.search("(\d{1})|(\d{2})", line) is not None:

                        if now.day == day and now.month == month and now.year == year:
                            if hour < 12:
                                print("........hour " + str(hour))
                                hour += 12
                                if hour < now.hour and minute < now.minute:
                                    has_calendar = False
                            else:
                                has_calendar = False
                        else:
                            has_calendar = False
                    else:
                        has_calendar = False

            # except:
            #     has_calendar = False

                # position = context

            jsonobject = {
                "has_calendar": has_calendar,
                "day": day,
                "month": month,
                "year": year,
                "hour": hour,
                "minute": minute
            }
            print("JSON OBJECT: ")
            print(jsonobject)
            result.append(jsonobject)
    res = jsonify({
        "CALENDAR": result
    })

    print("Calendar JSON --->>>")
    print(res)
    return res


if __name__ == "__main__":
    app.run(debug=True)


# https://calendar.google.com/calendar/u/0/r/eventedit?text=Quick Chat with Pratik Desai Coep&details=This is a quick Chat with you (@rhugaved) and Pratik Desai Coep. This invite was automatically detected and created by You!
# &dates=2022326T0000/2022326T03000
