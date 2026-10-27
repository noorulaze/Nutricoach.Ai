import React, { useState, useEffect } from 'react';
import { getFoodImageUrl, CATEGORY_FALLBACK_IMAGES } from '../../utils/foodImageDatabase';
import { Utensils } from 'lucide-react';

interface FoodImageProps {
  name: string;
  category?: string;
  cuisine?: string;
  dietaryType?: string;
  imageUrl?: string;
  src?: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'auto';
  showCategoryBadge?: boolean;
}

export default function FoodImage({
  name,
  category,
  cuisine,
  dietaryType,
  imageUrl,
  src,
  alt,
  className = '',
  imgClassName = '',
  aspectRatio = 'square',
  showCategoryBadge = false
}: FoodImageProps) {
  const resolvedUrl = imageUrl || src || getFoodImageUrl({ name, category, cuisine, dietaryType });
  const [currentSrc, setCurrentSrc] = useState<string>(resolvedUrl);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const nextUrl = imageUrl || src || getFoodImageUrl({ name, category, cuisine, dietaryType });
    setCurrentSrc(nextUrl);
    setHasError(false);
    setIsLoaded(false);
  }, [name, category, cuisine, dietaryType, imageUrl, src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      const fallback = (category && CATEGORY_FALLBACK_IMAGES[category]) || CATEGORY_FALLBACK_IMAGES.general_food;
      if (fallback !== currentSrc) {
        setCurrentSrc(fallback);
      }
    }
  };

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[16/9]',
    auto: 'h-full w-full'
  }[aspectRatio];

  return (
    <div className={`relative overflow-hidden bg-[#f0f4ef] dark:bg-[#202722] ${aspectClasses} ${className}`}>
      {/* Skeleton Loading Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-black/10 to-black/5 dark:from-white/5 dark:via-white/10 dark:to-white/5 animate-pulse flex items-center justify-center">
          <Utensils className="w-4 h-4 text-[#8BAF78]/40" />
        </div>
      )}

      {/* Real Image */}
      <img
        src={currentSrc}
        alt={alt || `${name} food photo`}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className={`w-full h-full object-cover transition-all duration-300 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        } ${imgClassName}`}
      />

      {/* Optional Category Badge */}
      {showCategoryBadge && category && (
        <div className="absolute top-2 left-2 z-10">
          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-xs text-white border border-white/20">
            {category.replace('_', ' ')}
          </span>
        </div>
      )}
    </div>
  );
}
