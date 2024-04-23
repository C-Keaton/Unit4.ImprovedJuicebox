const express = require("express");
const morgan = require("morgan");
const app = express();
const jwt = require("jsonwebtoken");

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

  try {
    req.user = jwt.verify(token, process.env.JWT);
  } catch {
    req.user = null;
  }

  next();
});

app.use("/auth", require("./auth"));
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
