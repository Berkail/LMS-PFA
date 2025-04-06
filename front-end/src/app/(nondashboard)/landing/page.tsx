"use client";

import React from 'react'
import { motion } from 'framer-motion';
import Link from "next/link";
import {useCarousel} from "@/hooks/useCarousel";
import Image from "next/image";
import {Skeleton} from "@/components/ui/skeleton";
import LandingLoadingSkeleton from '@/components/skeletons/LandingLoadingSkeleton';


export default function LandingPage() {

  const [isLoading, setIsLoading] = React.useState(true);

  // Always call hooks at the top level
  const currentImage = useCarousel({ totalImages: 3 });

  React.useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  // Conditional rendering for loading state
  if (isLoading) {
    return <LandingLoadingSkeleton />;
  }


  return (
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="landing"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y:0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="landing__hero"

          >
             <div className="landing__hero-content">
               <h1 className="landing__title">Stay Hungry, Stay Foolish</h1>
               <p className="landing__description">
               Embracing Steve Jobs' timeless wisdom, we value curiosity and bold thinking. Our platform encourages students to question, explore, and never settle.
               </p>
               <div className="landing__cta">
                 <Link href="/signup">
                   <div className="landing__cta-button">Join us</div>
                 </Link>
               </div>
             </div>
             <div className="landing__hero-images">
               {["/hero1.jpg" , "/hero2.jpg" , "/hero3.jpg" ].map ((src, index) => (
                   <Image
                       key={src}
                       src={src}
                       alt={`Hero Banneer ${index + 1}`}
                       fill
                       priority={index === currentImage}
                       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                       className={`landing__hero-image ${
                           index === currentImage ? "landing__hero-image--active" : ""
                       }`}
                   />

               ))}
             </div>

        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y:0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ amount:0.3, once:true}}
          className="landing__featured"
          >
          <h2 className="landing__featured-title">Featured Courses</h2>
          <p className="landing__featured-description">
            From beginner to advanced, in all industries, we have the right courses just for you and preparing your intire journey for learning and making the most.
          </p> 

          <div className="landing__tags">
            {["web development","enterprise IT", "react nextjs" , "javascript","backend development"].map((tag, index) => (
                <span key={index} className="landing__tag">
                  {tag}
                </span>
            ))}
          </div>
            <div className="landing__courses">

            </div>

        </motion.div>
      </motion.div>
  );
}
