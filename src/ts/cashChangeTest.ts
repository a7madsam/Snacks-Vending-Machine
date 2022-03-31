import { domElement, globalVariable } from "./variabels.js";
import * as utilities from "./utilities.js";
import { Coin } from "./coins.js";
import { Denomination } from "./Denomination_enum.js";

export function testMachine() {
  testWhenTheMachineHaveZeroCoinChange();
  testWhenTheMachineHaveCoinChange();
}
function makeCoinChangeZero() {
  globalVariable.coins = [
    new Coin(Denomination.tenCent, 0),
    new Coin(Denomination.twentyCent, 0),
    new Coin(Denomination.fiftyCent, 0),
    new Coin(Denomination.oneDollar, 0),
    new Coin(Denomination.twentyDollar, 0),
    new Coin(Denomination.fiftyDollar, 0),
  ];
}
function makeCoinChangeDefault() {
  globalVariable.coins = [
    new Coin(Denomination.tenCent, 1000),
    new Coin(Denomination.twentyCent, 500),
    new Coin(Denomination.fiftyCent, 200),
    new Coin(Denomination.oneDollar, 100),
    new Coin(Denomination.twentyDollar, 5),
    new Coin(Denomination.fiftyDollar, 2),
  ];
}
function testWhenTheMachineHaveZeroCoinChange() {
  makeCoinChangeZero();
  //first test
  /*
    Customer entered [1$,50cent,20cent,10cent] = 1.8$
    chose item [5:prise = 1.6$]
  */
  utilities.updateMachineCash(Denomination.oneDollar, 1);
  utilities.updateMachineCash(Denomination.fiftyCent, 1);
  utilities.updateMachineCash(Denomination.twentyCent, 1);
  utilities.updateMachineCash(Denomination.tenCent, 1);

  let expect: string | number = "[1x20cent]";
  let actual: string | number = utilities.isThereAnyCoinChangeInMachine(1.8, 5);
  if (actual === expect) {
    console.log("test [1] --> passed");
  } else {
    throw new Error("test [1] --> notPassed");
  }
  makeCoinChangeZero();
  //second test
  /*
    Customer entered [1$,50cent,20cent,(3)10cent] = 2$
    chose item [5:prise = 1.6$]
  */
  utilities.updateMachineCash(Denomination.oneDollar, 1);
  utilities.updateMachineCash(Denomination.fiftyCent, 1);
  utilities.updateMachineCash(Denomination.twentyCent, 1);
  utilities.updateMachineCash(Denomination.tenCent, 3);
  expect = "[2x10cent] + [1x20cent]";
  actual = utilities.isThereAnyCoinChangeInMachine(2, 5);
  if (expect === actual) {
    console.log("test [2] --> passed");
  } else {
    throw new Error("test [2] --> notPassed");
  }
  makeCoinChangeZero();
  //third test
  /*
    Customer entered [(3)1$] = 3$
    chose item [2:prise = 2.20$]
  */
  utilities.updateMachineCash(Denomination.oneDollar, 3);
  expect = -1;
  actual = utilities.isThereAnyCoinChangeInMachine(3, 2);
  if (actual === expect) {
    console.log("test [3] --> passed");
  } else {
    throw new Error("test [3] --> notPassed");
  }
}
function testWhenTheMachineHaveCoinChange() {
  makeCoinChangeDefault();
  //first test
  /*
    Customer entered [(3)1$,50cent,20cent] = 3.7$
    chose item [22: price 2.6$]
  */
  utilities.updateMachineCash(Denomination.fiftyCent, 1);
  utilities.updateMachineCash(Denomination.twentyCent, 1);
  utilities.updateMachineCash(Denomination.oneDollar, 3);
  let expect: string | number = "[1x10cent] + [1x1$]";
  let actual: string | number = utilities.isThereAnyCoinChangeInMachine(
    3.7,
    22
  );
  if (actual === expect) {
    console.log("test [4] --> passed");
  } else {
    throw new Error("test [4] --> notPassed");
  }
  //second test
  /*
    Customer entered [20$,1$,50cent] = 21.5$
    chose item [12: price 2$]
  */
  utilities.updateMachineCash(Denomination.fiftyCent, 1);
  utilities.updateMachineCash(Denomination.twentyCent, 1);
  utilities.updateMachineCash(Denomination.oneDollar, 3);
  expect = "[1x50cent] + [19x1$]";
  actual = utilities.isThereAnyCoinChangeInMachine(21.5, 12);
  if (actual === expect) {
    console.log("test [5] --> passed");
  } else {
    throw new Error("test [5] --> notPassed");
  }
}
