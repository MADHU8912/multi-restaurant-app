async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("msg");

  try {
    const res = await fetch("http://localhost:5000/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("adminToken", data.token);
      msg.innerText = "Login success";
      window.location.href = "dashboard.html";
    } else {
      msg.style.color = "red";
      msg.innerText = data.message || "Login failed";
    }
  } catch (error) {
    msg.style.color = "red";
    msg.innerText = "Server error";
  }
}