const inquirer = require('inquirer');
const connection = require('./db/connection')

function init() {
    inquirer
        .prompt([
            {
                message: "What would you like to do?",
                name: "choice",
                type: "list",
                choices: ["View all departments", "View all roles", "View all roles", "Quit"]
            }
        ]).then(answers => {
            switch (answers) {
                case "view all departments":
                    break;
                case "View all roles":
                    viewAllRoles();
                    break;
                case "quit":
                    console.log("Goodbye!")
                    process.exit(0)
            }
        })
}
function viewAllRoles() {
    connection.promise().query("SELECT * FROM role")
        .then(data => {
            console.table(data)
        })
        .then(() => init())
}

init()