var loginBtn = document.querySelector(".toggle-btn:nth-child(1)");
var registerBtn = document.querySelector(".toggle-btn:nth-child(2)");
var x = document.getElementById("login");
var y = document.getElementById("register");
var z = document.getElementById("btn");

function register() {
  x.style.left = "-400px";
  y.style.left = "50px";
  z.style.left = "110px";

  // Active button text color
  registerBtn.classList.add("active");
  loginBtn.classList.remove("active");
}

function login() {
  x.style.left = "50px";
  y.style.left = "450px";
  z.style.left = "0";

  // Active button text color
  loginBtn.classList.add("active");
  registerBtn.classList.remove("active");
}

// Set default active button
loginBtn.classList.add("active");