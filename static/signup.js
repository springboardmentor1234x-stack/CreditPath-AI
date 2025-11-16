document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");
    
    const messageDiv = document.createElement("div");
    messageDiv.setAttribute("id", "message-div");
    signupForm.parentNode.insertBefore(messageDiv, signupForm);

    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault(); 
        messageDiv.innerHTML = "";
        messageDiv.className = ""; 

        const fullname = document.getElementById("fullname").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        if (password !== confirmPassword) {
            showMessage("Passwords do not match.", "error");
            return;
        }
        if (password.length < 8) {
            showMessage("Password must be at least 8 characters long.", "error");
            return;
        }

        const payload = {
            fullname: fullname,
            email: email,
            password: password
        };

        try {
            const response = await fetch("/signup", { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Sign up failed.");
            }

            const newUserData = await response.json();
            showMessage(`Success! Account created for ${newUserData.fullname}. You can now log in.`, "success");
            signupForm.reset(); 

            setTimeout(() => {
                window.location.href = "login.html"; // Redirect to login
            }, 2000);

        } catch (error) {
            showMessage(error.message, "error");
        }
    });
    function showMessage(message, type) {
        messageDiv.innerHTML = `<p>${message}</p>`;
        messageDiv.className = type === "success" ? "message-success" : "message-error";
    }
});