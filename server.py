from flask import Flask, request, jsonify
import numpy as np
import joblib
import traceback

app = Flask(__name__)

# Load preprocessor & model
preprocessor = joblib.load("artifacts/preprocessor.joblib")
model = joblib.load("artifacts/RandomForest.joblib")  # update file name if needed


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # Ensure all required features exist
        required_fields = [
            "loanAmount", "annualIncome", "creditScore", "monthlyDebt",
            "employmentLength", "homeOwnership", "revolvingCreditLimit", "creditCardDebt"
        ]

        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        # Convert to expected ML model input format
        X = np.array([[
            float(data['loanAmount']),
            float(data['annualIncome']),
            float(data['creditScore']),
            float(data['monthlyDebt']),
            float(data['employmentLength']),
            data['homeOwnership'],  # categorical - will be one-hot encoded
            float(data['revolvingCreditLimit']),
            float(data['creditCardDebt']),
        ]])

        # Apply preprocessing
        X_processed = preprocessor.transform(X)

        # Predictions
        proba = model.predict_proba(X_processed)[0][1] * 100  # 0–100%
        pred = model.predict(X_processed)[0]

        # Response payload
        return jsonify({
            "approvalProbability": round(proba, 2),
            "loanApproved": bool(pred)
        })

    except Exception as e:
        return jsonify({
            "error": "Prediction failed",
            "details": traceback.format_exc()
        }), 500


@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Loan Model API running"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)