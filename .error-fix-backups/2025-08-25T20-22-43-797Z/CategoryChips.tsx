import React, { FC, useState, useEffect, useCallback, useRef } from 'react';

import { cn } from '../src/lib/utils.ts';

interface CategoryChipsProps {
 categories: string;
 selectedCategory: string;
 onSelectCategory: (category) => void;
 className?: string;
}

const CategoryChips: React.FC<CategoryChipsProps> = ({
 categories,
 selectedCategory,
 onSelectCategory,
 className }) => {
 const scrollContainerRef = useRef<HTMLDivElement>(null);
 const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
 const [canScrollRight, setCanScrollRight] = useState<boolean>(false);

 // Check scroll position and update button states
 const checkScrollPosition = useCallback(() => {
 const container = scrollContainerRef.current;
 if (!container) {
return;
}

 const { scrollLeft, scrollWidth, clientWidth } = container;
 setCanScrollLeft(scrollLeft > 0);
 setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
 }, []);

 // Scroll functions
 const scrollLeft = useCallback(() => {
 const container = scrollContainerRef.current;
 if (!container) {
return;
}

 container.scrollBy({
 left: -200,
 behavior: 'smooth' });
 }, []);

 const scrollRight = useCallback(() => {
 const container = scrollContainerRef.current;
 if (!container) {
return;
}

 container.scrollBy({
 left: 200,
 behavior: 'smooth' });
 }, []);

 // Set up scroll event listener
 useEffect(() => {
 const container = scrollContainerRef.current;
 if (!container) {
return;
}

 checkScrollPosition();
 container.addEventListener('scroll', checkScrollPosition as EventListener);

 // Check on resize
 const resizeObserver = new ResizeObserver(checkScrollPosition);
 resizeObserver.observe(container);

 return () => {
 container.removeEventListener('scroll', checkScrollPosition as EventListener);
 resizeObserver.disconnect();

 }}, [checkScrollPosition]);

 // Scroll to selected category when it changes
 useEffect(() => {
 const container = scrollContainerRef.current;
 if (!container) {
return;
}

 const selectedButton = container.querySelector(`[data-category="${selectedCategory}"]`) as HTMLElement;
 if (!selectedButton) {
return;
}

 const containerRect = container.getBoundingClientRect();
 const buttonRect = selectedButton.getBoundingClientRect();

 // Check if button is fully visible
 const isVisible =
 buttonRect.left >= containerRect.left &&
 buttonRect.right <= containerRect.right;

 if (!isVisible) {
 const scrollLeft = selectedButton.offsetLeft - container.offsetWidth / 2 + selectedButton.offsetWidth / 2;
 container.scrollTo({
 left: Math.max(0, scrollLeft),
 behavior: 'smooth' });
 }
 }, [selectedCategory]);

 return (
 <div className={cn('relative flex items-center py-2 sm:py-3', className)}>
 {/* Left scroll button */}
 {canScrollLeft && (
 <button />
// FIXED:  onClick={(e) => scrollLeft(e)}
// FIXED:  className="absolute left-0 z-10 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-white border border-gray-200 rounded-full shadow-md hover:bg-gray-50 transition-colors touch-manipulation"
// FIXED:  aria-label="Scroll left"
 >
 <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
// FIXED:  </svg>
// FIXED:  </button>
 )}

 {/* Category chips container */}
 <div
 ref={scrollContainerRef}
 className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-2 px-10 sm:px-12"
 style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
 >
 {categories?.map((category) => {
 const isSelected = category === selectedCategory;

 return (
 <button
 key={category}
// FIXED:  data-category={category} />
 onClick={() => onSelectCategory(category)}
 className={cn(
  'flex-shrink-0 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap touch-manipulation min-h-[36px] sm:min-h-[40px]',
  isSelected
  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
 )}
 >
 {category}
// FIXED:  </button>
 );
 })}
// FIXED:  </div>

 {/* Right scroll button */}
 {canScrollRight && (
 <button />
// FIXED:  onClick={(e) => scrollRight(e)}
// FIXED:  className="absolute right-0 z-10 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-white border border-gray-200 rounded-full shadow-md hover:bg-gray-50 transition-colors touch-manipulation"
// FIXED:  aria-label="Scroll right"
 >
 <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
// FIXED:  </svg>
// FIXED:  </button>
 )}

// FIXED:  </div>
 );
};

export default CategoryChips;