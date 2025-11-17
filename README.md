# CreditPath-AI

## 🚀 Project Overview

The **CreditPath AI Loan Risk Predictor** is a modern, single-page application (SPA) designed to simulate a fintech loan underwriting dashboard. It provides an interactive Borrower Form where users can input financial data, which is then sent to a simulated machine learning backend for an Approval Prediction.

The application, branded as "CreditPath AI," features a dark, professional aesthetic built with Tailwind CSS and pure JavaScript for navigation and logic.

### Key Features

- **Single-Page Interface**: All functionality resides within `index.html`, offering a fast, responsive user experience.
- **Asynchronous Prediction**: The application sends form data to a simulated external API (`http://localhost:5000/predict`) to retrieve approval decisions and probability scores.
- **Data Visualization**: Uses the native HTML `<canvas>` element and pure JavaScript for simple chart visualizations on the Dashboard and Insights pages.
- **Financial Insights**: Calculates and visualizes key financial ratios (LTI, DTI, Credit Utilization) based on borrower input.
- **Fully Responsive**: Designed with a mobile-first approach using Tailwind CSS utility classes.

---

## 💻 Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | HTML5, CSS3 |
| **Styling** | Tailwind CSS (via CDN) |
| **Logic** | Vanilla JavaScript (ES6+) |
| **Data/API** | Mock backend integration via `fetch` API |

---

## ⚙️ Setup and Usage

### 1. Running the Frontend

Since this is a single, self-contained HTML file (`index.html`), the setup is straightforward:

1. Save the provided code content as `index.html`.
2. Open the file directly in any modern web browser (e.g., Chrome, Firefox, Safari, Edge).

The application will load immediately onto the Dashboard page.

### 2. Form Submission

To generate a prediction, navigate to the **📝 Apply** page and fill out the borrower information form.

### 🚨 Important: Backend Dependency

The application is configured to send the loan data to the following endpoint:

```
http://localhost:5000/predict
```

For the application to show results other than a "Server Error: Could not connect" message, you must have a local server running at this address that can accept a POST request with JSON data and return a JSON response in the following format:

```json
{
  "loanApproved": true,
  "approvalProbability": 85.5
}
```

**Response Fields:**
- `loanApproved` (boolean): Indicates whether the loan is approved (`true`) or denied (`false`)
- `approvalProbability` (number): The probability score between 0-100

The frontend logic handles all subsequent UI updates, risk labeling ('Low Risk', 'High Risk'), and ratio calculations based on this minimal backend response.

### 3. Navigation and Pages

The application consists of four main sections:

- **📊 Dashboard**: Displays mock KPI metrics and a simple Bar Chart visualization.
- **📝 Apply (Borrower Form)**: The input interface for loan data submission.
- **✅ Results**: Shows the Final Decision Badge, Risk Score, and Approval Probability (populated after form submission).
- **💡 Insights**: Displays derived financial ratios (LTI, DTI, CUR) with progress bars and a simulated risk trajectory line chart.

---

## 🎨 Design Notes

The UI uses a dark theme (`bg-gray-900`) with high-contrast text and interactive elements featuring a signature **blue-to-teal gradient** for a modern fintech look. 

All components are built using Tailwind's responsive utilities to ensure perfect scaling on mobile, tablet, and desktop devices.

### Design Highlights:
- Dark mode aesthetic with `text-gray-100` for readability
- Gradient accents (`from-blue-500 to-teal-400`) for CTAs and highlights
- Smooth transitions and hover effects for enhanced interactivity
- Card-based layout with subtle shadows and rounded corners

---

## 📁 Project Structure

```
CreditPath-AI/
│
├── index.html          # Main application file (SPA)
└── README.md           # This file
```

---

## 🔧 Backend Setup (Optional)

To fully test the prediction functionality, you can create a simple backend server. Here's an example using Python Flask:

### Python Backend Example

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    
    # Simple mock prediction logic
    approval = random.choice([True, False])
    probability = random.uniform(30, 95)
    
    return jsonify({
        'loanApproved': approval,
        'approvalProbability': round(probability, 2)
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
```

**To run:**
1. Install dependencies: `pip install flask flask-cors`
2. Save as `app.py`
3. Run: `python app.py`

---

## 🚀 Future Enhancements

- Integration with real ML models for loan prediction
- User authentication and session management
- Historical loan data tracking and analytics
- Export functionality for reports and insights
- Advanced data visualization with interactive charts
- Multi-language support

---

## 📄 License

This project is provided as-is for educational and demonstration purposes.

---

## 👨‍💻 Author

Created as a demonstration of modern SPA architecture and fintech UI/UX design principles.

---

## 🤝 Contributing

This is a demonstration project. Feel free to fork and modify for your own use cases.

---

**Note**: This application is designed for demonstration purposes only and should not be used for actual loan underwriting decisions without proper validation, compliance, and security measures.
