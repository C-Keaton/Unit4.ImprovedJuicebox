const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use("/api", require("./api"));

app.get("/", (req, res) => {
  res.send("Welcome to My Juicebox Website")
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Internal server error.");
});

app.use((req, res) => {
  res.status(404).send("Not found.");
});

module.exports = app;
