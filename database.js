const {Client} = require("pg");
const client = new Client({
    port:5432,
    host: "localhost",
    user: "postgres",
    password: "Votre mot de passe postgres SQL",
    database:"Le nom de la database créée"
})

client.connect();

module.exports.clientPG = client; 
