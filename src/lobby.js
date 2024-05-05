const PORT = 5051;
const createNewTableButton = document.getElementById("create-new-table");

createNewTableButton.addEventListener("click", () => {
  fetch(`https://localhost:${PORT}/api/Tables`, {
    method: "POST",
    body: JSONformData,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": `http://localhost:8081`,
    },
  })
    .then((res) => {
      console.log(res.status);
      determineFeedbackMessage(res.status);
      return res.json();
    })
    // .then((res) => res.json())
    .then((data) => {
      console.log(data);
      window.sessionStorage.setItem("token", data.token);
      setTimeout(() => {
        window.location.href = "lobby.html";
      }, 3000);
    })
    .catch((err) => {
      console.log(err);
      determineFeedbackMessage(null);
    });
});
