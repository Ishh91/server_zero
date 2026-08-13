const mongoose = require('mongoose');
require('dotenv').config();

const Blog = require('./models/Blog');
const CaseStudy = require('./models/CaseStudy');

const safeSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // 1. Seed Blogs if empty
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      console.log('Seeding Blogs...');
      const sampleBlogs = [
        {
          title: 'The Power of Short-Form Video in 2024',
          slug: 'power-of-short-form-video-2024',
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
          author: 'Tushar',
          readTime: 5,
          featured: true,
          featuredImage: 'https://images.pexels.com/photos/6898853/pexels-photo-6898853.jpeg?auto=compress&cs=tinysrgb&w=800',
          seoTitle: 'The Power of Short-Form Video in 2024 | Digital Marketing',
          seoDescription: 'Discover how short-form video is revolutionizing digital marketing and brand engagement strategies.',
          published: true,
        },
        {
          title: 'Content Strategy That Drives Real Results',
          slug: 'content-strategy-that-drives-results',
          excerpt: 'Learn how to create a content strategy that actually converts viewers into loyal customers.',
          content: `<p>A successful content strategy requires more than just posting regularly. It needs careful planning, audience research, and data-driven decisions.</p>
          <h3>Understanding Your Audience</h3>
          <p>The foundation of any good content strategy is knowing exactly who you're speaking to. Create detailed buyer personas and understand their pain points, desires, and content preferences.</p>
          <h3>Content Calendar Best Practices</h3>
          <p>Consistency is key, but so is variety. Plan your content mix to include educational, entertaining, and promotional content in the right proportions.</p>`,
          category: 'Content Strategy',
          tags: ['content strategy', 'marketing', 'branding'],
          author: 'Shanviv Rudra',
          readTime: 7,
          featured: true,
          featuredImage: 'https://images.pexels.com/photos/1181672/pexels-photo-1181672.jpeg?auto=compress&cs=tinysrgb&w=800',
          seoTitle: 'Content Strategy That Drives Results | Brand Strategy',
          seoDescription: 'Learn how to create a content strategy that actually converts viewers into customers.',
          published: true,
        },
        {
          title: 'Cinematic Editing Techniques for Social Media',
          slug: 'cinematic-editing-techniques-social-media',
          excerpt: 'Master professional editing techniques that make your social media videos stand out from the crowd.',
          content: `<p>Professional editing can transform ordinary footage into compelling content. Here are some techniques that will elevate your videos.</p>
          <h3>Color Grading Essentials</h3>
          <p>Color sets the mood. Learn how to use color grading to create emotional responses and maintain brand consistency across all your videos.</p>
          <h3>Rhythm and Pacing</h3>
          <p>The timing of your cuts can make or break viewer engagement. Understand how to edit to the beat and maintain optimal pacing throughout your video.</p>`,
          category: 'Video Production',
          tags: ['video editing', 'cinematography', 'production'],
          author: 'Ketan Koparkar',
          readTime: 6,
          featured: true,
          featuredImage: 'https://images.pexels.com/photos/6898852/pexels-photo-6898852.jpeg?auto=compress&cs=tinysrgb&w=800',
          seoTitle: 'Cinematic Editing Techniques | Video Production',
          seoDescription: 'Master professional editing techniques that make your social media videos stand out.',
          published: true,
        },
        {
          title: 'Building a High-Converting Social Media Presence',
          slug: 'building-a-high-converting-social-media-presence',
          excerpt: 'Strategic approaches to social media that build authority, authentic engagement, and business growth.',
          content: `<p>Personal and brand growth isn't about vanity metrics—it's about building trust at scale. When people know what you stand for, business opportunities follow naturally.</p>
          <h3>Authority Over Vanity Metrics</h3>
          <p>Stop chasing follower counts and start building deep relationships. Focus on depth of trust, message clarity, and niche authority.</p>`,
          category: 'Social Media',
          tags: ['social media', 'authority', 'growth'],
          author: 'Tushar',
          readTime: 5,
          featured: false,
          featuredImage: 'https://images.pexels.com/photos/1472547/pexels-photo-1472547.jpeg?auto=compress&cs=tinysrgb&w=800',
          seoTitle: 'Building a High-Converting Social Media Presence',
          seoDescription: 'Strategic approaches to social media that build authority and drive growth.',
          published: true,
        },
        {
          title: 'Case Study: 4x Organic Growth Without Paid Ads',
          slug: 'case-study-4x-organic-growth',
          excerpt: 'How repositioning content around core expertise scaled community to 236k followers organically.',
          content: `<p>This case study explores how strategic positioning and storytelling generated massive organic traction without spending heavily on ads.</p>
          <h3>The Challenge</h3>
          <p>High ad spend with diminishing returns and low engagement among cold audiences.</p>
          <h3>Our Strategy</h3>
          <p>We led with credible, value-first content and refined the messaging narrative to speak directly to target buyers.</p>`,
          category: 'Case Studies',
          tags: ['case study', 'organic growth', 'storytelling'],
          author: 'Shanviv Rudra',
          readTime: 8,
          featured: false,
          featuredImage: 'https://images.pexels.com/photos/932405/pexels-photo-932405.jpeg?auto=compress&cs=tinysrgb&w=800',
          seoTitle: 'Case Study: 4x Organic Growth Without Paid Ads',
          seoDescription: 'How repositioning content around core expertise scaled community organically.',
          published: true,
        }
      ];

      await Blog.insertMany(sampleBlogs);
      console.log('✅ 5 Blogs seeded successfully!');
    } else {
      console.log(`Blogs already exist (${blogCount}), skipping.`);
    }

    // 2. Seed Case Studies if empty
    const caseStudyCount = await CaseStudy.countDocuments();
    if (caseStudyCount === 0) {
      console.log('Seeding Case Studies...');
      const sampleCaseStudies = [
        {
          title: 'NexCRM',
          slug: 'nex-crm',
          subtitle: 'Event-Driven CRM Integration & Automation Middleware',
          client: 'NexCorp',
          industry: 'Sales & Marketing Technology / CRM Operations',
          engagementType: 'End-to-end build — architecture, development, deployment, handover',
          coreChallenge: 'Disconnected CRM data and unreliable third-party sync',
          deliveryModel: 'Single accountable team, milestone-based delivery',
          status: 'Live in production',
          technicalStack: ['Node.js', 'Redis', 'PostgreSQL', 'REST API', 'Cloud-native'],
          challengeDescription: "Our client's sales operation depended on a CRM ecosystem that needed to stay in sync with multiple downstream systems — contact records, sales opportunities, custom fields, and tags — in real time. Off-the-shelf integrations covered the basic cases but broke down under real-world conditions: webhook deliveries arrived out of order, duplicate events created duplicate contacts, and there was no reliable audit trail when something went wrong.",
          whatWeBuilt: "NexCRM is a middleware platform that sits between the client's CRM and every system that needs to talk to it. It ingests webhook events, processes them through a queue-based pipeline designed for reliability rather than speed-at-all-costs, and keeps contact and opportunity records consistent across every connected system.",
          keyCapabilities: [
            'Reliable webhook ingestion with automatic retry handling',
            'Idempotency safeguards that eliminate duplicate records',
            'Full audit trail for every sync event — what, when, and why',
            'Structured data validation layer before touching the CRM',
            'Configurable mapping without requiring code deployment',
            'Encrypted credential storage and data-in-transit protection'
          ],
          technicalApproach: 'We built NexCRM around an event-driven architecture: a message queue absorbs incoming webhook traffic so that no event is ever lost, even during traffic spikes or temporary downstream outages. Every event carries an idempotency key, so reprocessing the same event twice never creates duplicate data.',
          metrics: {
            metric1: { value: '99.9%', label: 'Sync Reliability Post-Launch' },
            metric2: { value: '0', label: 'Duplicate Records Since Go-Live' },
            metric3: { value: '100%', label: 'Events Traceable via Audit Log' }
          },
          testimonial: {
            quote: 'Before this, every sync issue meant a support ticket and a guessing game about what went wrong. Now we can trace any record back to the exact event that created it — that traceability alone changed how our ops team works.',
            author: 'Operations Lead, Client Organisation'
          },
          featured: true,
          publishedAt: new Date()
        },
        {
          title: 'TrustLayer AI',
          slug: 'trust-layer-ai',
          subtitle: 'AI-Powered Identity Verification & Fraud Risk Platform',
          client: 'TrustLayer Inc',
          industry: 'Fintech / Digital Identity & Trust Infrastructure',
          engagementType: 'End-to-end AI/ML platform build and deployment',
          coreChallenge: "Manual identity verification couldn't scale or catch sophisticated fraud",
          deliveryModel: 'Iterative model development with continuous client validation',
          status: 'Live in production',
          technicalStack: ['Computer Vision', 'Biometric Matching', 'Graph Analysis', 'LLM', 'Cloud GPU'],
          challengeDescription: "Our client needed to verify the identity of users at scale — onboarding thousands of people who upload identity documents and a live photo or video, expecting a trust decision back in seconds. Manual review didn't scale, and simple automated checks weren't catching increasingly sophisticated fraud.",
          whatWeBuilt: 'TrustLayer AI is a multi-stage verification platform that evaluates an identity submission across more than a dozen independent checks before returning a trust decision. Rather than relying on any single signal, the system cross-references document authenticity, biometric matching, and behavioural risk indicators.',
          keyCapabilities: [
            'Automated document data extraction with built-in consistency checks',
            'Biometric face-matching between documents and live capture',
            'Liveness detection to flag photo/video replays or masks',
            'Detection layer tuned for AI-generated and manipulated media',
            'Cross-submission link analysis to surface coordinated fraud',
            'Composite risk score with full explainability'
          ],
          technicalApproach: 'We treated this as a defense-in-depth problem rather than a single-model problem. Each verification stage — document analysis, biometric matching, liveness, media authenticity, behavioural signals — runs as an independent module, and the platform\'s risk engine combines their outputs into a single weighted decision rather than gating on any one check in isolation.',
          metrics: {
            metric1: { value: 'Seconds', label: 'Average Decision Time' },
            metric2: { value: '12+', label: 'Independent Verification Signals' },
            metric3: { value: 'Explainable', label: 'Every Decision, Audit-Ready' }
          },
          testimonial: {
            quote: 'What stood out wasn\'t just the detection accuracy — it was that every flagged case comes with a clear explanation. Our investigators aren\'t guessing why the system raised a concern; they can see exactly which signals triggered it.',
            author: 'Head of Trust & Safety, Client Organisation'
          },
          featured: true,
          publishedAt: new Date()
        }
      ];

      await CaseStudy.insertMany(sampleCaseStudies);
      console.log('✅ 2 Case Studies seeded successfully!');
    } else {
      console.log(`Case Studies already exist (${caseStudyCount}), skipping.`);
    }

    console.log('🎉 Safe seeding process completed.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Safe seeding error:', err);
    process.exit(1);
  }
};

safeSeed();
