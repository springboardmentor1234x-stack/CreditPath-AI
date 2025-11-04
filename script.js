document.getElementById("loanForm").addEventListener("submit", async function(event) {
  event.preventDefault(); // Prevent page reload

  const formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    age: document.getElementById("age").value,
    income: document.getElementById("income").value,
    creditScore: document.getElementById("creditScore").value
  };

  try {
    const response = await fetch("http://127.0.0.1:5000/predict-loan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    alert("✅ Data is ready for prediction: " + result.message);
  } catch (error) {
    console.error("Error:", error);
    alert("❌ Something went wrong while sending data to the API!");
  }
});
