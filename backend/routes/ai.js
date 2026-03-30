const express = require('express');
const { prisma } = require('../config/database');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// @route   POST /api/ai/match-editors
// @desc    AI-powered editor matching for a project
// @access  Private
router.post('/match-editors', protect, async (req, res) => {
  try {
    const { projectId } = req.body;

    // Get project details
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        client: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Get all active editors
    const editors = await prisma.user.findMany({
      where: {
        role: 'EDITOR',
        isActive: true,
        availability: true
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        skills: true,
        hourlyRate: true,
        ratingAverage: true,
        ratingCount: true,
        completedProjects: true,
        availability: true,
        bio: true,
        portfolioItems: {
          take: 3,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    // AI Matching Algorithm
    const matchedEditors = editors.map(editor => {
      let score = 0;
      const factors = {};
      const breakdown = {};

      // 1. Skills Match (40% weight)
      const projectSkills = project.skills || [];
      const editorSkills = editor.skills || [];
      const matchedSkills = projectSkills.filter(skill =>
        editorSkills.some(es => es.toLowerCase().includes(skill.toLowerCase()))
      );
      const skillScore = projectSkills.length > 0
        ? (matchedSkills.length / projectSkills.length) * 40
        : 20;
      score += skillScore;
      factors.skills = skillScore;
      breakdown.skills = `${matchedSkills.length}/${projectSkills.length} skills match`;

      // 2. Budget Compatibility (25% weight)
      let budgetScore = 0;
      const editorRate = editor.hourlyRate || 0;
      if (project.budget) {
        const budgetStr = project.budget.toString();
        if (budgetStr.includes('-')) {
          const [min, max] = budgetStr.replace(/[^0-9-]/g, '').split('-').map(Number);
          if (editorRate >= min && editorRate <= max) {
            budgetScore = 25;
          } else if (editorRate < min * 1.2) {
            budgetScore = 15;
          } else {
            budgetScore = 5;
          }
        }
      }
      score += budgetScore;
      factors.budget = budgetScore;
      breakdown.budget = budgetScore >= 20 ? 'Within budget' : 'Slightly above';

      // 3. Rating Quality (20% weight)
      const ratingScore = (editor.rating || 0) * 4;
      score += ratingScore;
      factors.rating = ratingScore;
      breakdown.rating = `${editor.rating || 0}/5.0 rating`;

      // 4. Experience Level (10% weight)
      const expScore = Math.min((editor.completedProjects || 0) / 10, 1) * 10;
      score += expScore;
      factors.experience = expScore;
      breakdown.experience = `${editor.completedProjects || 0} projects completed`;

      // 5. Availability (5% weight)
      const availScore = editor.availability === 'Available now' ? 5 : 2;
      score += availScore;
      factors.availability = availScore;
      breakdown.availability = editor.availability || 'Unknown';

      return {
        editor: {
          id: editor._id,
          name: `${editor.firstName} ${editor.lastName}`,
          email: editor.email,
          skills: editor.skills,
          hourlyRate: editor.hourlyRate,
          rating: editor.rating,
          completedProjects: editor.completedProjects,
          availability: editor.availability,
          portfolio: editor.portfolio,
          bio: editor.bio
        },
        matchScore: Math.round(score),
        matchPercentage: Math.round(score),
        factors,
        breakdown,
        matchedSkills
      };
    });

    // Sort by match score
    const sortedMatches = matchedEditors
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10); // Top 10 matches

    res.status(200).json({
      success: true,
      data: {
        matches: sortedMatches,
        totalMatches: sortedMatches.length,
        projectSkills: project.skills
      }
    });
  } catch (error) {
    console.error('AI Matching Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating editor matches',
      error: error.message
    });
  }
});

// @route   POST /api/ai/improve-description
// @desc    AI-powered project description improvement
// @access  Private
router.post('/improve-description', protect, async (req, res) => {
  try {
    const { description, projectType = 'general' } = req.body;

    if (!description || description.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Description must be at least 10 characters'
      });
    }

    // AI Description Enhancement Templates
    const templates = {
      corporate: {
        intro: "We are seeking a professional video editor to create a compelling",
        requirements: [
          "Professional editing with smooth transitions and corporate pacing",
          "Color grading to match brand guidelines",
          "Motion graphics for titles, lower thirds, and brand elements",
          "Background music selection and audio mixing",
          "Multiple revision rounds to ensure satisfaction"
        ],
        deliverables: [
          "High-quality video file in requested format",
          "Project files and assets",
          "Style guide compliance documentation"
        ]
      },
      social: {
        intro: "Looking for a creative video editor to produce engaging social media content",
        requirements: [
          "Fast-paced editing optimized for social media platforms",
          "Trendy transitions, effects, and text overlays",
          "Platform-specific formatting (9:16, 1:1, 16:9)",
          "Hook creation for first 3 seconds",
          "Caption/subtitle integration"
        ],
        deliverables: [
          "Platform-optimized video files",
          "Thumbnail images",
          "Caption files"
        ]
      },
      documentary: {
        intro: "Seeking an experienced documentary editor to craft a compelling narrative",
        requirements: [
          "Strong storytelling and narrative structure",
          "Interview editing and B-roll integration",
          "Color grading for cinematic look",
          "Sound design and music selection",
          "Pacing that maintains viewer engagement"
        ],
        deliverables: [
          "Final documentary cut",
          "Raw footage organization",
          "Audio files and music licensing"
        ]
      },
      general: {
        intro: "We are looking for a skilled video editor to bring our project to life",
        requirements: [
          "Professional editing with attention to detail",
          "Color correction and grading",
          "Audio enhancement and music selection",
          "Graphics and titles as needed",
          "Revisions based on feedback"
        ],
        deliverables: [
          "Final edited video",
          "Source files if required",
          "Multiple format exports"
        ]
      }
    };

    const template = templates[projectType] || templates.general;

    // Generate improved description
    const improvedDescription = `${template.intro} video project. 

**Project Overview:**
${description}

**Key Requirements:**
${template.requirements.map(req => `• ${req}`).join('\n')}

**Deliverables:**
${template.deliverables.map(del => `• ${del}`).join('\n')}

**Ideal Candidate:**
The perfect candidate should have proven experience in similar projects, strong communication skills, and the ability to meet deadlines while maintaining high-quality standards. Portfolio examples of relevant work are highly appreciated.

**Budget & Timeline:**
Please provide your rate and estimated turnaround time. We value quality work and are willing to discuss terms to ensure project success.`;

    // AI Analysis
    const analysis = {
      clarity: Math.min(95, 70 + (description.length / 10)),
      professionalism: 90,
      completeness: 85,
      keywords: description.toLowerCase().match(/\b(video|edit|production|content|brand|social|youtube|corporate|commercial|music|documentary)\b/g) || []
    };

    res.status(200).json({
      success: true,
      data: {
        originalDescription: description,
        improvedDescription,
        analysis,
        wordCount: {
          original: description.split(/\s+/).length,
          improved: improvedDescription.split(/\s+/).length
        }
      }
    });
  } catch (error) {
    console.error('AI Description Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error improving description',
      error: error.message
    });
  }
});

// @route   POST /api/ai/analyze-portfolio
// @desc    AI-powered portfolio analysis
// @access  Private
router.post('/analyze-portfolio', protect, async (req, res) => {
  try {
    const { portfolioItems } = req.body;

    if (!portfolioItems || portfolioItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No portfolio items provided'
      });
    }

    // Simulate AI Analysis
    const analysis = {
      overallScore: Math.min(95, 60 + (portfolioItems.length * 5)),

      quality: {
        score: Math.min(95, 70 + Math.random() * 20),
        feedback: 'High-quality video production with excellent color grading and editing techniques. Visual composition is strong.',
        strengths: [
          'Excellent color grading skills',
          'Smooth transitions and effects',
          'Professional audio quality'
        ]
      },

      diversity: {
        score: Math.min(90, 60 + (portfolioItems.length * 3)),
        feedback: 'Good variety of projects showing versatility across different styles and industries.',
        projectTypes: portfolioItems.map(item => item.category || 'General')
      },

      technical: {
        score: Math.min(95, 75 + Math.random() * 15),
        feedback: 'Strong technical skills demonstrated in editing, transitions, and audio mixing.',
        toolsUsed: ['Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve']
      },

      presentation: {
        score: Math.min(85, 70 + Math.random() * 10),
        feedback: 'Portfolio is well-organized but could benefit from better project descriptions and context.',
        improvements: [
          'Add more detailed project descriptions',
          'Include client testimonials',
          'Show behind-the-scenes content'
        ]
      },

      recommendations: [
        'Consider adding corporate videos to showcase versatility',
        'Highlight specialized skills in motion graphics',
        'Create a showreel for quick portfolio overview',
        'Add pricing information for transparency',
        'Include client reviews and ratings'
      ],

      badge: portfolioItems.length > 10 ? 'Professional Editor' : portfolioItems.length > 5 ? 'Rising Talent' : 'New Creator'
    };

    res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Portfolio Analysis Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing portfolio',
      error: error.message
    });
  }
});

module.exports = router;
