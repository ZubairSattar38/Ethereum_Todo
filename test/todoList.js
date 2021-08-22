var Todo = artifacts.require("./Todo.sol");

contract("Todo",function(accounts){
    it("Todo List added", function() {
        return Todo.deployed().then(function(instance) {
          todoInstance = instance;
          return todoInstance.createTodo("Hello","World", { from: accounts[0] });
        }).then(function(receipt) {
            assert("Sussefull",receipt)
        })
      });
})