from distutils.log import debug
from unittest.util import _MAX_LENGTH
from flask import Flask, jsonify
import sys
from transformers import pipeline

app = Flask(__name__)

@app.route("/")
def hello():
    res = jsonify({
        "Hello":"WhatsNxt!"
    })
    return res

@app.route("/autocomplete")
def autocomplete():
    modelPipeline = pipeline('text-generation', model = 'D:\COEP\Final Year\BTech Project\model\output')

    #sample context
    context = "@rhugaved: How are"
    result = modelPipeline(context, max_length=50, num_return_sequences=3, do_sample=True, eos_token_id=2, pad_token_id=0, skip_special_tokens=True, top_k=50, top_p=0.95)
    print("Result: {}".format(result))

    res = jsonify({
        "AUTOCOMPLETE: ":result
    })
    return res


if __name__ == "__main__":
    app.run(debug=True)