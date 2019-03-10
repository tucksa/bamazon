const mysql= require("mysql");
const inquirer = require("inquirer");

const connection= mysql.createConnection({
    host: "localhost",
    port:3306,
    user:"root",
    password:"Sharolyn@89",
    database:"bamazon_db"
});

connection.connect(function(err){
    if (err) throw err;
    console.log("connected on "+ connection.threadId);
    start();
});

function start(){
    inquirer.prompt({
        name: "managerOpts",
        type: "list",
        message: "What would you like to do?",
        choices:["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }).then(function(ans){
        if(ans.managerOpts === "View Products for Sale"){
            productDisplay();

        }else if (ans.managerOpts === "View Low Inventory"){
            lowInventoryDisplay();

        }else if (ans.managerOpts === "Add to Inventory"){
            addInventory();
        }else if (ans.managerOpts === "Add New Product"){
            addProduct();
        };
    });
};

function productDisplay(){
    connection.query("SELECT * FROM products", function(err, res){
        if(err) throw err;
        console.log(`ID    |  Product Name      |  Price  |  Stock Quantity | Product Sales
------------------------------------------------------------------------------------\n`)
            for (let i=0; i<res.length; i++){
                let id=JSON.stringify(res[i].id);
                let name= res[i].product_name;
                let price= JSON.stringify(res[i].price);
                let quantity= JSON.stringify(res[i].stock_quantity);
                let sales= JSON.stringify(res[i].product_sales)
                while(id.length<9){
                    id= id+" ";
                };
                while(name.length<20){
                    name= name+" ";
                };
                while(price.length<15){
                    price= price+" ";
                };
                while(quantity.length<18){
                    quantity= quantity+" ";
                };
                while(sales.length<10){
                    sales= sales+" ";
                };
                console.log(`${id}${name}${price}${quantity}${sales}`);
            };
        connection.end();
    });
};

function lowInventoryDisplay(){
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res){
        if(err) throw err;
        console.log(`ID    |  Product Name      |  Price  |  Stock Quantity | Product Sales
-----------------------------------------------------------------------------\n`)
            for (let i=0; i<res.length; i++){
                let id=JSON.stringify(res[i].id);
                let name= res[i].product_name;
                let price= JSON.stringify(res[i].price);
                let quantity= JSON.stringify(res[i].stock_quantity);
                let sales= JSON.stringify(res[i].product_sales);
                while(id.length<9){
                    id= id+" ";
                };
                while(name.length<20){
                    name= name+" ";
                };
                while(price.length<15){
                    price= price+" ";
                };
                while(quantity.length<18){
                    quantity= quantity+" ";
                };
                while(sales.length<10){
                    sales= sales+" ";
                };
                console.log(`${id}${name}${price}${quantity}${sales}`);
            };
        connection.end();
    });
};

function addInventory(){
    inquirer.prompt([
        {
            name: "whatID",
            type: "input",
            message: "What is the ID of the product you would like to add to?",
        },
        {
            name: "quantity",
            type: "input",
            message: "How many are you adding?"
        }
    ]).then(function(ans){
            var originalQuantity;
            var item;
        connection.query("SELECT * FROM products WHERE id= " + ans.whatID, function(err, res){
            if (err) throw err;
            originalQuantity= res[0].stock_quantity;
            item= res[0].product_name;
        connection.query("UPDATE products SET ? WHERE ?",[
            {stock_quantity: parseInt(originalQuantity)+ parseInt(ans.quantity)},
            {id: ans.whatID}
        ], function(err){
            if (err) throw err;
            console.log("You successfully added "+ ans.quantity + " to "+ item);
            });
            connection.end();
        });
   
    });   
  
};

function addProduct(){
    inquirer.prompt([
        {
            name: "productName",
            type: "input",
            message: "What product are you adding?"
        },
        {
            name: "departmentName",
            type: "input",
            message: "Which department will it be in?"
        },
        {
            name: "price",
            type: "input",
            message: "What is the price of this product?"
        },
        {
            name: "stockQuantity",
            type: "input",
            message: "How many do we have?"
        }
    ]).then(function(ans){
        connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) VALUES ("
        + "'"+ans.productName +"', '"+ ans.departmentName + "', "+ ans.price+", "+ ans.stockQuantity+", 0)", 
        function(err){
            if (err) throw err;
            console.log("You have successfully added this product to the inventory!");
        });
        connection.end();
    });
};