class Coin {
  _denomination: string;
  _amount: number;
  constructor(_denomination, _amount) {
    this._denomination = _denomination;
    this._amount = _amount;
  }
  set setAmount(amount: number) {
    this._amount = amount;
  }
  get getDenomination() {
    return this._denomination;
  }
  get getAmount() {
    return this._amount;
  }
}
export { Coin };
