const mysql2 = require('mysql2');
require('dotenv').config();

const databaseConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
};

function connectToDatabase() {
    const database = mysql2.createConnection(databaseConfig);

    database.connect((error) => {
        if (error) {
            console.log(`Error connecting to database: ${error.stack}`);
        } else {
            console.log(`Connected to database! Connection id: ${database.threadId}`);
        }
    });

    return database;
}

module.exports = connectToDatabase();
