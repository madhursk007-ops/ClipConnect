/**
 * MongoDB to PostgreSQL Migration Script
 * 
 * This script migrates existing MongoDB data to PostgreSQL using Prisma.
 * Run with: node scripts/migrateToPostgres.js
 */

const mongoose = require('mongoose');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const logger = console;

// MongoDB Models (legacy)
const User = require('../models/User');
const Project = require('../models/Project');
const Message = require('../models/Message');
const Review = require('../models/Review');
const Referral = require('../models/Referral');

const prisma = new PrismaClient();

// Helper function to convert MongoDB ObjectId to string
const toStringId = (id) => id ? id.toString() : null;

// Helper to convert MongoDB Date to ISO string
const toDate = (date) => date ? new Date(date) : null;

// Migration functions
const migrateUsers = async () => {
  logger.log('📦 Migrating users...');
  
  const mongoUsers = await User.find({}).lean();
  logger.log(`Found ${mongoUsers.length} users in MongoDB`);
  
  let migrated = 0;
  let errors = 0;
  
  for (const user of mongoUsers) {
    try {
      // Map MongoDB user to PostgreSQL schema
      await prisma.user.create({
        data: {
          id: toStringId(user._id),
          username: user.username,
          email: user.email,
          password: user.password,
          refreshToken: user.refreshToken,
          role: user.role === 'editor' ? 'EDITOR' : 'CLIENT',
          
          // Profile
          firstName: user.profile?.firstName || '',
          lastName: user.profile?.lastName || '',
          bio: user.profile?.bio,
          avatar: user.profile?.avatar,
          location: user.profile?.location,
          website: user.profile?.website,
          phone: user.profile?.phone,
          
          // Editor profile
          isEditor: user.role === 'editor',
          skills: user.editorProfile?.skills?.map(s => s.toUpperCase().replace('-', '_')) || [],
          experience: user.editorProfile?.experience?.toUpperCase() || 'INTERMEDIATE',
          hourlyRate: user.editorProfile?.hourlyRate,
          availability: user.editorProfile?.availability ?? true,
          editorTotalEarnings: user.editorProfile?.totalEarnings || 0,
          completedProjects: user.editorProfile?.completedProjects || 0,
          
          // Client profile
          isClient: user.role === 'client',
          company: user.clientProfile?.company,
          industry: user.clientProfile?.industry,
          companySize: user.clientProfile?.companySize?.replace('-', '_').replace('+', '_PLUS'),
          clientTotalSpent: user.clientProfile?.totalSpent || 0,
          postedProjects: user.clientProfile?.postedProjects || 0,
          
          // Ratings
          ratingAverage: user.ratings?.average || 0,
          ratingCount: user.ratings?.count || 0,
          
          // Verification
          isVerified: user.verification?.isVerified || false,
          emailVerified: user.verification?.emailVerified || false,
          idVerified: user.verification?.idVerified || false,
          verificationToken: user.verification?.verificationToken,
          verificationExpires: toDate(user.verification?.verificationExpires),
          
          // Security
          lastLogin: toDate(user.security?.lastLogin),
          loginAttempts: user.security?.loginAttempts || 0,
          lockUntil: toDate(user.security?.lockUntil),
          passwordChangedAt: toDate(user.security?.passwordChangedAt),
          passwordResetToken: user.security?.passwordResetToken,
          passwordResetExpires: toDate(user.security?.passwordResetExpires),
          twoFactorEnabled: user.security?.twoFactorEnabled || false,
          twoFactorSecret: user.security?.twoFactorSecret,
          
          // Preferences
          emailNotifications: user.preferences?.notifications?.email ?? true,
          pushNotifications: user.preferences?.notifications?.push ?? true,
          projectUpdateNotifications: user.preferences?.notifications?.projectUpdates ?? true,
          messageNotifications: user.preferences?.notifications?.messages ?? true,
          marketingNotifications: user.preferences?.notifications?.marketing ?? false,
          showEmail: user.preferences?.privacy?.showEmail || false,
          showPhone: user.preferences?.privacy?.showPhone || false,
          allowMessages: user.preferences?.privacy?.allowMessages ?? true,
          theme: user.preferences?.theme?.toUpperCase() || 'DARK',
          language: user.preferences?.language || 'en',
          
          // Status
          isActive: user.isActive ?? true,
          isSuspended: user.isSuspended || false,
          suspensionReason: user.suspensionReason,
          suspendedAt: toDate(user.suspendedAt),
          suspendedUntil: toDate(user.suspendedUntil),
          
          // Subscription
          subscriptionPlan: user.subscription?.plan?.toUpperCase() || 'FREE',
          subscriptionStatus: user.subscription?.status?.toUpperCase() || 'ACTIVE',
          stripeCustomerId: user.subscription?.stripeCustomerId,
          stripeSubscriptionId: user.subscription?.stripeSubscriptionId,
          subscriptionPeriodEnd: toDate(user.subscription?.currentPeriodEnd),
          cancelAtPeriodEnd: user.subscription?.cancelAtPeriodEnd || false,
          
          // Wallet
          walletBalance: user.wallet?.balance || 0,
          walletCredits: user.wallet?.credits || 0,
          walletEscrow: user.wallet?.escrow || 0,
          walletPending: user.wallet?.pending || 0,
          walletTotalEarnings: user.wallet?.totalEarnings || 0,
          walletTotalSpent: user.wallet?.totalSpent || 0,
          
          // Referral
          referralCode: user.referral?.referralCode,
          referredById: toStringId(user.referral?.referredBy),
          totalReferrals: user.referral?.totalReferrals || 0,
          referralCredits: user.referral?.creditsEarned || 0,
          
          // Usage stats
          projectsPosted: user.usage?.projectsPosted || 0,
          applicationsSubmitted: user.usage?.applicationsSubmitted || 0,
          messagesSent: user.usage?.messagesSent || 0,
          storageUsed: user.usage?.storageUsed || 0,
          
          // Profile stats
          profileViews: user.stats?.profileViews || 0,
          responseRate: user.stats?.responseRate,
          onTimeDeliveryRate: user.stats?.onTimeDeliveryRate,
          clientSatisfaction: user.stats?.clientSatisfaction,
          averageDeliveryTime: user.stats?.averageDeliveryTime,
          
          createdAt: toDate(user.createdAt) || new Date(),
          updatedAt: toDate(user.updatedAt) || new Date(),
        }
      });
      
      migrated++;
    } catch (error) {
      logger.error(`Error migrating user ${user._id}:`, error.message);
      errors++;
    }
  }
  
  logger.log(`✅ Migrated ${migrated} users (${errors} errors)`);
  return { migrated, errors };
};

const migrateEducation = async () => {
  logger.log('📚 Migrating education records...');
  
  const mongoUsers = await User.find({ 'editorProfile.education': { $exists: true, $ne: [] } }).lean();
  let migrated = 0;
  
  for (const user of mongoUsers) {
    for (const edu of user.editorProfile?.education || []) {
      try {
        await prisma.education.create({
          data: {
            userId: toStringId(user._id),
            institution: edu.institution,
            degree: edu.degree,
            field: edu.field,
            startDate: toDate(edu.startDate),
            endDate: toDate(edu.endDate),
            isCurrent: edu.current || false,
          }
        });
        migrated++;
      } catch (error) {
        logger.error(`Error migrating education for user ${user._id}:`, error.message);
      }
    }
  }
  
  logger.log(`✅ Migrated ${migrated} education records`);
};

const migrateCertifications = async () => {
  logger.log('📜 Migrating certifications...');
  
  const mongoUsers = await User.find({ 'editorProfile.certifications': { $exists: true, $ne: [] } }).lean();
  let migrated = 0;
  
  for (const user of mongoUsers) {
    for (const cert of user.editorProfile?.certifications || []) {
      try {
        await prisma.certification.create({
          data: {
            userId: toStringId(user._id),
            name: cert.name,
            issuer: cert.issuer,
            issueDate: toDate(cert.issueDate),
            expiryDate: toDate(cert.expiryDate),
            credentialId: cert.credentialId,
            credentialUrl: cert.credentialUrl,
          }
        });
        migrated++;
      } catch (error) {
        logger.error(`Error migrating certification for user ${user._id}:`, error.message);
      }
    }
  }
  
  logger.log(`✅ Migrated ${migrated} certifications`);
};

const migratePortfolio = async () => {
  logger.log('🎨 Migrating portfolio items...');
  
  const mongoUsers = await User.find({ 'editorProfile.portfolio': { $exists: true, $ne: [] } }).lean();
  let migrated = 0;
  
  for (const user of mongoUsers) {
    for (const item of user.editorProfile?.portfolio || []) {
      try {
        await prisma.portfolioItem.create({
          data: {
            userId: toStringId(user._id),
            title: item.title,
            description: item.description,
            videoUrl: item.videoUrl,
            thumbnailUrl: item.thumbnailUrl,
            tags: item.tags || [],
            category: item.category?.toUpperCase().replace('-', '_'),
            duration: item.duration,
            clientName: item.clientName,
            completedAt: toDate(item.completedAt),
          }
        });
        migrated++;
      } catch (error) {
        logger.error(`Error migrating portfolio item for user ${user._id}:`, error.message);
      }
    }
  }
  
  logger.log(`✅ Migrated ${migrated} portfolio items`);
};

const migrateProjects = async () => {
  logger.log('🎯 Migrating projects...');
  
  const mongoProjects = await Project.find({}).lean();
  logger.log(`Found ${mongoProjects.length} projects in MongoDB`);
  
  let migrated = 0;
  let errors = 0;
  
  for (const project of mongoProjects) {
    try {
      await prisma.project.create({
        data: {
          id: toStringId(project._id),
          title: project.title,
          description: project.description,
          clientId: toStringId(project.client),
          editorId: toStringId(project.editor),
          category: project.category?.toUpperCase().replace('-', '_') || 'VIDEO_EDITING',
          budget: project.budget,
          deadline: toDate(project.deadline),
          status: project.status?.toUpperCase() || 'OPEN',
          duration: project.requirements?.duration,
          format: project.requirements?.format,
          style: project.requirements?.style,
          footage: project.requirements?.footage,
          music: project.requirements?.music,
          revisions: project.requirements?.revisions || 2,
          tags: project.tags || [],
          createdAt: toDate(project.createdAt) || new Date(),
          updatedAt: toDate(project.updatedAt) || new Date(),
        }
      });
      
      migrated++;
    } catch (error) {
      logger.error(`Error migrating project ${project._id}:`, error.message);
      errors++;
    }
  }
  
  logger.log(`✅ Migrated ${migrated} projects (${errors} errors)`);
  return { migrated, errors };
};

const migrateProjectAttachments = async () => {
  logger.log('📎 Migrating project attachments...');
  
  const mongoProjects = await Project.find({ attachments: { $exists: true, $ne: [] } }).lean();
  let migrated = 0;
  
  for (const project of mongoProjects) {
    for (const attachment of project.attachments || []) {
      try {
        await prisma.projectAttachment.create({
          data: {
            projectId: toStringId(project._id),
            filename: attachment.filename,
            url: attachment.url,
            size: attachment.size,
            uploadedAt: toDate(attachment.uploadedAt),
          }
        });
        migrated++;
      } catch (error) {
        logger.error(`Error migrating attachment for project ${project._id}:`, error.message);
      }
    }
  }
  
  logger.log(`✅ Migrated ${migrated} attachments`);
};

const migrateProposals = async () => {
  logger.log('💼 Migrating proposals...');
  
  const mongoProjects = await Project.find({ proposals: { $exists: true, $ne: [] } }).lean();
  let migrated = 0;
  
  for (const project of mongoProjects) {
    for (const proposal of project.proposals || []) {
      try {
        await prisma.proposal.create({
          data: {
            projectId: toStringId(project._id),
            editorId: toStringId(proposal.editor),
            message: proposal.message,
            estimatedTime: proposal.estimatedTime,
            proposedBudget: proposal.proposedBudget,
            submittedAt: toDate(proposal.submittedAt),
            status: proposal.status?.toUpperCase() || 'PENDING',
          }
        });
        migrated++;
      } catch (error) {
        logger.error(`Error migrating proposal for project ${project._id}:`, error.message);
      }
    }
  }
  
  logger.log(`✅ Migrated ${migrated} proposals`);
};

const migrateMessages = async () => {
  logger.log('💬 Migrating messages...');
  
  const mongoMessages = await Message.find({}).lean();
  logger.log(`Found ${mongoMessages.length} messages in MongoDB`);
  
  let migrated = 0;
  let errors = 0;
  
  for (const message of mongoMessages) {
    try {
      const createdMessage = await prisma.message.create({
        data: {
          id: toStringId(message._id),
          senderId: toStringId(message.sender),
          recipientId: toStringId(message.recipient),
          projectId: toStringId(message.project),
          content: message.content,
          type: message.type?.toUpperCase() || 'TEXT',
          isRead: message.isRead || false,
          readAt: toDate(message.readAt),
          isEdited: message.isEdited || false,
          editedAt: toDate(message.editedAt),
          isDeleted: message.isDeleted || false,
          deletedAt: toDate(message.deletedAt),
          createdAt: toDate(message.createdAt) || new Date(),
        }
      });
      
      // Migrate attachments
      for (const attachment of message.attachments || []) {
        await prisma.messageAttachment.create({
          data: {
            messageId: createdMessage.id,
            filename: attachment.filename,
            url: attachment.url,
            size: attachment.size,
            mimeType: attachment.mimeType,
          }
        });
      }
      
      migrated++;
    } catch (error) {
      logger.error(`Error migrating message ${message._id}:`, error.message);
      errors++;
    }
  }
  
  logger.log(`✅ Migrated ${migrated} messages (${errors} errors)`);
  return { migrated, errors };
};

const migrateReviews = async () => {
  logger.log('⭐ Migrating reviews...');
  
  const mongoReviews = await Review.find({}).lean();
  logger.log(`Found ${mongoReviews.length} reviews in MongoDB`);
  
  let migrated = 0;
  let errors = 0;
  
  for (const review of mongoReviews) {
    try {
      await prisma.review.create({
        data: {
          id: toStringId(review._id),
          reviewerId: toStringId(review.reviewer),
          revieweeId: toStringId(review.reviewee),
          projectId: toStringId(review.project),
          rating: review.rating,
          comment: review.comment,
          communication: review.categories?.communication,
          quality: review.categories?.quality,
          timeliness: review.categories?.timeliness,
          professionalism: review.categories?.professionalism,
          isVerified: review.isVerified || false,
          response: review.response?.content,
          respondedAt: toDate(review.response?.respondedAt),
          createdAt: toDate(review.createdAt) || new Date(),
          updatedAt: toDate(review.updatedAt) || new Date(),
        }
      });
      
      migrated++;
    } catch (error) {
      logger.error(`Error migrating review ${review._id}:`, error.message);
      errors++;
    }
  }
  
  logger.log(`✅ Migrated ${migrated} reviews (${errors} errors)`);
  return { migrated, errors };
};

// Main migration function
const runMigration = async () => {
  logger.log('\n🚀 Starting MongoDB to PostgreSQL Migration\n');
  
  try {
    // Connect to MongoDB
    logger.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    logger.log('✅ Connected to MongoDB\n');
    
    // Connect to PostgreSQL
    logger.log('Connecting to PostgreSQL...');
    await prisma.$connect();
    logger.log('✅ Connected to PostgreSQL\n');
    
    // Clear existing data (optional - be careful!)
    const shouldClearData = process.env.CLEAR_PG_DATA === 'true';
    if (shouldClearData) {
      logger.log('⚠️  Clearing existing PostgreSQL data...');
      await prisma.$executeRaw`TRUNCATE TABLE "reviews", "message_attachments", "messages", "proposals", "milestones", "payments", "project_attachments", "projects", "verification_documents", "portfolio_items", "user_languages", "user_software", "certifications", "education", "users" CASCADE`;
      logger.log('✅ Data cleared\n');
    }
    
    // Run migrations in order (respecting foreign key constraints)
    const results = {
      users: await migrateUsers(),
      education: await migrateEducation(),
      certifications: await migrateCertifications(),
      portfolio: await migratePortfolio(),
      projects: await migrateProjects(),
      attachments: await migrateProjectAttachments(),
      proposals: await migrateProposals(),
      messages: await migrateMessages(),
      reviews: await migrateReviews(),
    };
    
    // Summary
    logger.log('\n' + '='.repeat(50));
    logger.log('📊 MIGRATION SUMMARY');
    logger.log('='.repeat(50));
    logger.log(`Users: ${results.users.migrated} migrated, ${results.users.errors} errors`);
    logger.log(`Projects: ${results.projects.migrated} migrated, ${results.projects.errors} errors`);
    logger.log(`Messages: ${results.messages.migrated} migrated, ${results.messages.errors} errors`);
    logger.log(`Reviews: ${results.reviews.migrated} migrated, ${results.reviews.errors} errors`);
    logger.log('='.repeat(50) + '\n');
    
    logger.log('✅ Migration completed successfully!');
    
  } catch (error) {
    logger.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    await prisma.$disconnect();
  }
};

// Run if executed directly
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration };
