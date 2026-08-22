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

//inserting values in table.

// let q = `INSERT INTO projects
// (name, description, technologies, github)
// VALUES ?`

// const projects = [
//     [
//         "Portfolio Website",
//         "A personal portfolio website to showcase my skills and projects.",
//         "HTML, CSS, JavaScript, Node.js, Express.js, EJS, MySQL",
//         null
//     ],
//     [
//         "Student Management System",
//         "A web application for managing student records.",
//         "Node.js, Express.js, EJS, MySQL",
//         null
//     ],
//     [
//         "Crime Reporting Website",
//         "A web application for submitting and managing crime reports.",
//         "Python, Flask, HTML, CSS, JavaScript, MySQL",
//         null
//     ]
// ];

// try{
// connection.query(q,[projects],(err,result)=>{
//     if(err) throw err;
//     console.log(result);
// });
// }catch(err){
//   console.log(err);
// }

app.get("/",(req,res)=>{
  let q = `SELECT * FROM projects`;
  try{
    connection.query(q,(err,result)=>{
    if(err)throw err;
   let projects = result;
   res.render("index.ejs",{projects});
  });
  }catch(err){
    console.log(err);
  }
});

app.listen(port ,()=>{
  console.log(`app is listening on port:${port}`);
});