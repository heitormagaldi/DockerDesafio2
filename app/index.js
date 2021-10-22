const express = require("express");
const app = express();
const port = 5000;
const config = {
  host: "db",
  user: "root",
  password: "root",
  database: "nodedb",
};
const mysql = require("mysql");
const connection = mysql.createConnection(config);

let retornoHtml = "<h1>Full Cycle Rocks!</h1> <h2>Pessoas cadastradas</h2>";

let sql = `TRUNCATE TABLE people;`;
/*let sql = `CREATE TABLE people( 
          ID int NOT NULL AUTO_INCREMENT,
          NAME varchar(255) NOT NULL,
          PRIMARY KEY (ID));`;
*/
try {
  connection.query(sql);
} catch (Error) {
  sql = `CREATE TABLE people( 
          ID int NOT NULL AUTO_INCREMENT,
          NAME varchar(255) NOT NULL,
          PRIMARY KEY (ID));`;
  connection.query(sql);
}

sql = `INSERT INTO people(NAME) values('Heitor Magaldi')`;
connection.query(sql);
sql = `INSERT INTO people(NAME) values('Roberto Carlos')`;
connection.query(sql);
sql = `INSERT INTO people(NAME) values('Valeu equipe de Suporte!')`;
connection.query(sql);

let table = "<table id='tabPeople'><tr><th>ID</th><th>Nome</th></tr>";

let getEmployeeNames = function () {
  return new Promise(function (resolve, reject) {
    connection.query("SELECT * FROM people", function (err, rows) {
      if (rows === undefined) {
        reject(new Error("Error rows is undefined"));
      } else {
        resolve(rows);
      }
    });
  });
};

let retorno = getEmployeeNames()
  .then(function (results) {
    results.map((element) => {
      table += `<tr><td>${element.ID}</td><td>${element.NAME}</td>`;
    });

    table += "</table>";

    retornoHtml += table;
    app.get("/", (req, res) => {
      res.send(retornoHtml);
    });
  })
  .catch(function (err) {
    console.log("Promise rejection error: " + err);
  });

connection.end();

app.listen(port, () => {
  console.log("Rodando na porta " + port);
});
