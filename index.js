const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
require("dotenv").config();

const mysql = require("mysql2");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

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
app.get("/", (req, res) => {

    let projectQuery = `SELECT * FROM projects`;
    let skillQuery = `SELECT * FROM skills`;

    connection.query(projectQuery, (err, projects) => {

        if (err) {
            console.log(err);
            return res.send("Error fetching projects");
        }

        connection.query(skillQuery, (err, skills) => {

            if (err) {
                console.log(err);
                return res.send("Error fetching skills");
            }

            res.render("index.ejs", {
                projects,
                skills
            });
        });
    });
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

//Checking is username and password is valid or not..
app.post("/admin/login",(req,res)=>{
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

// back to main page..
app.get("/",(req,res)=>{
    res.render("index.ejs");
});
//back to admin dashboard
app.get("/Admin/dashbord.ejs",(req,res)=>{
    res.render("Admin/dashbord.ejs");
});


// render project form.
app.get("/admin/projects/add",(req,res)=>{
     res.render("Admin/addproject.ejs");
});

//insert new project in portfolio
app.post("/admin/projects/add",(req,res)=>{
 let {name,description,technologies,github} = req.body;
 let q = `INSERT INTO projects (name, description,technologies , github)
        VALUES (?,?,?,?)`;
   let val =[name,description,technologies,github || null];
connection.query(q,val,(err,result)=>{
  if(err){
    console.log(err);
     return res.send("Error adding project");
  }
       console.log("Project added successfully!");

      res.redirect("/");
})

});

// insert message in table..

app.post("/contact",(req,res)=>{

let {name,email,message} = req.body;

let q =` INSERT INTO message (name,email,message) VALUES ?`;
 
let val = [[name,email,message]];

connection.query(q,[val],(err,result)=>{
if(err){
  console.log(err);
  return res.send("error sending message")
}
console.log("Message sent successfully!");

 res.redirect("/");
});
});

// view message send by visitors..

app.get("/admin/message",(req,res)=>{
  let q = `SELECT * FROM message`;
 try{
    connection.query(q,(err,result)=>{
       if(err) throw err;
      let messages = result;
      res.render("Admin/message.ejs",{messages});
  });
 }catch(err){
  console.log(err);
 }
 
});

//skills ..

app.get("/admin/skills/add",(req,res)=>{
   res.render("Admin/add-skill.ejs");
});

app.post("/admin/skills/add",(req,res)=>{
let {name} = req.body;
let q = `INSERT INTO skills (name) VALUES ?`;
let val = [[name]];

connection.query(q,[val],(err,result)=>{
  if(err){
    console.log(err);
     return res.send("error in database");
  }
  console.log("add skill successful");
   res.redirect("/");
});
});
//admin project page.
app.get("/admin/projects", (req, res) => {

    let q = "SELECT * FROM projects";

    connection.query(q, (err, projects) => {

        if (err) {
            console.log(err);
            return res.send("Database error");
        }

        res.render("Admin/projects.ejs", { projects });
    });
});

// project with there id

app.get("/admin/projects/edit/:id",(req,res)=>{
    let {id} = req.params;
    let q =` SELECT * FROM projects where id = ?`;
   connection.query(q,[id],(err,result)=>{
      if(err){
        console.log(err);
       return res.send("error in database");
      }
      let project = result[0];
      console.log("data access successfully");
       res.render("Admin/edit-project.ejs",{project})
   });
});
// patch request to update project info in db..

app.patch("/admin/projects/edit/:id",(req,res)=>{
     let {id} = req.params;
     let {name:newname,
        description:newdescription,
        technologies:newtechnologies,
        github:link} = req.body;
       let q = `
    UPDATE projects
    SET name = ?, description = ?, technologies = ?, github = ?
    WHERE id = ?
`;
connection.query(q,[newname,
    newdescription,
    newtechnologies,
    link,id],(err,result)=>{
       if(err){
        console.log(err);
       return res.send("database error");
       }
          console.log("Project updated successfully");
          res.redirect("/admin/projects")
    });
      });

      //delete
      app.delete("/admin/projects/delete/:id",(req,res)=>{
        let {id} = req.params;
        let q = `DELETE FROM projects WHERE id = ?`;
        connection.query(q,[id],(err,result)=>{
           if(err){
            console.log(err);
           return res.send("database error");
           }
           console.log("project delete successfully");
        })
      });

app.listen(port ,()=>{
  console.log(`app is listening on port:${port}`);
});


