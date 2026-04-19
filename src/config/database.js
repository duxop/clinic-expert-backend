require("dotenv/config");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("../generated/prisma/client");

const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

const connection = async () => {
  await prisma.$queryRaw`SELECT 1`;
};

module.exports = { prisma, connection };
