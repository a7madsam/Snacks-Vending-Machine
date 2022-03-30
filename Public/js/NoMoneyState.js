import { domElement, globalVariable } from "./variabels.js";
import { PaymentType } from "./PaymentType_enum.js";
import * as utilities from "./utilities.js";
class NoMoneyState {
    snackVendingMachine;
    constructor(snackVendingMachine) {
        this.snackVendingMachine = snackVendingMachine;
        domElement.screenPanel.innerHTML = `Please enter item number or insert your card or coins`;
    }
    selectItemAndInsertMoney() {
        this.snackVendingMachine.setState = this.snackVendingMachine.hasMoneyState;
        if (globalVariable.typeOfPayment == PaymentType.creditPayment) {
            utilities.getChangeForCredit(globalVariable.totalAmountOfInsertedCoins, Number(globalVariable.selectedProduct));
        }
        else {
            if (globalVariable.stringChange.length === 0) {
                utilities.getChangeForCash(globalVariable.totalAmountOfInsertedCoins, Number(globalVariable.selectedProduct));
            }
        }
        domElement.screenPanel.innerHTML = `You inserted ${utilities.toFixed(globalVariable.totalAmountOfInsertedCoins, 2)}$ and selected [${globalVariable.selectedProduct}:${globalVariable.prices()[Number(globalVariable.selectedProduct) - 1]}], Your change: ${globalVariable.stringChange} <br>In process...`;
        utilities.addToLogs(domElement.screenPanel.innerHTML);
    }
    dispenseItem() {
        domElement.screenPanel.innerHTML = `Snacks Vending Machine cannot dispense item because money is not inserted or item is not selected...`;
        utilities.addToLogs(domElement.screenPanel.innerHTML);
    }
    ejectMoney() {
        domElement.screenPanel.innerHTML =
            "Snacks Vending Machine cannot eject Money because there is no money inserted...";
        utilities.addToLogs(domElement.screenPanel.innerHTML);
    }
}
export { NoMoneyState };
