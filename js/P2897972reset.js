const form = document.getElementById("reset-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newPassword = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  // Validation
  if (!newPassword || !confirmPassword) {
    alert("All fields are required");
    return;
  }

  if (newPassword.length < 8) {
    alert("Password must be at least 8 characters");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  const csrfToken = localStorage.getItem("csrfToken");

  if (!csrfToken) {
    alert("Session expired. Please login again.");
    window.location.href = "P2897972login.html";
    return;
  }

  try {
    const res = await fetch("http://127.0.0.1:8000/reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken
      },
      credentials: "include",
      body: JSON.stringify({ newPassword })
    });

    const data = await res.json();
    console.log("RESET RESPONSE:", data);

    if (res.ok) {
      
      window.location.href = "P2897972newpasswordconfirmation.html";
    } else {
      alert(data.error || "Reset failed");
    }

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
});