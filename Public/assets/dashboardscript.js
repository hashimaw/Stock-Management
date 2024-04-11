// Initialize an empty array to store the Data we collect from the inventory table that are checked
let checkedIds = new Array;



//a function to add new row to the selected items table using backticks
function addRowToSelectedItemsTable(newRowData) {
  var table = document.getElementById('selectedItemsTableBody');
  var row = document.createElement('tr');
  row.className = "hover:bg-slate-100 p-3 mx-2 rounded-xl";
  row.setAttribute('data-object', newRowData._id, ); 
  row.innerHTML = `<td><input type="checkbox" id="remember-me" name="remember-me" class="mr-3" checked></td>
                  <td> ${newRowData.name} <input class="hidden" name="name" value="${newRowData.name}"></td>
                  <td> ${newRowData.model} <input class="hidden" name="model" value="${newRowData.model}"></td>
                  <td> ${newRowData.type} <input class="hidden" name="type" value="${newRowData.type}"></td>
                  <td><img class="w-14" src="assets/download.jfif" alt=""></td>
                  <td>
                    <input id="comment" name="comment" type="text" autocomplete="name" value="..beloved" required
                    class="focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 rounded-lg border border-solid shadow-sm bg-opacity-60 border-slate-200 placeholder-slate-500 placeholder:text-md placeholder:font-normal font-medium text-md text-black" 
                    placeholder="...beloved customer"  >  
                  </td>
                  <td>
                    <input id="quantity-${newRowData._id}" name="quantity" type="number" autocomplete="cc-number" min="1" max="100" value="0" oninput="validateInputQuantity(this, ${newRowData.quantity})" required 
                    class="w-14 focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 rounded-lg border border-solid shadow-sm bg-opacity-60 border-slate-200 placeholder-black placeholder:text-md placeholder:font-medium font-medium text-md text-black" 
                    placeholder="1"  >  
                  </td>
                  <td>
                    <input id="soldprice" name="soldprice" type="number" autocomplete="cc-number" value="${newRowData.sellingprice}" oninput="validateInputSellingprice(this, ${newRowData.sellingprice} )" required 
                    class="w-24 focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 rounded-lg border border-solid shadow-sm bg-opacity-60 border-slate-200 placeholder-black placeholder:text-md placeholder:font-medium font-medium text-md text-black" 
                    placeholder = ${newRowData.sellingprice}>
                  </td>
                  <td></td>
                  <td class="hidden">${newRowData._id}<input class="hidden" name="id" value="${newRowData._id}"></td>
                  <td> <input id="sellingprice" name="sellingprice" class="hidden" value="${newRowData.sellingprice}"></td>
                  <td> <input id="purchasedprice" name="purchasedprice" class="hidden" value="${newRowData.purchasedprice}"></td>`
          

          table.appendChild(row);
}

Sum();


  // Function to remove row from selected items table
  function removeRowFromSelectedItemsTable(removableRowId) {
    var table = document.getElementById('selectedItemsTable');
    for (var i = 0; i < table.rows.length; i++) {
      if (table.rows[i].cells[9].textContent === removableRowId) {
        table.deleteRow(i);
      }
    }
  }





  //function to uncheck the inventory tables checkboxes after we unselect the item from selected items table
  function uncheckcheckboxfromInventory(uncheckedrowId) {
    var table = document.getElementById('inventorytable');
    for (var i = 0; i < table.rows.length; i++) {
      if (table.rows[i].cells[9].textContent === uncheckedrowId) {
        const checkbox = table.rows[i].cells[0].querySelector('input[type="checkbox"]');
          if (checkbox) {
            checkbox.checked = false; // Uncheck the checkbox
          }
          break;
      }
    }
  }






// Get all checkboxes within the table
let inventorycheckboxes = document.querySelectorAll('#inventorytable input[type="checkbox"]');
// Add a change event listener to each checkbox
inventorycheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
            // Get the ID of the row (assuming it's stored in a data attribute)
            let rowId = this.closest('tr').dataset.id;

            // If the checkbox is checked, add the ID to the array 
            // parse the data that we get from the row
            // call the addToSelectedItemsTable and pass the parsed data as an argument
            // store at selectediemcheckboxes that are dynamically generated checkboxes in selecteditemstable using queryselector right after adding row function is called
            // call the selecteditemcheckboxe function for generated checkboxes as it starts to watch for changes
            if(this.checked) {
              
                checkedIds.push(rowId);
                let newRowData = JSON.parse(rowId);
                addRowToSelectedItemsTable(newRowData);
                let selecteditemcheckboxes = document.querySelectorAll('#selectedItemsTable input[type="checkbox"]');
                selecteditemcheckboxe(selecteditemcheckboxes);
                let quantityInput = document.querySelectorAll('[id^="quantity-"]');
                let soldpriceInput = document.querySelectorAll('#soldprice');
                soldPriceUpdated(soldpriceInput);
                quantityUpdated(quantityInput);
                Sum();
            } 
            // If the checkbox is unchecked, remove the ID from the array
            // parse the data that we get from the row
            // call the removeRowFromSelectedItemsTable function to remove an item as it's unchecked at inventory table
            else {
              
                checkedIds = checkedIds.filter(id => id !== rowId);
                let removableRowId = JSON.parse(rowId);
                removeRowFromSelectedItemsTable(removableRowId._id);
                Sum();
            }
        });
    });




// a function to watch checkboxes of newly added rows at selected items table     
function selecteditemcheckboxe(selecteditemcheckboxes){
// Add a change event listener to each checkbox
  selecteditemcheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        // Get the object of the row (assuming it's stored in a data attribute) and the data we get here is the id of specific item
        let uncheckedrowId = this.closest('tr').dataset.object;
        // here we find the array that we store at ceckedIds using the _id of the item we receive above and store it in tobepoped var 
        let tobepoped = new Array;
        checkedIds.forEach(item =>{
          tobepoped.push(JSON.parse(item)) 
        })
        tobepoped = tobepoped.filter((item) => item._id === uncheckedrowId);
        tobepoped = JSON.stringify(tobepoped[0]);
      
        // If the checkbox is checked, nothing to do
        if(this.checked) {
        } 
        // If the checkbox is unchecked, remove the ID from the array
        // call uncheckcheckboxfromInventory function to uncheck dropped item from inventory table
        // call removeRowFromSelectedItemsTable function to remove item from selected items table
        else {
          
            checkedIds = checkedIds.filter(id => id !== tobepoped);
            uncheckcheckboxfromInventory(uncheckedrowId);
            removeRowFromSelectedItemsTable(uncheckedrowId);
            Sum();
        }
    });
});
}



// function to show the sum of prcie
function Sum(){
  var table = document.getElementById('selectedItemsTable');
  const mySum = document.getElementById('Sum');
  var placeorderbutton = document.getElementById('placeorderbutton');
  let total=0;
    for (var i = 1; i < table.rows.length; i++) {
      table.rows[i].cells[8].textContent = table.rows[i].cells[7].querySelector('input').value * table.rows[i].cells[6].querySelector('input').value;
       total = total +  parseFloat(table.rows[i].cells[8].textContent);
    }
    if (total==0){
      placeorderbutton.disabled = true;
    }else{
      placeorderbutton.disabled = false;
    }
  mySum.innerHTML = '$'+total;
}



// function to watch for quantity input field 
function quantityUpdated(quantityInput){
  quantityInput.forEach(inputElement => {
    inputElement.addEventListener('input', function() {
      Sum();
    });
  })
}



// function to watch for sellingprice input field 
function soldPriceUpdated(soldpriceInput){
  soldpriceInput.forEach(inputElement => {
    inputElement.addEventListener('input', function() {
      Sum();
    });
  })
}



// function to validate quantity input field 
function validateInputQuantity(inputElement, availableQuantity) {
        const value = parseInt(inputElement.value);
        if (value < 1) {
            inputElement.value = 1;
        } else if (value > availableQuantity) {
            inputElement.value = availableQuantity;
        }
    }



// function to validate sellingprice input field 
function validateInputSellingprice(inputElement, sellingPrice) {
    const value = parseInt(inputElement.value);
    if (value < 1) {
        inputElement.value = sellingPrice;
    } else if (value > 2*sellingPrice) {
        inputElement.value = 2*sellingPrice;
    }
}

