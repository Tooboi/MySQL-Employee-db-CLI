// GIVEN a command-line application that accepts user input
// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database

const express = require("express");
const inquirer = require("inquirer");
require("console.table");

const fs = require("fs");
const mysql = require("mysql2");
const { ifError } = require("assert");
const { brotliDecompress } = require("zlib");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "Bubble12?",
    database: "factory_db",
  },
  console.log(`\u001b[32m Connected to the factory_db database.\u001b[0m`)
);

db.connect(function (err) {
  if (err) throw err;
  console.log(`\u001b[34;1m
    __  __        __  __                                   
   |  ||  |_ __  |  ||  | __ _ _ __   __ _  __ _  ___ _ __ 
   | |||| | '__| | |||| |/ _' | '_ | / _' |/ _' |/ _ | '__|
   | |  | | | _  | |  | | (_| | | | | (_| | (_| |  __/ |   
   |_|  |_|_|(_) |_|  |_||__,_|_| |_||__,_||__, ||___|_|   
                                           |___/           
   `);

  startPrompt(); // START
});

const startPrompt = () => {
  return inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "choice",
        choices: ["View All Departments", "View All Roles", "View All Employees", "Add Department", "Add Role", "Add Employee", "Update Employee Role", "\u001b[31;1mQuit\u001b[0m"],
      },
    ])

    .then(function ({ choice }) {
      switch (choice) {
        case "View All Departments":
          allDepartments();
          break;

        case "View All Roles":
          allRoles();
          break;

        case "View All Employees":
          allEmployees();
          break;

        case "Add Department":
          addDepartment();
          break;

        case "Add Role":
          addRole();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Update Employee Role":
          updateRole();
          break;

        case "Quit":
          db.end();
          break;
      }
    });
};

const allDepartments = () => {
  db.query("SELECT * FROM department", function (err, results) {
    if (err) {
      console.log(err);
    }
    console.log("\n\n\u001b[32;1m--------All Departments--------\u001b[0m\n");
    console.table(results);
    startPrompt();
  });
};
function allRoles() {
  db.query("SELECT * FROM role", function (err, results) {
    if (err) {
      console.log(err);
    }
    console.log("\n\n\u001b[32;1m--------All Roles--------\u001b[0m\n");
    console.table(results);
    startPrompt();
  });
}
function allEmployees() {
  db.query("SELECT * FROM employee", function (err, results) {
    if (err) {
      console.log(err);
    }
    console.log("\n\n\u001b[32;1m--------All Employees--------\u001b[0m\n");
    console.table(results);
    startPrompt();
  });
}
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "type",
        message: "What Department Would You Like To Add?",
        name: "departmentNew",
      },
    ])
    .then((answer) => {
      let depart = answer.departmentNew;
      db.query(`INSERT INTO department (name) VALUES (?)`, depart, (err, results) => {
        if (err) throw err;
        
        console.log(`\n\u001b[33mAdded ${depart} Department\u001b[0m\n`);
        startPrompt();
      });
    });
}
var rolesList = []
function addRole() {
    db.query("SELECT name FROM department", function (err, results) {


        if (err) {
          console.log(err);
        }
        for (let i = 0; i < results.length; i++) {
            rolesItem = results[i].name;
            
           rolesItem.forEach(rolesItem => {
            rolesList.push(rolesItem)
        }) 
        }
        
            // console.log(rolesItem);

        
    })
    
    inquirer
    .prompt([
      {
        type: "type",
        message: "What is the name of the role?",
        name: "roleName",
      },
      {
        type: "type",
        message: "What is the salary of the role?",
        name: "roleSalary",
      },
      {
        type: "list",
        message: "Which department does the role belong to?",
        name: "first_name",
        choices: rolesList,
      },
    ])
    .then((answer) => {
      let depart = answer.departmentNew;
      db.query(`INSERT INTO department (name) VALUES (?)`, depart, (err, results) => {
        if (err) throw err;
        
        console.log(`\n\u001b[33mAdded ${depart} Department\u001b[0m\n`);
        startPrompt();
      });
    });
}
function addEmployee() {
  startPrompt();
}
function updateRole() {
  startPrompt();
}

// Query database using COUNT() and GROUP BY
// db.query('SELECT COUNT(id) AS total_count FROM favorite_books GROUP BY in_stock', function (err, results) {
//   console.log(results);
// });

// // Query database using SUM(), MAX(), MIN() AVG() and GROUP BY
// db.query('SELECT SUM(quantity) AS total_in_section, MAX(quantity) AS max_quantity, MIN(quantity) AS min_quantity, AVG(quantity) AS avg_quantity FROM favorite_books GROUP BY section', function (err, results) {
//   console.log(results);
// });

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
