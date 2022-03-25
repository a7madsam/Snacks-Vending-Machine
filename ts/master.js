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
    numberOfItemsLeft: function () {
        var arrayOfItemsLeft = [];
        domElement.itemLeft.forEach(function (item) {
            arrayOfItemsLeft.push(Number(item.innerHTML));
        });
        return arrayOfItemsLeft;
    }
};
function getChange(amount, itemNumber) {
    amount -= globalVariable.prices()[itemNumber - 1];
    var res = {
        change: 0,
        stringChange: ""
    };
    var domi = [50, 20, 1, 0.5, 0.2, 0.1];
    domi.forEach(function (item) {
        var numberOfItem = 0;
        var totalOfItem = 0;
        while (amount >= item) {
            numberOfItem++;
            totalOfItem += item;
        }
        res.change += totalOfItem;
        if (numberOfItem > 0)
            res.stringChange += "[".concat(numberOfItem, " x ").concat(item, "$] + ");
    });
    globalVariable.change = res.change;
    globalVariable.stringChange = res.stringChange;
}
function reset() {
    if (globalVariable.totalAmountOfInsertedCoins > 0) {
        domElement.changeArea.innerHTML =
            globalVariable.totalAmountOfInsertedCoins.toString() + "$";
    }
    setTimeout(function () {
        domElement.changeArea.innerHTML = "";
    }, 2000);
    globalVariable.totalAmountOfInsertedCoins = 0;
    globalVariable.selectedProduct = "";
    globalVariable.change = 0;
    globalVariable.stringChange = "";
    enableCash();
    enableCredit();
    hideCredit();
    domElement.screenPanel.innerHTML = "Ejecting...";
    setTimeout(function () {
        new SnackVendingMachine();
    }, 1500);
}
function update() {
    var i = 0;
    domElement.itemLeft.forEach(function (item) {
        item.innerHTML = globalVariable.numberOfItemsLeft()[i];
        if (globalVariable.numberOfItemsLeft()[i] == 0) {
            item.parentElement.parentElement.parentElement.firstElementChild.classList.add("empty");
        }
        else {
            item.parentElement.parentElement.parentElement.firstElementChild.classList.remove("empty");
        }
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
        getChange(globalVariable.totalAmountOfInsertedCoins, Number(globalVariable.selectedProduct));
        domElement.screenPanel.innerHTML = "You inserted ".concat(globalVariable.totalAmountOfInsertedCoins, "$ and selected [").concat(globalVariable.selectedProduct, ":").concat(globalVariable.prices()[Number(globalVariable.selectedProduct) - 1], "]</br>Your change: ").concat(globalVariable.stringChange);
        this.snackVendingMachine.setState = this.snackVendingMachine.SoldState;
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
        globalVariable.numberOfItemsLeft()[Number(globalVariable.selectedProduct) - 1]--;
        update();
        this.snackVendingMachine.setState = this.snackVendingMachine.noMoneyState;
        setTimeout(reset, 1500);
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
//begin vending machine
var startVendingMachine = new SnackVendingMachine();
function sumInsertedCoin(event) {
    if (startVendingMachine.getState instanceof NoMoneyState) {
        globalVariable.totalAmountOfInsertedCoins += Number(event.target.getAttribute("data-money"));
        domElement.screenPanel.innerHTML = "You insert ".concat(globalVariable.totalAmountOfInsertedCoins.toFixed(1), "$, please select item to buy or ESC to cancel");
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
    console.log(tempCreditInput.length);
    if (tempCreditInput.length > 0) {
        globalVariable.totalAmountOfInsertedCoins += Number(tempCreditInput);
        domElement.screenPanel.innerHTML = "You insert ".concat(globalVariable.totalAmountOfInsertedCoins.toFixed(1), "$, please select item to buy or ESC to cancel");
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
        return;
    }
    if (!itemNumberInserted) {
        domElement.screenPanel.innerHTML = "Please select item to buy or ESC to cancel";
        return;
    }
    if (!itemNumberTrue) {
        console.log("reach");
        domElement.screenPanel.innerHTML = "Wrong item number";
        globalVariable.selectedProduct = "";
        setTimeout(function () {
            domElement.screenPanel.innerHTML = "";
        }, 1000);
        return;
    }
    //validate if totalAmountOfInsertedCoins >= price of selected item
    if (globalVariable.totalAmountOfInsertedCoins -
        globalVariable.prices()[Number(globalVariable.selectedProduct) - 1] >=
        0) {
        validatePrices = true;
    }
    if (!validatePrices) {
        domElement.screenPanel.innerHTML = "your inserted money is not enough for buy selected item so insert ".concat(globalVariable.prices()[Number(globalVariable.selectedProduct) - 1] -
            globalVariable.totalAmountOfInsertedCoins, " or more to buy it or ESC to cancel");
        return;
    }
    if (moneyInserted && itemNumberInserted && itemNumberTrue && validatePrices) {
        startVendingMachine.getState.selectItemAndInsertMoney();
        startVendingMachine.getState.dispenseItem();
    }
}
domElement.acceptInputItemBtn.addEventListener("click", collectCashAndAcceptItem);
