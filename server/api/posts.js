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
  if (!req.user) {
    return res.send("Please Login to Post")
  }
  const userId = req.user.id

  try {
    const { title, content} = req.body
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
    if (!req.user) {
      return res.send("Please Login to Post")
    }
    const { id } = req.params
    const userId = req.user.id
    const generatePostbyId = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      }
    })
    const returnedUserId = generatePostbyId.userId
    const { title, content} = req.body

    if (userId != returnedUserId) {
      return res.send("Cannot edit another person's post")
    }
    const updatePost = await prisma.post.update({
      where: {
        id: parseInt(id)
      },
      data: {
        title: `${title}`,
        content:  `${content}`,
        userId: returnedUserId
      }
    })

    res.send(updatePost);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.send("Please Login to Post")
    }
    const { id } = req.params
    const userId = req.user.id
    const generatePostbyId = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      }
    })
    if ( userId != generatePostbyId.userId) {
      return res.send("Cannot delete another person's post")
    }
    
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