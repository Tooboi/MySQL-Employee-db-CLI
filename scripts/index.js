
const inquirer = require("inquirer");
const fs = require("fs");

const startPrompt = () => {
    console.log(`
        _____ __  __ ____  _     _____   _______ _____ 
        | ____|  \/  |  _ \| |   / _ \ \ / / ____| ____|
        |  _| | |\/| | |_) | |  | | | \ V /|  _| |  _|  
        | |___| |  | |  __/| |__| |_| || | | |___| |___ 
        |_____|_|  |_|_|   |_____\___/ |_| |_____|_____|
                                                        
         __  __    _    _   _    _    ____ _____ ____ _____ ____  
        |  \/  |  / \  | \ | |  / \  / ___| ____/ ___| ____|  _ \ 
        | |\/| | / _ \ |  \| | / _ \| |  _|  _|| |  _|  _| | |_) |
        | |  | |/ ___ \| |\  |/ ___ \ |_| | |__| |_| | |___|  _ < 
        |_|  |_/_/   \_\_| \_/_/   \_\____|_____\____|_____|_| \_\
        `
     );                                                             
        
    
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

module.exports = startPrompt;