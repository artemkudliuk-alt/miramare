// Amenity icons drawn for Miramare: every icon repeats the double line of the logo's M.
const Svg = ({ children }) => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
)

export const Parasol = () => (
  <Svg>
    <path d="M3 11c2.5-5.5 15.5-5.5 18 0" />
    <path d="M5.6 11c2.4-3.4 10.4-3.4 12.8 0" />
    <path d="M11.4 11v9.5M12.6 11v9.5M4 20.5h16" />
  </Svg>
)

export const HeatedPool = () => (
  <Svg>
    <path d="M8 13V5.5a2 2 0 0 1 4 0M11 13V5.5a2 2 0 0 1 4 0M8 8.5h3M8 11h3" />
    <path d="M3 16.5c1.5-1.2 3-1.2 4.5 0s3 1.2 4.5 0 3-1.2 4.5 0 3 1.2 4.5 0" />
    <path d="M3 20c1.5-1.2 3-1.2 4.5 0s3 1.2 4.5 0 3-1.2 4.5 0 3 1.2 4.5 0" />
  </Svg>
)

export const SaltPool = () => (
  <Svg>
    <path d="M12 2.5c2.3 3 3.4 4.8 3.4 6.3a3.4 3.4 0 0 1-6.8 0c0-1.5 1.1-3.3 3.4-6.3z" />
    <path d="M3 16.5c1.5-1.2 3-1.2 4.5 0s3 1.2 4.5 0 3-1.2 4.5 0 3 1.2 4.5 0" />
    <path d="M3 20c1.5-1.2 3-1.2 4.5 0s3 1.2 4.5 0 3-1.2 4.5 0 3 1.2 4.5 0" />
  </Svg>
)

export const Bistro = () => (
  <Svg>
    <circle cx="12" cy="12" r="6.2" />
    <circle cx="12" cy="12" r="4" />
    <path d="M2.8 4v5.2M1.8 4v3.6a1 1 0 0 0 2 0M2.8 9.2V20M21.2 4c-1.4 1.6-1.8 4-1.2 7h1.2V20" />
  </Svg>
)

export const Reception = () => (
  <Svg>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="6.8" />
    <path d="M12 8.2V12l2.6 1.6" />
  </Svg>
)

export const Parking = () => (
  <Svg>
    <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
    <rect x="5.8" y="5.8" width="12.4" height="12.4" rx="1.6" />
    <path d="M10.2 15.6V8.4h2.5a2.2 2.2 0 0 1 0 4.4h-2.5" />
  </Svg>
)
