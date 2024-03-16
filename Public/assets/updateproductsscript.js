document.addEventListener('DOMContentLoaded', function() {
    var postButton = document.getElementById('postbutton');
    var deleteButton = document.getElementById('deletebutton');

    postButton.addEventListener('click', function(event) {
        document.getElementById("form").action = "/updateproducts";
    });

    deleteButton.addEventListener('click', function(event) {
        document.getElementById("form").action = "/deleteproducts";
    });
});





// Initialize an empty array to store the Data we collect from the inventory table that are checked
let checkedIds = new Array;
//get all input fields
let inputfield = document.getElementsByTagName('input')
buttondisable();
            // Get all radio buttons within the table
let inventoryradibuttons = document.querySelectorAll('#inventorytable input[type="radio"]');
// Add a change event listener to each radio button
inventoryradibuttons.forEach(radio => {
      radio.addEventListener('change', function() {
            // Get the ID of the row (assuming it's stored in a data attribute)
            let rowId = this.closest('tr').dataset.id;

           
            if(this.checked) {
                checkedIds = rowId;
                buttondisable();
                let topopulateinputs = JSON.parse(rowId);
                for (var index = 0; index < inputfield.length; index++) {
        var inputId = inputfield[index].id;

        // Set a value based on the unique ID
        switch (inputId) {
            case 'name':
                inputfield[index].value = topopulateinputs.name;
                break;
            case 'model':
                inputfield[index].value = topopulateinputs.model;
                break;
            case 'purchasedprice':
                inputfield[index].value = topopulateinputs.purchasedprice;
                break;
            case 'sellingprice':
                inputfield[index].value = topopulateinputs.sellingprice;
                break;
            case 'type':
                inputfield[index].value = topopulateinputs.type;
                break;
            case 'quantity':
                inputfield[index].value = topopulateinputs.quantity;
                break;
            case 'date':
                inputfield[index].value = new Date(topopulateinputs.date).toISOString().split('T')[0];
                break;
            case 'id':
                inputfield[index].value = topopulateinputs._id;
                break;
            // Add more cases for other input IDs if needed
        }
    }
            } 
        
            else {
               
            }
            console.log(checkedIds);
        });
    });


    function buttondisable(){
        var postButton = document.getElementById('postbutton');
    var deleteButton = document.getElementById('deletebutton');
    if(checkedIds.length==0){
        postButton.disabled = true;
        deleteButton.disabled = true;
    }else{
        postButton.disabled = false;
        deleteButton.disabled = false;
    }
    }
    