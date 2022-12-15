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

const express = require('express');
const inquirer = require("inquirer");

const fs = require("fs");
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL Username
    user: 'root',
    // TODO: Add MySQL Password
    password: 'Bubble12?',
    database: 'factory_db'
  },
  console.log(`Connected to the factory_db database.`)
);



const startPrompt = () => {
    console.log(`
     __  __        __  __                                   
    |  ||  |_ __  |  ||  | __ _ _ __   __ _  __ _  ___ _ __ 
    | |||| | '__| | |||| |/ _' | '_ | / _' |/ _' |/ _ | '__|
    | |  | | | _  | |  | | (_| | | | | (_| | (_| |  __/ |   
    |_|  |_|_|(_) |_|  |_||__,_|_| |_||__,_||__, ||___|_|   
                                            |___/           
    `);
  return inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "contact",
        choices: ["Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"],
      },
      {
        type: "input",
        name: "initialize",
        message: "What would you like to do?",
      },
      {
        type: "checkbox",
        message: "What languages do you know?",
        name: "stack",
        choices: ["HTML", "CSS", "JavaScript", "MySQL"],
      },
      {
        type: "list",
        message: "What is your preferred method of communication?",
        name: "contact",
        choices: ["email", "phone", "telekinesis"],
      },
    ])
    .then((data) => {
      const filename = `${data.name.toLowerCase().split(" ").join("")}.json`;

      fs.writeFile(filename, JSON.stringify(data, null, "\t"), (err) => (err ? console.log(err) : console.log("Success!")));
    });
};


startPrompt();



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
