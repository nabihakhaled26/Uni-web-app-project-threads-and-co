document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#register-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstname = form.firstname.value.trim();
    const lastname = form.lastname.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const repeatPassword = form["repeat-password"].value;

    if (!firstname || !lastname || !email || !password || !repeatPassword) {
      alert("All fields are required");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    if (password !== repeatPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ firstname, lastname, email, password })
      });

      const data = await res.json();
      console.log("REGISTER RESPONSE:", data);

      if (!res.ok) {
        alert(data.error || "Registration failed");
        return;
      }

      alert("Registration successful");
      window.location.href = "P2897972home.html";

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  });
});