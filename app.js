// api
const myKey = config.api;

//variable declartions

const table = document.querySelector(".table-data");
const tableBtn = document.querySelector(".stock-button");

const ownership = document.querySelector(".ownership");
const ownerYes = document.querySelector(".yes");
const ownerNo = document.querySelector(".no");
const bear = document.querySelector(".bearBtn");
const sentimentInput = document.querySelectorAll(".sentiment-radio");
const stockInput = document.querySelector("#stick");
const commentInput = document.querySelector("#comment");

//set ownership -- I'm sure this could be consolidated
ownerYes.addEventListener("click", () => {
  ownerYes.children[1].classList.add("checked");
  ownerNo.children[1].classList.remove("checked");
});
ownerNo.addEventListener("click", () => {
  ownerNo.children[1].classList.add("checked");
  ownerYes.children[1].classList.remove("checked");
});

let ownerChoice = Array.from(ownership.children);
ownerChoice.forEach((choice) => {
  console.log(choice);
});

ownership.addEventListener("click", function (event) {
  console.log(event.target);
});

bear.addEventListener("click", () => {
  console.log(bear);
  bear.classList.add("checked");
});

// ----------------------------------------------------------------------- add stock to table ------------------------------------------>>>>
tableBtn.addEventListener("click", () => {
  tableBtn.innerHTML = "Loading";
  loadingButton();

  let owner = ownerCheck();
  console.log(owner);
  if (owner === "yes") {
    owner = `<i class="fas fa-certificate"></i>`;
  } else {
    owner = "";
  }

  let sentiment = radioCheck(sentimentInput);
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
  clearRadio(sentimentInput);
  commentInput.value = "";
});

// ----------------------------------------------------------------------- functions ------------------------------------------>>>>

//owner check
function ownerCheck() {
  if (ownerYes.children[1].classList.contains("checked")) {
    ownerYes.children[1].classList.remove("checked");
    return "yes";
  } else {
    ownerNo.children[1].classList.remove("checked");
    return "no";
  }
}

// get correct radio results from form
function radioCheck(myForm) {
  let radio_value = "";
  for (let i = 0; i < myForm.length; i++) {
    if (myForm[i].checked) {
      radio_value = myForm[i].value;
      break;
    }
  }
  return radio_value;
}

//clear radio
function clearRadio(myForm) {
  for (let i = 0; i < myForm.length; i++) {
    if (myForm[i].checked) {
      myForm[i].checked = false;
      break;
    }
  }
}

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
