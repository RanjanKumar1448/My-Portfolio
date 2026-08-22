const express = require("express");
const app = express();
const port = 8080;
const path = require("path");

require("dotenv").config();

const mysql = require("mysql2");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
connection.connect((err) => {
    if (err) {
        console.log("Database connection failed:", err);
        return;
    }

    console.log("MySQL connected!");
});
app.listen(port ,()=>{
  console.log(`app is listening on port:${port}`);
});