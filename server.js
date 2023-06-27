// connect to the database
const mysql = require('mysql2')

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123password",
    database: "employee_db"
})
// error handling
db.connect(function (err) {
    if (err) throw err;
})

// export the connection
module.exports = db;