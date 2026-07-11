// @ts-nocheck
import { PrismaClient } from "@prisma/client";
const bcrypt = require("bcryptjs");

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function resetDevelopmentAuth() {
  try {
    await prisma.session.deleteMany({});
    await prisma.account.deleteMany({});

    const users = await prisma.user.findMany({
      include: {
        accounts: true,
        sessions: true,
      },
    });

    const userIds = users.map((user: { id: string }) => user.id);

    await prisma.user.deleteMany({});

    const testUsers = [
      {
        email: "admin@test.com",
        username: "admin",
        name: "Admin User",
        role: "ADMIN",
        password: await bcrypt.hash("password123", 10),
      },
      {
        email: "user@test.com",
        username: "user",
        name: "Test User",
        role: "USER",
        password: await bcrypt.hash("password123", 10),
      },
      {
        email: "doctor@test.com",
        username: "doctor",
        name: "Doctor User",
        role: "DOCTOR",
        password: await bcrypt.hash("password123", 10),
      },
    ];

    for (const testUser of testUsers) {
      const user = await prisma.user.create({
        data: {
          email: testUser.email,
          username: testUser.username,
          name: testUser.name,
          role: testUser.role,
          emailVerified: new Date(),
          accounts: {
            create: {
              providerId: "credentials",
              password: testUser.password,
            },
          },
        },
        include: {
          accounts: true,
        },
      });

      console.log(`Created user: ${user.email} with ID: ${user.id}`);
    }

    console.log("Dev auth reset completed successfully!");
    return { success: true };
  } catch (error) {
    console.error("Error resetting dev auth:", error);
    return { success: false, error };
  }
}

export async function resetDevAuth() {
  return resetDevelopmentAuth();
}