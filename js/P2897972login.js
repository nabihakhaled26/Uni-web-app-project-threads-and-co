const form = document.querySelector("#login-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.email.value.trim();
  const password = form.password.value.trim();

  
  if (!email || !password) {
    alert("Please fill in all fields");
    return;
  }

  try {
    const res = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    console.log("LOGIN RESPONSE:", data);

    
    if (!res.ok) {
      alert(data.error || "Login failed");
      return;
    }

    
    alert("Login successful");

   
    sessionStorage.setItem("justLoggedIn", "true");

    
    setTimeout(() => {
      window.location.href = "P2897972home.html";
    }, 200);

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    alert("Server error");
  }
});