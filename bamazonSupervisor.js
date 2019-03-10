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
        name: "supervisorOpts",
        type: "list",
        message: "What would you like to do?",
        choices:["View Product Sales by Department", "Create New Department"]
    }).then(function(ans){
        if(ans.supervisorOpts==="View Product Sales by Department"){
            salesDisplay();
        }else if (ans.supervisorOpts==="Create New Department"){
            addDepartment();
        };
    });
};

function salesDisplay(){
    connection.query(
        "SELECT departments.id, departments.department_name, departments.over_head_costs, products.product_sales FROM departments INNER JOIN products ON departments.department_name= products.department_name GROUP BY department_name",
        function(err, res){
            if(err) throw err;
            console.log(`ID    |  Department Name      |  Over Head Cost    | Product Sales     | Total Profit   
            ----------------------------------------------------------------------------------------------------\n`)
                for (let i=0; i<res.length; i++){
                    let id=JSON.stringify(res[i].id);
                    let name= res[i].department_name;
                    let overHead= JSON.stringify(res[i].over_head_costs);
                    let sales= JSON.stringify(res[i].product_sales);
                    let total= JSON.stringify(res[i].product_sales-res[i].over_head_costs);
                    while(id.length<9){
                        id= id+" ";
                    };
                    while(name.length<30){
                        name= name+" ";
                    };
                    while(overHead.length<26){
                        overHead= overHead+" ";
                    };
                    while(sales.length<12){
                        sales= sales+" ";
                    };
                    while(total.length<10){
                        total= total+" ";
                    };
                    console.log(`${id}${name}${overHead}${sales}${total}`);
                };
            connection.end();
        });
};

function addDepartment(){
    inquirer.prompt([
        {
            name: "departmentName",
            type: "input",
            message: "What Department are you adding?"
        },
        {
            name: "overHeadCost",
            type: "input",
            message: "What is the over head cost for this department?"
        }
    ]).then(function(ans){
        connection.query("INSERT INTO departments (department_name, over_head_costs) VALUES ("
        + "'"+ans.departmentName +"', "+ ans.overHeadCost+")", 
        function(err){
            if (err) throw err;
            console.log("You have successfully added"+ ans.departmentName+" to the tracker!");
        });
        connection.end();
    });
};