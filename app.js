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

var calculateTotal = function(type){
  var sum = 0;
  data.allItems[type].forEach(function(cur){
    sum += cur.value;
  });
  data.totals[type] = sum;
}

var data = {
  allItems:{
    exp:[],
    inc: []
  },
  totals:{
    exp: 0,
    inc:0
  },
  budget:0,
  percentage: -1
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

  deleteItem: function(type, id){
    var ids, index;
    // select specific id using map method which returns brand new array

    ids = data.allItems[type].map(function(current){
      return current.id;
    });

    index = ids.indexOf(id);
    if(index !== -1){
      //using splice method to remove element
      data.allItems[type].splice(index, 1);
    }

  },

  calculateBudget: function(){
    // calculate totalincome and expenses
    calculateTotal("exp");
    calculateTotal("inc");
    // calculate the budget: income - expenses
    data.budget = data.totals.inc - data.totals.exp;
    // calculate the percentage of income that we spent
    if(data.totals.inc > 0){
      data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);

    }else{
      data.percentage = -1;
    }

  },

  getBudget: function(){
    return{
      budget: data.budget,
      totalInc: data.totals.inc,
      totalExp: data.totals.exp,
      percentage: data.percentage
    };
  },
  testing : function(){
    console.log(data);
}

};
})();

var UIController = (function(){

  var DOMstring ={
    inputType:".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container : ".container"
  }
  return {
    getinput :function(){
      return {
        type:document.querySelector(DOMstring.inputType).value,
        description: document.querySelector(DOMstring.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstring.inputValue).value)
      };

    },
    addListItem: function(obj, type){
      var html, newHtml, element;

        // create HTML string with placehoder text
        if(type === "inc"){
          element = DOMstring.incomeContainer;
          html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

        }else if(type === "exp"){
            element = DOMstring.expensesContainer;
          html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
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
    displayBudget: function(obj){
      // var type;
      // obj.budget > 0 ? type = "inc" : type = "exp";

      document.querySelector(DOMstring.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstring.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstring.expensesLabel).textContent = obj.totalExp;

      if(obj.percentage > 0){
        document.querySelector(DOMstring.percentageLabel).textContent = obj.percentage + "%";

      }else{
        document.querySelector(DOMstring.percentageLabel).textContent = "---"

      }
    },
    getDOMstring: function(){
      return DOMstring;
    },
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
    document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem);
  };


var updateBudget = function(){
  //calculate the budget
budgetCtrl.calculateBudget();


  // return the budget
var budget = budgetCtrl.getBudget();

  // display the budget on UI
UICtrl.displayBudget(budget);


};

  var ctrlAddItem = function(){
    var input, newItem
    //1. get the filed input data
      input = UIController.getinput();
      if(input.description !== "" && !isNaN(input.value) && input.value > 0){
        //2 add the item to budget controller
         newItem= budgetCtrl.addItem(input.type, input.description, input.value);
        //3 add the item to the UI
        UICtrl.addListItem(newItem, input.type);
        //we need to clear the field
        UICtrl.clearFields();
        //4 calculate the budget
        updateBudget();
        //5 Display the budget on the UI

      }

  };

var ctrlDeleteItem = function(event){
  var itemId, splitID, type, ID;
  itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
  if(itemId){
    splitID = itemId.split("-");
    type = splitID[0];
    ID = parseInt(splitID[1]); // convert a string to integer with parseInt method

    // delete item from data
    budgetCtrl.deleteItem(type, ID);
    // dlete item from UI


    // update nd show the new budget in UI
  }
}
// });


return {
  init: function(){
    UICtrl.displayBudget({
          budget: 0,
          totalInc: 0,
          totalExp: 0,
          percentage: -1
        });
    setupEventListeners();
  }
};

// ToDo list fir the rest of application
// add event handler
// delete the item from data
// delete the item from UI
// re-calculate budget
// update UI

})(budgetController, UIController);

controller.init();


var example = ["12", ""]
