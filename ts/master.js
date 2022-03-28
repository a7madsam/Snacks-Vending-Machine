var domElement = {
    screenPanel: document.querySelector(".control-panel .screen-panel"),
    pricesOfItems: document.querySelectorAll(".items .price"),
    itemLeft: document.querySelectorAll(".items .left span"),
    denomination: document.querySelector(".coin-slots .cash .denominations"),
    tenCent: document.querySelector(".coin-slots .cash ._10cent"),
    twentyCent: document.querySelector(".coin-slots .cash ._20cent"),
    fiftyCent: document.querySelector(".coin-slots .cash ._50cent"),
    oneDollar: document.querySelector(".coin-slots .cash ._1dolar"),
    note: document.querySelector(".coin-slots .cash .notes"),
    twentyDollar: document.querySelector(".coin-slots .cash ._20dolar"),
    fiftyDollar: document.querySelector(".coin-slots .cash ._50dolar"),
    creditSVG: document.querySelector(".credit img"),
    creditInput: document.getElementById("credit-amount"),
    creditButton: document.querySelector(".credit button"),
    insertionArea: document.querySelector(".insertion-area"),
    insertionAreaDeleteButton: document.querySelector(".insertion-area .delete"),
    acceptInputItemBtn: document.querySelector(".control-panel .ok button"),
    changeArea: document.querySelector(".change-area")
};
var globalVariable = {
    totalAmountOfInsertedCoins: 0,
    selectedProduct: "",
    change: 0,
    stringChange: "",
    prices: function () {
        var arrayOfPrices = [];
        domElement.pricesOfItems.forEach(function (item) {
            arrayOfPrices.push(Number(item.innerHTML.substring(0, item.innerHTML.length - 1)));
        });
        return arrayOfPrices;
    },
    numberOfItemsLeft: [],
    coins: [],
    typeOfPayment: 0
};
//state class implementation
var NoMoneyState = /** @class */ (function () {
    function NoMoneyState(snackVendingMachine) {
        this.snackVendingMachine = snackVendingMachine;
        domElement.screenPanel.innerHTML = "Welcome at Snacks Vending Machine";
        setTimeout(function () {
            domElement.screenPanel.innerHTML = "Please enter item number or insert your card or coins";
        }, 2000);
    }
    NoMoneyState.prototype.selectItemAndInsertMoney = function () {
        this.snackVendingMachine.setState = this.snackVendingMachine.SoldState;
        if (globalVariable.typeOfPayment == 2) {
            getChangeForCredit(globalVariable.totalAmountOfInsertedCoins, Number(globalVariable.selectedProduct));
        }
        else {
            getChangeForCash(globalVariable.totalAmountOfInsertedCoins, Number(globalVariable.selectedProduct));
        }
        domElement.screenPanel.innerHTML = "You inserted ".concat(globalVariable.totalAmountOfInsertedCoins, "$ and selected [").concat(globalVariable.selectedProduct, ":").concat(globalVariable.prices()[Number(globalVariable.selectedProduct) - 1], "], Your change: ").concat(globalVariable.stringChange, " <br>In process...");
        console.log(domElement.screenPanel.innerHTML);
    };
    NoMoneyState.prototype.dispenseItem = function () {
        domElement.screenPanel.innerHTML = "Snacks Vending Machine cannot dispense item because money is not inserted or item is not selected...";
    };
    NoMoneyState.prototype.ejectMoney = function () {
        domElement.screenPanel.innerHTML =
            "Snacks Vending Machine cannot eject Money because there is no money inserted...";
    };
    return NoMoneyState;
}());
var SoldState = /** @class */ (function () {
    function SoldState(snackVendingMachine) {
        this.snackVendingMachine = snackVendingMachine;
    }
    SoldState.prototype.selectItemAndInsertMoney = function () {
        domElement.screenPanel.innerHTML =
            "Sorry, you cannot select item or insert Money, Snacks Vending Machine already dispensing item";
    };
    SoldState.prototype.ejectMoney = function () {
        domElement.screenPanel.innerHTML =
            "Sorry, you cannot eject Money, Snacks Vending Machine already dispensing item";
    };
    SoldState.prototype.dispenseItem = function () {
        domElement.screenPanel.innerHTML = "In process...";
        globalVariable.numberOfItemsLeft[Number(globalVariable.selectedProduct) - 1]--;
        update();
        globalVariable.totalAmountOfInsertedCoins = 0;
        domElement.changeArea.innerHTML =
            globalVariable.stringChange +
                "=" +
                globalVariable.change.toFixed(2) +
                "$";
        setTimeout(reset, 2500);
        this.snackVendingMachine.setState = this.snackVendingMachine.noMoneyState;
    };
    return SoldState;
}());
//SnackVendingMachine main class to maintains states
var SnackVendingMachine = /** @class */ (function () {
    function SnackVendingMachine() {
        this.noMoneyState = new NoMoneyState(this);
        this.soldState = new SoldState(this);
        this.currentState = this.noMoneyState;
    }
    Object.defineProperty(SnackVendingMachine.prototype, "NoMoneyState", {
        get: function () {
            return this.noMoneyState;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SnackVendingMachine.prototype, "SoldState", {
        get: function () {
            return this.soldState;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SnackVendingMachine.prototype, "setState", {
        set: function (state) {
            this.currentState = state;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SnackVendingMachine.prototype, "getState", {
        get: function () {
            return this.currentState;
        },
        enumerable: false,
        configurable: true
    });
    return SnackVendingMachine;
}());
var Coin = /** @class */ (function () {
    function Coin(_denomination, _amount) {
        this._denomination = _denomination;
        this._amount = _amount;
    }
    Object.defineProperty(Coin.prototype, "setAmount", {
        set: function (amount) {
            this._amount = amount;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Coin.prototype, "getDenomination", {
        get: function () {
            return this._denomination;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Coin.prototype, "getAmount", {
        get: function () {
            return this._amount;
        },
        enumerable: false,
        configurable: true
    });
    return Coin;
}());
//Initial denomination coins
globalVariable.coins.push(new Coin("_10cent", 1000), new Coin("_20cent", 500), new Coin("_50cent", 200), new Coin("_1dollar", 100), new Coin("_20dollar", 5), new Coin("_50dollar", 2));
//Initial the number of left for each item
function fillItemLeft() {
    domElement.itemLeft.forEach(function (item) {
        globalVariable.numberOfItemsLeft.push(Number(item.innerHTML));
    });
}
fillItemLeft();
//increase or decrease the amount of cash in machine
function cashOnMachine(targetCoin, amount) {
    if (typeof targetCoin === "string") {
        for (var i = 0; i < globalVariable.coins.length; i++) {
            if (globalVariable.coins[i].getDenomination === targetCoin) {
                globalVariable.coins[i].setAmount =
                    globalVariable.coins[i].getAmount + amount;
            }
        }
    }
    else {
        for (var i = 0; i < globalVariable.coins.length; i++) {
            if (globalVariable.coins[i].getDenomination === targetCoin.className) {
                globalVariable.coins[i].setAmount =
                    globalVariable.coins[i].getAmount + amount;
            }
        }
    }
}
function getChangeForCash(amount, itemNumber) {
    var coins = [500, 200, 10, 5, 2, 1]; //multiplied by 10 to convert coins to get rid of any fraction
    var stringCoin = [
        "_10cent",
        "_20cent",
        "_50cent",
        "_1dollar",
        "_20dollar",
        "_50dollar",
    ];
    var itemNumberValidate;
    if (itemNumber === 0) {
        itemNumberValidate = 0;
    }
    else {
        itemNumberValidate = globalVariable.prices()[itemNumber - 1];
    }
    var change = amount - itemNumberValidate;
    change = Number(change.toFixed(2));
    globalVariable.change = Number(change.toFixed(2));
    change *= 10;
    var min_coins = []; //to track minimum coins needed
    var last_coin = []; // to store last [minimum number of coin] type
    min_coins[0] = 0; // base case --> minimum number of coin == 0 at first(to get 0 change)
    for (var k = 1; k <= change; ++k) {
        min_coins[k] = Number.MAX_VALUE; //initial to compare [to get minimum]
        for (var i_1 = 0; i_1 < coins.length; i_1++) {
            if (k - coins[i_1] >= 0 &&
                globalVariable.coins[coins.length - i_1 - 1].getAmount > 0) {
                if (min_coins[k - coins[i_1]] + 1 < min_coins[k] &&
                    min_coins[k - coins[i_1]] + 1 <=
                        globalVariable.coins[coins.length - i_1 - 1].getAmount) {
                    min_coins[k] = min_coins[k - coins[i_1]] + 1;
                    last_coin[k] = coins[i_1];
                }
            }
        }
    }
    var temp = change;
    var res = {
        // work as a map
        1: 0,
        2: 0,
        5: 0,
        10: 0,
        200: 0,
        500: 0
    };
    while (temp > 0) {
        res[last_coin[temp]]++;
        temp -= last_coin[temp];
    }
    var i = 0;
    var changeString = "";
    for (var item in res) {
        if (res[item] > 0) {
            cashOnMachine(stringCoin[i], -res[item]);
            if (Number(item) <= 5) {
                changeString += "[".concat(res[item], "x").concat(Number(item) * 10, "cent] + ");
            }
            else {
                changeString += "[".concat(res[item], "x").concat(Number(item) / 10, "$] + ");
            }
        }
        i++;
    }
    globalVariable.stringChange = changeString.substring(0, changeString.length - 2);
}
function getChangeForCredit(amount, itemNumber) {
    var itemNumberValidate;
    if (itemNumber === 0) {
        itemNumberValidate = 0;
    }
    else {
        itemNumberValidate = globalVariable.prices()[itemNumber - 1];
    }
    amount -= itemNumberValidate;
    amount = Number(amount.toFixed(2));
    globalVariable.change = amount;
    globalVariable.stringChange = "[".concat(amount.toFixed(1), "$]");
}
function reset() {
    if (globalVariable.totalAmountOfInsertedCoins > 0) {
        if (globalVariable.typeOfPayment === 1) {
            getChangeForCash(globalVariable.totalAmountOfInsertedCoins, 0);
        }
        else {
            getChangeForCredit(globalVariable.totalAmountOfInsertedCoins, 0);
        }
        domElement.changeArea.innerHTML = globalVariable.stringChange;
    }
    setTimeout(function () {
        domElement.changeArea.innerHTML = "";
    }, 2500);
    globalVariable.totalAmountOfInsertedCoins = 0;
    globalVariable.selectedProduct = "";
    globalVariable.change = 0;
    globalVariable.stringChange = "";
    enableCash();
    enableCredit();
    hideCredit();
    new SnackVendingMachine();
}
//update all number of item left after dispensing
function update() {
    var i = 0;
    domElement.itemLeft.forEach(function (item) {
        item.innerHTML = globalVariable.numberOfItemsLeft[i];
        if (globalVariable.numberOfItemsLeft[i] == 0) {
            item.parentElement.parentElement.parentElement.firstElementChild.classList.add("empty");
        }
        else {
            item.parentElement.parentElement.parentElement.firstElementChild.classList.remove("empty");
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
//begin vending machine
var startVendingMachine = new SnackVendingMachine();
function sumInsertedCoin(event) {
    if (startVendingMachine.getState instanceof NoMoneyState) {
        globalVariable.typeOfPayment = 1;
        globalVariable.totalAmountOfInsertedCoins += Number(Number(event.target.getAttribute("data-money")).toFixed(1));
        cashOnMachine(event.target, 1);
        domElement.screenPanel.innerHTML = "You insert ".concat(globalVariable.totalAmountOfInsertedCoins.toFixed(2), "$, please select item to buy or ESC to cancel");
        disableCredit();
    }
    else {
        startVendingMachine.getState.selectItemAndInsertMoney();
    }
}
function getItemNumber(event) {
    var btn = event.target;
    if (btn.innerHTML == "ESC") {
        if (startVendingMachine.getState instanceof NoMoneyState) {
            reset();
        }
        else {
            startVendingMachine.getState.ejectMoney();
        }
    }
    else if (btn.id !== "delete") {
        if (startVendingMachine.getState instanceof NoMoneyState) {
            hideCredit();
            if (globalVariable.selectedProduct.length < 2) {
                globalVariable.selectedProduct += btn.innerHTML;
                domElement.screenPanel.innerHTML = globalVariable.selectedProduct;
            }
        }
        else {
            startVendingMachine.getState.selectItemAndInsertMoney();
        }
    }
}
function showCredit() {
    if (startVendingMachine.getState instanceof NoMoneyState) {
        globalVariable.typeOfPayment = 2;
        domElement.creditSVG.classList.add("when-credit-clicked-img");
        domElement.creditInput.classList.add("when-credit-clicked-input");
        domElement.creditButton.classList.add("when-credit-clicked-button");
        domElement.insertionArea.classList.add("move-insertion-area");
        disableCash();
    }
    else {
        startVendingMachine.getState.selectItemAndInsertMoney();
    }
}
function hideCredit() {
    domElement.creditSVG.classList.remove("when-credit-clicked-img");
    domElement.creditInput.classList.remove("when-credit-clicked-input");
    domElement.creditButton.classList.remove("when-credit-clicked-button");
    domElement.insertionArea.classList.remove("move-insertion-area");
}
domElement.denomination.addEventListener("click", sumInsertedCoin);
domElement.note.addEventListener("click", sumInsertedCoin);
domElement.creditSVG.addEventListener("click", showCredit);
domElement.insertionArea.addEventListener("click", getItemNumber);
domElement.insertionAreaDeleteButton.addEventListener("click", function () {
    var flag = false;
    if (globalVariable.selectedProduct.length <= 0) {
        flag = true;
    }
    var newString = globalVariable.selectedProduct.substring(0, globalVariable.selectedProduct.length - 1);
    globalVariable.selectedProduct = newString;
    if (!flag)
        domElement.screenPanel.innerHTML = newString;
});
domElement.creditButton.addEventListener("click", function () {
    var tempCreditInput = domElement.creditInput.value;
    domElement.creditInput.value = "";
    if (tempCreditInput.length > 0) {
        globalVariable.totalAmountOfInsertedCoins += Number(tempCreditInput);
        domElement.screenPanel.innerHTML = "You insert ".concat(globalVariable.totalAmountOfInsertedCoins.toFixed(2), "$, please select item to buy or ESC to cancel");
        hideCredit();
        disableCredit();
    }
    else {
        domElement.creditInput.classList.add("empty-input");
    }
});
function collectCashAndAcceptItem() {
    var moneyInserted = false;
    var itemNumberInserted = false;
    var itemNumberTrue = false;
    var validatePrices = false;
    var itemSoldOut = true;
    //check if money inserted
    if (globalVariable.totalAmountOfInsertedCoins > 0) {
        moneyInserted = true;
    }
    //validate item number
    if (globalVariable.selectedProduct.length > 0) {
        itemNumberInserted = true;
    }
    if (Number(globalVariable.selectedProduct) >= 1 &&
        Number(globalVariable.selectedProduct) <= 25) {
        itemNumberTrue = true;
    }
    if (!moneyInserted) {
        domElement.screenPanel.innerHTML = "Please insert Money to complete Process or ESC to cancel";
        if (Number(globalVariable.selectedProduct) < 1 ||
            Number(globalVariable.selectedProduct) > 25) {
            globalVariable.selectedProduct = "";
        }
        return;
    }
    if (!itemNumberInserted) {
        domElement.screenPanel.innerHTML = "Please select correct item number to buy or ESC to cancel";
        return;
    }
    if (!itemNumberTrue) {
        domElement.screenPanel.innerHTML = "Wrong item number";
        globalVariable.selectedProduct = "";
        setTimeout(function () {
            domElement.screenPanel.innerHTML = "";
        }, 1000);
        return;
    }
    //check if item is not soldOut
    if (globalVariable.numberOfItemsLeft[Number(globalVariable.selectedProduct) - 1] > 0) {
        itemSoldOut = false;
    }
    if (itemSoldOut) {
        domElement.screenPanel.innerHTML = "Sorry, item #".concat(globalVariable.selectedProduct, " sold out,please select another item or ESC to cancel");
        globalVariable.selectedProduct = "";
        return;
    }
    //validate if totalAmountOfInsertedCoins >= price of selected item
    if (globalVariable.totalAmountOfInsertedCoins -
        globalVariable.prices()[Number(globalVariable.selectedProduct) - 1] >=
        0) {
        validatePrices = true;
    }
    if (!validatePrices) {
        domElement.screenPanel.innerHTML = "your inserted money is not enough to buy selected item so insert ".concat((globalVariable.prices()[Number(globalVariable.selectedProduct) - 1] -
            globalVariable.totalAmountOfInsertedCoins).toFixed(2), " or more to buy it or ESC to cancel");
        return;
    }
    if (moneyInserted &&
        itemNumberInserted &&
        itemNumberTrue &&
        validatePrices &&
        !itemSoldOut) {
        startVendingMachine.getState.selectItemAndInsertMoney();
        setTimeout(function () {
            startVendingMachine.getState.dispenseItem();
        }, 3500);
    }
}
domElement.acceptInputItemBtn.addEventListener("click", collectCashAndAcceptItem);
