import React, { FC } from 'react';
const ChannelPageSkeleton: React.FC = () => {
 return (
 <div className="p-4 md:p-0 animate-pulse bg-white dark:bg-neutral-950">
 <div className="h-32 sm:h-48 md:h-56 lg:h-64 bg-neutral-200 dark:bg-neutral-700/50" />
 <div className="px-4 md:px-6 lg:px-8">
 <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-10 sm:-mt-12 md:-mt-16 mb-4 relative z-10">
 <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full bg-neutral-300 dark:bg-neutral-700 mr-0 sm:mr-5 border-4 border-white dark:border-neutral-950 flex-shrink-0" />
 <div className="flex-grow mt-3 sm:mt-0 text-center sm:text-left">
 <div className="h-8 w-48 sm:w-64 bg-neutral-300 dark:bg-neutral-700 rounded mb-2 mx-auto sm:mx-0" />
 <div className="h-5 w-32 sm:w-40 bg-neutral-300 dark:bg-neutral-700 rounded mx-auto sm:mx-0" />
// FIXED:  </div>
 <div className="h-10 w-32 bg-neutral-300 dark:bg-neutral-700 rounded-full mt-3 sm:mt-0 sm:ml-auto" />
// FIXED:  </div>
 <div className="flex border-b border-neutral-300 dark:border-neutral-700 space-x-1 mb-4">
 {Array.from({ length: 5 }).map((_, i) => (
 <div key={i} className="h-10 w-24 bg-neutral-200 dark:bg-neutral-700/60 rounded-t-md" />
 ))}
// FIXED:  </div>
 <div className="h-6 w-48 bg-neutral-300 dark:bg-neutral-700 rounded mb-4" />
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
 {Array.from({ length: 5 }).map((_, index) => (
 <div key={index} className="bg-white dark:bg-neutral-900 rounded-xl">
 <div className="aspect-video bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
 <div className="p-3"><div className="h-4 bg-neutral-300 dark:bg-neutral-700/80 rounded w-5/6 mb-1.5" /><div className="h-3 bg-neutral-300 dark:bg-neutral-700/80 rounded w-3/4" /></div>
// FIXED:  </div>
 ))}
// FIXED:  </div>
// FIXED:  </div>
// FIXED:  </div>
 );
};

export default ChannelPageSkeleton;