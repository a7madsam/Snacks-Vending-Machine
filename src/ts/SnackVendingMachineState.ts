//interface that explain the states of our VendingMachine
interface SnackVendingMachineState {
  selectItemAndInsertMoney(): void;
  ejectMoney(): void;
  dispenseItem(): void;
}
export { SnackVendingMachineState };
