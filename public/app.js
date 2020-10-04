// api
const myKey = config.api;

//firebase

const auth = firebase.auth();
const signIn = document.getElementById("sign-in");
const signOut = document.getElementById("sign-out");

const whenSignedIn = document.getElementById("whenSignedIn");
const whenSignedOut = document.getElementById("whenSignedOut");

const provider = new firebase.auth.GoogleAuthProvider();

signIn.onclick = () => auth.signInWithPopup(provider);

signOut.onclick = () => auth.signOut();

auth.onAuthStateChanged((user) => {
  if (user) {
    // signed in
    whenSignedIn.hidden = false;
    whenSignedOut.hidden = true;
    // not signed in
    whenSignedIn.hidden = true;
    whenSignedOut.hidden = false;
  }
});

//firestore
const db = firebase.firestore();
const dbItems = document.querySelector(".myList");
const createThing = document.getElementById("createThing");

let dbRef;
let unsubscribe;

auth.onAuthStateChanged((user) => {
  if (user) {
    dbRef = db.collection("entries");

    createThing.onclick = () => {
      //fb timestampe
      const { serverTimestamp } = firebase.firestore.FieldValue;

      console.log(user);

      dbRef.add({
        uid: user.uid,
        ticker: "MSFT",
        createdAt: serverTimestamp(),
      });
    };

    // stop livestreaming data
    unsubscribe = dbRef
      .where("uid", "==", user.uid)
      .orderBy("createdAt")
      .onSnapshot((querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => {
          return `<li>${doc.data().ticker}</li>`;
        });
        dbItems.innerHTML = items.join("");
      });
  } else {
    unsubscribe && unsubscribe();
  }
});

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
