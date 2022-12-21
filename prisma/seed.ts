import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany({
    where: {
      NOT: {
        id: "clbp5sbyu0000sdogrzfzfgm3",
      },
    },
  });

  await prisma.user.createMany({
    data: Array.from({ length: 100 }).map(() => {
      return {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        emailVerified: null,
        department: faker.name.jobArea(),
        position: faker.name.jobTitle(),
        role: "user",
        image: faker.image.avatar(),
        joined: faker.date.past(),
      };
    }),
  });

  await prisma.note.create({
    data: {
      title: "Note 1",
      content: "Content 1",
      fromUserId: "clbp5sbyu0000sdogrzfzfgm3",
      toUserId: "clbp5sbyu0000sdogrzfzfgm3",
    },
  });

  const users = await prisma.user.findMany();

  await prisma.address.createMany({
    data: users.map((user) => {
      return {
        address: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.state(),
        zip: faker.address.zipCode(),
        userId: user.id,
      };
    }),
  });

  await prisma.project.createMany({
    data: users
      .map((user) => {
        return Array.from({ length: 10 }).map(() => ({
          name: faker.commerce.productName(),
          userId: user.id,
        }));
      })
      .flat(),
  });

  const projects = await prisma.project.findMany();

  await prisma.task.createMany({
    data: projects
      .map((project) => {
        return Array.from({ length: 10 }).map(() => ({
          name: faker.commerce.productName(),
          projectId: project.id,
          userId: project.userId,
        }));
      })
      .flat(),
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
