document.addEventListener("DOMContentLoaded", () => {
  // console.log("Loaded");
  localStorage.setItem("language", "nl");
  let language = localStorage.getItem("language");

  let textNodeCollection = document.getElementsByClassName("text-node");
  const textNodesArray = [...textNodeCollection];

  const fetchAndDisplayTranslation = (lang) => {
    fetch(`./languages/${lang}.json`)
      .then((response) => response.json())
      .then((data) => {
        textNodesArray.forEach((textNode, i) => {
          let textContent = document.createTextNode(Object.values(data)[i]);
          textNode.appendChild(textContent);
        });
      })
      .catch((error) => console.error("Error fetching JSON data:", error));
  };

  fetchAndDisplayTranslation(language);

  // Translate button interaction
  let translateButton = document.getElementById("translate-button");
  translateButton.addEventListener("click", () => {
    textNodesArray.forEach((textNode) => {
      textNode.removeChild(textNode.childNodes[0]);
    });
    if (language == "nl") {
      localStorage.setItem("language", "en");
    } else if (language == "en") {
      localStorage.setItem("language", "nl");
    } else {
      localStorage.setItem("language", "en");
    }
    language = localStorage.getItem("language");
    fetchAndDisplayTranslation(language);
    // console.log(language);
  });
});

// Provide translation strings for each text node
// Enumerate 1 to 1 HTML text nodes
// Append text content from JSON for each HTML element
// Delete children textnodes when toggling new language
// Set language to abbreviation to get correct language JSON file (nl,en,es,de,...) on toggle
// Display new data on language toggle
