from distutils.log import debug
from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/")
def hello():
    res = jsonify({
        "Hello":"WhatsNxt!"
    })
    return res

if __name__ == "__main__":
    app.run(debug=True)