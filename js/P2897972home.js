(async () => {
  try {
    const justLoggedIn = sessionStorage.getItem("justLoggedIn");

    const res = await fetch("http://localhost:8000/check-auth", {
      method: "GET",
      credentials: "include"
    });

   
    if (res.status === 401) {
      console.log("User NOT authenticated");

    
      if (justLoggedIn) {
        console.log("Skipping redirect (fresh login)");
        sessionStorage.removeItem("justLoggedIn");
        return;
      }

      
      window.location.href = "P2897972login.html";
      return;
    }

    const data = await res.json();
    console.log("User authenticated:", data);

   
    sessionStorage.removeItem("justLoggedIn");

  } catch (err) {
    console.error("Auth check failed:", err);
  }
})();