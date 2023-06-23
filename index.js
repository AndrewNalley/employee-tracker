const inquirer = require('inquirer');
const db = require('./server')

function inquirerInit() {
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
    db.promise().query("SELECT * FROM role")
        .then(data => {
            console.table(data)
        })
        .then(() => init())
}



db.query(`SELECT * FROM employee`, (err, result) => {
    if (err) {
        res.status(500).json({
            success: false,
            error: err
        })
    }
    res.json({
        success: true,
        body: result
    });
})


// add new employee 

const { first_name, last_name, role_id } = req.body;
db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
    [first_name, last_name, role_id, manager_id],
    (err, result) => {
        if (err) {
            res.status(500).json({
                success: false,
                error: err
            })
        }
        res.status(201).json({
            success: true,
            body: req.body
        });
    })
});

// update employee 

db.query(`UPDATE employee SET first_name =?, last_name =?, role_id =? WHERE id =?`, [req.body.first_name, req.body.last_name, req.body], (err, result) => {
    if (err) {
        res.status(400).json({
            success: false,
            error: err
        })
    } else if (!result.affectedRows) {
        res.status(404).json({
            success: false,
            error: "Employee not found"
        })
    } else {
        res.json({
            success: true,
            data: req.body,
            changes: result.affectedRows
        })
    }
});


// delete employee 

db.query(`DELETE FROM employee WHERE id =?`, [req.params.id], (err, result) => {
    if (err) {
        res.status(400).json({
            success: false,
            error: err
        })
    } else if (!result.affectedRows) {
        res.status(404).json({
            success: false,
            error: "Employee not found"
        })
    } else {
        res.json({
            success: true,
            message: "Employee deleted",
            changes: result.affectedRows
        })
    }
});



inquirerInit();