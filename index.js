const inquirer = require("inquirer");
const db = require("./server");

const options = {
  "View all departments": () => {
    db.promise()
      .query("SELECT * FROM department ORDER BY id")
      .then(([rows]) => {
        const formatDate = rows.map((row) => ({
          ...row,
          date_added: new Date(row.date_added).toLocaleString(),
        }));
        console.table(formatDate);
        console.log("\n");
        backToMainMenu();
      })
      .catch((error) => {
        console.error(error);
      });
  },
  "View all roles": () => {
    db.promise()
      .query("SELECT * FROM role ORDER BY id")
      .then(([rows]) => {
        const formatDate = rows.map((row) => ({
          ...row,
          date_added: new Date(row.date_added).toLocaleString(),
        }));
        console.table(formatDate);
        console.log("\n");
        backToMainMenu();
      })
      .catch((error) => {
        console.error(error);
      });
  },
  "View all employees": () => {
    db.promise()
      .query("SELECT * FROM employee ORDER BY id")
      .then(([rows]) => {
        const formatDate = rows.map((row) => ({
          ...row,
          date_added: new Date(row.date_added).toLocaleString(),
        }));
        console.table(formatDate);
        console.log("\n");
        backToMainMenu();
      })
      .catch((error) => {
        console.error(error);
      });
  },
  "Add a department": () => {
    inquirer
      .prompt([
        {
          name: "departmentName",
          type: "input",
          message: "What is the name of the department?",
        },
      ])
      .then((answer) => {
        db.promise()
          .query("INSERT INTO department (name) VALUES (?)", [
            answer.departmentName,
          ])
          .then((response) => {
            console.log(
              "Department added! Department ID:",
              response[0].insertId
            );
          })
          .then(() => init())
          .catch((err) => console.log(err));
      });
  },
  "Add a role": () => {
    // prompt role, salary, department
    inquirer
      .prompt([
        {
          name: "roleTitle",
          type: "input",
          message: "What is the title of the role?",
        },
      ])
      .then((answer) => {
        db.promise()
          .query("INSERT INTO role (title) VALUES (?)", [answer.roleTitle])
          .then((response) => {
            console.log("Role added! Role ID:", response[0].insertId);
          })
          .then(() => init())
          .catch((err) => console.log(err));
      });
  },

  "Add an employee": () => {
    // prompt employee first name, last name, role, manager (if applicable)
    db.promise().query("SELECT * FROM employee");
    // add the employee to table
  },
  // option 7 - update an employee role
  "Update an employee role": () => {
    // select an employee to update
    db.promise().query("SELECT * FROM employee");
    // update role (and manager if applicable)
  },
  Quit: () => {
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
  },
};

// start the app
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
          "Quit",
        ],
      },
    ])
    .then((answer) => {
      console.log(answer);
      const action = options[answer.action];
      if (action) {
        action();
      } else {
        console.log("Please try again!");
        init();
      }
    })
    .catch((err) => console.log(err));
}
// back to the main menu
function backToMainMenu() {
  inquirer
    .prompt([
      {
        name: "Menu",
        type: "confirm",
        message: "Would you like to go back to the main menu?",
      },
    ])
    .then((answer) => {
      if (answer.Menu) return init();
    });
}

// start the app
init();
