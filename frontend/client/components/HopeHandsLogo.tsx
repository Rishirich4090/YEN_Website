interface HopeHandsLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "full" | "icon" | "text";
  className?: string;
}

export default function HopeHandsLogo({
  size = "md",
  variant = "full",
  className = "",
}: HopeHandsLogoProps) {
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
      {/* Outer circle with green-yellow gradient */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-green-500 shadow-lg"></div>

      {/* Inner design - handshaking/helping hands */}
      <div className="relative flex h-full w-full items-center justify-center rounded-full">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5 text-white drop-shadow-sm"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left hand extended for handshake */}
          <path
            d="M3 14c0-.5.2-1 .5-1.3l3-2.5c.8-.7 2-.7 2.8 0l.7.6c.3.3.5.7.5 1.2v2c0 .5-.2 1-.5 1.3l-2 1.7c-.4.3-.9.3-1.3 0l-3-2.5c-.5-.4-.7-1-.7-1.5z"
            fill="currentColor"
            opacity="0.95"
          />

          {/* Right hand extended for handshake */}
          <path
            d="M21 14c0-.5-.2-1-.5-1.3l-3-2.5c-.8-.7-2-.7-2.8 0l-.7.6c-.3.3-.5.7-.5 1.2v2c0 .5.2 1 .5 1.3l2 1.7c.4.3.9.3 1.3 0l3-2.5c.5-.4.7-1 .7-1.5z"
            fill="currentColor"
            opacity="0.95"
          />

          {/* Handshake connection in the center */}
          <ellipse
            cx="12"
            cy="13.5"
            rx="1.5"
            ry="1"
            fill="currentColor"
            opacity="0.9"
          />

          {/* Heart symbol representing care and compassion */}
          <path
            d="M12 9.5c-.7-.7-1.8-.7-2.5 0-.7.7-.7 1.8 0 2.5L12 14.5l2.5-2.5c.7-.7.7-1.8 0-2.5-.7-.7-1.8-.7-2.5 0z"
            fill="currentColor"
            opacity="0.8"
          />

          {/* Unity dots showing connection */}
          <circle cx="9.5" cy="13" r="0.4" fill="currentColor" opacity="0.7" />
          <circle cx="14.5" cy="13" r="0.4" fill="currentColor" opacity="0.7" />

          {/* Rays of hope emanating outward */}
          <g opacity="0.6" stroke="currentColor" strokeWidth="0.5" fill="none">
            <line x1="12" y1="4" x2="12" y2="6.5" />
            <line x1="12" y1="19.5" x2="12" y2="22" />
            <line x1="5" y1="12" x2="7.5" y2="12" />
            <line x1="16.5" y1="12" x2="19" y2="12" />
            <line x1="7.5" y1="7.5" x2="9" y2="9" />
            <line x1="15" y1="15" x2="16.5" y2="16.5" />
            <line x1="16.5" y1="7.5" x2="15" y2="9" />
            <line x1="9" y1="15" x2="7.5" y2="16.5" />
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
      HopeHands
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
