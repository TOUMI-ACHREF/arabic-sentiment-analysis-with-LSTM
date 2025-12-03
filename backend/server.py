# server.py
from flask import Flask, request, jsonify
from predict_service import predict_sentiment  # import your function
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    text = data.get("text", "")
    
    if not text:
        return jsonify({"error": "No text provided"}), 400

    result = predict_sentiment(text)
    return jsonify(result)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
