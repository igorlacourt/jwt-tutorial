const Pool = require("pg").Pool; 

// configure how and where to connect with the dataase
// all requests come from this pool
const pool = new Pool({
    user: "postgres",
    password: "123",
    host: "localhost",
    port: 5432,
    database: "jwttutorial"
}); 

module.exports = pool;