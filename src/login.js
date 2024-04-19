"use strict";

// Regular expressions
let emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

let loginButton = document.getElementById("login-button");
loginButton.setAttribute("disabled", true);

// Toggle Password visibility
let showPasswordBox = document.getElementById("showPassword");
const makePasswordVisible = (event) => {
  let passwordInput = document.getElementById("password-input");
  if (event.target.checked) {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
};
showPasswordBox.addEventListener("click", makePasswordVisible);

// Display an error message
const displayMessage = (message) => {
  let messageBox = document.getElementsByClassName("message-box")[0];
  let messageWrapper = document.createElement("div");
  messageWrapper.classList.add("message-box");
  let messageTextNode = document.createTextNode(message);

  messageWrapper.appendChild(messageTextNode);
  messageBox.appendChild(messageWrapper);
  return messageBox;
};

// Determine which error to be displayed
const determineErrorMessage = (response) => {
  console.log(response);
  if (!response) {
    console.log("hello");
  } else if (response > 0) {
    switch (key) {
      case response === 200:
        displayMessage("ok", "Login succeeded");
        console.log("Good");
        break;
      case response === 400:
        displayMessage("warning", "User already exists");
        console.log("Already Exists");
        break;
      case response === 404:
        displayMessage("error", "User not found");
        console.log("Not found !");
        break;
      default:
        response === undefined;
        break;
    }
  }
};

// Check if all fields are filled
const handleInput = (event) => {
  let targetId = event.target.id;
  let targetName = event.target.name;
  let targetValue = event.target.value;

  if (targetName == "email") {
    let emailInputElement = document.getElementById(targetId);
    if (emailRegex.test(targetValue)) {
      emailInputElement.style.border = "2px solid var(--ok)";
    } else if (targetValue == "") {
      emailInputElement.style.border = "2px solid var(--warning)";
      loginButton.setAttribute("disabled", true);
    } else {
      emailInputElement.style.border = "2px solid var(--light-grey)";
    }
  } else if (targetName == "password") {
    let passwordInputElement = document.getElementById(targetId);
    if (passwordRegex.test(targetValue)) {
      passwordInputElement.style.border = "2px solid var(--ok)";
      loginButton.removeAttribute("disabled");
    } else if (targetValue == "") {
      passwordInputElement.style.border = "2px solid var(--warning)";
      loginButton.setAttribute("disabled", true);
    } else {
      passwordInputElement.style.border = "2px solid var(--light-grey)";
    }
  }
};

// Form Elements
let loginForm = document.getElementById("login-form");
let registerForm = document.getElementById("register-form");

const handleLogin = (event) => {
  event.preventDefault();

  // FormData puts all inputs as key-value pairs
  const loginFormData = new FormData(loginForm);
  // We make an object from these entries
  const loginFormDataEntries = Object.fromEntries(loginFormData.entries());
  // JSON stringify to pass into request body
  const JSONformData = JSON.stringify(loginFormDataEntries);

  fetch("https://localhost:5001/api/Authentication/token", {
    method: "POST",
    body: JSONformData,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "http://localhost:5173",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      // if (!data) {
      //     displayMessage("warning")
      //     console.log(data)
      // } else {
      //     console.log(data)
      //     displayMessage("ok");
      //     window.sessionStorage.setItem('token', data.token);
      //     setTimeout(() => {
      //        window.location.href = 'TODO';
      //     }, 3000);
      // }
    })
    .catch((err) => console.log(err));
};

loginForm.addEventListener("input", handleInput);
loginForm.addEventListener("submit", handleLogin);
