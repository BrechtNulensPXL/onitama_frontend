document.addEventListener("DOMContentLoaded", () => {
  localStorage.setItem("language", "nl");
  let language = localStorage.getItem("language");

  let textNodeCollection = document.getElementsByClassName("text-node");
  const textNodesArray = [...textNodeCollection];

  const fetchAndDisplayTranslation = (lang) => {
    fetch(`./languages/${lang}.json`)
      .then((response) => response.json())
      .then((data) => {
        textNodesArray.forEach((textNode) => {
          if (textNode.hasChildNodes()) {
            textNode.removeChild(textNode.childNodes[0]);
          }
          const translationKey = textNode.getAttribute("data-translation");
          let textContent = document.createTextNode(data[translationKey]);
          textNode.appendChild(textContent);
        });
      })
      .catch((error) => console.error("Error fetching JSON data:", error));
  };

  fetchAndDisplayTranslation(language);

  // Translate buttons - reference and copy
  const translateButtonCollection =
    document.getElementsByClassName("translate-button");
  let translateButtons = [...translateButtonCollection];

  // Get language value from each button separately
  // Set language according localStorage
  translateButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      localStorage.setItem("language", e.target.dataset.language);
      language = localStorage.getItem("language");
      fetchAndDisplayTranslation(language);
    });
  });
});

// Provide translation strings for each text node
// Enumerate 1 to 1 HTML text nodes
// Append text content from JSON for each HTML element
// Delete children textnodes when toggling new language
// Set language to abbreviation to get correct language JSON file (nl,en,es,de,...) on toggle
// Display new data on language toggle
