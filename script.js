document.getElementById('loanForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Stop the default form submission

    const form = event.target;
    
    // Clear any previous result display
    document.getElementById('resultContainer').classList.add('hidden');

    // --- 1. Validation Check (Relies on HTML5 'required', 'min', 'max', 'pattern') ---
    if (!form.checkValidity()) {
        // If the form is invalid, the browser will automatically show its native error messages
        // (like "Please fill out this field") next to the problematic input.
        console.log("Form is invalid. Browser showing native errors.");
        
        // This stops the function from running and prevents the success modal from opening.
        return; 
    }
    
    // --- EXECUTION PROCEEDS ONLY IF THE FORM IS VALID ---
    
    // --- 2. Data Mapping (Creating the Model Object) ---
    const formData = new FormData(form);
    const borrowerData = {};

    // Populate the object and convert numbers
    for (let [key, value] of formData.entries()) {
        if (['age', 'annualIncome', 'creditScore', 'loanAmount', 'loanTenure'].includes(key)) {
            borrowerData[key] = parseFloat(value);
        } else {
            borrowerData[key] = value;
        }
    }

    console.log("Data Mapped to Model Structure:", borrowerData);
    
    // --- 3. Simulate Model Processing & API Call ---
    
    // Logic for simulation
    const monthlyIncome = borrowerData.annualIncome / 12;
    const isApproved = borrowerData.creditScore >= 680 && monthlyIncome >= 1500;
    const rate = borrowerData.creditScore >= 750 ? '5.5%' : (borrowerData.creditScore >= 680 ? '7.2%' : '8.9%');
    const maxLoan = isApproved ? (borrowerData.annualIncome * 3) : 'N/A';

    // Detailed JSON response
    const dummyModelResponse = {
        'applicant_id': 'CP-2025-' + Math.floor(Math.random() * 10000),
        'eligibility_status': isApproved ? 'APPROVED' : 'PENDING_REVIEW',
        'recommended_loan_amount_approved': maxLoan.toLocaleString('en-US') + ' USD',
        'recommended_interest_rate': rate,
        'loan_tenure_years': borrowerData.loanTenure,
        'annual_income': borrowerData.annualIncome.toLocaleString('en-US') + ' USD',
        'loan_to_income_ratio': (borrowerData.loanAmount / borrowerData.annualIncome).toFixed(2),
        'employment_risk': borrowerData.employmentStatus === 'Self-Employed' ? 'Medium' : 'Low',
        'details': `Application for ${borrowerData.loanPurpose} loan successfully received and preliminary assessment completed.`
    };

    // --- 4. Show Success Pop-up & Display Result ---
    
    // A. Show the Success Modal
    const successModal = document.getElementById('successModal');
    successModal.classList.remove('hidden');

    // B. Simulate processing time (2 seconds)
    setTimeout(() => {
        // C. Update the result container
        const resultContainer = document.getElementById('resultContainer');
        const modelResult = document.getElementById('modelResult');

        modelResult.textContent = JSON.stringify(dummyModelResponse, null, 2); 
        resultContainer.classList.remove('hidden');

        // Optional: Hide the modal after a short delay
        setTimeout(() => {
            successModal.classList.add('hidden');
        }, 1500);

        // Optional: Scroll to the result section
        resultContainer.scrollIntoView({ behavior: 'smooth' });
    }, 2000); 

    // Reset the form after successful submission
    form.reset(); 
});

// --- Modal Close Logic (remains the same) ---
document.querySelector('.close-btn').addEventListener('click', function() {
    document.getElementById('successModal').classList.add('hidden');
});

// Close modal if user clicks outside of it (remains the same)
window.addEventListener('click', function(event) {
    const modal = document.getElementById('successModal');
    if (event.target === modal) {
        modal.classList.add('hidden');
    }
});