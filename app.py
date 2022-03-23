from distutils.log import debug
from unittest.util import _MAX_LENGTH
from flask import Flask, jsonify, request
import sys
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)


global modelPipeline
modelPipeline = pipeline('text-generation', model = '/home/versatile/RON/Btech_Project/Models/6l_data_model/output')

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


if __name__ == "__main__":  
    app.run(debug=True)