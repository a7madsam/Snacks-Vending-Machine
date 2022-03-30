export let domElement = {
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
    changeArea: document.querySelector(".change-area"),
    logsContainer: document.getElementById("logs-content"),
    ShowLogsButton: document.getElementById("show-log"),
    HideLogsButtom: document.getElementById("hide-log"),
};
export let globalVariable = {
    totalAmountOfInsertedCoins: 0,
    selectedProduct: "",
    change: 0,
    stringChange: ``,
    prices: function () {
        let arrayOfPrices = [];
        domElement.pricesOfItems.forEach((item) => {
            arrayOfPrices.push(Number(item.innerHTML.substring(0, item.innerHTML.length - 1)));
        });
        return arrayOfPrices;
    },
    numberOfItemsLeft: [],
    coins: [],
    typeOfPayment: 0,
    machineLogs: [],
};
