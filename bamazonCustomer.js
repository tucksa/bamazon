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
    productDisplay();
});

function productDisplay(){
    connection.query("SELECT id, product_name, department_name, price, stock_quantity FROM products", function(err, res){
        if(err) throw err;
        console.log(`ID    |  Product Name      |  Department Name        |  Price  |  Stock Quantity   
----------------------------------------------------------------------------------------------\n`)
            for (let i=0; i<res.length; i++){
                let id=JSON.stringify(res[i].id);
                let name= res[i].product_name;
                let department= res[i].department_name;
                let price= JSON.stringify(res[i].price);
                let quantity= JSON.stringify(res[i].stock_quantity);
                while(id.length<9){
                    id= id+" ";
                };
                while(name.length<20){
                    name= name+" ";
                };
                while(department.length<26){
                    department= department+" ";
                };
                while(price.length<12){
                    price= price+" ";
                };
                while(quantity.length<10){
                    quantity= quantity+" ";
                };
                console.log(`${id}${name}${department}${price}${quantity}`);
            };
            console.log("\n\n");
            buy();
    });
};

function buy(){
    inquirer.prompt([
        {
            name:"whatID",
            type: "input",
            message: "What is the ID of the item you would like to buy?"
        },
        {
            name:"quantity",
            type: "input",
            message: "How many would you like to get?"
        }
    ]).then(function(ans){
        connection.query("SELECT * FROM products WHERE ID= " + ans.whatID, function(err, res){
            if (err) throw err;
            const sale= res[0].price*ans.quantity;
           if(ans.quantity<= res[0].stock_quantity){
               connection.query(
                   "UPDATE products SET ?, ? WHERE ?",
                   [
                       {stock_quantity: res[0].stock_quantity-ans.quantity},
                       {product_sales:res[0].product_sales+sale},
                       {id: ans.whatID}
                   ],
                   function(err){
                       if (err) throw err;
                   }
               )
                console.log("Thank you for your purchase! Your total comes to "+ sale);
           }else{
               console.log("Sorry, insufficient quantity...");
           }
           connection.end();
        });
    });
};