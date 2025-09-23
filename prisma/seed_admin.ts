import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'socialspot@lafricainedarchitecture.com';
  const password = 'Freewifi2@24!';
  const hashed = await bcrypt.hash(password, 12);

  // Check if admin already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    if (existing.role !== 'admin') {
      await prisma.user.update({ where: { email }, data: { role: 'admin', password: hashed, emailVerified: true } });
      console.log('Admin role updated for existing user.');
    } else {
      console.log('Admin already exists.');
    }
  } else {
    await prisma.user.create({
      data: {
        firstName: 'Admin',
        lastName: 'SocialSpot',
        email,
        password: hashed,
        emailVerified: true,
        role: 'admin',
      },
    });
    console.log('Admin user created.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
