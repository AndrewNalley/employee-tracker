const inquirer = require('inquirer');
const db = require('./server')

const options = {
    "View all departments": () => {
        db.promise()
            .query("SELECT * FROM department ORDER BY id")
            .then(([rows]) => {
                console.table(rows);
                console.log("\n");
                backToMainMenu();
            })
            .catch((error) => {
                console.error(error);
            });
    },
    "View all roles": () => {
        db.promise().query("SELECT * FROM role")
    },
    "View all employees": () => {
        db.promise().query("SELECT * FROM employee")
    },
    "Add a department": () => {
        inquirer.prompt([
            {
                name: "departmentName",
                type: "input",
                message: "What is the name of the department?"
            }
        ]).then(answer => {
            db.promise().query("INSERT INTO department (name) VALUES (?)", [answer.departmentName], (err, res) => {
                if (err) throw err;
                console.log("Department added!");
            })
                .then(() => init())
                .catch(err => console.log(err))
        });
    },
    "Add a role ": () => {
        // prompt role, salary, department
        db.promise().query("SELECT * FROM role")
        // add the role to table
    },
    "Add an employee": () => {
        // prompt employee first name, last name, role, manager (if applicable)
        db.promise().query("SELECT * FROM employee")
        // add the employee to table
    },
    // option 7 - update an employee role
    "Update an employee role": () => {
        // select an employee to update
        db.promise().query("SELECT * FROM employee")
        // update role (and manager if applicable)
    },
    "Quit": () => {
        inquirer
            .prompt([
                {
                    name: "confirmExit",
                    type: "confirm",
                    message: "Are you sure you want to exit?",
                },
            ])
            .then((answer) => {
                if (answer.moreQuery) return process.exit();
            });
    }
};

function init() {
    inquirer
        .prompt([
            {
                name: "action",
                type: "list",
                message: "What would you like to do?",
                choices: [
                    "View all departments",
                    "View all roles",
                    "View all employees",
                    "Add a department",
                    "Add a role",
                    "Add an employee",
                    "Update an employee role",
                    "Quit"
                ]
            }
        ])
        .then(answer => {
            console.log(answer);
            const action = options[answer.action];
            if (action) {
                action();
            } else {
                console.log("Please try again!");
                init();
            }
        }).catch(err => console.log(err))
};

function backToMainMenu() {
    inquirer
        .prompt([
            {
                name: "Menu",
                type: "confirm",
                message: "Would you like to go back to the main menu?",
            }
        ])
        .then(answer => {
            if (answer.Menu) return init();
        });
};

// start the app
init();
