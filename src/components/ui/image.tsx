import { useState, useEffect } from "react";
import { Skeleton } from "./skeleton";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

export const Image = ({ src, alt, className, fallback = "/placeholder.svg", ...props }: ImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(fallback);

  useEffect(() => {
    const img = new window.Image();
    img.src = src || fallback;
    
    img.onload = () => {
      setIsLoading(false);
      setCurrentSrc(src || fallback);
    };
    
    img.onerror = () => {
      setIsLoading(false);
      setError(true);
      setCurrentSrc(fallback);
    };
  }, [src, fallback]);

  if (isLoading) {
    return <Skeleton className={className} />;
  }

  return (
    <img
      src={error ? fallback : currentSrc}
      alt={alt}
      className={className}
      {...props}
    />
  );
};