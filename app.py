from distutils.log import debug
from opcode import hascompare, haslocal
from traceback import print_tb
from unittest.util import _MAX_LENGTH
from django.forms import DateInput
from flask import Flask, jsonify, request
import sys
from flask_cors import CORS
from matplotlib.pyplot import text
from pandas import array
from sympy import content
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

app = Flask(__name__)
CORS(app)


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
modelPipeline = pipeline(
    'text-generation', model='/home/rhugaved/Academics/BTech/PROJECT/GIT_PROJECT/DistilGPT2_1l_chats_new_model/output')


@app.route("/")
def hello():
    res = jsonify({
        "Hello": "WhatsNxt!"
    })
    return res


@app.route("/emotion")
def emotion():
    try:
        emotions = np.array(
            ['Anger', 'Happy', 'Love', 'Neutral', 'Sad', 'Surprise'])
        context = request.args.get('context', default='', type=str)
        # print(context)
        msgs = []
        context = context.split("#", 1)
        myname = context[0]
        context = context[1]
        print("context: ")
        print(context)
        for msg in context.split("#")[:-1]:
            # print(msg.split(":"))
            # if myname != msg.split(":")[0]:
            msgs.append(msg.split(":")[1])
        text_data = pd.DataFrame(msgs)
        text_data_preprocessed = data_preprocessing(text_data)
        result = emotion_loaded_model.predict(text_data_preprocessed)
        print("MESSAGES====>>> ", msgs)

        # print("REsult: ", result)
        # print("length; ", len(result))
        result_emotion = []
        for i in range(len(result)):
            result_emotion.append(emotions[result[i]])
        # print("Emotion Result: {}".format(result_emotion))
    except:
        result_emotion = []

    res = jsonify({
        "EMOTION": result_emotion
    })
    return res


@app.route("/autocomplete")
def autocomplete():
    # sample context
    context = request.args.get('context', default='', type=str)
    result = []
    i = 0
    while i < 5:
        temp = modelPipeline(context, max_length=90, num_return_sequences=1, do_sample=True,
                             eos_token_id=2, pad_token_id=0, skip_special_tokens=True, top_k=50, top_p=0.95)
        if len(temp[0]['generated_text']) - len(context) > 3:
            result.append(temp[0])
            i = i + 1

    # print("Result: {}".format(result))

    res = jsonify({
        "AUTOCOMPLETE": result
    })
    return res


@app.route("/calendar")
def calendar():
    result = []
    context = request.args.get('context', default='', type=str)
    # print(f'Calendar context = {context}')
    language = 'en'
    context = context.split('<SPLIT>')
    now = datetime.datetime.now()
    for line in context:
        if(len(line) > 0):
            line = re.sub(r'[^\w]', ' ', line)
            print(f'line = {line}')
            try:
                dt = timefhuman(line)
                has_calendar = False
                day = None
                month = None
                year = None
                hour = None
                minute = None
                print(dt)
                # If there is no date and time mentioned in the messsage
                if(dt == []):
                    pass
                else:
                    has_calendar = True
                    year = dt.year
                    month = dt.month
                    day = dt.day
                    hour = dt.hour
                    minute = dt.minute

                    if now > dt:
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
            except:
                has_calendar = False

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
