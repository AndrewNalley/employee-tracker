const inquirer = require("inquirer");
const db = require("./server");

// If user adds to a department, this check will make sure it exists
const validateDepartment = (input) => {
  return db
    .promise()
    .query("SELECT * FROM department ORDER BY id")
    .then(([rows]) => {
      const departmentIds = rows.map((row) => row.id);

      if (!departmentIds.includes(input)) {
        return (
          console.log(
            "\n ❌ Invalid department ID. Unable to add Department. ❌ \n"
          ),
          init()
        );
      }

      return true;
    })
    .catch((error) => {
      console.log("Error occurred while fetching departments:", error);
      throw new Error("An error occurred. Please try again.");
    });
};

const validateManager = (input) => {
  return db
    .promise()
    .query("SELECT * FROM employee ORDER BY id")
    .then(([rows]) => {
      const managerIDs = rows.map((row) => row.id);

      if (input === null || managerIDs.includes(input)) {
        return true;
      } else {
        console.log("\n ❌ Invalid Manager ID. Unable to add Employee. ❌ \n");
        return init();
      }
    })
    .catch((error) => {
      console.log("Error occurred while fetching employee data:", error);
      throw new Error("An error occurred. Please try again.");
    });
};

const validateRole = (input) => {
  return db
    .promise()
    .query("SELECT * FROM role ORDER BY id")
    .then(([rows]) => {
      const roleIDs = rows.map((row) => row.id);;

      if (input === null || roleIDs.includes(input)) {
        return true;
      } else {
        console.log("\n ❌ Invalid Role ID. Unable to add. ❌ \n");
        return init();
      }
    })
    .catch((error) => {
      console.log("Error occurred while fetching role data:", error);
      throw new Error("An error occurred. Please try again.");
    });
};

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
        console.log(
          "An error occurred while retrieving department data. Please try again."
        );
        backToMainMenu();
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
        console.log(
          "An error occurred while retrieving role data. Please try again."
        );
        backToMainMenu();
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
        console.log(
          "An error occurred while retrieving employee data. Please try again."
        );
        backToMainMenu();
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
              "\n 💥",
              "Department added! Department ID:",
              response[0].insertId,
              "💥 \n"
            );
            backToMainMenu();
          })
          .catch((error) => {
            console.error(
              "An error occurred while adding the department:",
              error
            );
            console.log("Failed to add the department. Please try again.");
            backToMainMenu();
          });
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
        {
          name: "roleSalary",
          type: "number",
          message: "What is the salary for this role?",
        },
        {
          name: "roleDepartment",
          type: "number",
          message:
            "What department does this role belong to? Please enter the ID of the department.",
          // if not a number input, or if the user hits enter, returns null
          filter: (input) => {
            if (isNaN(input)) {
              return null;
            }
            return input;
          },
          validate: validateDepartment,
        },
      ])
      .then((answers) => {
        db.promise()
          .query(
            "INSERT INTO role (title, salary, department_id) VALUES (?,?,?)",
            [answers.roleTitle, answers.roleSalary, answers.roleDepartment]
          )
          .then((response) => {
            console.log(
              "\n 💥 Role added! Role ID:",
              response[0].insertId,
              " 💥 \n"
            );
            backToMainMenu();
          })
          .catch((error) => {
            console.error(
              "An error occurred while adding the role:",
              error
            );
            console.log("Failed to add the role. Please try again.");
            backToMainMenu();
          });
      });
  },
  "Add an employee": () => {
    // prompt employee first name, last name, role, manager (if applicable)
    inquirer
      .prompt([
        {
          name: "firstName",
          type: "input",
          message: "What is the employee's first name?",
        },
        {
          name: "lastName",
          type: "input",
          message: "What is the employee's last name?",
        },
        {
          name: "role",
          type: "number",
          message:
            "What is the role of this employee? Please enter the role ID.",
          filter: (input) => {
            if (isNaN(input)) {
              return null;
            }
            return input;
          },
          validate: validateRole,
        },
        {
          name: "manager",
          type: "number",
          message:
            "Finally, who is the employee's manager? If no manager, please hit enter.",
          // if not a number input, or if the user hits enter, returns null
          filter: (input) => {
            if (isNaN(input)) {
              return null;
            }
            return input;
          },
          validate: validateManager,
        },
      ])
      .then((answers) => {
        db.promise()
          // add the employee to table
          .query(
            "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)",
            [answers.firstName, answers.lastName, answers.role, answers.manager]
          )
          .then((response) => {
            console.log("\n 💥 Employee added! Employee ID:", response[0].insertId, " 💥 \n");
            backToMainMenu();
          })
          .catch((error) => {
            console.error(
              "An error occurred while adding the employee:",
              error
            );
            console.log("Failed to add the employee. Please try again.");
            backToMainMenu();
          });
      });
  },
  "Update an employee role": () => {
    // select an employee to update
    inquirer
      .prompt([
        {
          name: "firstName",
          type: "input",
          message: "What is the first name of the employee?"
        },
        {
          name: "lastName",
          type: "input",
          message: "What is the last name of the employee?"
        },
        {
          name: "newRole",
          type: "number",
          message: "What is the new role for this employee?",
          filter: (input) => {
            if (isNaN(input)) {
              return null;
            }
            return input;
          },
          validate: validateRole,
        }
      ])
      .then((answers) => {
        db.promise()
          .query(
            `UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?`,
            [answers.newRole, answers.firstName, answers.lastName]
          )
          .then(() => {
            console.log("\n ✅ Employee role updated successfully! ✅ \n");
            backToMainMenu();
          })
          .catch((error) => {
            console.error("An error occurred while updating the employee role:", error);
            console.log("Failed to update the employee role. Please try again.");
            backToMainMenu();
          });
      });
  },
  "Update employee's manager": () => {
    inquirer
      .prompt([
        {
          name: "firstName",
          type: "input",
          message: "Please enter the employee's first name."
        },
        {
          name: "lastName",
          type: "input",
          message: "Please enter the employee's last name."
        },
        {
          name: "managerID",
          type: "number",
          message: "Please enter the new manager ID.",
          filter: (input) => {
            if (isNaN(input)) {
              return null;
            }
            return input;
          },
          validate: validateManager,
        }
      ])
      .then((answers) => {
        db.promise()
          .query(
            "UPDATE employee SET manager_id = ? WHERE first_name = ? AND last_name = ?",
            [answers.managerID, answers.firstName, answers.lastName],
          )
          .then((response) => {
            console.log(
              "\n 💥 Manager updated! 💥 \n"
            );
            backToMainMenu();
          })
          .catch((error) => {
            console.error(
              "An error occurred while adding the role:",
              error
            );
            console.log("Failed to add the role. Please try again.");
            backToMainMenu();
          });
      });
  },
  "Quit": () => {
    inquirer
      .prompt([
        {
          name: "confirmExit",
          type: "confirm",
          message: "\n 🛠️ Are you sure you want to exit? 🛠️ \n",
        },
      ])
      .then((answer) => {
        if (answer.confirmExit) return process.exit();
      })
      .catch((error) => {
        console.error("An error occurred while trying to exit:", error);
        console.log("Failed to exit. Returning to the Main Menu.");
        backToMainMenu();
      })
  },
};

function welcomeBanner() {
  console.log(`
     __   __   __   __   __   __   __   __   __   __   __   __   __   __   __   ___
   / ___/ ___/ ___/ ___/ ___/ ___/ ___/ ___/ ___/ ___/ ___/ ___/ ___/ ___/ ___/ ___ \\
   \\ __ / __ / __ / __ / __ / __ / __ / __ / __ / __ / __ / __ / __ / __ / __ / ___ /
  ^                                                                                  ^
| | |                                                                              | | |
 \\ \\        EEEEEEE MM    MM PPPPPP  LL       OOOOO  YY   YY EEEEEEE EEEEEEE        \\ \\
| | |       EE      MMM  MMM PP   PP LL      OO   OO YY   YY EE      EE            | | |
 \\ \\        EEEEE   MM MM MM PPPPPP  LL      OO   OO  YYYYY  EEEEE   EEEEE          \\ \\
| | |       EE      MM    MM PP      LL      OO   OO   YYY   EE      EE            | | |
 \\ \\        EEEEEEE MM    MM PP      LLLLLLL  OOOO0    YYY   EEEEEEE EEEEEEE        \\ \\
| | |                                                                              | | |
 \\ \\            TTTTTTT RRRRRR    AAA    CCCCC  KK  KK EEEEEEE RRRRRR               \\ \\
| | |             TTT   RR   RR  AAAAA  CC    C KK KK  EE      RR   RR             | | |
 \\ \\              TTT   RRRRRR  AA   AA CC      KKKK   EEEEE   RRRRRR               \\ \\
| | |             TTT   RR  RR  AAAAAAA CC    C KK KK  EE      RR  RR              | | |
 \\ \\              TTT   RR   RR AA   AA  CCCCC  KK  KK EEEEEEE RR   RR              \\ \\
| | |                                                                              | | |
 \\ /                                                                                \\ /
  V  __   __   __   __   __   __   __   __   __   __   __   __   __   __   __   ___  V
   / ___/ ___/ ___/ ___/ ___/ ___/ ___/ ___/ ___/ ___/ ___/ ___/ ___/ ___/ ___/ ___ \\
   \\ __ / __ / __ / __ / __ / __ / __ / __ / __ / __ / __ / __ / __ / __ / __ / ___ /


                         __   __   __   __   __   __   __  ___
                       / ___/ ___/ ___/ ___/ ___/ ___/ ___/ __ \\
                       \\ __ / __ / __ / __ / __ / __ / __ / __ /
                      ^                                         ^
                    | | |                                     | | |
                     \\ \\                                       \\ \\
                    | | |               WELCOME!              | | |
                     \\ \\                                       \\ \\
                    | | |            PLEASE SELECT            | | |
                     \\ \\             OPTIONS BELOW             \\ \\
                    | | |                                     | | |
                     \\ \\                                       \\ \\
                    | | |                                     | | |
                     \\ /                                       \\ /
                      V  __   __   __   __   __   __   __  ___  V
                       / ___/ ___/ ___/ ___/ ___/ ___/ ___/ __ \\
                       \\ __ / __ / __ / __ / __ / __ / __ / __ /
`)
};

// start the app
function init() {
  inquirer
    .prompt([
      {
        name: "action",
        type: "list",
        message: "\n 🛠️  What would you like to do? 🛠️ \n",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "Update employee's manager",
          "Quit",
        ],
      },
    ])
    .then((answer) => {
      console.log("\n 👉 Action selected: ", answer);
      const action = options[answer.action];
      if (action) {
        action();
      } else {
        console.log("\n ⛔️ Please try again! ⛔️ \n");
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
        type: "input",
        message: "\n ✅ Press Enter to return to the Main Menu ✅ \n",
      },
    ])
    .then(() => {
      init();
    });
}

// start the app
welcomeBanner();
init();