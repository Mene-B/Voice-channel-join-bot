const {Client} = require("pg");
const client = new Client({
    port:5432,
    host: "localhost",
    user: "postgres",
    password: "edouard2005",
    database:"Voice"
})

client.connect();

module.exports.clientPG = client; 