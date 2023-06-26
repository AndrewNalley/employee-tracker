// connect to the database
const mysql = require('mysql2')

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123password",
    database: "employees_db"
})
// error handling
db.connect(function (err) {
    if (err) throw err;
})
// Specify the database to use
db.query('USE employee_db', (err) => {
    if (err) throw err;
    console.log('Using employee_db database.');
})
// export the connection
module.exports = db;