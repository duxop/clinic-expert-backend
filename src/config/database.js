const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const connection = async () => {
  await prisma.$queryRaw`SELECT 1`;
};

module.exports = { prisma, connection }
