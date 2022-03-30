import { domElement, globalVariable } from "./variabels.js";
import { SnackVendingMachine } from "./SnackVendingMachine.js";
import { Denomination } from "./Denomination_enum.js";
function fillItemLeft() {
  domElement.itemLeft.forEach((item) => {
    globalVariable.numberOfItemsLeft.push(Number(item.innerHTML));
  });
}
function updateMachineCash(targetCoin, amount) {
  if (typeof targetCoin === "string") {
    for (let i = 0; i < globalVariable.coins.length; i++) {
      if (globalVariable.coins[i].getDenomination === targetCoin) {
        globalVariable.coins[i].setAmount =
          globalVariable.coins[i].getAmount + amount;
      }
    }
  } else {
    for (let i = 0; i < globalVariable.coins.length; i++) {
      if (globalVariable.coins[i].getDenomination === targetCoin.className) {
        globalVariable.coins[i].setAmount =
          globalVariable.coins[i].getAmount + amount;
      }
    }
  }
}
const coins = [1, 2, 5, 10, 200, 500]; //multiplied by 10 to convert coins to get rid of any fraction
function isThereAnyCoinChangeInMachine(amount: number, itemNumber: number) {
  let availableCoinsInMachine = {
    1: globalVariable.coins[0].getAmount,
    2: globalVariable.coins[1].getAmount,
    5: globalVariable.coins[2].getAmount,
    10: globalVariable.coins[3].getAmount,
    200: globalVariable.coins[4].getAmount,
    500: globalVariable.coins[5].getAmount,
  };
  let change = amount - globalVariable.prices()[itemNumber - 1];
  change = toFixed(change, 2);
  globalVariable.change = toFixed(change, 2); //assign current change to globalVar change
  change *= 10;
  let min_coins = []; //to track minimum coins needed
  let last_coin = []; // to store last [minimum number of coin] type
  min_coins[0] = 0; // base case --> minimum number of coin == 0 at first(to get 0 change)
  for (let amountOfChange = 1; amountOfChange <= change; ++amountOfChange) {
    min_coins[amountOfChange] = Number.MAX_VALUE; //initial to compare [to get minimum]
    last_coin[amountOfChange] = -1;
    for (let i = 0; i < coins.length; i++) {
      if (amountOfChange - coins[i] >= 0) {
        if (
          min_coins[amountOfChange - coins[i]] + 1 <
            min_coins[amountOfChange] &&
          min_coins[amountOfChange - coins[i]] + 1 <=
            globalVariable.coins[i].getAmount
        ) {
          min_coins[amountOfChange] = min_coins[amountOfChange - coins[i]] + 1;
          last_coin[amountOfChange] = coins[i];
        }
      }
    }
  }
  let tempChange = change;
  let res = {
    // work as a map
    1: 0,
    2: 0,
    5: 0,
    10: 0,
    200: 0,
    500: 0,
  };
  let _tempChange;
  while (tempChange > 0) {
    for (_tempChange = tempChange; _tempChange > 0; ) {
      if (
        last_coin[_tempChange] > 0 &&
        availableCoinsInMachine[last_coin[_tempChange]] > 0
      ) {
        res[last_coin[_tempChange]]++;
        availableCoinsInMachine[last_coin[_tempChange]]--;
        tempChange -= last_coin[_tempChange];
        _tempChange = tempChange;
        break;
      } else {
        _tempChange--;
      }
    }
    if (tempChange > 0 && _tempChange <= 0) {
      //check if we reach the end of array and the change still not reach zero
      return -1;
    }
  }
  if (tempChange > 0) {
    //to make sure that the change reach zero
    return -1;
  }
}
const stringCoin = [
  Denomination.tenCent,
  Denomination.twentyCent,
  Denomination.fiftyCent,
  Denomination.oneDollar,
  Denomination.twentyDollar,
  Denomination.fiftyDollar,
];
function getChangeForCash(amount: number, itemNumber: number) {
  let itemNumberValidate;
  if (itemNumber === 0) {
    //to check if this function call from reset [user press ESC] or not
    itemNumberValidate = 0;
  } else {
    itemNumberValidate = globalVariable.prices()[itemNumber - 1];
  }
  let change = amount - itemNumberValidate;
  change = toFixed(change, 2);
  globalVariable.change = toFixed(change, 2); //assign current change to globalVar change
  change *= 10;
  let min_coins = []; //to track minimum coins needed
  let last_coin = []; // to store last [minimum number of coin] type
  min_coins[0] = 0; // base case --> minimum number of coin == 0 at first(to get 0 change)
  for (let amountOfChange = 1; amountOfChange <= change; ++amountOfChange) {
    min_coins[amountOfChange] = Number.MAX_VALUE; //initial to compare [to get minimum]
    last_coin[amountOfChange] = -1;
    for (let i = 0; i < coins.length; i++) {
      if (amountOfChange - coins[i] >= 0) {
        if (
          min_coins[amountOfChange - coins[i]] + 1 <
            min_coins[amountOfChange] &&
          min_coins[amountOfChange - coins[i]] + 1 <=
            globalVariable.coins[i].getAmount
        ) {
          min_coins[amountOfChange] = min_coins[amountOfChange - coins[i]] + 1;
          last_coin[amountOfChange] = coins[i];
        }
      }
    }
  }
  let tempChange = change;
  let res = {
    // work as a map
    1: 0,
    2: 0,
    5: 0,
    10: 0,
    200: 0,
    500: 0,
  };
  let _tempChange;
  while (tempChange > 0) {
    for (_tempChange = tempChange; _tempChange > 0; ) {
      if (last_coin[_tempChange] > 0) {
        res[last_coin[_tempChange]]++;
        tempChange -= last_coin[_tempChange];
        break;
      } else {
        _tempChange--;
      }
    }
  }
  let i = 0;
  let changeString = ``;
  for (const item in res) {
    if (res[item] > 0) {
      updateMachineCash(stringCoin[i], -res[item]);
      if (Number(item) <= 5) {
        changeString += `[${res[item]}x${Number(item) * 10}cent] + `;
      } else {
        changeString += `[${res[item]}x${Number(item) / 10}$] + `;
      }
    }
    i++;
  }
  globalVariable.stringChange = changeString.substring(
    0,
    changeString.length - 2
  );
  if (globalVariable.stringChange.length === 0) {
    globalVariable.stringChange = "[0$]";
  }
}
function getChangeForCredit(amount: number, itemNumber: number) {
  let itemNumberValidate; //to check if this function call from reset [user press ESC] or not
  if (itemNumber === 0) {
    itemNumberValidate = 0;
  } else {
    itemNumberValidate = globalVariable.prices()[itemNumber - 1];
  }
  amount -= itemNumberValidate;
  amount = toFixed(amount, 2);
  globalVariable.change = amount;
  globalVariable.stringChange = `[${toFixed(amount, 2)}$]`;
}
function reset() {
  if (globalVariable.totalAmountOfInsertedCoins > 0) {
    if (globalVariable.typeOfPayment === 1) {
      getChangeForCash(globalVariable.totalAmountOfInsertedCoins, 0);
    } else {
      getChangeForCredit(globalVariable.totalAmountOfInsertedCoins, 0);
    }
    domElement.changeArea.innerHTML = globalVariable.stringChange;
  }
  setTimeout(() => {
    domElement.changeArea.innerHTML = "";
  }, 2500);
  globalVariable.totalAmountOfInsertedCoins = 0;
  globalVariable.selectedProduct = "";
  globalVariable.change = 0;
  globalVariable.stringChange = ``;
  enableCash();
  enableCredit();
  hideCredit();
  new SnackVendingMachine();
}
//update all number of item left after dispensing
function update() {
  let i = 0;
  domElement.itemLeft.forEach((item) => {
    item.innerHTML = globalVariable.numberOfItemsLeft[i];
    if (globalVariable.numberOfItemsLeft[i] == 0) {
      item.parentElement.parentElement.parentElement.firstElementChild.classList.add(
        "empty"
      );
    } else {
      item.parentElement.parentElement.parentElement.firstElementChild.classList.remove(
        "empty"
      );
    }
    i++;
  });
}
function disableCash() {
  domElement.denomination.classList.add("disable");
  domElement.note.classList.add("disable");
}
function enableCash() {
  domElement.denomination.classList.remove("disable");
  domElement.note.classList.remove("disable");
}

function disableCredit() {
  domElement.creditSVG.classList.add("disable");
}
function enableCredit() {
  domElement.creditSVG.classList.remove("disable");
}
function hideCredit() {
  domElement.creditSVG.classList.remove("when-credit-clicked-img");
  domElement.creditInput.classList.remove("when-credit-clicked-input");
  domElement.creditButton.classList.remove("when-credit-clicked-button");
  domElement.insertionArea.classList.remove("move-insertion-area");
}
function toFixed(number: number, to: number) {
  return Number(number.toFixed(to));
}
function addToLogs(logsContent) {
  let newContent = document.createElement("div");
  newContent.id = "logs-content-row";
  newContent.innerHTML = logsContent;
  domElement.logsContainer.appendChild(newContent);
}
export {
  fillItemLeft,
  updateMachineCash,
  getChangeForCash,
  getChangeForCredit,
  reset,
  update,
  disableCash,
  enableCash,
  disableCredit,
  enableCredit,
  hideCredit,
  toFixed,
  isThereAnyCoinChangeInMachine,
  addToLogs,
};
