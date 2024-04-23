const router = require("express").Router();

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

router.get("/", async (req, res, next) => {
  try {
    const generateAllPosts = await prisma.post.findMany()

    res.send(generateAllPosts);
  } 
  catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params
  try {
    const generatePostbyId = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      }
    })

    if (!generatePostbyId) {
      return res.status(404).send("Cannot find post.");
    }

    res.send(generatePostbyId);
  } 
  catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { title, content, userId} = req.body
    const createPost = await prisma.post.create({
      data: {
        title: `${title}`,
        content:  `${content}`,
        userId: parseInt(userId)
      }
    })

    res.send(createPost);
  } 
  catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params
    const { title, content, userId} = req.body
    const updatePost = await prisma.post.update({
      where: {
        id: parseInt(id)
      },
      data: {
        title: `${title}`,
        content:  `${content}`,
        userId: parseInt(userId)
      }
    })

    res.send(updatePost);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params
    const deletePost = await prisma.post.delete({
      where: {
        id: parseInt(id)
      }
    })

    res.send(deletePost);
  } catch (error) {
    next(error);
  }
});
module.exports = router 