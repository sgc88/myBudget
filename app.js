console.log("hello world");
var budgetController = (function(){
  //some code here
})();

var UIController = (function(){

  var DOMstring ={
    inputType:".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn"
  }
  return {
    getinput :function(){
      return {
        type:document.querySelector(DOMstring.inputType).value,
        description: document.querySelector(DOMstring.inputDescription).value,
        value: document.querySelector(DOMstring.inputValue).value
      }

    },
    getDOMstring: function(){
      return DOMstring;
    }
  }




})();


var controller  = (function(budgetCtrl, UICtrl){
  var setupEventListeners = function (){
      var DOM = UICtrl.getDOMstring();
      document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);
      document.addEventListener("keypress", function(event){
      if(event.keyCode === 13){
        ctrlAddItem();
      }
    });
  }

  var ctrlAddItem = function(){
    var input = UIController.getinput();
    console.log(input);
  }
  // var money = document.getElementById('amount').value;
  //1. get the filed input data
  //2 add the item to budget controller
  //3 add the item to the UI
  //4 calculate the budget
  //5 Display the budget on the UI

});

})(budgetController, UIController);
