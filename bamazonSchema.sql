create database bamazon_db;

USE bamazon_db;
CREATE TABLE products(
    id INT NOT NULL auto_increment,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(75),
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    product_sales DECIMAL NOT NULL,
    PRIMARY KEY(id)
);
CREATE TABLE departments(
    id INT NOT NULL auto_increment,
    department_name VARCHAR(75),
    over_head_costs INT,
    PRIMARY KEY (id)
);