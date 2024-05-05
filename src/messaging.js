let en;
let nl;

const getLanguages = async () => {
  const response_english = await fetch("../languages/en.json");
  const response_dutch = await fetch("../languages/nl.json");
  const json_english = await response_english.json();
  const json_dutch = await response_dutch.json();

  en = json_english;
  nl = json_dutch;
};
getLanguages();

let messageBoxCollection = [];
const messageBoxWrapper = document.getElementsByClassName(
  "message-box-wrapper"
)[0];
// const generateMessageButton = document.getElementById("generate-message");

// Create a message element and display it
export const createMessageBox = (status, translationKey) => {
  const currentLanguage = localStorage.getItem("language") || "en";
  const translations = currentLanguage === "en" ? en : nl;

  const message = translations[translationKey];
  let messageBoxElement = document.createElement("div");
  let messageBoxParagraph = document.createElement("p");
  let messageBoxTextNode = document.createTextNode(`${message}`);
  let messageBoxDismissButton = document.createElement("button");
  let messageBoxImage = document.createElement("img");

  messageBoxElement.appendChild(messageBoxImage);
  messageBoxParagraph.appendChild(messageBoxTextNode);
  messageBoxElement.appendChild(messageBoxParagraph);
  messageBoxElement.appendChild(messageBoxDismissButton);

  messageBoxElement.className = "messagebox";
  messageBoxParagraph.className = "messagetext";
  messageBoxDismissButton.className = "messagedismiss";
  messageBoxImage.className = "messageicon";

  switch (status) {
    case "error":
      messageBoxImage.setAttribute(
        "src",
        "assets/icons/white/error_cross_icon_white.svg"
      );
      messageBoxElement.classList.add("error");
      break;
    case "action":
      messageBoxImage.setAttribute(
        "src",
        "assets/icons/white/daruma_icon_white.svg"
      );
      messageBoxElement.classList.add("action");
      break;
    case "confirmation":
      messageBoxImage.setAttribute(
        "src",
        "assets/icons/white/check_icon_white.svg"
      );
      messageBoxElement.classList.add("confirmation");
      break;
    case "warning":
      messageBoxImage.setAttribute(
        "src",
        "assets/icons/white/warning_icon_white.svg"
      );
      messageBoxElement.classList.add("warning");
      break;
  }
  messageBoxCollection.push(messageBoxElement);
  console.log("collection length", messageBoxCollection.length);
  messageBoxWrapper.appendChild(messageBoxElement);

  return;
};

// Inner wrapper messagebox dismissal user interaction
messageBoxWrapper.addEventListener("click", (e) => {
  if (e.target.className == "messagedismiss") {
    removeMessageBox(e.target.parentNode);
  }
});

const removeMessageBox = (element) => {
  messageBoxWrapper.removeChild(element);
  messageBoxCollection.shift();
  console.log("collection popped", messageBoxCollection.length);
};

// createMessageBox("confirmation", "Some confirm");
// createMessageBox("error", "message.error.denied");
// createMessageBox("warning", "Some warning");
// createMessageBox("action", "Some action");

// Automatic messagebox dismissal after 3 seconds
// const messageBoxTimer = () => {
//   if (messageBoxCollection.length > 0) {
//     removeMessageBox(messageBoxCollection[0]);
//     console.log("removed", messageBoxCollection.length - 1);
//   } else {
//     stopMessageBoxTimer();
//   }
// };
// const messageBoxTimeout = setTimeout(messageBoxTimer, 1500);
// const stopMessageBoxTimer = () => {
//   console.log("stop");
//   clearTimeout(messageBoxTimeout);
// };

// messageBoxCollection.length == 0 ? stopMessageBoxTimer() : messageBoxTimeout;

// Create a message on button press
// generateMessageButton.addEventListener("click", () => {
//   createMessageBox("action", "nav.home");
//   // Start a new timer for the new message
//   // setTimeout(messageBoxTimer, 3000);
//   if (messageBoxCollection.length > 6) {
//     generateMessageButton.setAttribute("enabled", false);
//     return;
//     // createMessageBox("error", "Too much info");
//   } else {
//     generateMessageButton.setAttribute("enabled", true);
//   }
// });
