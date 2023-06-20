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

app.get(`/api/employee`, (req, res) => {
    db.query(`SELECT * FROM employee`, (err, data) => {
        if (err) {
            res.status(500).json({
                success: false,
                error: err
            })
        }
        res.json({
            success: true,
            body: data
        });
    })
});
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
