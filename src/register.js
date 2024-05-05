"use strict";

// Import message functions
import { createMessageBox } from "./messaging.js";

// Check if a token is already assigned and redirect to waitingroom if true
// if (sessionStorage.getItem("token")) {
//   window.location.replace("waitingroom.html");
// }

// Regular expressions
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
const userNameRegex = /^[a-zA-Z0-9_]{3,31}$/;

// Form Elements
let registerForm = document.getElementById("register-form");
// const registerButton = document.getElementById("register-button");

// Keeping a state object to track which inputs are true or false
const state = {
  email: {
    value: null,
    isValid: false,
    errorMessage: "",
  },
  username: {
    value: null,
    isValid: false,
    errorMessage: "",
  },
  password: {
    value: null,
    isValid: false,
    errorMessage: "",
  },
  confirmPassword: {
    value: null,
    isValid: false,
    errorMessage: "",
  },
  passwordMatch: {
    isValid: false,
  },
};

// Toggle Password visibility
const passwordInput = document.getElementById("password-input");
const confirmPasswordInput = document.getElementById("confirm-password-input");
const passwordVisibilityButton = document.getElementById("showPassword");
passwordVisibilityButton.addEventListener("click", () => {
  if (passwordInput.type == "text") {
    passwordInput.type = "password";
  } else {
    passwordInput.type = "text";
  }
});

let inputCollection = document.getElementsByClassName("register-form-field");
const inputsArray = [...inputCollection];

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

const handleRegistration = (event) => {
  event.preventDefault();
  // Check each input on register for errors
  inputsArray.forEach((inp) => {
    let fieldInput = inp.getElementsByTagName("input");
    let fieldInputTypeValue = fieldInput[0].attributes["type"].value;
    let fieldInputValue = fieldInput[0].value;
    let fieldInputParent = fieldInput[0].parentNode;

    // Check regex for each type of input separately
    if (fieldInputTypeValue == "email") {
      if (emailRegex.test(fieldInputValue)) {
        const emailStateObject = {
          value: fieldInputValue,
          errorMessage: "Is a valid email",
          isValid: true,
        };
        state.email = emailStateObject;
      } else {
        const emailStateObject = {
          value: fieldInputValue,
          errorMessage: "Is not a valid email",
          isValid: false,
        };
        state.email = emailStateObject;
        fieldInputParent.style.border = "2px solid var(--error)";
      }
    } else if (
      fieldInputTypeValue == "password" &&
      fieldInput[0].name == "password"
    ) {
      if (passwordRegex.test(fieldInputValue)) {
        const passwordStateObject = {
          value: fieldInputValue,
          errorMessage: "Is a valid password",
          isValid: true,
        };
        state.password = passwordStateObject;
      } else {
        const passwordStateObject = {
          value: fieldInputValue,
          errorMessage: "Is not a valid password",
          isValid: false,
        };
        state.password = passwordStateObject;
        fieldInputParent.style.border = "2px solid var(--error)";
      }
    } else if (
      fieldInputTypeValue == "password" &&
      fieldInput[0].name == "confirm-password"
    ) {
      if (
        passwordRegex.test(fieldInputValue) &&
        fieldInputValue === passwordInput.value
      ) {
        const confirmPasswordStateObject = {
          value: fieldInputValue,
          errorMessage: "Password does match",
          isValid: true,
        };
        state.confirmPassword = confirmPasswordStateObject;
        state.passwordMatch.isValid = true;
      } else {
        if (fieldInput.value === passwordInput.value) {
          const confirmPasswordStateObject = {
            value: fieldInputValue,
            errorMessage: "Password does match but it is not valid",
            isValid: false,
          };
          state.confirmPassword = confirmPasswordStateObject;
          state.passwordMatch.isValid = true;
        } else {
          const confirmPasswordStateObject = {
            value: fieldInputValue,
            errorMessage: "Password does not match and is invalid",
            isValid: false,
          };
          state.confirmPassword = confirmPasswordStateObject;
          state.passwordMatch.isValid = false;
        }
      }
    } else if (fieldInputTypeValue == "text") {
      if (userNameRegex.test(fieldInputValue)) {
        const usernameStateObject = {
          value: fieldInputValue,
          errorMessage: "Is a valid username",
          isValid: true,
        };
        state.username = usernameStateObject;
      } else {
        const usernameStateObject = {
          value: fieldInputValue,
          errorMessage: "Is not a valid username",
          isValid: false,
        };
        state.username = usernameStateObject;
        fieldInputParent.style.border = "2px solid var(--error)";
      }
    }
  });

  if (!Object.values(state).every((v) => v.isValid)) {
    console.log("state", state);
    // Iterate through each field in the state object
    for (const inputField in state) {
      if (state.hasOwnProperty(inputField)) {
        // Check if the value of the inputField is false
        if (state[inputField].isValid === false) {
          // console.log(inputField);
          if (inputField == "email") {
            createMessageBox("error", "message.error.invalid.email");
          }
          if (inputField == "password") {
            createMessageBox("error", "message.error.invalid.password");
          }
          if (inputField == "passwordMatch") {
            createMessageBox("error", "message.error.invalid.nomatchpassword");
          }
          if (inputField == "username") {
            createMessageBox("error", "message.error.invalid.username");
          }
        }
      }
    }
  } else {
    // FormData puts all inputs as key-value pairs
    const registerFormData = new FormData(registerForm);
    // We make an object from these entries
    const registerFormEntries = Object.fromEntries(registerFormData.entries());
    // JSON stringify to pass into request body
    const JSONformData = JSON.stringify(registerFormEntries);

    fetch("https://localhost:5051/api/Authentication/register", {
      method: "POST",
      body: JSONformData,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        determineFeedbackMessage(res.status);
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
        determineFeedbackMessage(null);
      });
  }
};

// Inputfields obj is passed into handleInput as argument for toggling loginButton
// registerForm.addEventListener("input", (e) => handleInput(e, inputFields));
registerForm.addEventListener("submit", handleRegistration);
