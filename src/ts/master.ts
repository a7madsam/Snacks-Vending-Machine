import { domElement, globalVariable } from "./variabels.js";
import { NoMoneyState } from "./NoMoneyState.js";
import { SnackVendingMachine } from "./SnackVendingMachine.js";
import { Coin } from "./coins.js";
import { Denomination } from "./Denomination_enum.js";
import { PaymentType } from "./PaymentType_enum.js";
import * as utilities from "./utilities.js";
//Initial denomination coins
globalVariable.coins.push(
  new Coin(Denomination.tenCent, 1000),
  new Coin(Denomination.twentyCent, 500),
  new Coin(Denomination.fiftyCent, 200),
  new Coin(Denomination.oneDollar, 100),
  new Coin(Denomination.twentyDollar, 5),
  new Coin(Denomination.fiftyDollar, 2)
);
//Initial the number of left for each item
utilities.fillItemLeft();
//begin vending machine
const startVendingMachine = new SnackVendingMachine();
function sumInsertedCoin(event) {
  if (startVendingMachine.getState instanceof NoMoneyState) {
    globalVariable.typeOfPayment = PaymentType.cashPayment;
    globalVariable.totalAmountOfInsertedCoins += utilities.toFixed(
      Number(event.target.getAttribute("data-money")),
      2
    );
    utilities.updateMachineCash(event.target, 1);
    domElement.screenPanel.innerHTML = `You insert ${utilities.toFixed(
      globalVariable.totalAmountOfInsertedCoins,
      2
    )}$, please select item to buy or ESC to cancel`;
    utilities.addToLogs(domElement.screenPanel.innerHTML);
    utilities.disableCredit();
  } else {
    startVendingMachine.getState.selectItemAndInsertMoney();
  }
}
function getItemNumber(event) {
  let btn = event.target;
  if (btn.innerHTML == "ESC") {
    if (startVendingMachine.getState instanceof NoMoneyState) {
      utilities.reset();
    } else {
      startVendingMachine.getState.ejectMoney();
    }
  } else if (
    btn.id != "delete" &&
    Number(btn.innerHTML) >= 0 &&
    Number(btn.innerHTML) <= 9
  ) {
    if (startVendingMachine.getState instanceof NoMoneyState) {
      utilities.hideCredit();
      if (globalVariable.selectedProduct.length < 2) {
        globalVariable.selectedProduct += btn.innerHTML;
        domElement.screenPanel.innerHTML = globalVariable.selectedProduct;
      }
    } else {
      startVendingMachine.getState.selectItemAndInsertMoney();
    }
  }
}
function showCredit() {
  if (startVendingMachine.getState instanceof NoMoneyState) {
    globalVariable.typeOfPayment = PaymentType.creditPayment;
    domElement.creditSVG.classList.add("when-credit-clicked-img");
    domElement.creditInput.classList.add("when-credit-clicked-input");
    domElement.creditButton.classList.add("when-credit-clicked-button");
    domElement.insertionArea.classList.add("move-insertion-area");
    utilities.disableCash();
  } else {
    startVendingMachine.getState.selectItemAndInsertMoney();
  }
}
function deleteCharacterFromScreenPanel() {
  let flag: boolean = false;
  if (globalVariable.selectedProduct.length <= 0) {
    flag = true;
  }
  let newString = globalVariable.selectedProduct.substring(
    0,
    globalVariable.selectedProduct.length - 1
  );
  globalVariable.selectedProduct = newString;
  if (!flag) domElement.screenPanel.innerHTML = newString;
}
function getInputFromCreditButton() {
  let tempCreditInput = domElement.creditInput.value;
  domElement.creditInput.value = "";
  if (tempCreditInput.length > 0) {
    globalVariable.totalAmountOfInsertedCoins += Number(tempCreditInput);
    domElement.screenPanel.innerHTML = `You insert ${utilities.toFixed(
      globalVariable.totalAmountOfInsertedCoins,
      2
    )}$, please select item to buy or ESC to cancel`;
    utilities.addToLogs(domElement.screenPanel.innerHTML);
    utilities.hideCredit();
    utilities.disableCredit();
  } else {
    domElement.creditInput.classList.add("empty-input");
  }
}
function showLogs() {
  domElement.logsContainer.classList.add("show-logs");
  domElement.ShowLogsButton.classList.add("hide-logs");
  domElement.HideLogsButtom.classList.add("show-logs");
}
function hideLogs() {
  domElement.logsContainer.classList.remove("show-logs");
  domElement.ShowLogsButton.classList.remove("hide-logs");
  domElement.HideLogsButtom.classList.remove("show-logs");
}
function collectCashAndAcceptItem() {
  let moneyInserted: boolean = false;
  let itemNumberInserted: boolean = false;
  let itemNumberTrue: boolean = false;
  let validatePrices: boolean = false;
  let itemSoldOut: boolean = true;
  //check if money inserted
  if (globalVariable.totalAmountOfInsertedCoins > 0) {
    moneyInserted = true;
  }
  //validate item number
  if (globalVariable.selectedProduct.length > 0) {
    itemNumberInserted = true;
  }
  if (
    Number(globalVariable.selectedProduct) >= 1 &&
    Number(globalVariable.selectedProduct) <= 25
  ) {
    itemNumberTrue = true;
  }
  if (!moneyInserted) {
    domElement.screenPanel.innerHTML = `Please insert Money to complete Process or ESC to cancel`;
    utilities.addToLogs(domElement.screenPanel.innerHTML);
    if (
      Number(globalVariable.selectedProduct) < 1 ||
      Number(globalVariable.selectedProduct) > 25
    ) {
      globalVariable.selectedProduct = "";
    }
    return;
  }
  if (!itemNumberInserted) {
    domElement.screenPanel.innerHTML = `Please select correct item number to buy or ESC to cancel`;
    utilities.addToLogs(domElement.screenPanel.innerHTML);
    return;
  }
  if (!itemNumberTrue) {
    domElement.screenPanel.innerHTML = `Wrong item number`;
    utilities.addToLogs(domElement.screenPanel.innerHTML);
    globalVariable.selectedProduct = "";
    setTimeout(() => {
      domElement.screenPanel.innerHTML = ``;
    }, 1000);
    return;
  }
  //check if item is not soldOut
  if (
    globalVariable.numberOfItemsLeft[
      Number(globalVariable.selectedProduct) - 1
    ] > 0
  ) {
    itemSoldOut = false;
  }
  if (itemSoldOut) {
    domElement.screenPanel.innerHTML = `Sorry, item #${globalVariable.selectedProduct} sold out,please select another item or ESC to cancel`;
    utilities.addToLogs(domElement.screenPanel.innerHTML);
    globalVariable.selectedProduct = "";
    return;
  }
  //validate if totalAmountOfInsertedCoins >= price of selected item
  if (
    globalVariable.totalAmountOfInsertedCoins -
      globalVariable.prices()[Number(globalVariable.selectedProduct) - 1] >=
    0
  ) {
    validatePrices = true;
  }
  if (!validatePrices) {
    domElement.screenPanel.innerHTML = `your inserted money is not enough to buy selected item so insert ${utilities.toFixed(
      globalVariable.prices()[Number(globalVariable.selectedProduct) - 1] -
        globalVariable.totalAmountOfInsertedCoins,
      2
    )} or more to buy it or ESC to cancel`;
    utilities.addToLogs(domElement.screenPanel.innerHTML);
    return;
  }
  //check if machine have any coin to give change
  if (
    globalVariable.typeOfPayment === PaymentType.cashPayment &&
    utilities.isThereAnyCoinChangeInMachine(
      globalVariable.totalAmountOfInsertedCoins,
      Number(globalVariable.selectedProduct)
    ) === -1
  ) {
    domElement.screenPanel.innerHTML = `Sorry, we do not have change in machine right now</br>here it is your money`;
    utilities.addToLogs(domElement.screenPanel.innerHTML);
    setTimeout(() => {
      utilities.reset();
    }, 2500);
    return;
  }
  if (
    moneyInserted &&
    itemNumberInserted &&
    itemNumberTrue &&
    validatePrices &&
    !itemSoldOut
  ) {
    startVendingMachine.getState.selectItemAndInsertMoney();
    setTimeout(() => {
      startVendingMachine.getState.dispenseItem();
    }, 3500);
  }
}
domElement.denomination.addEventListener("click", sumInsertedCoin);
domElement.note.addEventListener("click", sumInsertedCoin);
domElement.creditSVG.addEventListener("click", showCredit);
domElement.insertionArea.addEventListener("click", getItemNumber);
domElement.creditButton.addEventListener("click", getInputFromCreditButton);
domElement.insertionAreaDeleteButton.addEventListener(
  "click",
  deleteCharacterFromScreenPanel
);
domElement.ShowLogsButton.addEventListener("click", showLogs);
domElement.HideLogsButtom.addEventListener("click", hideLogs);
domElement.acceptInputItemBtn.addEventListener(
  "click",
  collectCashAndAcceptItem
);
