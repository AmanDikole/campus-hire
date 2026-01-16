import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await hash('admin123', 12)

  // --- 1. Create College A: MIT ---
  console.log("Creating College A: MIT...")
  const collegeA = await prisma.college.create({
    data: {
      name: "MIT World Peace University",
      subdomain: "mit",
      location: "Pune, India",
    }
  })

  // Create Admin for MIT
  await prisma.user.create({
    data: {
      email: 'admin@mit.edu', 
      password,
      role: 'admin',
      collegeId: collegeA.id
    }
  })
  
  // Create Student for MIT
  await prisma.user.create({
    data: {
      email: 'student@mit.edu',
      password,
      role: 'student',
      collegeId: collegeA.id,
      profile: {
        create: {
          fullName: "Amit Sharma",
          branch: "CSE",
          cgpa: 8.5
        }
      }
    }
  })

  // --- 2. Create College B: COEP ---
  console.log("Creating College B: COEP...")
  const collegeB = await prisma.college.create({
    data: {
      name: "COEP Technological University",
      subdomain: "coep",
      location: "Pune, India",
    }
  })

  // Create Admin for COEP
  await prisma.user.create({
    data: {
      email: 'admin@coep.edu',
      password,
      role: 'admin',
      collegeId: collegeB.id
    }
  })

  // Create Student for COEP
  await prisma.user.create({
    data: {
      email: 'student@coep.edu',
      password,
      role: 'student',
      collegeId: collegeB.id,
      profile: {
        create: {
          fullName: "Priya Patil",
          branch: "ENTC",
          cgpa: 9.2
        }
      }
    }
  })

  console.log("✅ Seeding complete! You can now log in as:")
  console.log("   - MIT Admin: admin@mit.edu / admin123")
  console.log("   - COEP Admin: admin@coep.edu / admin123")
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