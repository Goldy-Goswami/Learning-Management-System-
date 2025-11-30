document.getElementById("login").addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const role = document.getElementById("role").value;

    // TEMP: Name extracted from email (until DB connected)
    const name = email.split("@")[0];

    // Save to localStorage
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userRole", role);

    // Redirect based on role
    if (role === "student") {
        window.location.href = "student-dashboard.html";
    } else {
        window.location.href = "teacher-dashboard.html";
    }
});
