// api
const myKey = config.api;

//variable declartions

const table = document.querySelector(".table-data");
const tableBtn = document.querySelector(".stock-button");

const sentimentInput = document.querySelectorAll(".sentimentInput");

const stockInput = document.querySelector("#stick");
const commentInput = document.querySelector("#comment");

const ownership = document.querySelectorAll(".ownerInput");
//set ownership
let owner;
let sentiment;

ownership.forEach((choice) => {
  choice.addEventListener("click", handleOwner);
});

function handleOwner(event) {
  ownership.forEach((choice) => {
    choice.classList.remove("checked");
  });
  event.target.classList.add("checked");
  owner = event.target.classList.contains("yes");
}

sentimentInput.forEach((choice) => {
  choice.addEventListener("click", handleSentiment);
});

function handleSentiment(event) {
  sentimentInput.forEach((choice) => {
    choice.classList.remove("checked");
  });
  event.target.classList.add("checked");
  sentiment = event.target.classList[1].slice(0, -3);
}

// ----------------------------------------------------------------------- add stock to table ------------------------------------------>>>>
tableBtn.addEventListener("click", () => {
  tableBtn.innerHTML = "Loading";
  loadingButton();

  if (owner === true) {
    owner = `<i class="fas fa-certificate"></i>`;
  } else {
    owner = "";
  }

  let sentCapital = capitalizeFirstLetter(sentiment);

  let ticker = stockInput.value;
  let comment = commentInput.value;

  let rawDate = new Date();
  let date = `${
    rawDate.getMonth() + 1
  }/${rawDate.getDate()}/${rawDate.getFullYear()}`;

  let priceStamp;
  let name;

  let getPrice = fetchPrice(ticker, (getPrice) => {
    priceStamp = getPrice;
  });

  let getName = fetchName(ticker, (getName) => {
    name = getName.companyName;
  });

  setTimeout(() => {
    let template = `
    <tr>
        <td>${owner}</td>
        <td> <button class="sentiment ${sentiment}">${sentCapital}</button></td>
        <td>${ticker}</td>
        <td>${name}</td>
        <td>${comment}</td>
        <td>${date}</td>
        <td>$${priceStamp}</td>
    </tr>
  `;
    table.innerHTML += template;

    tableBtn.innerHTML = "Add";
    loadingButton();
  }, 1000);

  //clear inpurt
  stockInput.value = "";
  sentimentInput.forEach((choice) => choice.classList.remove("checked"));
  ownership.forEach((choice) => choice.classList.remove("checked"));
  commentInput.value = "";
});

// ----------------------------------------------------------------------- functions ------------------------------------------>>>>

// get stock price
function fetchPrice(stock, callback) {
  fetch(`https://cloud.iexapis.com/v1/stock/${stock}/price?token=${myKey}`)
    .then((response) => {
      var resp = response.json();
      return resp;
    })
    .then((data) => callback(data));
}

// get company name price
function fetchName(stock, callback) {
  fetch(`https://cloud.iexapis.com/v1/stock/${stock}/company?token=${myKey}`)
    .then((response) => {
      var resp = response.json();
      return resp;
    })
    .then((data) => callback(data));
}

//capitilize first letter
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

//loading button
function loadingButton() {
  tableBtn.classList.toggle("loading");
}
