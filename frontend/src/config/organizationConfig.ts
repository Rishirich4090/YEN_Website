// Organization Configuration
// This file contains all the organization-related constants and contact information
// Update this file to modify organization details across the entire application

export const ORGANIZATION_CONFIG = {
  // Basic Information
  name: "Young Entrepreneur Network",
  shortName: "YEN",
  tagline: "Network is the new networth.",
  
  // Mission & Vision
  mission: "To empower young entrepreneurs by providing comprehensive networking, mentorship, and collaborative opportunities that foster innovation, sustainable business growth, and economic impact.",
  vision: "A world where young entrepreneurs have access to the networks, resources, and opportunities they need to transform ideas into successful ventures that create positive change.",
  
  // Contact Information
  contact: {
    email: "info@yen.org",
    phone: "+1 (555) 987-6543",
    address: "456 Innovation Hub, Entrepreneur City, EC 67890",
    website: "www.yen.org",
    socialMedia: {
      linkedin: "https://linkedin.com/company/young-entrepreneur-network",
      twitter: "https://twitter.com/YEN_Network",
      instagram: "https://instagram.com/yen_network",
      facebook: "https://facebook.com/YoungEntrepreneurNetwork"
    }
  },
  
  // Core Offerings
  coreOfferings: [
    "Networking Events & Meetups",
    "Mentorship Programs",
    "Business Development Workshops",
    "Investment Readiness Training",
    "Collaborative Workspace Access",
    "Pitch Competition & Demo Days",
    "Industry-Specific Support Groups",
    "Digital Platform & Community",
    "Resource Library & Tools"
  ],
  
  // Target Audience
  targetAudience: [
    "Aspiring entrepreneurs aged 18-35",
    "Early-stage startup founders", 
    "Students with business ideas",
    "Young professionals seeking entrepreneurial opportunities",
    "Innovative thinkers and problem solvers"
  ],
  
  // Membership Benefits
  membershipBenefits: [
    "Access to exclusive networking events",
    "1-on-1 mentorship matching",
    "Business development workshops",
    "Investor pitch opportunities",
    "Co-working space access",
    "Resource library and tools",
    "Industry expert connections",
    "Peer collaboration platform",
    "Monthly innovation challenges",
    "Career transition support"
  ],
  
  // Brand Colors (matching your purple-pink theme)
  brandColors: {
    primary: "#7F55B1",    // Purple
    secondary: "#9B7EBD",  // Light Purple
    accent: "#F49BAB",     // Pink
    light: "#FFE1E0"       // Light Pink
  }
};

// Export individual constants for easier access
export const ORG_NAME = ORGANIZATION_CONFIG.name;
export const ORG_SHORT_NAME = ORGANIZATION_CONFIG.shortName;
export const ORG_TAGLINE = ORGANIZATION_CONFIG.tagline;
export const ORG_MISSION = ORGANIZATION_CONFIG.mission;
export const ORG_VISION = ORGANIZATION_CONFIG.vision;
export const ORG_CONTACT = ORGANIZATION_CONFIG.contact;
export const ORG_CORE_OFFERINGS = ORGANIZATION_CONFIG.coreOfferings;
export const ORG_TARGET_AUDIENCE = ORGANIZATION_CONFIG.targetAudience;
export const ORG_MEMBERSHIP_BENEFITS = ORGANIZATION_CONFIG.membershipBenefits;
