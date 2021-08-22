App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  init: async function () {
    return App.initWeb3();
  },

  initWeb3: async function () {
    if ((typeof window.ethereum !== 'undefined') || (typeof window.web3 !== 'undefined')) {
      App.web3Provider = window.ethereum;
      web3 = new Web3(window.ethereum || window.web3.currentProvider);
    } else {
      App.web3Provider = new Web3(new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545'));
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function () {
    $.getJSON("Todo.json", function (todo) {
      App.contracts.Todo = TruffleContract(todo);
      App.contracts.Todo.setProvider(App.web3Provider);
      return App.render();
    })
  },

  checkExistInDelete: function (id) {
    console.log("id ", id)
    // App.contracts.Todo.deployed().then(function(instance){
    //   return instance.checkExistInDelete(id);
    // }).then(function(result){
    //   console.log("result ",result)
    //     // $('#content').hide();
    //     // $('#loader').show();
    // }).catch(function(err){
    //   console.log(err);
    // })
  },

  checking: function (id) {
    console.log(" id ", id);
    App.contracts.Todo.deployed().then(function (instance) {
      return instance.checkExistInDelete(id, { from: App.account });
    }).then(function (result) {
      console.log("result ", result)
    }).catch(function (err) {
      console.log("err ", err);
    })
  },
  render: function () {
    var todoInstance;
    var loader = $('#loader');
    var content = $('#content');
    loader.show();
    content.hide();
    //  Load Account Data
    //      IT IS THE ACCCOUNT THAT WE CONNECTED TO THE BLOCKCHAIN
    web3.eth.getCoinbase(function (err, account) {
      if (err == null) {
        App.account = account;
        $('#accountAddress').html('Your Account :- ' + account);
      }
    });
    // Load Contract Data
    App.contracts.Todo.deployed().then(function (instance) {
      todoInstance = instance;
      return todoInstance.todoCount();
    }).then(async (todoCount) => {
      var todoResults = $('#todoResults');
      todoResults.empty();
      var todoSelect = $('#todoSelect');
      todoSelect.empty();
      console.log("todoCount ", todoCount)
      for (var i = 1; i <= todoCount; i++) {
        
        todoInstance.todos(i).then(function (result) {
          console.log("result ",result);
          var id = result[0];
          var title = result[1];
          var description = result[2];
          console.log("id ", id, " title ", title, " description ", description)
          //     Render Candidate result
          // var todoTemplate = "<tr><th>" + id + "</th><td>" + title + "</td><td>" + description + "</td></tr>"
          var todoTemplate = "<button type='button' class='list-group-item list-group-item-action'>" +id +" "+ title +"</button>"

          todoResults.append(todoTemplate)
          // //      Render Todo ballot Option
          // var todoOption = "<option value '" + id + "'>" + description + "</option>";
          // todoSelect.append(todoOption)
       })

        // todoInstance.checkExistInDelete(i, { from: App.account }).then(function (result) {
        //   if (result.logs[0].args.returnValue) {
        //     todoInstance.todos(i).then(function (result) {
        //       console.log("result ",result);
        //       var id = result[0];
        //       var title = result[1];
        //       var description = result[2];
        //       console.log("id ", id, " title ", title, " description ", description)
        //       //     Render Candidate result
        //       var todoTemplate = "<tr><th>" + id + "</th><td>" + title + "</td><td>" + description + "</td></tr>"
        //       todoResults.append(todoTemplate)
        //       //      Render Todo ballot Option
        //       var todoOption = "<option value '" + id + "'>" + description + "</option>";
        //       todoSelect.append(todoOption)
        //    })
        //  }
        // }).catch(err => {
        //   console.log("error ", err)
        // })
        // App.checking(i);

      }
      loader.hide();
      content.show();
    })
  },



  addTodo: function () {
    var title = $("#title").val();
    // var description = $("#description").val();
    description=' ';
    App.contracts.Todo.deployed().then(function (instance) {
      console.log("App.Account ", title," description ",description);

      return instance.createTodo(title, description, { from: App.account });
    }).then(function (result) {
      console.log("result ", result)
      // $('#content').hide();
      // $('#loader').show();
    }).catch(function (err) {
      console.log(err);
    })
  }
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
