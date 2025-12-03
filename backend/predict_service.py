# predict_service.py
import pickle
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
import json
import sys

# Load trained model
model = load_model("sentiment_model.h5") 

# Load tokenizer
with open("tokenizer.pkl", "rb") as f:   # same tokenizer used during training
    tokenizer = pickle.load(f)

# Prediction function
def predict_sentiment(text):
    """
    Input: a string (single review/text)
    Output: dictionary with probability and label (0 = negative, 1 = positive)
    """
    seq = tokenizer.texts_to_sequences([text])
    padded = pad_sequences(seq, maxlen=100)  # same maxlen as training

    prob = model.predict(padded, verbose=0)[0][0]
    label = 1 if prob > 0.5 else 0

    return {"probability": float(prob), "label": label}



if __name__ == "__main__":
    if len(sys.argv) > 1:
        text = sys.argv[1]
        result = predict_sentiment(text)
        print(json.dumps(result))