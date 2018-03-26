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
};

return {
  addItem: function(type, des, val){
    var newItem, ID;
    //create new ID
    if(data.allItems[type].length > 0){
      ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
    }else{
      ID = 0;
    }
    //create a new item based on expenses or income
    if(type === "exp"){
        newItem = new Expense(ID, des, val);
    }else if(type === "inc"){
        newItem = new Income(ID, des, val);
    }
    // add the new item to the data
    data.allItems[type].push(newItem);
    return newItem;
  },
  testing : function(){
    console.log(data);
}

}
})();

var UIController = (function(){

  var DOMstring ={
    inputType:".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list"
  }
  return {
    getinput :function(){
      return {
        type:document.querySelector(DOMstring.inputType).value,
        description: document.querySelector(DOMstring.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstring.inputValue).value)
      }

    },
    addListItem: function(obj, type){
      var html, newHtml, element;

        // create HTML string with placehoder text
        if(type === "inc"){
          element = DOMstring.incomeContainer;
          html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

        }else if(type === "exp"){
            element = DOMstring.expensesContainer;
          html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        };


        // replace the placehoder text with some actaul sata
        newHtml = html.replace("%id%", obj.id);
        newHtml = newHtml.replace("%value%", obj.value);
        newHtml = newHtml.replace("%description%", obj.description);



        // insert the HTML into DOM
        document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);

    },

    clearFields: function(){
      var fields, fieldArr;
      fields = document.querySelectorAll(DOMstring.inputDescription + "," + DOMstring.inputValue);

      fieldArr = Array.prototype.slice.call(fields);
      fieldArr.forEach(function(current, index, array){
        current.value= "";
      });
      fieldArr[0].focus();
    },

    getDOMstring: function(){
      return DOMstring;
    }
  };

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


var updateBudget = function(){
  //calculate the budget


  // return the budget


  // display the budget on UI


};

  var ctrlAddItem = function(){
    var input, newItem
    //1. get the filed input data
      input = UIController.getinput();
    //2 add the item to budget controller
     newItem= budgetCtrl.addItem(input.type, input.description, input.value);
    //3 add the item to the UI
    UICtrl.addListItem(newItem, input.type);
    //we need to clear the field
    UICtrl.clearFields();
    //4 calculate the budget
    //5 Display the budget on the UI
  };


// });

return {
  init: function(){
    setupEventListeners();
  }
};

})(budgetController, UIController);

controller.init();


var example = ["12", ""]
