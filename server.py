from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allows your JS to talk to Flask

@app.route('/')
def home():
    return jsonify({"message": "✅ Flask API is running. Use POST /predict-loan to send data."})

@app.route('/predict-loan', methods=['POST'])
def predict_loan():
    data = request.json
    print("Received data:", data)
    return jsonify({"message": "Data received successfully for prediction"})

if __name__ == '__main__':
    app.run(debug=True)
