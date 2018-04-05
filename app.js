console.log("hello world");
var budgetController = (function(){
 var Expense = function(id, description, value){
   this.id = id;
   this.description = description;
   this.value = value;
   this.percentage = -1;
 };

 Expense.prototype.calcPercentage = function(totalIncome){
   if(totalIncome > 0){
     this.percentage = Math.round((this.value / totalIncome) *100);
   }else{
     this.percentage = -1;
   }
 };


Expense.prototype.getPercentage = function(){
  return this.percentage;
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
  calculatePercentages: function(){

    data.allItems.exp.forEach(function(cur){
      cur.calcPercentage(data.totals.inc);
    });
  },
  getPercentages: function(){
    var allPerc = data.allItems.exp.map(function(cur){
      return cur.getPercentage();
    });
    return allPerc;
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
    container : ".container",
    expensesPercLabel: ".item__percentage",
    dateLabel: ".budget__title--month"
  };
  var formatNumber = function(num, type){
    /*
    + before income and - before expenses
    exactly 2 decimal points and comma separating the thousands
    */
    num = Math.abs(num);
    num = num.toFixed(2);
    numSplit = num.split(".");
    int = numSplit[0];
    if(int.length > 3){
      int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, int.length);
    }
    dec = numSplit[1];
    return (type === "exp" ? "-" : "+" ) + int + "." + dec;

  };

  var nodeListForEach = function(list, callback){
    for(var i = 0; i < list.length; i++){
      callback(list[i], i);
    }
  };

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
        newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));
        newHtml = newHtml.replace("%description%",obj.description);



        // insert the HTML into DOM
        document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);

    },

    deleteListItem: function(selectorID){
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);

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
      var type;
      obj.budget > 0 ? type = "inc" : type = "exp";


      document.querySelector(DOMstring.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMstring.incomeLabel).textContent = formatNumber(obj.totalInc, "inc");
      document.querySelector(DOMstring.expensesLabel).textContent = formatNumber(obj.totalExp, "exp");

      if(obj.percentage > 0){
        document.querySelector(DOMstring.percentageLabel).textContent = obj.percentage + "%";

      }else{
        document.querySelector(DOMstring.percentageLabel).textContent = "---"

      }
    },

    displayPercentages: function(percentages){
      var fields = document.querySelectorAll(DOMstring.expensesPercLabel);


      nodeListForEach(fields, function(current, index){
        if(percentages[index] > 0){
          current.textContent = percentages[index] + "%";
        }else{
          current.textContent ="---";
        }
      });

    },
    displayMonth: function(){
      var now, year, month;

      now = new Date();
      months = ["January", "Fabruary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      month = now.getMonth();
      year = now.getFullYear();
      document.querySelector(DOMstring.dateLabel).textContent = months[month] + "/" + year;
    },

    changeType: function (){
      var fields = document.querySelectorAll(
          DOMstring.inputType + "," +
          DOMstring.inputDescription + "," +
          DOMstring.inputValue
      );
      nodeListForEach(fields, function(cur){
        cur.classList.toggle("red-focus");
      });


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
    document.querySelector(DOM.inputType).addEventListener("change", UICtrl.changeType);
  };


var updateBudget = function(){
  //calculate the budget
budgetCtrl.calculateBudget();


  // return the budget
var budget = budgetCtrl.getBudget();

  // display the budget on UI
UICtrl.displayBudget(budget);
};
var updatePercentages = function(){
  //calculate percentage
  budgetCtrl.calculatePercentages();
  //read percentage from budget controller
  var percentages = budgetCtrl.getPercentages();
  //update UI with new percentage
  UICtrl.displayPercentages(percentages);

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
        // update percentage
        updatePercentages();


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
    // delete item from UI
    UICtrl.deleteListItem(itemId);

    // update nd show the new budget in UI
    updateBudget();

    updatePercentages();
  }
}
// });


return {
  init: function(){
    UICtrl.displayMonth();
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
