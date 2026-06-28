const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const TeamMember = require('./models/TeamMember');
const Portfolio = require('./models/Portfolio');
const Blog = require('./models/Blog');
const PersonalBranding = require('./models/PersonalBranding');

const connectDB = require('./config/database');

const seedData = async () => {
  try {
    await connectDB();
    
    // Create admin user only if it doesn't exist
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@zerobycineviv.com' });
    if (!existingAdmin) {
      const admin = await User.create({
        name: 'Admin User',
        email: process.env.ADMIN_EMAIL || 'admin@zerobycineviv.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123',
        role: 'admin',
      });
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists, skipping creation');
    }
    
    // Check if team members exist before seeding
    const existingTeamMembers = await TeamMember.countDocuments();
    if (existingTeamMembers === 0) {
      const teamMembers = [
        {
          name: 'Aditya Vikram Singh',
          role: 'Founder & Creative Director',
          bio: 'Leading brand strategy, creative direction, and marketing vision with over a decade of experience in building digital brands.',
          expertise: ['Brand Strategy', 'Creative Direction', 'Marketing Vision', 'Client Communication'],
          order: 1,
          isActive: true,
        },
        {
          name: 'Priya Sharma',
          role: 'Content Strategist',
          bio: 'Expert in content planning, viral strategy, and audience psychology. Creates content systems that build attention and trust.',
          expertise: ['Content Planning', 'Viral Strategy', 'Audience Psychology', 'Social Media Direction'],
          order: 2,
          isActive: true,
        },
        {
          name: 'Rahul Mehta',
          role: 'Cinematic Editor',
          bio: 'Specializes in reel editing, cinematic production, color grading, and motion visuals that capture attention within seconds.',
          expertise: ['Reel Editing', 'Cinematic Production', 'Color Grading', 'Motion Visuals'],
          order: 3,
          isActive: true,
        },
      ];
      
      await TeamMember.insertMany(teamMembers);
      console.log('Team members created');
    } else {
      console.log('Team members already exist, skipping seeding');
    }
    
    // Check if portfolio items exist before seeding
    const existingPortfolioItems = await Portfolio.countDocuments();
    if (existingPortfolioItems === 0) {
      const portfolioItems = [
        {
          title: 'Luxury Fashion Campaign',
          category: 'Fashion',
          videoUrl: '/videos/sample-1.mp4',
          thumbnailUrl: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'High-end fashion campaign that generated 2.5M+ views',
          client: 'Elite Fashion House',
          results: { views: '2.5M', engagement: '12%', conversions: '8.5%' },
          featured: true,
          order: 1,
          isActive: true,
        },
        {
          title: 'Gourmet Food Series',
          category: 'Food',
          videoUrl: '/videos/sample-2.mp4',
          thumbnailUrl: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Food content series that increased engagement by 200%',
          client: 'Fine Dining Group',
          results: { views: '1.2M', engagement: '15%', conversions: '6.2%' },
          featured: true,
          order: 2,
          isActive: true,
        },
        {
          title: 'Urban Lifestyle Series',
          category: 'Lifestyle',
          videoUrl: '/videos/sample-3.mp4',
          thumbnailUrl: 'https://images.pexels.com/photos/3945684/pexels-photo-3945684.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Lifestyle content that resonated with urban audiences',
          client: 'Urban Living Co',
          results: { views: '1.8M', engagement: '14%', conversions: '7.1%' },
          featured: true,
          order: 3,
          isActive: true,
        },
      ];
      
      await Portfolio.insertMany(portfolioItems);
      console.log('Portfolio items created');
    } else {
      console.log('Portfolio items already exist, skipping seeding');
    }
    
    // Check if blogs exist before seeding
    const existingBlogs = await Blog.countDocuments();
    if (existingBlogs === 0) {
      const blogs = [
        {
          title: 'The Power of Short-Form Video in 2024',
          excerpt: 'Discover how short-form video is revolutionizing digital marketing and brand engagement strategies.',
          content: `<p>In today's fast-paced digital landscape, short-form video has emerged as the most powerful tool for brand engagement. With platforms like TikTok, Instagram Reels, and YouTube Shorts dominating user attention, businesses can no longer afford to ignore this trend.</p>
          <h3>Why Short-Form Video Works</h3>
          <p>Short-form videos capture attention within the first 3 seconds, making them ideal for today's reduced attention spans. They're highly shareable, algorithm-friendly, and perfect for building authentic connections with your audience.</p>
          <h3>Key Strategies for Success</h3>
          <ul>
            <li>Hook viewers in the first 3 seconds</li>
            <li>Tell a complete story in 60 seconds or less</li>
            <li>Use trending sounds and formats</li>
            <li>Maintain brand consistency</li>
          </ul>`,
          category: 'Marketing',
          tags: ['video marketing', 'social media', 'digital marketing'],
          author: 'Aditya Vikram Singh',
          readTime: 5,
          featured: true,
          featuredImage: 'https://images.pexels.com/photos/6898853/pexels-photo-6898853.jpeg?auto=compress&cs=tinysrgb&w=800',
          seoTitle: 'The Power of Short-Form Video in 2024 | Digital Marketing',
          seoDescription: 'Discover how short-form video is revolutionizing digital marketing and brand engagement strategies.',
          published: true,
        },
        {
          title: 'Content Strategy That Drives Results',
          excerpt: 'Learn how to create a content strategy that actually converts viewers into customers.',
          content: `<p>A successful content strategy requires more than just posting regularly. It needs careful planning, audience research, and data-driven decisions.</p>
          <h3>Understanding Your Audience</h3>
          <p>The foundation of any good content strategy is knowing exactly who you're speaking to. Create detailed buyer personas and understand their pain points, desires, and content preferences.</p>
          <h3>Content Calendar Best Practices</h3>
          <p>Consistency is key, but so is variety. Plan your content mix to include educational, entertaining, and promotional content in the right proportions.</p>`,
          category: 'Content Strategy',
          tags: ['content strategy', 'marketing', 'branding'],
          author: 'Priya Sharma',
          readTime: 7,
          featured: true,
          featuredImage: 'https://images.pexels.com/photos/1181672/pexels-photo-1181672.jpeg?auto=compress&cs=tinysrgb&w=800',
          seoTitle: 'Content Strategy That Drives Results | Brand Strategy',
          seoDescription: 'Learn how to create a content strategy that actually converts viewers into customers.',
          published: true,
        },
        {
          title: 'Cinematic Editing Techniques for Social Media',
          excerpt: 'Master professional editing techniques that make your social media videos stand out from the crowd.',
          content: `<p>Professional editing can transform ordinary footage into compelling content. Here are some techniques that will elevate your videos.</p>
          <h3>Color Grading Essentials</h3>
          <p>Color sets the mood. Learn how to use color grading to create emotional responses and maintain brand consistency across all your videos.</p>
          <h3>Rhythm and Pacing</h3>
          <p>The timing of your cuts can make or break viewer engagement. Understand how to edit to the beat and maintain optimal pacing throughout your video.</p>`,
          category: 'Video Production',
          tags: ['video editing', 'cinematography', 'production'],
          author: 'Rahul Mehta',
          readTime: 6,
          featured: true,
          featuredImage: 'https://images.pexels.com/photos/6898852/pexels-photo-6898852.jpeg?auto=compress&cs=tinysrgb&w=800',
          seoTitle: 'Cinematic Editing Techniques | Video Production',
          seoDescription: 'Master professional editing techniques that make your social media videos stand out.',
          published: true,
        },
        {
          title: 'Building a Social Media Presence That Converts',
          excerpt: 'Strategic approaches to social media that build real engagement and drive business growth.',
          content: `<p>Social media success isn't about having the most followers—it's about having the right followers who engage with your content and convert into customers.</p>
          <h3>Engagement Over Vanity Metrics</h3>
          <p>Stop chasing likes and start building relationships. Focus on comments, shares, and meaningful interactions that indicate real connection with your brand.</p>
          <h3>Community Building</h3>
          <p>Create spaces where your audience feels valued and heard. Respond to comments, ask questions, and foster genuine conversations around your brand.</p>`,
          category: 'Social Media',
          tags: ['social media', 'community', 'engagement'],
          author: 'Priya Sharma',
          readTime: 4,
          featured: false,
          featuredImage: 'https://images.pexels.com/photos/1472547/pexels-photo-1472547.jpeg?auto=compress&cs=tinysrgb&w=800',
          seoTitle: 'Building a Social Media Presence | Social Strategy',
          seoDescription: 'Strategic approaches to social media that build real engagement and drive business growth.',
          published: true,
        },
        {
          title: 'Case Study: Luxury Brand Transformation',
          excerpt: 'How we helped a luxury fashion brand increase engagement by 300% through strategic video content.',
          content: `<p>This case study explores our work with a luxury fashion brand that was struggling to connect with younger audiences on social media.</p>
          <h3>The Challenge</h3>
          <p>The brand had beautiful products but their content felt outdated and didn't resonate with Gen Z and millennial consumers.</p>
          <h3>Our Strategy</h3>
          <p>We developed a series of short-form videos that showcased the craftsmanship behind their products while telling compelling stories about the brand's heritage.</p>
          <h3>The Results</h3>
          <p>Within 3 months, engagement increased by 300%, sales were up 45%, and the brand saw massive growth in their younger audience demographics.</p>`,
          category: 'Case Studies',
          tags: ['case study', 'luxury', 'fashion'],
          author: 'Aditya Vikram Singh',
          readTime: 8,
          featured: false,
          featuredImage: 'https://images.pexels.com/photos/932405/pexels-photo-932405.jpeg?auto=compress&cs=tinysrgb&w=800',
          seoTitle: 'Luxury Brand Transformation Case Study',
          seoDescription: 'How we helped a luxury fashion brand increase engagement by 300% through strategic video content.',
          published: true,
        },
        {
          title: 'The Future of Digital Content: Trends to Watch',
          excerpt: 'Explore emerging trends in digital content creation that will shape the industry in the coming years.',
          content: `<p>The digital content landscape is constantly evolving. Staying ahead of trends can give your brand a significant competitive advantage.</p>
          <h3>AI in Content Creation</h3>
          <p>Artificial intelligence is transforming how we create and optimize content. From idea generation to video editing, AI tools are becoming indispensable.</p>
          <h3>Interactive Content</h3>
          <p>Polls, quizzes, and interactive videos are increasing engagement rates by making content participation rather than just consumption.</p>
          <h3>Authenticity Over Perfection</h3>
          <p>Audiences are craving real, unpolished content that feels genuine. Behind-the-scenes footage and authentic storytelling are more effective than ever.</p>`,
          category: 'Industry Insights',
          tags: ['trends', 'future', 'digital content'],
          author: 'Aditya Vikram Singh',
          readTime: 5,
          featured: false,
          featuredImage: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
          seoTitle: 'Future of Digital Content | Industry Trends',
          seoDescription: 'Explore emerging trends in digital content creation that will shape the industry.',
          published: true,
        },
      ];
      
      await Blog.insertMany(blogs);
      console.log('Blogs created');
    } else {
      console.log('Blogs already exist, skipping seeding');
    }
    
    // Check if personal branding data exists before seeding
    const existingPersonalBrandings = await PersonalBranding.countDocuments();
    if (existingPersonalBrandings === 0) {
      const personalBrandings = [
        {
          name: 'Raj Sharma',
          field: 'Digital Entrepreneur & Business Coach',
          bio: 'Helping aspiring entrepreneurs build profitable online businesses through strategic content creation and digital marketing.',
          avatarUrl: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
          reports: [
            { title: '2024 Growth Report', description: 'Annual performance and growth metrics showing 300% business growth' }
          ],
          videos: [
            { 
              title: 'Brand Story Journey', 
              description: 'Behind the scenes of brand transformation from 0 to 7 figures', 
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 
              thumbnailUrl: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=400' 
            }
          ],
          photos: [
            { title: 'Brand Photoshoot', imageUrl: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400' }
          ],
          data: [
            { metric: 'Followers', value: '1.2M', icon: 'fas fa-users' },
            { metric: 'Engagement', value: '8.5%', icon: 'fas fa-heart' },
            { metric: 'Reach', value: '5M+', icon: 'fas fa-globe' }
          ],
          socialLinks: {
            linkedin: '#',
            instagram: '#',
            twitter: '#'
          },
          order: 1,
          isActive: true
        },
        {
          name: 'Priya Kapoor',
          field: 'Content Creator & Life Coach',
          bio: 'Empowering individuals to live their best lives through authentic content and actionable advice.',
          avatarUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
          reports: [
            { title: 'Client Success Stories', description: 'Testimonials and transformation reports from 500+ clients' }
          ],
          videos: [
            { 
              title: 'Daily Motivation Series', 
              description: 'Inspiring content that helps people start their day with purpose', 
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 
              thumbnailUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400' 
            }
          ],
          photos: [
            { title: 'Lifestyle Photoshoot', imageUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400' }
          ],
          data: [
            { metric: 'Subscribers', value: '850K', icon: 'fas fa-play' },
            { metric: 'Views', value: '25M+', icon: 'fas fa-eye' },
            { metric: 'Clients', value: '150+', icon: 'fas fa-handshake' }
          ],
          socialLinks: {
            linkedin: '#',
            instagram: '#',
            youtube: '#'
          },
          order: 2,
          isActive: true
        },
        {
          name: 'Amit Patel',
          field: 'Fitness Influencer & Trainer',
          bio: 'Transforming lives through fitness, nutrition, and a positive mindset.',
          avatarUrl: 'https://images.pexels.com/photos/1181685/pexels-photo-1181685.jpeg?auto=compress&cs=tinysrgb&w=400',
          reports: [
            { title: 'Transformation Journey', description: 'Before and after stories of 200+ clients' }
          ],
          videos: [
            { 
              title: 'Workout Routines', 
              description: 'Comprehensive workout guides for all fitness levels', 
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 
              thumbnailUrl: 'https://images.pexels.com/photos/1181685/pexels-photo-1181685.jpeg?auto=compress&cs=tinysrgb&w=400' 
            }
          ],
          photos: [
            { title: 'Fitness Journey', imageUrl: 'https://images.pexels.com/photos/1181685/pexels-photo-1181685.jpeg?auto=compress&cs=tinysrgb&w=400' }
          ],
          data: [
            { metric: 'Followers', value: '2.3M', icon: 'fas fa-users' },
            { metric: 'Programs Sold', value: '5K+', icon: 'fas fa-shopping-cart' },
            { metric: 'Transformations', value: '200+', icon: 'fas fa-star' }
          ],
          socialLinks: {
            linkedin: '#',
            instagram: '#',
            youtube: '#'
          },
          order: 3,
          isActive: true
        }
      ];
      
      await PersonalBranding.insertMany(personalBrandings);
      console.log('Personal branding entries created');
    } else {
      console.log('Personal branding entries already exist, skipping seeding');
    }
    
    console.log('✅ Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();