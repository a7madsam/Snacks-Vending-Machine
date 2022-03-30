import { domElement, globalVariable } from "./variabels.js";
import { SnackVendingMachineState } from "./SnackVendingMachineState.js";
import { SnackVendingMachine } from "./SnackVendingMachine.js";
import * as utilities from "./utilities.js";
class HasMoneyState implements SnackVendingMachineState {
  snackVendingMachine: SnackVendingMachine;
  constructor(snackVendingMachine: SnackVendingMachine) {
    this.snackVendingMachine = snackVendingMachine;
  }
  selectItemAndInsertMoney() {
    domElement.screenPanel.innerHTML =
      "Sorry, you cannot select item or insert Money, Snacks Vending Machine already dispensing item";
      utilities.addToLogs(domElement.screenPanel.innerHTML);
  }
  ejectMoney(): void {
    domElement.screenPanel.innerHTML =
      "Sorry, you cannot eject Money, Snacks Vending Machine already dispensing item";
      utilities.addToLogs(domElement.screenPanel.innerHTML);
  }
  dispenseItem(): void {
    globalVariable.numberOfItemsLeft[
      Number(globalVariable.selectedProduct) - 1
    ]--;
    utilities.update();
    globalVariable.totalAmountOfInsertedCoins = 0;
    domElement.changeArea.innerHTML =
      globalVariable.stringChange +
      "=" +
      utilities.toFixed(globalVariable.change, 2) +
      "$";
      utilities.addToLogs(domElement.screenPanel.innerHTML);
    utilities.reset();
    this.snackVendingMachine.setState = this.snackVendingMachine.noMoneyState;
  }
}
export { HasMoneyState };
