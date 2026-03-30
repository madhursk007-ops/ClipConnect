const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');

// Create Prisma Client instance with logging in development
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'info', 'warn', 'error']
    : ['error'],
});

// Connection management
const connectDB = async () => {
  try {
    // Test the connection by running a simple query
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;

    logger.info('PostgreSQL Connected successfully');

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      await prisma.$disconnect();
      logger.info('PostgreSQL connection closed through app termination');
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await prisma.$disconnect();
      logger.info('PostgreSQL connection closed through SIGTERM');
      process.exit(0);
    });

  } catch (error) {
    logger.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Export both the client and connection function
module.exports = { prisma, connectDB };
