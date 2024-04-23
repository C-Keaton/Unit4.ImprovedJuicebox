const router = require("express").Router();
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

router.post("/register", async (req, res, next) => {
  const { username, password } = req.body
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  hashedPassword_global = hashedPassword
  try {
    const registerUser = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword
      }
    })
    console.log(registerUser)
    const token = jwt.sign({ id: registerUser.id }, process.env.JWT);

    console.log("Registered!")
    res.status(201).send({ token });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body

  const findUsername = await prisma.user.findUnique({
    where: {
      username: username,
    }
  })
  const comparePasswords = await bcrypt.compare(password, findUsername.password)
  if (comparePasswords != true) {
    return res.status(401).send("Invalid login credentials.");
  }

  const loginPassword = findUsername.password
  try {
    const userLogin = await prisma.user.findUnique({
      where: {
        username: username,
        password: loginPassword
      }
    })

    const token = jwt.sign({ id: userLogin.id }, process.env.JWT);

    console.log("Logged In!")
    res.send({ token });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
