// api
const myKey = config.api;

//variable declartions

const table = document.querySelector(".table-data");
const tableBtn = document.querySelector(".stock-button");

const ownerInput = document.querySelectorAll(".ownerform");
const sentimentInput = document.querySelectorAll(".sentiment-radio");
const stockInput = document.querySelector("#stick");
const commentInput = document.querySelector("#comment");

// ----------------------------------------------------------------------- add stock to table ------------------------------------------>>>>

tableBtn.addEventListener("click", () => {
  let owner = radioCheck(ownerInput);
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
  }, 1000);

  //clear inpurt
  stockInput.value = "";
  clearRadio(ownerInput);
  clearRadio(sentimentInput);
  commentInput.value = "";
});

// ----------------------------------------------------------------------- functions ------------------------------------------>>>>

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

//   let total;

//   console.log("entered");

//   return new Promise(function (resolve, reject) {
//     request(
//       `https://cloud.iexapis.com/v1/stock/${stock}/price?token=pk_12493ac929dc4aca8b9ca87d35fefc39`,
//       function (error, response, body) {
//         total = body;

//         resolve(total);
//       }
//     );
//   });
// }
