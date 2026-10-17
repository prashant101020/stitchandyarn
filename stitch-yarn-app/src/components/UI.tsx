import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';

// Fade-up animation on scroll
export function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '100px 0px 0px 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Image with blur-up placeholder and lazy loading
export function LazyImage({
  src,
  alt,
  className = '',
  aspectRatio = '4/5',
}: {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <div
      className={`relative overflow-hidden bg-cream-dark ${className}`}
      style={{ aspectRatio }}
    >
      {/* Blur placeholder */}
      {!loaded && (
        <div className="absolute inset-0 skeleton" />
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-500 ${
          loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        }`}
      />
    </div>
  );
}

// Product card with hover zoom
export function ProductCard({
  name,
  price,
  comparePrice,
  image,
  imageAlt,
  badges,
  onClick,
}: {
  name: string;
  price: number;
  comparePrice?: number;
  image: string;
  imageAlt: string;
  badges?: string[];
  onClick?: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="group text-left w-full cursor-pointer bg-transparent border-none p-0"
      whileTap={{ scale: 0.98 }}
      aria-label={`View ${name}`}
    >
      <div className="product-frame relative">
        <LazyImage src={image} alt={imageAlt} className="rounded-lg" />
        {badges && badges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {badges.map((badge) => (
              <span
                key={badge}
                className={`badge ${
                  badge === 'Sold out' ? 'badge-blush' :
                  badge === 'Made to order' ? 'badge-gold' :
                  badge === 'Sale' ? 'badge-sage' : 'badge-blush'
                }`}
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="mt-3 px-1">
        <h3 className="font-heading text-lg font-medium text-cocoa group-hover:text-primary transition-colors leading-snug">
          {name}
        </h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="font-body font-semibold text-primary">
            ₹{price.toLocaleString('en-IN')}
          </span>
          {comparePrice && (
            <span className="text-sm text-cocoa-light line-through">
              ₹{comparePrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

// Section heading with optional script flourish
export function SectionHeading({
  title,
  subtitle,
  scriptAccent,
  center = true,
}: {
  title: string;
  subtitle?: string;
  scriptAccent?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-8 ${center ? 'text-center' : ''}`}>
      {scriptAccent && (
        <span className="font-script text-2xl text-primary block mb-1">
          {scriptAccent}
        </span>
      )}
      <h2 className="font-heading text-3xl md:text-4xl font-semibold text-cocoa">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-cocoa-light max-w-xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// Empty state
export function EmptyState({
  icon,
  title,
  message,
  action,
}: {
  icon: ReactNode;
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-rose-line mb-4 text-5xl">{icon}</div>
      <h3 className="font-heading text-xl font-medium text-cocoa mb-2">{title}</h3>
      <p className="text-cocoa-light mb-6 max-w-sm">{message}</p>
      {action}
    </div>
  );
}

// Skeleton product card
export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="skeleton" style={{ aspectRatio: '4/5' }} />
      <div className="mt-3 px-1 space-y-2">
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/3 rounded" />
      </div>
    </div>
  );
}

// Star rating display
export function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          viewBox="0 0 20 20"
          className={`w-4 h-4 ${star <= rating ? 'text-gold' : 'text-cream-dark'}`}
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}
