import { NoMoneyState } from "./NoMoneyState.js";
import { HasMoneyState } from "./HasMoneyState.js";
//SnackVendingMachine main class to maintains states
class SnackVendingMachine {
    noMoneyState;
    hasMoneyState;
    currentState;
    constructor() {
        this.noMoneyState = new NoMoneyState(this);
        this.hasMoneyState = new HasMoneyState(this);
        this.currentState = this.noMoneyState;
    }
    get NoMoneyState() {
        return this.noMoneyState;
    }
    get HasMoneyState() {
        return this.hasMoneyState;
    }
    set setState(state) {
        this.currentState = state;
    }
    get getState() {
        return this.currentState;
    }
}
export { SnackVendingMachine };
