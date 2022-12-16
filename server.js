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
  console.log(`
   \u001b[33;1m __  __       \u001b[32;1m __  __                                   
   \u001b[33;1m|  ||  |_ __  \u001b[32;1m|  ||  | __ _ _ ___  __ _  __ _  ___ _ __ 
   \u001b[33;1m| |||| | '__| \u001b[32;1m| |||| |/ _' | '_  |/ _' |/ _' |/ _ | '__|
   \u001b[33;1m| |  | | | _  \u001b[32;1m| |  | | (_| | | | | (_| | (_| |  __/ |   
   \u001b[33;1m|_|  |_|_|(_) \u001b[32;1m|_|  |_|.__._|_| |_|.__,_|.__, |.___|_|   
   \u001b[33;1m              \u001b[32;1m                          |___/           
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

function allDepartments() {
  db.query("SELECT id AS ID, department_name AS Department FROM departments", function (err, results) {
    if (err) {
      console.log(err);
    }
    console.log("\n\n\u001b[32;1m--------All Departments--------\u001b[0m\n");
    console.table(results);
    startPrompt();
  });
}
function allRoles() {
  const queryInner = `SELECT * FROM role;`;

  db.query(queryInner, function (err, results) {
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
      db.query(`INSERT INTO departments (department_name) VALUES (?)`, depart, (err, results) => {
        if (err) throw err;

        console.log(`\n\u001b[33m--------Added ${depart} Department--------\u001b[0m\n`);
        startPrompt();
      });
    });
}
var rolesList = [];
function addRole() {
  db.query("SELECT department_name FROM departments", function (err, results) {
    if (err) {
      console.log(err);
    }
    for (var i = 0; i < results.length; i++) {
      rolesItem = results[i].department_name;
      if (!rolesList.includes(rolesItem)) {
        rolesList.push(rolesItem);
      }
    }
  });

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
        name: "departmentType",
        choices: rolesList,
      },
    ])
    .then((answer) => {
      let rolePost = answer.roleName;
      let roleSalaryPost = answer.roleSalary;
      let departB = answer.departmentType;
      console.log(departB);
      db.query(`INSERT INTO role (title, salary) VALUES (?, ?)`, [rolePost, roleSalaryPost], (err, results) => {
        if (err) throw err;

        console.log(`\n\u001b[33m--------Added ${rolePost} Role--------\u001b[0m\n`);
        startPrompt();
      });
    });
}

var titlesList = [];
var managersList = [];
function addEmployee() {
  db.query("SELECT title FROM role", function (err, results) {
    if (err) {
      console.log(err);
    }
    for (var i = 0; i < results.length; i++) {
      titleItem = results[i].title;
      if (!titlesList.includes(titleItem)) {
        titlesList.push(titleItem);
      }
    }
  });
  db.query("SELECT last_name FROM employee", function (err, results) {
    if (err) {
      console.log(err);
    }

    for (var i = 0; i < results.length; i++) {
      managersItem = results[i].last_name;

      if (!managersList.includes(managersItem)) {
        managersList.push(managersItem);
        // console.log(managersList);
      }
    }
  });
  inquirer
    .prompt([
      {
        type: "type",
        message: "What is the employee's first name?",
        name: "employeeFname",
      },
      {
        type: "type",
        message: "What is the employee's last name?",
        name: "employeeLname",
      },
      {
        type: "list",
        message: "What is the employee's role?",
        name: "roleType",
        choices: titlesList,
      },
      {
        type: "list",
        message: "Who is the employee's manager?",
        name: "managerType",
        choices: ["\u001b[31;1mnone\u001b[0m", managersList.slice(-1)],
      },
    ])
    .then((answer) => {
      let titleFPost = answer.employeeFname;
      let titleLPost = answer.employeeLname;
      let roleB = answer.roleType;
      let managerPost = answer.managerType;
      // console.log(departB);
      db.query(`INSERT INTO employee (first_name, last_name) VALUES (?, ?)`, [titleFPost, titleLPost], (err, results) => {
        if (err) throw err;

        console.log(`\n\u001b[33m--------Added ${titleFPost} ${titleLPost} To Employee's--------\u001b[0m\n`);
        startPrompt();
      });
    });
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
