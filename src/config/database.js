const prisma = require("./client")

const connection = async () => {
  await prisma.$queryRaw`SELECT 1`;
};

module.exports = connection;
