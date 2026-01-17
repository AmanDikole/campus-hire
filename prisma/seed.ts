import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await hash('admin123', 12)

  // --- 1. Create College A: MIT ---
  console.log("Seeding College A: MIT...")
  const mit = await prisma.college.upsert({
    where: { subdomain: 'mit' },
    update: {},
    create: {
      name: "MIT World Peace University",
      subdomain: "mit",
      location: "Pune, India",
    }
  })

  // MIT Admin
  await prisma.user.upsert({
    where: { 
      // ✅ Corrected: Using composite unique key
      email_collegeId: { email: 'admin@mit.edu', collegeId: mit.id } 
    },
    update: {},
    create: {
      email: 'admin@mit.edu',
      password,
      role: 'admin',
      collegeId: mit.id
    }
  })
  
  // MIT Student
  await prisma.user.upsert({
    where: { 
      // ✅ Corrected: Using composite unique key
      email_collegeId: { email: 'student@mit.edu', collegeId: mit.id } 
    },
    update: {},
    create: {
      email: 'student@mit.edu',
      password,
      role: 'student',
      collegeId: mit.id,
      profile: {
        create: {
          prnNumber: "MIT-2026-001",
          fullName: "Amit Sharma",
          branch: "CSE",
          gender: "Male",
          cgpa: 8.5,
          percent10th: 92.0,
          percent12th: 88.5,
          passoutYear: 2026,
          liveBacklogs: 0,
          deadBacklogs: 0,
          isVerified: true,
        }
      }
    }
  })

  // --- 2. Create College B: COEP ---
  console.log("Seeding College B: COEP...")
  const coep = await prisma.college.upsert({
    where: { subdomain: 'coep' },
    update: {},
    create: {
      name: "COEP Technological University",
      subdomain: "coep",
      location: "Pune, India",
    }
  })

  // COEP Admin
  await prisma.user.upsert({
    where: { 
      email_collegeId: { email: 'admin@coep.edu', collegeId: coep.id } 
    },
    update: {},
    create: {
      email: 'admin@coep.edu',
      password,
      role: 'admin',
      collegeId: coep.id
    }
  })

  // COEP Student
  await prisma.user.upsert({
    where: { 
      email_collegeId: { email: 'student@coep.edu', collegeId: coep.id } 
    },
    update: {},
    create: {
      email: 'student@coep.edu',
      password,
      role: 'student',
      collegeId: coep.id,
      profile: {
        create: {
          prnNumber: "COEP-2026-999",
          fullName: "Priya Patil",
          branch: "AI&DS",
          gender: "Female",
          cgpa: 9.2,
          percent10th: 95.0,
          percent12th: 91.0,
          passoutYear: 2026,
          liveBacklogs: 0,
          deadBacklogs: 0,
          isVerified: true,
        }
      }
    }
  })

  console.log("✅ Seeding complete!")
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })