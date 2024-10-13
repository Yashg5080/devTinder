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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});