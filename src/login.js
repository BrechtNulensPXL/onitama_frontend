("use strict");
import { createMessageBox } from "./messaging.js";

const PORT = 5051;

// Check if a token is already assigned and redirect to waitingroom if true
// if (sessionStorage.getItem("token")) {
//   window.location.replace("waitingroom.html");
// }

// Regular expressions
const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

const loginState = {
  email: {
    value: null,
    isValid: false,
    errorMessage: "",
  },
  password: {
    value: null,
    isValid: false,
    errorMessage: "",
  },
};

// Toggle Password visibility
const passwordInput = document.getElementById("password-input");
const passwordVisibilityButton = document.getElementById("showPassword");
passwordVisibilityButton.addEventListener("click", () => {
  if (passwordInput.type == "text") {
    passwordInput.type = "password";
  } else {
    passwordInput.type = "text";
  }
});

// Determine which error to be displayed
const determineFeedbackMessage = (response) => {
  console.log("response", response);
  if (!response) {
    createMessageBox("error", "message.error.fault");
  } else {
    switch (response) {
      case 200:
        createMessageBox("confirmation", "message.confirm.register");
        break;
      case 201:
        createMessageBox("confirmation", "message.confirm.register");
        break;
      case 400:
        createMessageBox("error", "message.error.noaccount");
        break;
      case 404:
        createMessageBox("error", "message.error.denied");
        break;
      case 500:
        createMessageBox("error", "message.error.denied");
        break;
      default:
        createMessageBox("error", "message.error.fault");
        break;
    }
  }
};

//
let inputCollection = document.getElementsByClassName("login-form-field");
const inputsArray = [...inputCollection];

// Form Elements
let loginForm = document.getElementById("login-form");
// let registerForm = document.getElementById("register-form");

const handleLogin = (event) => {
  event.preventDefault();
  inputsArray.forEach((inp) => {
    let fieldInput = inp.getElementsByTagName("input");
    let fieldInputTypeValue = fieldInput[0].attributes["type"].value;
    let fieldInputValue = fieldInput[0].value;
    let fieldInputParent = fieldInput[0].parentNode;

    if (fieldInputTypeValue == "email") {
      if (emailRegex.test(fieldInputValue)) {
        const emailStateObject = {
          value: fieldInputValue,
          errorMessage: "Is a valid email",
          isValid: true,
        };
        loginState.email = emailStateObject;
      } else {
        const emailStateObject = {
          value: fieldInputValue,
          errorMessage: "Is not a valid email",
          isValid: false,
        };
        loginState.email = emailStateObject;
        fieldInputParent.style.border = "2px solid var(--error)";
      }
    } else if (fieldInputTypeValue == "password") {
      if (passwordRegex.test(fieldInputValue)) {
        const passwordStateObject = {
          value: fieldInputValue,
          errorMessage: "Is a valid email",
          isValid: true,
        };
        loginState.password = passwordStateObject;
      } else {
        const passwordStateObject = {
          value: fieldInputValue,
          errorMessage: "Is not a valid password",
          isValid: false,
        };
        loginState.password = passwordStateObject;
        fieldInputParent.style.border = "2px solid var(--error)";
      }
    }
  });

  if (!Object.values(loginState).every((v) => v.isValid)) {
    // If one of the inputs return false a single message will be displayed
    createMessageBox("error", "message.error.invalid.credentials");
  } else {
    // FormData puts all inputs as key-value pairs
    const loginFormData = new FormData(loginForm);
    // We make an object from these entries
    const loginFormDataEntries = Object.fromEntries(loginFormData.entries());
    // JSON stringify to pass into request body
    const JSONformData = JSON.stringify(loginFormDataEntries);

    fetch(`https://localhost:${PORT}/api/Authentication/token`, {
      method: "POST",
      body: JSONformData,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": `http://localhost:8081`,
      },
    })
      .then((res) => {
        determineFeedbackMessage(res.status);
        return res.json();
      })
      // .then((res) => res.json())
      .then((data) => {
        console.log(data);
        window.sessionStorage.setItem("token", data.token);
        setTimeout(() => {
          window.location.href = "lobby.html";
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
        determineFeedbackMessage(null);
      });
  }
};

loginForm.addEventListener("submit", handleLogin);
