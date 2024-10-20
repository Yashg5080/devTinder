const express = require('express');
const app = express();
const port = 3000;


app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/products", (req, res) => {
  res.send("Products");
});

// Post Request
app.post("/products", (req, res) => {
  res.send("Products");
});

// Dynamic Route with query parameter
app.post("/products/:id", (req, res) => {
  console.log(req.query, req.params);
  res.send("Products" + req.params.id );
});


// Dynamic Route with Regular Expression and we can also write regular expression
// in the form of string
app.post(/.*fly$/, (req, res) => {
  res.send("Reg");
});


// Multiple Callbacks in a single route
// next() is used to call the next callback
// We can pass an array of callback functions as well
app.post("/users", (req, res, next) => {
  next();
  // res.send("users");
}, (req, res, next) => {
  res.send("users1");
  next()
});

// Writing a middlewae to authenticate the admin user befor he tries to access the admin route

// This middleware will run for each of the routes starting with /admin
app.use("/admin", (req, res, next) => {
  const token = "abc"
  const isAdminAuthenticated = token === "abc";
  if(isAdminAuthenticated){
    next();
  } else {
    res.status(401).send("Unauthorized Access");
  }
});

app.post("/admin/data", (req, res, next) => {
  console.log("Data Middleware");
  res.send("I got the data!!");
});

// Error Handling Middleware
app.use("/", (err,req, res, next) => {
  if(err) {
    res.status(500).send("Something went wrong");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});