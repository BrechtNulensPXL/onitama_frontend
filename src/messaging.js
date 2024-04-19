let messageBoxCollection = [];
const innerWrapper = document.getElementsByClassName("inner-wrapper")[0];

// Create a message element and display it
const createMessageBox = (status, message) => {
  let messageBoxElement = document.createElement("div");
  let messageBoxParagraph = document.createElement("p");
  let messageBoxTextNode = document.createTextNode(message);
  let messageBoxDismissButton = document.createElement("button");

  messageBoxElement.appendChild(messageBoxDismissButton);
  messageBoxParagraph.appendChild(messageBoxTextNode);
  messageBoxElement.appendChild(messageBoxParagraph);

  messageBoxElement.className = "messagebox";
  messageBoxParagraph.className = "messagetext";
  messageBoxDismissButton.className = "messagedismiss";

  switch (status) {
    case "error":
      messageBoxElement.classList.add("error");
      break;
    case "action":
      messageBoxElement.classList.add("action");
      break;
    case "confirmation":
      messageBoxElement.classList.add("confirmation");
      break;
  }
  messageBoxCollection.push(messageBoxElement);
  console.log("collection length", messageBoxCollection.length);
  innerWrapper.appendChild(messageBoxElement);
};

// Inner wrapper messagebox dismissal user interaction
innerWrapper.addEventListener("click", (e) => {
  if (e.target.className == "messagedismiss") {
    removeMessageBox(e.target.parentNode);
  }
});

const removeMessageBox = (element) => {
  innerWrapper.removeChild(element);
  messageBoxCollection.pop();
  console.log("collection popped", messageBoxCollection.length);
};

createMessageBox("error", "Some error");
createMessageBox("action", "Some action");
createMessageBox("confirmation", "Some confirm");

// Automatic messagebox dismissal after 3 seconds
const messageBoxTimer = () => {
  if (messageBoxCollection.length > 0) {
    removeMessageBox(messageBoxCollection[messageBoxCollection.length - 1]);
    console.log("removed", messageBoxCollection.length - 1);
  } else {
    stopMessageBoxTimer();
  }
};
const messageBoxTimeout = setTimeout(messageBoxTimer, 3000);
const stopMessageBoxTimer = () => {
  console.log("stop");
  // clearTimeout(messageBoxTimeout);
};

// Create a message on button press
const generateMessageButton = document.getElementById("generate-message");
generateMessageButton.addEventListener("click", () => {
  createMessageBox("action", "Message created");
  // Start a new timer for the new message
  setTimeout(messageBoxTimer, 5000);
  // TODO
});
messageBoxCollection.length == 0 ? stopMessageBoxTimer() : messageBoxTimeout;

if (messageBoxCollection.length > 6) {
  createMessageBox("error", "Too much info");
  generateMessageButton.setAttribute("enabled", false);
} else {
  generateMessageButton.setAttribute("enabled", true);
}
