const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Create test editor
  const editorPassword = await bcrypt.hash('editor123', 12);
  const editor = await prisma.user.create({
    data: {
      username: 'testeditor',
      email: 'editor@test.com',
      password: editorPassword,
      role: 'EDITOR',
      firstName: 'John',
      lastName: 'Editor',
      bio: 'Professional video editor with 5+ years experience',
      location: 'New York, USA',
      isEditor: true,
      skills: ['VIDEO_EDITING', 'MOTION_GRAPHICS', 'COLOR_GRADING'],
      experience: 'EXPERT',
      hourlyRate: 50.00,
      availability: true,
      emailVerified: true,
      isVerified: true,
      referralCode: 'EDIT2024',
      walletBalance: 1000.00,
    }
  });
  console.log('✅ Created editor:', editor.email);

  // Create test client
  const clientPassword = await bcrypt.hash('client123', 12);
  const client = await prisma.user.create({
    data: {
      username: 'testclient',
      email: 'client@test.com',
      password: clientPassword,
      role: 'CLIENT',
      firstName: 'Jane',
      lastName: 'Client',
      bio: 'Content creator looking for talented editors',
      location: 'Los Angeles, USA',
      isClient: true,
      company: 'Creative Studios',
      industry: 'Media & Entertainment',
      emailVerified: true,
      referralCode: 'CLIENT2024',
      walletBalance: 5000.00,
    }
  });
  console.log('✅ Created client:', client.email);

  // Create sample project
  const project = await prisma.project.create({
    data: {
      title: 'YouTube Video Editing - Tech Review',
      description: 'Need a professional editor to edit a 10-minute tech review video. Looking for cinematic style with color grading.',
      clientId: client.id,
      category: 'VIDEO_EDITING',
      budget: 500.00,
      deadline: new Date('2024-06-30'),
      status: 'OPEN',
      duration: '5-10 minutes',
      format: 'YouTube',
      style: 'Cinematic',
      footage: 'Client provides',
      music: 'Royalty free',
      revisions: 3,
      tags: ['youtube', 'tech', 'review', 'editing'],
    }
  });
  console.log('✅ Created project:', project.title);

  // Create sample proposal
  const proposal = await prisma.proposal.create({
    data: {
      projectId: project.id,
      editorId: editor.id,
      message: 'I would love to work on this project! I have extensive experience with tech review videos and can deliver within 5 days.',
      estimatedTime: '5 days',
      proposedBudget: 450.00,
      status: 'PENDING',
    }
  });
  console.log('✅ Created proposal');

  // Create sample messages
  const message1 = await prisma.message.create({
    data: {
      senderId: client.id,
      recipientId: editor.id,
      projectId: project.id,
      content: 'Hi! I saw your proposal. Can you share some samples of your tech review work?',
      type: 'TEXT',
    }
  });
  console.log('✅ Created message 1');

  const message2 = await prisma.message.create({
    data: {
      senderId: editor.id,
      recipientId: client.id,
      projectId: project.id,
      content: 'Sure! I will send you my portfolio link right away.',
      type: 'TEXT',
      isRead: true,
      readAt: new Date(),
    }
  });
  console.log('✅ Created message 2');

  // Create portfolio items for editor
  const portfolio1 = await prisma.portfolioItem.create({
    data: {
      userId: editor.id,
      title: 'iPhone 15 Pro Review',
      description: 'Cinematic tech review with dynamic transitions',
      videoUrl: 'https://example.com/video1',
      thumbnailUrl: 'https://example.com/thumb1.jpg',
      tags: ['tech', 'review', 'cinematic'],
      category: 'VIDEO_EDITING',
      duration: '8:30',
      clientName: 'TechChannel',
    }
  });
  console.log('✅ Created portfolio item 1');

  const portfolio2 = await prisma.portfolioItem.create({
    data: {
      userId: editor.id,
      title: 'MacBook Pro M3 Review',
      description: 'Professional product review with motion graphics',
      videoUrl: 'https://example.com/video2',
      thumbnailUrl: 'https://example.com/thumb2.jpg',
      tags: ['tech', 'apple', 'motion-graphics'],
      category: 'MOTION_GRAPHICS',
      duration: '12:45',
      clientName: 'AppleFan',
    }
  });
  console.log('✅ Created portfolio item 2');

  // Add education
  const education = await prisma.education.create({
    data: {
      userId: editor.id,
      institution: 'Film School NY',
      degree: 'Bachelor of Arts',
      field: 'Film Production',
      startDate: new Date('2015-09-01'),
      endDate: new Date('2019-05-30'),
    }
  });
  console.log('✅ Created education record');

  // Add certification
  const certification = await prisma.certification.create({
    data: {
      userId: editor.id,
      name: 'Adobe Premiere Pro Certified',
      issuer: 'Adobe',
      issueDate: new Date('2020-03-15'),
      credentialId: 'ADP-2020-12345',
    }
  });
  console.log('✅ Created certification');

  console.log('\n✨ Database seeding completed!');
  console.log('\nTest Accounts:');
  console.log('  Editor: editor@test.com / editor123');
  console.log('  Client: client@test.com / client123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
