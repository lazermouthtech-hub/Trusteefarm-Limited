import React from 'react';

const AppleIcon = ({ className = 'h-6 w-6' }: { className?: string }) => {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="currentColor"
        d="M19.35 15.34a3.39 3.39 0 0 1-2.45-1.23a3.36 3.36 0 0 1-1.23-2.45a5.2 5.2 0 0 1 1.48-3.87a5.53 5.53 0 0 1 3.79-1.85a1 1 0 0 1 .42 0a5.28 5.28 0 0 1 2.33 4.68a5.22 5.22 0 0 1-5.34 4.72M16.5 6.74a4.42 4.42 0 0 0-3.32 1.48a5.35 5.35 0 0 0-2 4.25a5.73 5.73 0 0 0 .15 1.45a1 1 0 0 1-1.09 1.09a7.22 7.22 0 0 1-1.39-4.82a7.35 7.35 0 0 1 2.76-6A7.44 7.44 0 0 1 16.5 2a.69.69 0 0 1 .15 0a7.48 7.48 0 0 1 5.38 2.5a.69.69 0 0 1 0 1a5.45 5.45 0 0 0-3.14 1.25Z"
      />
    </svg>
  );
};

export default AppleIcon;
