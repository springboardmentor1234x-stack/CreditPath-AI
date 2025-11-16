# CreditPath-AI

## Project Objective

This project aims to predict the likelihood of a borrower defaulting on a loan. By leveraging machine learning, this model can help financial institutions make more informed lending decisions, manage risk, and reduce financial losses. The core of this project is not just to build an accurate model, but one that is **interpretable** and **robust** against class imbalance.

---

## Dataset

The model is trained on the `Anonymize_Loan_Default_data.csv` dataset, which contains anonymized loan records and borrower information.

* **Source:** https://www.kaggle.com/datasets/joebeachcapital/loan-default
* **Target Variable:** `repay_fail` (1 for default, 0 for repayment)
* **Challenge:** The dataset is highly imbalanced, with far fewer defaults than repayments.

---

## 🛠️ Methodology & Workflow

This project follows a systematic machine learning pipeline:

1.  **Data Cleaning:**
    * **Leaky Feature Removal:** Identified and dropped features that would not be available at the time of prediction (e.g., `total_pymnt`, `last_pymnt_d`).
    * **Null Value Handling:** Dropped columns with a high percentage of missing values.
    * **Type Conversion:** Cleaned and converted text-based fields (like `term`, `emp_length`, `revol_util`) into numerical formats for modeling.

2.  **Feature Engineering:**
    * `credit_history_length_months`: Time (in months) from earliest credit line to loan issuance.
    * `loan_to_income_ratio`: The ratio of the loan amount to the borrower's annual income.
    * `loan_burden_ratio`: The monthly installment as a fraction of monthly income.
    * `acc_open_freq`: Frequency of new account openings over the borrower's credit history.
    * `dti_x_int_rate`: An interaction term capturing the combined risk of high debt and a high interest rate.

3.  **Preprocessing:**
    * **Imputation:** Filled remaining missing values using median (for numerical) and mode (for categorical).
    * **Encoding:** Applied one-hot encoding to all categorical features using `pd.get_dummies`.
    * **Scaling:** Standardized key numerical features using `StandardScaler` to ensure they are on a comparable scale.

4.  **Modeling & Tuning:**
    * **Model:** Chose `XGBClassifier` for its high performance, speed, and built-in handling of missing values.
    * **Handling Imbalance:** Applied `scale_pos_weight` directly in the model. This method adjusts the weight of the minority class (defaults) during training, forcing the model to pay more attention to it.
    * **Tuning:** Used `RandomizedSearchCV` with 3-fold cross-validation to efficiently find the best hyperparameters, optimizing for the **ROC AUC score**.

---

## Key Results & Visualizations

The final model performs well in identifying high-risk borrowers, balancing the need to grant loans with the risk of default.

### 1. Model Performance

* **Test Set AUC:** **0.71**
* **Classification Report:**
    ```
               precision    recall  f1-score   support

           0       0.91      0.64      0.75      6530
           1       0.24      0.65      0.36      1166
    ```

### 2. Confusion Matrix

The confusion matrix shows the model's strategic trade-off. By using `scale_pos_weight`, we prioritized catching defaults, accepting that we would be more cautious with good loans.

* **True Positives (Defaults Caught): 760**
* **False Negatives (Defaults Missed): 406**

This results in a **Recall for defaults of 65%** (760 / (760 + 406)), meaning the model successfully **catches 2 out of every 3 actual defaults**. The trade-off is a higher number of False Positives (2,344), which represents a business decision to be more risk-averse.


### 3. Model Interpretability: SHAP Analysis

* **`term_x_int_rate` (Synthetic Feature):** This is the **#1 most important predictor**. A high value (a long-term loan *and* a high interest rate) is the single strongest indicator of default risk.
* **`annual_inc`:** A high annual income (red dots) strongly *decreases* the risk of default (pushes the SHAP value negative).
* **`int_rate` & `funded_amnt_inv`:** High interest rates and larger funded amounts are both logical and significant predictors of increased risk.
* **`purpose_small_business`:** Borrowers taking loans for a small business (red dot, indicating `True`) are clearly shown to be in a higher-risk category.
* **`credit_history_length_months`:** A low value for credit history (blue dot, meaning a newer borrower) increases the predicted risk of default.

---

## 💻 Technologies Used

* Python 3.x
* Pandas
* NumPy
* Scikit-learn (for preprocessing, splitting, and metrics)
* XGBoost (for the core model)
* Matplotlib & Seaborn (for visualization)
* SHAP (for model interpretability)
* Google Colab
