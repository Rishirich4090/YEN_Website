interface NGOImageProps {
  type:
    | "education"
    | "donation"
    | "water"
    | "healthcare"
    | "housing"
    | "energy"
    | "community"
    | "hero"
    | "about"
    | "default";
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export default function NGOImage({
  type,
  alt,
  className = "",
  width,
  height,
}: NGOImageProps) {
  // Generate SVG images with relevant content for each type
  const generateSVG = (type: string) => {
    const baseColors = {
      education: {
        primary: "#3B82F6",
        secondary: "#93C5FD",
        accent: "#DBEAFE",
      },
      donation: { primary: "#EF4444", secondary: "#FCA5A5", accent: "#FEE2E2" },
      water: { primary: "#06B6D4", secondary: "#67E8F9", accent: "#CFFAFE" },
      healthcare: {
        primary: "#EC4899",
        secondary: "#F9A8D4",
        accent: "#FCE7F3",
      },
      housing: { primary: "#F59E0B", secondary: "#FCD34D", accent: "#FEF3C7" },
      energy: { primary: "#EAB308", secondary: "#FDE047", accent: "#FEFCE8" },
      community: {
        primary: "#8B5CF6",
        secondary: "#C4B5FD",
        accent: "#EDE9FE",
      },
      hero: { primary: "#22C55E", secondary: "#86EFAC", accent: "#DCFCE7" },
      about: { primary: "#6366F1", secondary: "#A5B4FC", accent: "#E0E7FF" },
      default: { primary: "#22C55E", secondary: "#86EFAC", accent: "#DCFCE7" },
    };

    const colors = baseColors[type] || baseColors.default;

    switch (type) {
      case "education":
        return `
          <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="eduGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${colors.accent}"/>
                <stop offset="100%" style="stop-color:${colors.secondary}"/>
              </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#eduGrad)"/>
            
            <!-- Books stack -->
            <rect x="80" y="180" width="60" height="8" fill="${colors.primary}" rx="2"/>
            <rect x="85" y="172" width="50" height="8" fill="${colors.secondary}" rx="2"/>
            <rect x="90" y="164" width="40" height="8" fill="${colors.primary}" rx="2"/>
            
            <!-- School building -->
            <rect x="150" y="100" width="100" height="80" fill="white" stroke="${colors.primary}" stroke-width="2"/>
            <polygon points="150,100 200,60 250,100" fill="${colors.primary}"/>
            <rect x="170" y="120" width="15" height="20" fill="${colors.secondary}"/>
            <rect x="200" y="120" width="15" height="20" fill="${colors.secondary}"/>
            <rect x="220" y="120" width="15" height="20" fill="${colors.secondary}"/>
            <rect x="185" y="150" width="20" height="30" fill="${colors.primary}"/>
            
            <!-- Children figures -->
            <circle cx="120" cy="200" r="8" fill="#F4A460"/>
            <rect x="115" y="208" width="10" height="15" fill="${colors.primary}"/>
            <circle cx="280" cy="200" r="8" fill="#F4A460"/>
            <rect x="275" y="208" width="10" height="15" fill="${colors.secondary}"/>
            
            <!-- Graduation cap -->
            <polygon points="300,80 320,75 340,80 340,85 300,85" fill="${colors.primary}"/>
            <rect x="318" y="70" width="4" height="15" fill="${colors.primary}"/>
            
            <!-- Text -->
            <text x="200" y="250" text-anchor="middle" fill="${colors.primary}" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Education for All</text>
          </svg>
        `;

      case "donation":
        return `
          <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="donGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${colors.accent}"/>
                <stop offset="100%" style="stop-color:${colors.secondary}"/>
              </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#donGrad)"/>
            
            <!-- Donation box -->
            <rect x="150" y="120" width="100" height="80" fill="white" stroke="${colors.primary}" stroke-width="3" rx="5"/>
            <rect x="190" y="100" width="20" height="20" fill="${colors.primary}" rx="10"/>
            
            <!-- Heart symbol -->
            <path d="M200,140 C195,135 185,135 185,145 C185,155 200,170 200,170 C200,170 215,155 215,145 C215,135 205,135 200,140 Z" fill="${colors.primary}"/>
            
            <!-- Hands giving -->
            <ellipse cx="120" cy="160" rx="15" ry="8" fill="#F4A460"/>
            <rect x="105" y="160" width="30" height="6" fill="#F4A460"/>
            <ellipse cx="280" cy="160" rx="15" ry="8" fill="#F4A460"/>
            <rect x="265" y="160" width="30" height="6" fill="#F4A460"/>
            
            <!-- Coins -->
            <circle cx="170" cy="180" r="6" fill="#FFD700"/>
            <circle cx="185" cy="175" r="6" fill="#FFD700"/>
            <circle cx="200" cy="180" r="6" fill="#FFD700"/>
            <circle cx="215" cy="175" r="6" fill="#FFD700"/>
            <circle cx="230" cy="180" r="6" fill="#FFD700"/>
            
            <!-- Dollar signs -->
            <text x="175" y="185" text-anchor="middle" fill="${colors.primary}" font-family="Arial, sans-serif" font-size="8" font-weight="bold">₹</text>
            <text x="225" y="180" text-anchor="middle" fill="${colors.primary}" font-family="Arial, sans-serif" font-size="8" font-weight="bold">₹</text>
            
            <text x="200" y="250" text-anchor="middle" fill="${colors.primary}" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Support Our Cause</text>
          </svg>
        `;

      case "water":
        return `
          <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${colors.accent}"/>
                <stop offset="100%" style="stop-color:${colors.secondary}"/>
              </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#waterGrad)"/>
            
            <!-- Well -->
            <ellipse cx="200" cy="200" rx="40" ry="15" fill="${colors.primary}"/>
            <rect x="160" y="150" width="80" height="50" fill="#8B4513"/>
            <ellipse cx="200" cy="150" rx="40" ry="15" fill="${colors.primary}"/>
            
            <!-- Bucket -->
            <ellipse cx="280" cy="180" rx="20" ry="8" fill="#666"/>
            <rect x="260" y="170" width="40" height="10" fill="#666"/>
            <ellipse cx="280" cy="170" rx="20" ry="8" fill="#999"/>
            
            <!-- Water drops -->
            <ellipse cx="190" cy="130" rx="3" ry="6" fill="${colors.primary}"/>
            <ellipse cx="200" cy="125" rx="3" ry="6" fill="${colors.primary}"/>
            <ellipse cx="210" cy="130" rx="3" ry="6" fill="${colors.primary}"/>
            
            <!-- People -->
            <circle cx="120" cy="190" r="10" fill="#F4A460"/>
            <rect x="112" y="200" width="16" height="25" fill="${colors.secondary}"/>
            <circle cx="320" cy="190" r="10" fill="#F4A460"/>
            <rect x="312" y="200" width="16" height="25" fill="${colors.secondary}"/>
            
            <text x="200" y="250" text-anchor="middle" fill="${colors.primary}" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Clean Water Access</text>
          </svg>
        `;

      case "healthcare":
        return `
          <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="healthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${colors.accent}"/>
                <stop offset="100%" style="stop-color:${colors.secondary}"/>
              </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#healthGrad)"/>
            
            <!-- Medical cross -->
            <rect x="190" y="100" width="20" height="60" fill="${colors.primary}"/>
            <rect x="180" y="120" width="40" height="20" fill="${colors.primary}"/>
            
            <!-- Stethoscope -->
            <circle cx="120" cy="120" r="8" fill="${colors.primary}"/>
            <path d="M120,128 Q140,140 160,120" stroke="${colors.primary}" stroke-width="3" fill="none"/>
            <circle cx="160" cy="120" r="5" fill="${colors.primary}"/>
            
            <!-- Medical bag -->
            <rect x="250" y="140" width="40" height="30" fill="${colors.secondary}" rx="5"/>
            <rect x="265" y="130" width="10" height="10" fill="${colors.primary}"/>
            <path d="M260,150 L280,150" stroke="white" stroke-width="2"/>
            <path d="M270,145 L270,155" stroke="white" stroke-width="2"/>
            
            <!-- Ambulance -->
            <rect x="80" y="180" width="60" height="30" fill="white" stroke="${colors.primary}" stroke-width="2"/>
            <circle cx="95" cy="220" r="8" fill="${colors.primary}"/>
            <circle cx="125" cy="220" r="8" fill="${colors.primary}"/>
            <rect x="105" y="190" width="10" height="10" fill="${colors.primary}"/>
            <rect x="110" y="185" width="10" height="10" fill="${colors.primary}"/>
            
            <!-- Heart with pulse -->
            <path d="M300,140 C295,135 285,135 285,145 C285,155 300,170 300,170 C300,170 315,155 315,145 C315,135 305,135 300,140 Z" fill="${colors.primary}"/>
            <path d="M260,145 L270,145 L275,135 L280,155 L285,145 L340,145" stroke="${colors.primary}" stroke-width="2" fill="none"/>
            
            <text x="200" y="250" text-anchor="middle" fill="${colors.primary}" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Healthcare for All</text>
          </svg>
        `;

      case "housing":
        return `
          <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="houseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${colors.accent}"/>
                <stop offset="100%" style="stop-color:${colors.secondary}"/>
              </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#houseGrad)"/>
            
            <!-- Main house -->
            <rect x="140" y="140" width="120" height="80" fill="white" stroke="${colors.primary}" stroke-width="2"/>
            <polygon points="140,140 200,100 260,140" fill="${colors.primary}"/>
            
            <!-- Door -->
            <rect x="185" y="180" width="30" height="40" fill="${colors.secondary}"/>
            <circle cx="205" cy="200" r="2" fill="${colors.primary}"/>
            
            <!-- Windows -->
            <rect x="155" y="160" width="20" height="15" fill="${colors.secondary}"/>
            <rect x="225" y="160" width="20" height="15" fill="${colors.secondary}"/>
            <line x1="165" y1="160" x2="165" y2="175" stroke="${colors.primary}" stroke-width="1"/>
            <line x1="235" y1="160" x2="235" y2="175" stroke="${colors.primary}" stroke-width="1"/>
            
            <!-- Chimney -->
            <rect x="220" y="80" width="15" height="30" fill="${colors.primary}"/>
            
            <!-- Smoke -->
            <circle cx="230" cy="75" r="3" fill="#CCC" opacity="0.7"/>
            <circle cx="235" cy="70" r="2" fill="#CCC" opacity="0.6"/>
            <circle cx="225" cy="68" r="2" fill="#CCC" opacity="0.6"/>
            
            <!-- Smaller houses -->
            <rect x="80" y="170" width="40" height="50" fill="${colors.accent}"/>
            <polygon points="80,170 100,150 120,170" fill="${colors.secondary}"/>
            <rect x="280" y="170" width="40" height="50" fill="${colors.accent}"/>
            <polygon points="280,170 300,150 320,170" fill="${colors.secondary}"/>
            
            <!-- Trees -->
            <circle cx="60" cy="180" r="15" fill="#228B22"/>
            <rect x="57" y="195" width="6" height="15" fill="#8B4513"/>
            <circle cx="340" cy="180" r="15" fill="#228B22"/>
            <rect x="337" y="195" width="6" height="15" fill="#8B4513"/>
            
            <text x="200" y="250" text-anchor="middle" fill="${colors.primary}" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Safe Housing</text>
          </svg>
        `;

      case "energy":
        return `
          <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="energyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${colors.accent}"/>
                <stop offset="100%" style="stop-color:${colors.secondary}"/>
              </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#energyGrad)"/>
            
            <!-- Solar panel -->
            <rect x="120" y="120" width="80" height="50" fill="${colors.primary}" stroke="#333" stroke-width="1"/>
            <line x1="130" y1="130" x2="190" y2="130" stroke="#333" stroke-width="0.5"/>
            <line x1="130" y1="140" x2="190" y2="140" stroke="#333" stroke-width="0.5"/>
            <line x1="130" y1="150" x2="190" y2="150" stroke="#333" stroke-width="0.5"/>
            <line x1="130" y1="160" x2="190" y2="160" stroke="#333" stroke-width="0.5"/>
            <line x1="140" y1="120" x2="140" y2="170" stroke="#333" stroke-width="0.5"/>
            <line x1="150" y1="120" x2="150" y2="170" stroke="#333" stroke-width="0.5"/>
            <line x1="160" y1="120" x2="160" y2="170" stroke="#333" stroke-width="0.5"/>
            <line x1="170" y1="120" x2="170" y2="170" stroke="#333" stroke-width="0.5"/>
            <line x1="180" y1="120" x2="180" y2="170" stroke="#333" stroke-width="0.5"/>
            
            <!-- Sun -->
            <circle cx="320" cy="80" r="20" fill="#FFD700"/>
            <line x1="320" y1="50" x2="320" y2="40" stroke="#FFD700" stroke-width="2"/>
            <line x1="320" y1="120" x2="320" y2="110" stroke="#FFD700" stroke-width="2"/>
            <line x1="290" y1="80" x2="280" y2="80" stroke="#FFD700" stroke-width="2"/>
            <line x1="350" y1="80" x2="360" y2="80" stroke="#FFD700" stroke-width="2"/>
            <line x1="300" y1="60" x2="295" y2="55" stroke="#FFD700" stroke-width="2"/>
            <line x1="340" y1="100" x2="345" y2="105" stroke="#FFD700" stroke-width="2"/>
            <line x1="340" y1="60" x2="345" y2="55" stroke="#FFD700" stroke-width="2"/>
            <line x1="300" y1="100" x2="295" y2="105" stroke="#FFD700" stroke-width="2"/>
            
            <!-- Light bulb -->
            <circle cx="280" cy="180" r="15" fill="${colors.secondary}"/>
            <rect x="275" y="195" width="10" height="8" fill="#666"/>
            <rect x="273" y="203" width="14" height="4" fill="#666"/>
            
            <!-- Lightning bolt -->
            <path d="M240,140 L250,160 L245,160 L250,180 L240,160 L245,160 Z" fill="${colors.primary}"/>
            
            <!-- Wind turbine -->
            <rect x="60" y="100" width="4" height="80" fill="${colors.primary}"/>
            <ellipse cx="62" cy="100" rx="15" ry="3" fill="${colors.secondary}" transform="rotate(0 62 100)"/>
            <ellipse cx="62" cy="100" rx="15" ry="3" fill="${colors.secondary}" transform="rotate(120 62 100)"/>
            <ellipse cx="62" cy="100" rx="15" ry="3" fill="${colors.secondary}" transform="rotate(240 62 100)"/>
            
            <text x="200" y="250" text-anchor="middle" fill="${colors.primary}" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Renewable Energy</text>
          </svg>
        `;

      case "community":
        return `
          <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="commGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${colors.accent}"/>
                <stop offset="100%" style="stop-color:${colors.secondary}"/>
              </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#commGrad)"/>
            
            <!-- People in circle -->
            <circle cx="200" cy="150" r="80" fill="none" stroke="${colors.primary}" stroke-width="2" stroke-dasharray="5,5"/>
            
            <!-- Person 1 -->
            <circle cx="200" cy="100" r="10" fill="#F4A460"/>
            <rect x="195" y="110" width="10" height="15" fill="${colors.primary}"/>
            
            <!-- Person 2 -->
            <circle cx="250" cy="130" r="10" fill="#DEB887"/>
            <rect x="245" y="140" width="10" height="15" fill="${colors.secondary}"/>
            
            <!-- Person 3 -->
            <circle cx="270" cy="180" r="10" fill="#F4A460"/>
            <rect x="265" y="190" width="10" height="15" fill="${colors.primary}"/>
            
            <!-- Person 4 -->
            <circle cx="230" cy="220" r="10" fill="#DEB887"/>
            <rect x="225" y="230" width="10" height="15" fill="${colors.secondary}"/>
            
            <!-- Person 5 -->
            <circle cx="170" cy="220" r="10" fill="#F4A460"/>
            <rect x="165" y="230" width="10" height="15" fill="${colors.primary}"/>
            
            <!-- Person 6 -->
            <circle cx="130" cy="180" r="10" fill="#DEB887"/>
            <rect x="125" y="190" width="10" height="15" fill="${colors.secondary}"/>
            
            <!-- Person 7 -->
            <circle cx="150" cy="130" r="10" fill="#F4A460"/>
            <rect x="145" y="140" width="10" height="15" fill="${colors.primary}"/>
            
            <!-- Connecting hands -->
            <line x1="210" y1="115" x2="240" y2="135" stroke="${colors.primary}" stroke-width="2"/>
            <line x1="255" y1="145" x2="265" y2="175" stroke="${colors.primary}" stroke-width="2"/>
            <line x1="265" y1="195" x2="235" y2="215" stroke="${colors.primary}" stroke-width="2"/>
            <line x1="220" y1="235" x2="180" y2="235" stroke="${colors.primary}" stroke-width="2"/>
            <line x1="160" y1="225" x2="140" y2="195" stroke="${colors.primary}" stroke-width="2"/>
            <line x1="135" y1="175" x2="155" y2="145" stroke="${colors.primary}" stroke-width="2"/>
            <line x1="160" y1="135" x2="190" y2="115" stroke="${colors.primary}" stroke-width="2"/>
            
            <!-- Central heart -->
            <path d="M200,140 C195,135 185,135 185,145 C185,155 200,170 200,170 C200,170 215,155 215,145 C215,135 205,135 200,140 Z" fill="${colors.primary}"/>
            
            <text x="200" y="280" text-anchor="middle" fill="${colors.primary}" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Community Unity</text>
          </svg>
        `;

      case "hero":
        return `
          <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${colors.accent}"/>
                <stop offset="100%" style="stop-color:${colors.secondary}"/>
              </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#heroGrad)"/>
            
            <!-- Mountain background -->
            <polygon points="0,200 100,120 200,140 300,100 400,130 400,300 0,300" fill="${colors.primary}" opacity="0.3"/>
            <polygon points="0,220 80,160 180,180 280,140 400,170 400,300 0,300" fill="${colors.primary}" opacity="0.2"/>
            
            <!-- Sun -->
            <circle cx="320" cy="80" r="25" fill="#FFD700"/>
            <line x1="320" y1="45" x2="320" y2="30" stroke="#FFD700" stroke-width="3"/>
            <line x1="320" y1="130" x2="320" y2="115" stroke="#FFD700" stroke-width="3"/>
            <line x1="275" y1="80" x2="260" y2="80" stroke="#FFD700" stroke-width="3"/>
            <line x1="365" y1="80" x2="380" y2="80" stroke="#FFD700" stroke-width="3"/>
            
            <!-- Large helping hands -->
            <ellipse cx="150" cy="150" rx="25" ry="12" fill="#F4A460" transform="rotate(-15 150 150)"/>
            <ellipse cx="250" cy="150" rx="25" ry="12" fill="#DEB887" transform="rotate(15 250 150)"/>
            
            <!-- Heart between hands -->
            <path d="M200,130 C190,120 170,120 170,140 C170,160 200,190 200,190 C200,190 230,160 230,140 C230,120 210,120 200,130 Z" fill="${colors.primary}"/>
            
            <!-- Hope rays -->
            <g opacity="0.7">
              <line x1="200" y1="100" x2="200" y2="80" stroke="${colors.primary}" stroke-width="3"/>
              <line x1="180" y1="110" x2="170" y2="95" stroke="${colors.primary}" stroke-width="3"/>
              <line x1="220" y1="110" x2="230" y2="95" stroke="${colors.primary}" stroke-width="3"/>
              <line x1="165" y1="130" x2="150" y2="120" stroke="${colors.primary}" stroke-width="3"/>
              <line x1="235" y1="130" x2="250" y2="120" stroke="${colors.primary}" stroke-width="3"/>
            </g>
            
            <!-- Globe at bottom -->
            <circle cx="200" cy="220" r="30" fill="${colors.secondary}" opacity="0.8"/>
            <path d="M170,220 Q200,200 230,220" stroke="${colors.primary}" stroke-width="2" fill="none"/>
            <path d="M170,220 Q200,240 230,220" stroke="${colors.primary}" stroke-width="2" fill="none"/>
            <line x1="200" y1="190" x2="200" y2="250" stroke="${colors.primary}" stroke-width="2"/>
            
            <text x="200" y="280" text-anchor="middle" fill="${colors.primary}" font-family="Arial, sans-serif" font-size="18" font-weight="bold">Hope for Humanity</text>
          </svg>
        `;

      case "about":
        return `
          <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="aboutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${colors.accent}"/>
                <stop offset="100%" style="stop-color:${colors.secondary}"/>
              </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#aboutGrad)"/>
            
            <!-- Mission symbol - compass -->
            <circle cx="200" cy="150" r="50" fill="white" stroke="${colors.primary}" stroke-width="3"/>
            <circle cx="200" cy="150" r="5" fill="${colors.primary}"/>
            
            <!-- Compass points -->
            <polygon points="200,110 205,140 200,145 195,140" fill="${colors.primary}"/>
            <polygon points="200,190 195,160 200,155 205,160" fill="${colors.primary}"/>
            <polygon points="160,150 190,145 195,150 190,155" fill="${colors.secondary}"/>
            <polygon points="240,150 210,155 205,150 210,145" fill="${colors.secondary}"/>
            
            <!-- N E S W -->
            <text x="200" y="105" text-anchor="middle" fill="${colors.primary}" font-family="Arial, sans-serif" font-size="12" font-weight="bold">N</text>
            <text x="245" y="155" text-anchor="middle" fill="${colors.primary}" font-family="Arial, sans-serif" font-size="12" font-weight="bold">E</text>
            <text x="200" y="200" text-anchor="middle" fill="${colors.primary}" font-family="Arial, sans-serif" font-size="12" font-weight="bold">S</text>
            <text x="155" y="155" text-anchor="middle" fill="${colors.primary}" font-family="Arial, sans-serif" font-size="12" font-weight="bold">W</text>
            
            <!-- Team figures around compass -->
            <circle cx="120" cy="100" r="8" fill="#F4A460"/>
            <rect x="115" y="108" width="10" height="12" fill="${colors.primary}"/>
            
            <circle cx="280" cy="100" r="8" fill="#DEB887"/>
            <rect x="275" y="108" width="10" height="12" fill="${colors.secondary}"/>
            
            <circle cx="120" cy="200" r="8" fill="#F4A460"/>
            <rect x="115" y="208" width="10" height="12" fill="${colors.primary}"/>
            
            <circle cx="280" cy="200" r="8" fill="#DEB887"/>
            <rect x="275" y="208" width="10" height="12" fill="${colors.secondary}"/>
            
            <!-- Connecting lines to center -->
            <line x1="128" y1="108" x2="170" y2="130" stroke="${colors.primary}" stroke-width="2" opacity="0.5"/>
            <line x1="272" y1="108" x2="230" y2="130" stroke="${colors.primary}" stroke-width="2" opacity="0.5"/>
            <line x1="128" y1="212" x2="170" y2="190" stroke="${colors.primary}" stroke-width="2" opacity="0.5"/>
            <line x1="272" y1="212" x2="230" y2="190" stroke="${colors.primary}" stroke-width="2" opacity="0.5"/>
            
            <text x="200" y="280" text-anchor="middle" fill="${colors.primary}" font-family="Arial, sans-serif" font-size="16" font-weight="bold">Our Mission</text>
          </svg>
        `;

      default:
        return `
          <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="defaultGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${colors.accent}"/>
                <stop offset="100%" style="stop-color:${colors.secondary}"/>
              </linearGradient>
            </defs>
            <rect width="400" height="300" fill="url(#defaultGrad)"/>
            <path d="M200,130 C190,120 170,120 170,140 C170,160 200,190 200,190 C200,190 230,160 230,140 C230,120 210,120 200,130 Z" fill="${colors.primary}"/>
            <text x="200" y="250" text-anchor="middle" fill="${colors.primary}" font-family="Arial, sans-serif" font-size="16" font-weight="bold">HopeHands NGO</text>
          </svg>
        `;
    }
  };

  const svgDataUrl = `data:image/svg+xml;base64,${btoa(generateSVG(type))}`;

  return (
    <img
      src={svgDataUrl}
      alt={alt}
      className={className}
      width={width}
      height={height}
      style={{ maxWidth: "100%", height: "auto" }}
    />
  );
}
