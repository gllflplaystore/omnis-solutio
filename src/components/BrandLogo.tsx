export default function BrandLogo() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg
        viewBox="20 20 605 330"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* ---------- DEFINITIONS ---------- */}
        <defs>
          <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff3bff" />
            <stop offset="50%" stopColor="#5b8cff" />
            <stop offset="100%" stopColor="#ff3b3b" />
          </linearGradient>

          <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ---------------- BASE LOGO ---------------- */}
        <path
          d="M564.881 27.6436H420.208C391.233 27.6436 367.768 51.7158 367.768 81.4418H617.354C617.354 51.7158 593.89 27.6436 564.915 27.6436H564.881ZM564.881 157.37H403.404L250.515 27.6436H80.079C51.1038 27.6436 27.6396 51.7158 27.6396 81.4418V287.131C27.6396 316.857 51.1038 340.929 80.079 340.929H267.285C296.26 340.929 319.724 316.857 319.724 287.131V209.191L267.285 164.689V287.131H80.079V81.4418H231.649L384.538 211.168H564.881V287.096H367.768C367.768 316.822 391.233 340.895 420.208 340.895H564.881C593.856 340.895 617.32 316.822 617.32 287.096V211.168C617.32 181.442 593.856 157.37 564.881 157.37Z"
          fill="rgba(255,255,255,0.08)"
        />

        {/* -------- TOP GLOW LINE -------- */}

        <path
          d="M564.881 27.6436 H420.208 C391.233 27.6436 367.768 51.7158 367.768 81.4418 H617.354 C617.354 51.7158 593.89 27.6436 565.5 28"
          fill="none"
          stroke="#5b8cff"
          strokeWidth="0.3"
        />
        <path
          d="M564.881 27.6436 H420.208 C391.233 27.6436 367.768 51.7158 367.768 81.4418 H617.354 C617.354 51.7158 593.89 27.6436 565.5 28"
          fill="none"
          stroke="url(#energyGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          pathLength="1"
          className="energy-top"
          filter="url(#neonGlow)"
        />

        {/* -------- BOTTOM GLOW LINE -------- */}

        <path
          d="M564.881 157.37H403.404L250.515 27.6436H80.079C51.1038 27.6436 27.6396 51.7158 27.6396 81.4418V287.131C27.6396 316.857 51.1038 340.929 80.079 340.929H267.285C296.26 340.929 319.724 316.857 319.724 287.131V209.191L267.285 164.689V287.131H80.079V81.4418H231.649L384.538 211.168H564.881V287.096H367.768C367.768 316.822 391.233 340.895 420.208 340.895H564.881C593.856 340.895 617.32 316.822 617.32 287.096V211.168C617.32 181.442 593.856 157.37 564.881 157.37Z"
          fill="none"
          stroke="#5b8cff"
          strokeWidth="0.3"
        />
        <path
          d="M564.881 157.37H403.404L250.515 27.6436H80.079C51.1038 27.6436 27.6396 51.7158 27.6396 81.4418V287.131C27.6396 316.857 51.1038 340.929 80.079 340.929H267.285C296.26 340.929 319.724 316.857 319.724 287.131V209.191L267.285 164.689V287.131H80.079V81.4418H231.649L384.538 211.168H564.881V287.096H367.768C367.768 316.822 391.233 340.895 420.208 340.895H564.881C593.856 340.895 617.32 316.822 617.32 287.096V211.168C617.32 181.442 593.856 157.37 564.881 157.37Z"
          fill="none"
          stroke="url(#energyGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          pathLength="1"
          className="energy-bottom"
          filter="url(#neonGlow)"
        />
      </svg>
    </div>
  );
}
