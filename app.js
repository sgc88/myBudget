console.log("hello world");
var budgetController = (function(){
  //some code here
})();

var UIController = (function(){

  //some code here
})();


var controller  = (function(budgetCtrl, UICtrl){
document.querySelector(".add__btn").addEventListener("click", function(){
  // var money = document.getElementById('amount').value;
  //1. get the filed input data
  //2 add the item to budget controller
  //3 add the item to the UI
  //4 calculate the budget
  //5 Display the budget on the UI
});
document.addEventListener("keypress", function(event){
if(event.keyCode === 13){
  console.log("Enter was pressed");
}
});

})(budgetController, UIController);
