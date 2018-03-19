console.log("hello world");
var budgetController = (function(){
 var Expense = function(id, description, value){
   this.id = id;
   this.description = description;
   this.value = value;
 };
 var Income = function(id, description, value){
   this.id = id;
   this.description = description;
   this.value = value;
 };

var allExpenses = [];
var allIncomes = [];
var totalExpenses = 0;
var totalIncomes = 0;

var data = {
  allItems:{
    exp:[],
    inc: []
  },
  total:{
    exp: 0,
    inc:0
  }
}
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
  };


  var ctrlAddItem = function(){
    var input = UIController.getinput();
  }
  // var money = document.getElementById('amount').value;
  //1. get the filed input data
  //2 add the item to budget controller
  //3 add the item to the UI
  //4 calculate the budget
  //5 Display the budget on the UI

// });

return {
  init: function(){
    setupEventListeners();
  }
};

})(budgetController, UIController);

controller.init();
