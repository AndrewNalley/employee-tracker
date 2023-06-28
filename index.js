const inquirer = require("inquirer");
const db = require("./server");

// Below 3 functions allow user to easily find information by name, not ID, then return ID for data manipulation
const getDepartmentNames = () => {
  return db.promise()
    .query("SELECT name FROM department")
    .then(([rows]) => {
      return rows.map((row) => row.name);
    })
    .catch((error) => {
      console.error("An error occurred while retrieving department names:", error);
      return [];
    });
};
const getDepartmentId = (input) => {
  return db.promise()
    .query("SELECT id FROM department WHERE name = ?", [input])
    .then(([rows]) => {
      if (rows.length > 0) {
        return rows[0].id;
      } else {
        return null;
      }
    })
    .catch((error) => {
      console.error("An error occurred while retrieving department ID:", error);
      return null;
    });
};
const getRoleNames = () => {
  return db.promise()
    .query("SELECT title FROM role")
    .then(([rows]) => {
      return rows.map((row) => row.title);
    })
    .catch((error) => {
      console.error("An error occurred while retrieving role titles:", error);
      return [];
    })
};
const getRoleId = (input) => {
  return db.promise()
    .query("SELECT id FROM role WHERE title = ?", [input])
    .then(([rows]) => {
      if (rows.length > 0) {
        return rows[0].id;
      } else {
        return null;
      }
    })
    .catch((error) => {
      console.error("An error occurred while retrieving the role ID:", error);
      return null;
    });
};
const getManagerNames = () => {
  return db.promise()
    .query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL")
    .then(([rows]) => {
      const managerNames = rows.map((row) => row.name);
      return managerNames;
    })
    .catch((error) => {
      console.error("An error occurred while retrieving manager names:", error);
      return [];
    });
};
const getManagerId = (firstName, lastName) => {
  return db.promise()
    .query("SELECT id FROM employee WHERE first_name = ? AND last_name = ?", [firstName, lastName])
    .then(([rows]) => {
      if (rows.length > 0) {
        return rows[0].id;
      } else {
        return null;
      }
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
  "Add a role": async () => {
    try {
      // prompt role, salary, department
      const departmentNames = await getDepartmentNames();
      const answers = await inquirer.prompt([
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
          type: "list",
          message: "In what department does this role belong?",
          choices: departmentNames,
        },
      ]);

      const departmentId = await getDepartmentId(answers.roleDepartment);

      if (departmentId) {
        const response = await db.promise().query(
          "INSERT INTO role (title, salary, department_id) VALUES (?,?,?)",
          [answers.roleTitle, answers.roleSalary, departmentId]
        );

        console.log(
          "\n 💥 Role added! Role ID:",
          response[0].insertId,
          " 💥 \n"
        );
        backToMainMenu();
      }
    } catch (error) {
      console.error("An error occurred while adding the role:", error);
      console.log("Failed to add the role. Please try again.");
      backToMainMenu();
    }
  },
  "Add an employee": async () => {
    try {
      // prompt employee first name, last name, role, manager (if applicable)
      const roleNames = await getRoleNames();
      const managerNames = await getManagerNames();

      const answers = await inquirer.prompt([
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
          type: "list",
          message: "What is the role of this employee?",
          choices: roleNames,
        },
        {
          name: "manager",
          type: "list",
          message:
            "Finally, who is the employee's manager? If no manager, please hit enter.",
          choices: managerNames,
        },
      ]);

      const roleId = getRoleId(answers.role);
      const managerId = getManagerId(answers.manager);

      if (roleId) {
        const response = await db.promise().query(
          "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)",
          [answers.firstName, answers.lastName, roleId, managerId]
        );

        console.log(
          "\n 💥 Employee added! Employee ID:",
          response[0].insertId,
          " 💥 \n"
        );
        backToMainMenu();
      }
    } catch (error) {
      console.error("An error occurred while adding the employee:", error);
      console.log("Failed to add the employee. Please try again.");
      backToMainMenu();
    }
  },
  "Update an employee role": async () => {
    try {
      // select an employee to update
      const roleName = await getRoleNames();
      const answers = await inquirer.prompt([
        {
          name: "firstName",
          type: "input",
          message: "What is the first name of the employee?",
        },
        {
          name: "lastName",
          type: "input",
          message: "What is the last name of the employee?",
        },
        {
          name: "newRole",
          type: "list",
          message: "What is the new role for this employee?",
          choices: roleName,
        },
      ]);

      const roleId = await getRoleId(answers.newRole);

      if (roleId) {
        await db.promise().query(
          `UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?`,
          [roleId, answers.firstName, answers.lastName]
        );

        console.log("\n ✅ Employee role updated successfully! ✅ \n");
        backToMainMenu();
      }
    } catch (error) {
      console.error("An error occurred while updating the role:", error);
      console.log("Failed to update role. Please try again.");
      backToMainMenu();
    }
  },
  "Update employee's manager or change to manager status": async () => {
    try {
      const managerNames = await getManagerNames();
      const answers = await inquirer.prompt([
        {
          name: "firstName",
          type: "input",
          message: "Please enter the employee's first name.",
        },
        {
          name: "lastName",
          type: "input",
          message: "Please enter the employee's last name.",
        },
        {
          name: "manager",
          type: "list",
          message:
            "If the employee is a manager, please select null. Otherwise, choose a manager for this employee.",
          choices: managerNames,
        },
      ]);

      const managerId = await getManagerId(answers.manager);

      if (managerId) {
        await db.promise().query(
          "UPDATE employee SET manager_id = ? WHERE first_name = ? AND last_name = ?",
          [managerId, answers.firstName, answers.lastName]
        );

        console.log("\n 💥 Manager updated! 💥 \n");
        backToMainMenu();
      }
    } catch (error) {
      console.error("An error occurred while updating the manager:", error);
      console.log("Failed to update the manager. Please try again.");
      backToMainMenu();
    }
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