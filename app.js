const table = document.querySelector(".table-data");
const tableBtn = document.querySelector(".stock-button");

const ownerInput = document.querySelectorAll(".ownerform");
const sentimentInput = document.querySelectorAll(".sentiment-radio");
const stockInput = document.querySelector("#stick");
const commentInput = document.querySelector("#comment");

tableBtn.addEventListener("click", () => {
  let owner = radioCheck(ownerInput);
  let sentiment = radioCheck(sentimentInput);
  let ticker = stockInput.value;
  let comment = commentInput.value;

  //   let template = `
  //     <tr>
  //         <td>${owner}</td>
  //         <td>${sentiment}</td>
  //         <td>${ticker}</td>
  //         <td></td>
  //         <td>${comment}</td>
  //         <td></td>
  //         <td></td>
  //     </tr>
  //   `;
  let template = `
    <tr>
        <td>${owner}</td>
        <td>${sentiment}</td>
        <td>${ticker}</td>
        <td></td>
        <td>${comment}</td>
        <td></td>
        <td></td>
    </tr>
  `;
  table.innerHTML += template;
});

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
