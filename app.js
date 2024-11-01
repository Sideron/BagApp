const addBT = document.getElementById("addItemBT");
const itemListShow = document.getElementById("itemList");
const weigthCount = document.getElementById("weigthCount");
const addItemForm = document.getElementById('addContainer');
const weigthBar = document.getElementById("weigthBar")
let maxWeigth = 10;
let currentWeigth = 0;
let items = [];
let listIndex = 0;

// New Item vars
let NIname, NIweigth, NIamount, NItype;

updateItems();

// Item list logic

const itemType = {
    'Shirt' : 'images/shirt.png',
    'Pants' : 'images/pant.png',
    'Hat1' : 'images/hat1.png'
}

function Item(name, weigth, amount, type){
    this.name = name;
    let _weigth = weigth;
    let _amount = amount;
    let totalWeigth = (_amount*_weigth).toFixed(2);
    let _itemType = type;
    let imageType = itemType[type];
    let color = '';
    Object.defineProperty(this,'weigth',{
        get: function(){
            return _weigth;
        },
        set: function(nWeigth){
            currentWeigth -= _weigth;
            _weigth = nWeigth;
            totalWeigth = (_amount*_weigth).toFixed(2);
            currentWeigth += _weigth;
        }
    });
    Object.defineProperty(this,'amount',{
        get: function(){
            return _amount;
        }
    });
    Object.defineProperty(this, 'totalWeigth',{
        get: function(){
            return totalWeigth;
        }
    });
    Object.defineProperty(this,'type',{
        get: function(){
            return _itemType;
        },
        set: function(nType){
            _itemType = nType;
            imageType = itemType[nType];
        }
    });
    this.add = function(added){
        currentWeigth -= totalWeigth;
        _amount += added;
        totalWeigth = (_amount*_weigth).toFixed(2);
        currentWeigth += totalWeigth;
    }
    this.remove = function(removed){
        currentWeigth -= totalWeigth;
        _amount -= removed;
        totalWeigth = (_amount*_weigth).toFixed(2);
        if(_amount<=0){
            removeItem(this.name);
        }
        currentWeigth += totalWeigth;
    }
    this.showItemInfo = function(){
        return `<div class="item" id="item">
        <button type="button" class="editItemBT"></button>
        <div class="itemInfo">
            <h2>${this.name}</h2>
            <p>Amount: ${_amount}</p>
            <p>Weigth: ${_weigth}</p>
            <p>Total Weigth: ${totalWeigth}</p>
        </div>
        <img class="itemImg" src="${imageType}">  
    </div>`
    }
}

function updateTotalWeigth()
{
    weigthBar.value = (currentWeigth/maxWeigth*100).toFixed(2)
    weigthCount.innerHTML = `Weigth: ${currentWeigth}/${maxWeigth}kg | ${(currentWeigth/maxWeigth*100).toFixed(2)}%`
}
function addItem(item){
    items[listIndex] = item;
    listIndex++;
    updateItems();
}

function removeItem(name){
    let pt = 0;
    for(let i=0;i<items.length;i++){
        if(items[i].name == name){
            pt = i;
            break;
        }
    }
    items.splice(pt,1);
    listIndex--;
    updateItems();
}

function updateItems(){
    currentWeigth = 0;
    itemListShow.innerHTML = ``
    if(items.length <= 0){
        itemListShow.innerHTML = "<div class='emptyListSign'>You have no items</div>"
    }
    for(let i=0;i<items.length;i++){
        currentWeigth += Number(items[i].totalWeigth);
        itemListShow.innerHTML+=items[i].showItemInfo();
    }
    updateTotalWeigth();
}

// Add Item functions

addBT.onclick = function(){
    //window.location='./addItem.html'
    addItemForm.innerHTML = `<div class="addItemPage">
            <div class="addItemForm">
                <button onclick="removeForm()">X</button>
                <h1>New Item</h1>
                <form>
                    <label for="iName">Name: </label>
                    <input type="text" id="iName"><br>
                    <label for="wNum">Weigth (gm): </label>
                    <input type="number" step="0.1" min="0" id="wNum"><br>
                    <label for="aNum">Amount: </label>
                    <input type="number" min="0" step="1" id="aNum" oninput="this.value = Math.round(this.value);"><br>
                    <label for="ItemTypeSelect">Item type: </label>
                    <select name="ItemTypeSelect" id="ItemTypeSelect">
                        <option value="null">-- Select an option --</option>
                        <option value="Shirt">Shirt</option>
                        <option value="Pants">Pants</option>
                        <option value="Hat1">Cap</option>
                    </select><br>
                    <label for="aNum">Color: </label>
                    <input type="color"><br>
                    <p id="warnText"></p>
                    <button type="button" onclick="sendNewItem()" class="submitFormBT">Add</button>
                </form>
            </div>
        </div>`
}

function removeForm(){
    addItemForm.innerHTML = '';
}

function sendNewItem(){
    NIname = document.getElementById('iName').value;
    NIweigth = parseFloat(document.getElementById('wNum').value) || 0;
    NIamount = parseInt(document.getElementById('aNum').value) || 0;
    NItype = document.getElementById('ItemTypeSelect').value;
    warnTx = document.getElementById('warnText');

    if(NIname == ''){
        warnTx.innerHTML = 'Insert a name.';
    }else if(NIweigth <= 0){
        warnTx.innerHTML = 'Set a weigth.';
    }else if(NIamount <= 0){
        warnTx.innerHTML = 'Set an amount.';
    }else if(NItype == 'null'){
        warnTx.innerHTML = 'Choose a type.';
    }else{
        let nItem = new Item(NIname,NIweigth,NIamount,NItype);
        addItem(nItem);
        console.log(nItem);
        NIname = 0;NIweigth = 0;NIamount = 0;NItype = 0;
        removeForm();
    }
    
}
