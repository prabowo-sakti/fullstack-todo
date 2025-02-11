const locationPath = window.location.pathname;
let accessToken = localStorage.getItem("accessToken");

if (accessToken) {
  localStorage.removeItem("accessToken");
  accessToken = null;
}

if (locationPath === "/login") {
  const login = document.getElementById("login");
  login.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Invalid credential");
        }
        return res.json();
      })
      .then(({ accessToken }) => {
        localStorage.setItem("accessToken", accessToken);
        window.location.href = "/";
      })
      .catch((err) => {
        alert(err);
      });
  });
}

if (locationPath === "/signup") {
  const signupForm = document.getElementById("signup");
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Error while registering the user");
        }
        return res.json();
      })
      .then(({ accessToken }) => {
        localStorage.setItem("accessToken", accessToken);
        window.location.href = "/";
      })
      .catch((err) => {
        alert(err);
      });
  });
}
