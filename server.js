const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123password',
    database: 'employee_db'
}, console.log(`Connected to the employee_db database.`));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// get all employees route
app.get(`/api/employee`, (req, res) => {
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
});
// add new employee route
app.post(`/api/employee`, (req, res) => {
    const { first_name, last_name, role_id } = req.body;
    db.query(`INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)`,
        [first_name, last_name, role_id],
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
// update employee route
app.put("/api/employee/:id", (req, res) => {
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
    })
});

app.delete("/api/employee/:id", (req, res) => {
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
});

// server listening
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
