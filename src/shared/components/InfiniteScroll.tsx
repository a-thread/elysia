import React, { useRef, useEffect, ReactNode } from 'react';

interface InfiniteScrollProps {
  threshold?: number;
  onScrolled: () => void;
  children?: ReactNode;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({ threshold = 1, onScrolled, children }) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            onScrolled();
          }
        });
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold, onScrolled]);

  return <div ref={elementRef}>{children}</div>;
};

export default InfiniteScroll;
