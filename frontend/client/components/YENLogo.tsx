interface YENLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "full" | "icon" | "text";
  className?: string;
}

export default function YENLogo({
  size = "md",
  variant = "full",
  className = "",
}: YENLogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  const iconSize = sizeClasses[size];
  const textSize = textSizeClasses[size];

  const LogoIcon = () => (
    <div className={`${iconSize} relative ${className}`}>
      {/* Outer circle with purple-pink gradient */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 shadow-lg"></div>

      {/* Inner design - networking/entrepreneurial symbol */}
      <div className="relative flex h-full w-full items-center justify-center rounded-full">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5 text-white drop-shadow-sm"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Central hub representing network core */}
          <circle
            cx="12"
            cy="12"
            r="2.5"
            fill="currentColor"
            opacity="0.95"
          />

          {/* Network nodes around the central hub */}
          <circle cx="6" cy="6" r="1.2" fill="currentColor" opacity="0.8" />
          <circle cx="18" cy="6" r="1.2" fill="currentColor" opacity="0.8" />
          <circle cx="6" cy="18" r="1.2" fill="currentColor" opacity="0.8" />
          <circle cx="18" cy="18" r="1.2" fill="currentColor" opacity="0.8" />
          <circle cx="12" cy="4" r="1" fill="currentColor" opacity="0.7" />
          <circle cx="12" cy="20" r="1" fill="currentColor" opacity="0.7" />
          <circle cx="4" cy="12" r="1" fill="currentColor" opacity="0.7" />
          <circle cx="20" cy="12" r="1" fill="currentColor" opacity="0.7" />

          {/* Connection lines representing network */}
          <g opacity="0.6" stroke="currentColor" strokeWidth="1" fill="none">
            <line x1="12" y1="12" x2="6" y2="6" />
            <line x1="12" y1="12" x2="18" y2="6" />
            <line x1="12" y1="12" x2="6" y2="18" />
            <line x1="12" y1="12" x2="18" y2="18" />
            <line x1="12" y1="12" x2="12" y2="4" />
            <line x1="12" y1="12" x2="12" y2="20" />
            <line x1="12" y1="12" x2="4" y2="12" />
            <line x1="12" y1="12" x2="20" y2="12" />
          </g>

          {/* Innovation spark */}
          <path
            d="M10 8l2-2 2 2-1 1 1 1-2 2-2-2 1-1-1-1z"
            fill="currentColor"
            opacity="0.9"
          />

          {/* Growth arrows */}
          <g opacity="0.7" stroke="currentColor" strokeWidth="0.8" fill="none">
            <path d="M8 16l-1-1 1-1" />
            <path d="M16 8l1 1-1 1" />
          </g>
        </svg>
      </div>

      {/* Subtle glow effect with purple-pink theme */}
      <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-purple-300/20 to-pink-400/20 blur-sm -z-10"></div>
    </div>
  );

  const LogoText = () => (
    <span
      className={`${textSize} font-bold bg-gradient-to-r from-purple-700 via-pink-600 to-purple-600 bg-clip-text text-transparent ${className}`}
    >
      YEN
    </span>
  );

  if (variant === "icon") {
    return <LogoIcon />;
  }

  if (variant === "text") {
    return <LogoText />;
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <LogoIcon />
      <LogoText />
    </div>
  );
}
