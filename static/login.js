document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    
    const messageDiv = document.createElement("div");
    messageDiv.setAttribute("id", "message-div");
    loginForm.parentNode.insertBefore(messageDiv, loginForm);

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        messageDiv.innerHTML = "";
        messageDiv.className = "";

        const email = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const formData = new URLSearchParams();
        formData.append("username", email);
        formData.append("password", password);

        try {
            const response = await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Login failed.");
            }

            const data = await response.json();
            localStorage.setItem("access_token", data.access_token);
            
            showMessage("Login successful! Redirecting...", "success");

            setTimeout(() => {
                window.location.href = "app.html"; 
            }, 1500);

        } catch (error) {
            showMessage(error.message, "error");
        }
    });

    function showMessage(message, type) {
        messageDiv.innerHTML = `<p>${message}</p>`;
        messageDiv.className = type === "success" ? "message-success" : "message-error";
    }
});