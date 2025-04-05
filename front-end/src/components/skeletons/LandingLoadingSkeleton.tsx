import React from 'react'
import { Skeleton } from '../ui/skeleton';

const LandingLoadingSkeleton = () => {
    return (
        <div className="landing-skeleton">
          <div className="landing-skeleton__hero">
            <div className="landing-skeleton__hero-content">
              <Skeleton className="landing-skeleton__title" />
              <Skeleton className="landing-skeleton__subtitle" />
              <Skeleton className="landing-skeleton__subtitle-secondary" />
              <Skeleton className="landing-skeleton__button" />
            </div>
            <Skeleton className="landing-skeleton__hero-image" />
          </div>
  
          <div className="landing-skeleton__featured">
            <Skeleton className="landing-skeleton__featured-title" />
            <Skeleton className="landing-skeleton__featured-description" />
  
          </div>
  
        </div>
    );
  };

export default LandingLoadingSkeleton