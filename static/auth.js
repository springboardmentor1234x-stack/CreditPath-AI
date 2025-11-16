(function() {
    const token = localStorage.getItem("access_token");

    if (!token) {
        localStorage.setItem("redirect_url", window.location.pathname);
        window.location.href = "login.html";
    }
})();