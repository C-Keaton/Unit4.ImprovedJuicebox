const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { faker } = require("@faker-js/faker")

async function main() {
  count = 1
  const titles = ["Favorite Vacation Spot", "Favorite Song", "My Birthday"]
  while (count <= 3) {
    const topics = [`${faker.location.country()}`, `${faker.music.genre()}`, `${faker.date.birthdate({ min: 1965, max: 2005, mode: 'year' })}`]
    numberOfPosts = 0
    const createUser = await prisma.user.create({
      data: {
        username: faker.internet.userName(),
        password: faker.internet.password()
      }
    })

    numberOfPosts = numberOfPosts + 1
    const createPost1 = await prisma.post.create({
      data: {
        title: `${titles[numberOfPosts-1]}`,
        content:  `My favorite vacation spot is ${topics[numberOfPosts-1]}.`,
        userId: createUser.id
      }
    })

    numberOfPosts = numberOfPosts + 1
    const createPost2 = await prisma.post.create({
      data: {
        title: `${titles[numberOfPosts-1]}`,
        content:  `My favorite song is ${topics[numberOfPosts-1]}.`,
        userId: createUser.id
      }
    })

    numberOfPosts = numberOfPosts + 1
    const createPost3 = await prisma.post.create({
      data: {
        title: `${titles[numberOfPosts-1]}`,
        content:  `My Birthday is ${topics[numberOfPosts-1]}.`,
        userId: createUser.id
      }
    })

    console.log(`New User:`, createUser)
    console.log(createPost1)
    console.log(createPost2)
    console.log(createPost3)
    count = count + 1
  }
  console.log("Finished")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })