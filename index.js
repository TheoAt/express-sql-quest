const express = require("express");
const connection = require("./config");
const app = express();
const port = 8000;

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.get("/", (req, res) => {
  res.send("API Wild Code School Orléans");
});

app.get("/api/students", (req, res) => {
  connection.query("SELECT * FROM students", (err, results) => {
    if(err){
      res.status(500).send("Error retrieving data");
    } else {
      res.status(200).json(results);
    }
  });
});

app.get("/api/students/:id", (req, res) => {
  connection.query(
    "SELECT * from students WHERE id=?",
    [req.params.id],
    (err, results) => {
      if (err) {  
        console.log(err);
        res.status(500).send("Error retrieving data");
      } else {
        res.status(200).json(results);
      }
    }
  );
});

app.get("/api/students/search", (req, res) => {
  connection.query(
    "SELECT * from students WHERE nom LIKE '%?%'",
    [req.query.name],
    (err, results) => {
      if(err){
        res.status(500).send("error retrieving datas");
      }else{
        if(results.length > 0){
          res.status(200).json(results);
        }else{
          res.status(404).send("No results for this duration");
        }
      }
    }
  )
});

app.get("/api/students/search", (req, res) => {
  connection.query(
    "SELECT * from students WHERE nom LIKE '?%'",
    [req.query.firstLetterName],
    (err, results) => {
      if(err){
        res.status(500).send("error retrieving datas");
      }else{
        if(results.length > 0){
          res.status(200).json(results);
        }else{
          res.status(404).send("No results for this duration");
        }
      }
    }
  )
});

app.get("/api/students/search", (req, res) => {
  connection.query(
    "SELECT * from students WHERE age >= ?",
    [req.query.minAge],
    (err, results) => {
      if(err){
        res.status(500).send("error retrieving datas");
      }else{
        if(results.length > 0){
          res.status(200).json(results);
        }else{
          res.status(404).send("No results for this duration");
        }
      }
    }
  )
});

app.get("/api/students/order", (req, res) => {
  connection.query(
    "SELECT * from students WHERE nom ORDER BY ?",
    [req.query.order],
    (err, results) => {
      if(err){
        res.status(500).send("error retrieving datas");
      }else{
        if(results.length > 0){
          res.status(200).json(results);
        }else{
          res.status(404).send("No results for this duration");
        }
      }
    }
  )
});

app.post("/api/students", (req, res) => {
  connection.query(
    "INSERT INTO students SET ?",
    req.body, 
    (err, results) => {
          if (err) {
            res.status(500).send("Error saving a student");
          } else {
            res.status(200).send({id: results.insertId, ...req.body});
          }
        }
    ); 
});

app.put("/api/students/:id", (req, res) => {
  const idStudent = req.params.id;
  const newStudent = req.body;
  connection.query(
    "UPDATE students SET ? WHERE id = ?",
    [newStudent, idStudent],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating a student");
      } else {
        res.status(200).send("Student updated successfully 🎉");
      }
    }
  );
});

app.put("/api/toggle_students/:id", (req, res) => {
  const idStudent = req.params.id;
  connection.query(
    "UPDATE students SET js = !js WHERE id = ?",
    [idStudent],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating data...");
      } else {
        res.status(200).send("Student updated successfully 🎉");
      }
    }
  );
});

app.delete("/api/students/:id", (req, res) => {
  const idStudent = req.params.id;
  connection.query(
    "DELETE FROM students WHERE id = ?",
    [idStudent],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("😱 Error deleting an user");
      } else {
        res.status(200).send("🎉 User deleted!");

      }
    }
  );
});

app.delete("/api/students/php", (req, res) => {
  connection.query(
    "DELETE FROM students WHERE js = 0",
    (err, results) => {
      if (err) {
        res.status(500).send("😱 Error deleting user(s)");
      } else {
        res.status(200).send("🎉 User(s) deleted!");

      }
    }
  );
});

app.listen(port, (err) => {
    if (err) {
      throw new Error(`An error occurred: ${err.message}`);
    }
    console.log(`Server is listening on ${port}`);
});