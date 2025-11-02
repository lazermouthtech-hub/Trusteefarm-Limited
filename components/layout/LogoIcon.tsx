import React from 'react';
import { classNames } from '../../lib/utils';

interface LogoIconProps {
  className?: string;
}

const LogoIcon = ({ className = 'h-8 w-8' }: LogoIconProps) => {
  return (
    <div className={classNames(className, 'rounded-full bg-gradient-to-br from-yellow-400 to-green-700 flex items-center justify-center p-1.5 shadow-md flex-shrink-0')}>
       <svg viewBox="0 0 50 50" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.6364 12H36.3636V18.6667H27.2727V38H21.8182V18.6667H13.6364V12ZM27.2727 23H35V27.3333H27.2727V23Z"
          fill="white"
        />
      </svg>
    </div>
  );
};

export default LogoIcon;