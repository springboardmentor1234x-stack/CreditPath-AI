// script.js - handles single prediction page & popup
const API = "http://127.0.0.1:8000";

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('cpai_token');
  if (!token) window.location.href = 'login.html';

  const predictBtn = document.getElementById('predictBtn');
  const clearBtn = document.getElementById('clearBtn');
  const closePopup = document.getElementById('closePopup');

  if (predictBtn) predictBtn.addEventListener('click', doPredict);
  if (clearBtn) clearBtn.addEventListener('click', doClear);
  if (closePopup)
    closePopup.addEventListener('click', () => {
      document.getElementById('popupOverlay').style.display = 'none';
    });

  // logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn)
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('cpai_token');
      localStorage.removeItem('cpai_name');
      window.location.href = 'login.html';
    });
});

// collect data
function gatherData() {
  return {
    name: document.getElementById('b_name').value || "Unknown",
    age: parseInt(document.getElementById('b_age').value || 30),
    income: parseFloat(document.getElementById('b_income').value || 0),
    loan_amount: parseFloat(document.getElementById('b_loan').value || 0),
    credit_score: parseFloat(document.getElementById('b_credit').value || 650),
    debt_to_income_ratio: parseFloat(document.getElementById('b_debt').value || 20),
    existing_loans: parseInt(document.getElementById('b_existing').value || 0)
  };
}

// do prediction
async function doPredict() {
  const data = gatherData();

  try {
    const res = await fetch(`${API}/predict/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const j = await res.json();

    if (!res.ok) {
      alert(j.detail || "Prediction failed");
      return;
    }

    showPopup(j);

  } catch (err) {
    console.error(err);
    alert("Server unreachable");
  }
}

// show popup result
function showPopup(res) {
  const overlay = document.getElementById("popupOverlay");
  overlay.style.display = "flex";

  // emoji first
  document.getElementById("p_emoji").innerText = res.emoji || "❗";

  document.getElementById("p_name").innerText = res.name || "Unknown";
  document.getElementById("p_pred").innerText = `Prediction: ${res.prediction}`;
  document.getElementById("p_prob").innerText = `Probability: ${res.percentage}%`;

  document.getElementById("p_reason").innerText =
    res.reason ? `Main reason: ${res.reason}` : "";

  document.getElementById("p_action").innerText =
    res.action ? `Recommended action: ${res.action}` : "";
}

// clear form
function doClear() {
  [
    "b_name",
    "b_age",
    "b_income",
    "b_loan",
    "b_credit",
    "b_debt",
    "b_existing",
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}
