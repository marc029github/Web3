// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

contract Counter {
  uint public x;
  int private count;

  event Increment(uint by);

  constructor() {
    x = 0;
    count = 0;
  }

  function getCount() public view returns (int) {
    return count;
  }

  function incrementTotal() public {
    count++;
  }

  function decrement() public {
    count--;
  }

  function inc() public {
    x++;
    emit Increment(1);
  }

  function incBy(uint by) public {
    require(by > 0, "incBy: increment should be positive");
    x += by;
    emit Increment(by);
  }
}
