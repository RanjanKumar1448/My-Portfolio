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

//Admain page formate started..

const bcrypt = require("bcrypt");

// const password = "admin@123";

// bcrypt.hash(password, 10, (err, hash) => {
//     if (err) {
//         console.log(err);
//         return;
//     }

//     console.log(hash);
// });

//  let q = `INSERT INTO admins (username, password) VALUES (?, ?)`;

// let val = [
//     "admin",
//     "$2b$10$n8FEa5gJnvFbDYrKcL4rRO88X9hztnDAsL.yLEysUf1TA8EmGhM7e"
// ];

// connection.query(q, val, (err, result) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Admin created:", result);
//     }
// });

//to get login form when click admin button.
app.get("/admin/login",(req,res)=>{
     res.render("Admin/login.ejs");
});

app.post("/admin/dashboard",(req,res)=>{
  let {username,password} = req.body;
   let q = `SELECT * FROM admins WHERE username = ?`
   connection.query(q,[username],(err,result)=>{
       if(err){
        console.log(err);
        return res.send("database error!")
       }
       if(result.length === 0){
         return res.send("invalid username or password!");
       }
          let admin = result[0];

           bcrypt.compare(password, admin.password, (err, match) => {

            if (err) {
                console.log(err);
                return res.send("Something went wrong");
            }

            if (!match) {
                return res.send("Invalid username or password");
            }

            res.render("Admin/dashbord.ejs");
        });

   });
});

app.listen(port ,()=>{
  console.log(`app is listening on port:${port}`);
});