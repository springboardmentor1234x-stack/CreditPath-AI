## CreditPath-AI

Credit Path AI is an end-to-end credit risk prediction system that evaluates the likelihood of loan default using a trained XGBoost machine learning model. The application collects borrower information through a clean and interactive frontend interface and processes it using a FastAPI-based backend.

The backend validates the input data, runs it through the trained model, and returns a default risk prediction with probability, simulating a real-world credit decision workflow.

#How It Works

The user enters borrower details in the frontend form.

The frontend sends the data as a JSON request to the FastAPI backend using a POST API call.

The backend validates the inputs and prepares them for the ML model.

The XGBoost model predicts the probability of loan default.

Based on the probability, a risk level is determined.

The prediction result is returned to the frontend and displayed to the user.

#Tech Stack

Python
FastAPI
XGBoost
HTML, CSS, JavaScript

#Key Features

Structured borrower input form
REST API for predictions
Machine learning model inference
Real-time risk prediction output

#Use Case

Loan default risk assessment and credit decision support
