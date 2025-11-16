(function() {
    const token = localStorage.getItem("access_token");
    if (!token) {
        alert("You are not logged in. Redirecting to login page.");
        window.location.href = "login.html";
    }
})();
document.addEventListener("DOMContentLoaded", function() {

    const generateBtn = document.getElementById("generateButton");
    const formContainer = document.getElementById("form-container");
    const formTemplate = document.getElementById("form-template");
    const batchForm = document.getElementById("batchForm");
    const submitAllBtn = document.getElementById("submitAllButton");
    const resultsContainer = document.getElementById("results-container");

    generateBtn.addEventListener("click", function() {
        const count = document.getElementById("repeatCount").value;
        formContainer.innerHTML = ""; 
        if (resultsContainer) {
            resultsContainer.innerHTML = ""; 
        }
        if (count < 1) return; 

        for (let i = 1; i <= count; i++) {
            const formClone = formTemplate.content.cloneNode(true);
            const labels = formClone.querySelectorAll("label");
            const inputs = formClone.querySelectorAll("input, select");
            const formTitle = formClone.querySelector("h3");
            formTitle.textContent = `LOAN APPLICATION FORM #${i}`;
            labels.forEach(label => {
                const oldFor = label.getAttribute("for");
                if (oldFor) {
                    const newFor = `${oldFor}-${i}`;
                    label.setAttribute("for", newFor);
                }
            });
            inputs.forEach(input => {
                const oldId = input.getAttribute("id");
                if (oldId) {
                    const newId = `${oldId}-${i}`;
                    input.setAttribute("id", newId);
                }
            });
            formContainer.appendChild(formClone);
        }
        submitAllBtn.style.display = "block";
    });

    // --- BATCH SUBMIT LOGIC ---
    batchForm.addEventListener("submit", function(event) {
        event.preventDefault(); 
        
        if (resultsContainer) {
            resultsContainer.innerHTML = "<h3>Submitting...</h3>";
        }
        submitAllBtn.disabled = true;

        const payload = [];
        const formEntries = formContainer.querySelectorAll(".loan-form-entry");
        formEntries.forEach((entry) => {
            const getFloat = (name) => {
                const val = entry.querySelector(`[name="${name}"]`).value;
                return val ? parseFloat(val) : null;
            };
            const getString = (name) => {
                const val = entry.querySelector(`[name="${name}"]`).value;
                return val ? val : null;
            };
            const loanRequest = {
                loan_amnt: getFloat("loan_amnt"),
                term: getString("term"),
                int_rate: getFloat("int_rate"),
                installment: getFloat("installment"),
                emp_length: getString("emp_length"),
                home_ownership: getString("home_ownership"),
                annual_inc: getFloat("annual_inc"),
                verification_status: getString("verification_status"),
                purpose: getString("purpose"),
                dti: getFloat("dti"),
                delinq_2yrs: getFloat("delinq_2yrs"),
                earliest_cr_line: getString("earliest_cr_line"),
                inq_last_6mths: getFloat("inq_last_6mths"),
                open_acc: getFloat("open_acc"),
                pub_rec: getFloat("pub_rec"),
                revol_bal: getFloat("revol_bal"),
                revol_util: getString("revol_util"),
                total_acc: getFloat("total_acc")
            };
            payload.push(loanRequest);
        });

        const token = localStorage.getItem("access_token");

        fetch("/predict_batch", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify(payload),
        })
        .then(response => {
            if (response.status === 401) {
                // Token is bad or expired
                alert("Your session has expired. Please log in again.");
                localStorage.removeItem("access_token");
                window.location.href = "login.html";
                throw new Error("Unauthorized");
            }
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.detail || "Unknown error occurred");
                });
            }
            return response.json(); 
        })
        .then(results => {
            console.log("Received results from API:", results);
            displayResults(results);
            submitAllBtn.disabled = false;
        })
        .catch(error => {
            if (error.message !== "Unauthorized") {
                 console.error("Error submitting batch:", error);
                if (resultsContainer) {
                    resultsContainer.innerHTML = `<h3 class="error">Error: ${error.message}</h3><p>Could not connect to the API.</p>`;
                }
            }
            submitAllBtn.disabled = false;
        });
    });
    function displayResults(results) {
        if (!resultsContainer) return; 
        resultsContainer.innerHTML = "<h3>Prediction Results</h3>";
        const resultList = document.createElement("ul");
        results.forEach((result, index) => {
            const li = document.createElement("li");
            const probability = (result.probability_of_default * 100).toFixed(2);
            let labelClass = `status-${result.status}`;
            li.innerHTML = `
              <strong>Application #${index + 1}:</strong> 
              <span class="prediction ${labelClass}">${result.action}</span> 
              (Risk Score: ${probability}%)
              <p><strong>Recommendation:</strong> ${result.recommendation}</p>
            `;
            resultList.appendChild(li);
        });
        resultsContainer.appendChild(resultList);
    }
});